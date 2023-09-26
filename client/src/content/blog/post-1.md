---
layout: ../../layouts/PostLayout.astro
title: 'A Filosofia Node.js'
pubDate: 2022-07-01
description: 'Toda plataforma de programação possui sua filosofia, um conjunto de príncipios que guiam a forma como a plataforma é usada e isto influencia ambos o design e o desenvolvimento das aplicações que as usam.'
author: 'marcos'
slug: 'post-1'
image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
tags: ["astro", "blogging", "learning in public"]
---

Toda plataforma de programação possui sua filosofia, um conjunto de príncipios que influencia ambos a evolução da plataforma e o design e desenvolvimento das aplicações que as usam.

Em Node.js, alguns desses príncipios vem de seu criador - Ryan Dahl - enquanto que outros veem das pessoas que contribuem para o core, e finalmente, alguns são herdados do movimento JavaScript em geral.

Nenhum destes são regras, e devem sempre ser aplicados com bom senso, porém, são tremendamente úteis quando procuramos por uma fonte de inspiração quando projetamos nosso software.

## 1. Núcleo Pequeno
Um dos príncipios na criação de Node.js e seus módulos built-in é possuir o menor conjunto de funcionalidades possível, enquanto que o resto deve ser responsabilidade do usuário, ou seja os módulos que vivem fora do *core*.

Este príncipio possui o efeito de permitir uma experimentação e iterações mais rápidas por parte da comunidade, já que podemos experimentar diversas soluções por nós mesmos ao invés de esperar pelo desenvolvimento de uma eventual solução vinda da core.

## 2. Módulos pequenos
Node.js usa o conceito de **módulos** para estruturação de seus programas. Módulos são os "blocos de construção" das aplicações e das bibliotecas reutilizáveis.

Em Node.js, um dos príncipios mais evangelizados é o de se desenvolver em pequenos módulos (e packages), não apenas em termos de tamanho do código em si, mas mais importante ainda, em termos de escopo.

Módulos pequenos são:

- Reutilizáveis
- Mais fáceis de se entender e usar
- Mais simples de testar e manter
- Menores em tamanho, portanto bons para uso na web


## 3. Pequena área de contato
Além de pequenos em tamanho e escopo, outra característica desejável de módulos é a de se expor um conjunto de funcionalidades mínimo.

Por exemplo, um padrão comum de definição de módulos é o de se expor apenas uma funcionalidade, tal qual uma função ou uma classe, pelo simples fato de isto fornecer um ponto de entrada único, sem chance de confusão.

Diminuir a exposição tem o efeito de produzir uma API mais fácil de ser utilizada, mantida, e menos suscetível a erros. De fato, a maioria dos usuários de um componente estarão interessados em apenas um pequeno conjunto de features, sem a necessidade de estender ou usar aspectos mais avançados.