---
layout: ../../layouts/PostLayout.astro
title: 'Promises'
pubDate: 2022-07-01
description: 'Nesse artigo aprenderemos sobre as Callbacks, o mecanismo fundamental para o surgimento das promises e até async/await.'
author: 'marcos'
slug: 'promises'
image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
tags: ["astro", "blogging", "learning in public"]
---

Uma `Promise` é um objeto que carrega o eventual resultado (ou erro) de uma operação assíncrona. Elas podem assumir os estados:

- **Pending**: para quando a operação ainda não estiver completa.
- **Fulfilled**: para quando a operação tiver terminado com sucesso.
- **Rejected**: para quando a operação terminar com um erro.
- **Settled**: seja ela fulfilled ou rejected, ela é considerada **settled**.

Para receber o **fulfillment value** ou o erro (**reason**) associado com a rejeição, podemos usar o método `then()` de uma `Promise`. Tal método possui a assinatura:

```
promise.then(onFullfilled, onRejected)
```

`onFullfilled` é uma callback que irá eventualmente receber o valor da Promise. e `onRejected` é outra callback que irá receber a razão da rejeição (se houver). Ambas são opcionais.

```
asyncOperation(arg)
    .then(result => {
        // ...
    },
    err => {
        // ...
    })
```

