---
layout: ../../layouts/PostLayout.astro
title: 'Padrões de Fluxo de Controle usando Callbacks'
pubDate: 2022-07-01
description: 'Nesse artigo aprenderemos como escrever código assíncrono de forma limpa com a ajuda de alguns padrões. Saber como lidar apropriadamente com callbacks irá abrir o caminho para adotar abordagens modernas como Promises e async/await.'
author: 'marcos'
slug: 'callback-patterns'
image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
tags: ["astro", "blogging", "learning in public"]
---

A transição de um estilo de programação síncrono para uma plataforma como Node.js, onde *continuation-passing style* (CPS) e APIs assíncronas é o padrão, pode ser frustrante. A ordem de execução de código assíncrono pode ser difícil de prever.
Problemas simples como iterar um conjunto de arquivos, executar tarefas em sequência, ou esperar por um conjunto de operações se completarem requerem que o desenvolvedor tome novas abordagens e técnicas.

### Criando um web spider
Para explicar os problemas que surgem, iremos criar um web spider simples que faz o download do conteúdos das páginas.

```js
// utils.js
import path from 'path'
import { URL } from 'url'
import slug from 'slug'

export function urlToFilename (url) {
  const parsedUrl = new URL(url)
  const urlPath = parsedUrl.pathname.split('/')
    .filter(function (component) {
      return component !== ''
    })
    .map(function (component) {
      return slug(component, { remove: null })
    })
    .join('/')
  let filename = path.join(parsedUrl.hostname, urlPath)
  if (!path.extname(filename).match(/htm/)) {
    filename += '.html'
  }

  return filename
}
```

```js
// spider.js
import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename } from './utils.js'

export function spider (url, cb) {
  const filename = urlToFilename(url)
  fs.access(filename, err => {                                // (1)
    if (err && err.code === 'ENOENT') {
      console.log(`Downloading ${url} into ${filename}`)
      superagent.get(url).end((err, res) => {                 // (2)
        if (err) {
          cb(err)
        } else {
          mkdirp(path.dirname(filename), err => {             // (3)
            if (err) {
              cb(err)
            } else {
              fs.writeFile(filename, res.text, err => {       // (4)
                if (err) {
                  cb(err)
                } else {
                  cb(null, filename, true)
                }
              })
            }
          })
        }
      })
    } else {
      cb(null, filename, false)
    }
  })
}
```

Este código:

1. Checa se a URL já foi baixada verificando se o arquivo já foi criado. Se `err` for definido e possui o tipo `ENOENT`, então o arquivo não existe e é seguro criá-lo.
2. Se o arquivo não for encontrado, a URL é baixada.
3. Finalmente, escrevemos o corpo da resposta HTTP ao filesystem.

Para facilitar, criamos a função de poder executar essa função pela CLI:

```js
// spider-cli.js
import { spider } from './spider.js'
spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    console.error(err)
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`)
  } else {
    console.log(`"${filename}" was already downloaded`)
  }
})
```

Para executar: `node spider-cli.js http://www.example.com`

### Callback Hell
Olhando para a função `spider()`, embora o algoritmo seja simples e direto, o código resultante possui diversos níveis de identação e é díficl de ser lido.

A situação onde a abundância de closures e definições de callback in-place transformam o código em uma amoeba é chamado de **calback hell**. A estrutura típica desta amoeba se parece com:

```js
asyncFoo(err => {
  asyncBar(err => {
    asyncFooBar(err => {
      //...
    })
  })
})
```
> Callback Hell.

> Também conhecido coloquialmente como Pyramid of Doom.

Além dos problemas de legibilidade, há os problemas de nomes de variáveis usados em cada escopo. Geralmente, temos o uso de nomes similares ou identicos para descrever o conteúdo de uma variável, como por exemplo o argumento `error` recebido por cada callback. 

Também temos de ter em mente que closures vem com um pequeno preço em termos de performance e consumo de memória. Em adição, elas podem criar memory leaks que não são nada fáceis de identificar.

> Uma ótima introdução para como closures funcionam na V8: https://mrale.ph/blog/2012/09/23/grokking-v8-closures-for-fun.html

Vamos agora consertar estes problemas!

## Melhores Práticas e Padrões para Callbacks
Callback hell não é a única preocupação quando lidamos com código assíncrono. Existem diversas situações onde controlar o fluxo de um conjunto de tarefas assíncronas requerem o uso de padrões e técnicas específicos.

### Callback Discipline
A primeira regra é não abusar de definições de funções in-place quando definimos callbacks.

Existem alguns príncipios que podem nos ajudar a manter o nível de aninhamento baixo e melhorar a organização de nosso código em geral:

- Saia o mais rápido possível. Use `return`, `continue` ou `break`, dependendo do contexto, para sair imediatamente da statement atual ao invés de  aninhar outras statements `if...else`.
- Cria funções nomeadas para as callbacks, mantendo-as fora de closures e passando resultados intermediários como argumentos.
- Modularize o código. Divida o código em funções menores e reutilizáveis sempre que possível.

#### Aplicando callback discipline
Para o primeiro príncipio, podemos refatorar nossas statements de error-checking:

```js
if(err) {
    cb(err)
} else {
    // ....
}
```
para
```js
if(err) {
    return cb(err)
}
// ...
```

>Um erro comum quando executando esta otimização é esquecer de terminar a função após a callback ter sido invocada:
>```js
>if(err) {
>    callback(err)
>} 
>```
>repare a falta de um `return`, apesar de haver um erro a função irá erroneamente continuar!

Para os outros príncipios, podemos refatorar algumas funcionalidades identificando alguns pedaços de código reutilizáveis:

```js
function saveFile (filename, contents, cb) {
  mkdirp(path.dirname(filename), err => {
    if (err) {
      return cb(err)
    }
    fs.writeFile(filename, contents, cb)
  })
}
```
e
```js
function download (url, filename, cb) {
  console.log(`Downloading ${url}`)
  superagent.get(url).end((err, res) => {
    if (err) {
      return cb(err)
    }
    saveFile(filename, res.text, err => {
      if (err) {
        return cb(err)
      }
      console.log(`Downloaded and saved: ${url}`)
      cb(null, res.text)
    })
  })
}
```

E por último, modificamos a nossa função `spider()`:

```js
// spider.js
export function spider (url, cb) {
  const filename = urlToFilename(url)
  fs.access(filename, err => {
    if (!err || err.code !== 'ENOENT') {   // (1)
      return cb(null, filename, false)
    }
    download(url, filename, err => {
      if (err) {
        return cb(err)
      }
      cb(null, filename, true)
    })
  })
}
```

Comparando com o código antigo

```js
export function spider (url, cb) {
  const filename = urlToFilename(url)
  fs.access(filename, err => {                                // (1)
    if (err && err.code === 'ENOENT') {
      console.log(`Downloading ${url} into ${filename}`)
      superagent.get(url).end((err, res) => {                 // (2)
        if (err) {
          cb(err)
        } else {
          mkdirp(path.dirname(filename), err => {             // (3)
            if (err) {
              cb(err)
            } else {
              fs.writeFile(filename, res.text, err => {       // (4)
                if (err) {
                  cb(err)
                } else {
                  cb(null, filename, true)
                }
              })
            }
          })
        }
      })
    } else {
      cb(null, filename, false)
    }
  })
}
```

## Padrões Assíncronos com Callbacks
### Execução Sequencial
Executar um conjunto de tarefas em sequência significa rodá-los um de cada vez, um após o outro. A **ordem de execução** importa e **deve ser preservada**, talvez porquê o resultado de uma tarefa na lista possa afetar a execução da próxima.

Existem três variações deste fluxo:

- Executar um conjunto de tarefas conhecidas em sequência, sem propagação de dados entre elas.
- Usar a saída de uma tarefa como a entrada da próxima (também conhecido como *chain*, *pipeline* ou *waterfall*).
- Iterar sobre uma collection enquanto rodamos uma tarefa assíncrona em cada elemento, um após o outro.

#### Executando um Conjunto de Tarefas em Sequência
Podemos generalizar a solução com o seguinte padrão:

```js
function task1 (cb) {
  asyncOperation(() => {
    task2(cb)
  })
}

function task2 (cb) {
  asyncOperation(() => {
    task3(cb)
  })
}

function task3 (cb) {
  asyncOperation(() => {
    cb() // finally executes the callback
  })
}

task1(() => {
  // executed when task1, task2 and task3 are completed
  console.log('tasks 1, 2 and 3 executed')
})
```

Este padrão mostra como cada tarefa invoca a próxima quando após o término de uma operação síncrona genérica. O padrão coloca novamente ênfase na modularização das tarefas, mostrando como closures não são sempre necessárias para lidar com código assíncrono.

### Iteração Sequencial
Este padrão pode ser generalizado da forma:

```js
function iterate (index) {
  if (index === tasks.length) {
    return finish()
  }

  const task = tasks[index]
  task(() => iterate(index + 1))
}

function finish () {
  // iteration completed
}

iterate(0)
```

O padrão apresentado é muito poderoso e pode ser extendido ou adaptado para endereçar diversas necessidades comuns. Alguns exemplos:

- Podemos mapear os valores de uma array de forma assíncrona.
- Podemos passar os resultados de uma operação à próxima na iteração para implementar uma versão assíncrona do algoritmo `reduce`.
- Podemos quitar o loop de forma prematura se uma condição particular acontecer (implementação assíncrona do helper [`Array.some()`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/some))
- Podemos até iterar sobre um número infinito de elementos.

### Execução Paralela
Existem situações onde a ordem a execução de um conjunto de tarefas assíncronas não é importartante, e tudo o que queremos é sermos notificados quando todas essas tarefas se completem.

Este padrão pode ser generalizado da forma:

```js
const tasks = [ /* ... */ ]

let completed = 0
tasks.forEach(task => {
  task(() => {
    if (++completed === tasks.length) {
      finish()
    }
  })
})

function finish () {
  // all the tasks completed
}
```

#### Race Conditions em Tarefas Concorrentes
Rodar um conjunto de tarefas em paralelo pode causar problemas quando possuimos multiplas threads. Porém, em Node.js a história é diferente. Não precisamos de construções como locks, muteces, semáforos ou monitores. Porém, isto não significa que não podemos ter race conditions; pelo contrário, eles podem ser bem comuns. A raiz do problema é o delay entre a invocação de uma operação assíncrono e a notificação de seu resultado.


#### Execução paralela limitada
Spawnar tarefas paralelas sem controle pode levar à uma carga excessiva. Imagine possuir milhares de arquivos para leitura, URLs para se acessar, ou queries em bancos para rodar em paralelo. Um problema comum em tais situações é acabar ficando sem recursos. 
Limitar o número de tarefas é, em geral, uma boa prática que ajuda a construir aplicações resilientes. 

#### Limitando Concorrência
```js
const tasks = [
  // ...
]

const concurrency = 2
let running = 0
let completed = 0
let index = 0

function next () {                                          
  while (running < concurrency && index < tasks.length) {
    const task = tasks[index++]
    task(() => {                                            
      if (++completed === tasks.length) {
        return finish()
      }
      running--
      next()
    })
    running++
  }
}

next()

function finish() {
  // all tasks finished
}
```

Este algoritmo pode ser considerado uma mistura de execução sequencial e paralela. De fato, conseguimos notar algumas similaridades em ambos os padrões:

1. Possuimos uma função iterator, que chamamos de `next()`, e então um loop interno que spawna quantas tarefas forem possíveis em paralelo enquanto se mantém dentro do limite de concorrência.
2. A próxima parte importante é a callback que passamos para cada tarefa, que checa se já completamos todas as tarefas da lista. Se ainda existir tarefas para rodar, ela invoca `next()` para spawnar outro conjunto de tarefas.

#### Limitando Concorrência Globalmente
```js
export class TaskQueue {
  constructor (concurrency) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }
  pushTask (task) {
    this.queue.push(task)
    process.nextTick(this.next.bind(this))
    return this
  }
  next () {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      task(() => {
        this.running--
        process.nextTick(this.next.bind(this))
      })
      this.running++
    }
  }
}
```

