---
title: 制作一个 Serverless 评论系统
description: Serverless 评论系统架构和优势
date: 2021-11-26
layout: Post
thumbnail: 
authors:
  - TimQian
category:
  - guides-and-tutorials
---

评论系统是内容型网站必备模块之一。足够简单，但却是一个完整的全栈应用。同时涉及到前端，后端和数据库的操作。本文介绍笔者开发的一个基于 Serverless 的[评论系统](https://github.com/timqian/murmur/)。如果你也考虑使用Serverless 的方式开发全栈应用，不妨作为一个参考。

## 使用 Serverless 方式部署的评论系统可以带来什么

### 1. 零维护

当你把服务部署到 Serverless 平台后 (Tencent SCF, AWS lambda...)。 Serverless 平台会根据用户使用量自动分配服务器资源。不论你的服务是有一个人使用还是一亿人使用，你都不需要操心服务器的事情。

### 2. 按需付费

Serverless 函数按使用量付费，各大云厂商都有免费额度。在你的应用处于开发和早期阶段时，基本上是免费的。

- 腾讯云 SCF 的免费额度和价格参考：[https://cloud.tencent.com/document/product/583/12282](https://cloud.tencent.com/document/product/583/12282)
- AWS lambda 免费额度和价格参考：[https://aws.amazon.com/lambda/pricing/](https://aws.amazon.com/lambda/pricing/)

很多用户对 Serverless 的一个顾虑是迁移成本，因为各大云厂商的 Serverless 平台有自己的部署方法和代码的写法 (所谓的 [Vendor locked-in](https://en.wikipedia.org/wiki/Vendor_lock-in))。这个问题可以通过使用 Serverless Framework 解决，你写的一套普通的服务端代码，可以方便得部署到 AWS lambda，腾讯云 SCF 等云函数平台。同时这套代码也可以部署到普通的服务器上。接下来介绍这个评论系统的架构。

## 系统架构

![](https://sp-assets-1300963013.cos.ap-guangzhou.myqcloud.com/blog/posts/2021-11-26-serverless-comment-system-1.png)

该系统主要分为三部分

### 1. [服务端代码](https://github.com/timqian/murmur/tree/main/backend)

核心是一个 express.js 服务，用来收发评论。

### 2. [插件系统](https://github.com/timqian/murmur/tree/main/backend/plugins)

负责服务端代码与数据库，email 服务等的交互。用户可以自定义插件，选择希望评论存储的数据库类型，通知服务等等。

### 3. [前端代码](https://github.com/timqian/murmur/tree/main/frontend)

javascript + css ，将评论插入网页。

## 开发与部署

### 1. 本地开发与部署

本地开发与部署前端代码

```bash
cd frontend
npm i
npm start
```

本地开发与部署后端代码

```bash
cd backend
npm i
npm start
```

### 2. 部署到腾讯云

```bash
npm i serverless -g
cd backend
serverless deploy
````

Serverless framework 支持将一个常规的 express 应用部署到腾讯云，只需添加一个 `serverless.yml` 文件。

```yaml
# serverless.yml
component: http
name: serverless-comment-api

inputs:
  src: ./
  faas:
    runtime: Nodejs12.16
    framework: express
    name: ${name}
  apigw:
    protocols:
      - http
      - https
```

### GitHub 源码

https://github.com/timqian/murmur

## 参考资料

- [Serverless tencent-http component](https://github.com/serverless-components/tencent-http/)
- [Bye bye disqus](https://pawelgrzybek.com/bye-bye-disqus-i-built-my-commenting-system-using-aws-serverless-stack-and-netlify-build-hooks/)
- [How to build your own free serverless comment box](https://www.freecodecamp.org/news/how-you-can-build-your-own-free-serverless-comment-box-dc9d4f366d12/)

### 其他开源评论系统

- https://github.com/djyde/cusdis
- https://github.com/gitalk/gitalk
- https://github.com/imsun/gitment
- https://github.com/xCss/Valine
- https://github.com/jimpick/lambda-comments