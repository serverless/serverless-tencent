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

评论系统是内容型网站必备模块之一。足够简单，但却是一个完整的全栈应用。同时涉及到前端，后端和数据库的操作。本文介绍笔者开发的一个基于 Serverless 的评论系统([源码](https://github.com/timqian/murmur/))。如果你也考虑使用Serverless 的方式开发全栈应用，不妨作为一个参考。

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

评论系统默认使用 AWS S3 或者 Tencent COS 作为数据存储插件。
以 Tencent COS 为例，在开启服务前，我们需要到腾讯云 COS 创建一个 Bucket 用于存储评论。

随后将 `backend/.env.example` 重命名为 `backend/.env` 并且添加所需的环境变量。

准备好 COS Bucket，配置好环境变量之后，我们就可以在本地启动和调试评论服务了：

```bash
cd backend
npm i
npm start
```

### 2. 部署到腾讯云

Serverless framework 支持将一个常规的 express 应用部署到腾讯云，只需添加如下 `serverless.yml` 文件（使用 [tencent-http](https://github.com/serverless-components/tencent-http/) component），就可以使用 Serverless CLI 将我们的服务部署到腾讯云 SCF。

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

```bash
# 安装 serverless cli
npm i serverless -g

# 部署服务
cd backend
serverless deploy
```

## 关于存储服务的选择

对于业务逻辑复杂的应用，通常需要使用 SQL 数据库方便实现复杂的查询。[腾讯云原生数据库 TDSQL-C](https://cloud.tencent.com/document/product/1003/30505) 已支持 Serverless MySQL 版本，做到按实际使用的计算和存储量计费。需要的读者可以参考[这篇文章](https://cloud.tencent.com/document/product/1154/51858)来配置 MySQL 数据库在 serverless 应用中使用。

不过并不是所有应用都需要复杂的查询。比如对于本文描述的应用，简单的 Key-Value 存储和查询就可以满足要求，于是我们默认选择了 COS 作为数据存储服务。

使用 COS 作为数据存储服务有以下几个优点。

### 1. 配置和使用简单

由于 Serverless 函数是按需创建和销毁的，没有固定的 IP 地址，在和 SQL 数据库连接时，无法简单通过 IP 白名单来限制函数的访问，必须配合 VPC 一起使用。

使用 COS, S3, dynamodb 这种服务时，无需配置就可以通过 API 直接操作。

### 2. 价格优势

使用 SQL 数据库作为存储服务时，虽然腾讯云 [TDSQL-C](https://cloud.tencent.com/document/product/1003/30505) 可以帮助我们按使用量自动伸缩数据库集群中的服务数量，但是还是至少需要有一到两个实例保证业务的可用。不论使用与否，都需要支付维持服务的成本。

使用 COS 作为存储服务，无需预置实例，价格便宜。

通常来讲，SQL 数据库是适合大多数场景的存储服务。不过如果你的应用存储逻辑简单，不妨也可以尝试使用 COS 作为存储。

## 参考资料

- [GitHub 源码](https://github.com/timqian/murmur)
- [Serverless tencent-http component](https://github.com/serverless-components/tencent-http/)
- [Blog: Bye bye disqus](https://pawelgrzybek.com/bye-bye-disqus-i-built-my-commenting-system-using-aws-serverless-stack-and-netlify-build-hooks/)
- [Blog: How to build your own free serverless comment box](https://www.freecodecamp.org/news/how-you-can-build-your-own-free-serverless-comment-box-dc9d4f366d12/)

#### 一些其他的开源评论系统

- https://github.com/djyde/cusdis
- https://github.com/gitalk/gitalk
- https://github.com/imsun/gitment
- https://github.com/xCss/Valine
- https://github.com/jimpick/lambda-comments
- https://github.com/meteorlxy/vssue