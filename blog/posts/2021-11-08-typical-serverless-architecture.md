---
title: 典型的 Serverless 无服务器应用架构
description: 了解典型的事件驱动的无服务器应用架构的组成，以及它所带来的好处，并了解如何使用 Serverless 开始开发这样的典型无服务器应用架构。
date: 2021-11-08
layout: Post
thumbnail: https://sp-assets-1300963013.file.myqcloud.com/blog/thumbnails/2021-11-08-typical-serverless-architecture.png
authors:
  - OliverWang
category:
  - guides-and-tutorials
  - engineering-culture
---

要讨论无服务器架构的话，并不能仅仅局限于 FaaS 上，比如腾讯 SCF，或 AWS Lambdas。

函数计算最吸引人的两个原因是：弹性伸缩(扩缩容)和按量计费，与此同时开发者还可以大幅减少甚至免去运维的工作和困扰，进而专心在软件功能开发和代码可靠性提高上。

以下是一个典型的 Serverless 无服务器应用架构，这个无服务应用架构来自于 Theodo 在广泛的无服务器开发经验中总结的最佳实践。本文在 Theodo 的最佳实践架构基础上做了轻微调整，以便让这个架构可以适用于各个云厂商，虽然这个云架构的图示中所使用的资源图标是 AWS 的资源图标，但您可以轻松将这个架构部署在任何一个非 AWS 云供应商的环境中。

![](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-08-typical-serverless-architecture-1.png)

在上图中，每一个由虚线圈起来的方块代表一个典型的、界限清晰的功能模块，你可以在多数的无服务应用架构中发现这样的功能模块，这样的功能模块同样也对应着一个领域的业务模型。

## 单体应用架构与微服务应用架构

在无服务器应用架构中，**事件驱动的微服务架构**是所有架构中最适合无服务器应用的一种架构。相比于单体应用，基于事件驱动的无服务器应用微服务架构具有以下优势：

- **清晰的业务边界**：微服务按照领域驱动设计的业务相关模型划分功能，不论对于产品或开发都更易于理解系统的边界，更方便管理和维护。
- **快速开发与部署**：使用微服务拆分后，代码变得更少更简单，可以更好的进行开发，拓展，测试。部署也只需要部署修改的服务，更快，更方便。
- **按使用量付费**：使用云函数计算开发业务功能，相关功能仅在使用时按照使用时长计费，不使用不计费。
- **自动缩扩容**：基于云函数的自动扩容能力，无需要额外的配置就可以获得业务功能的自动缩扩容能力。
- **快速响应用户请求**：事件驱动可以将耗时的业务拆分为异步调用，减少调用和后续请求处理所需要的时间。
- **系统稳定，可用性高**：微服务本身具有更好的稳定性，当系统一个服务出现问题，不会导致整个系统不可用，同时无服务器应用提供快速回滚机制，在出现问题时可以快速修复，整个系统可用性更高。

### 事件中心

![](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-08-typical-serverless-architecture-2.png)

> 无服务器优先的架构需要将事件(Events)视为一等公民 - 这是真正拥抱云原生的唯一途径。-- Ben Ellerby (VP Engineering at Theodo & AWS Serverless Hero)

通过 EventBridge (事件总线)简化了服务和团队之间的沟通，减少了紧耦合并帮助我们避免了分布式单体应用。在事件驱动的无服务器应用架构中，通过函数构建的函数应用都是完全独立且无状态的，通过 EventBridge 可以解决函数应用和应用的互相通信问题，同时如果其中一个服务出现了故障，或在某一个服务中做了破坏性的改动（breaking change），那么对与整个系统的影响都是极为有限的。

### 静态站点

![](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-08-typical-serverless-architecture-3.png)

如今的大多数网站都是单页应用程序（SPA），它们是由用户的浏览器在第一次访问 URL 时下载的一组由静态文件打包而成的全功能动态应用程序。在云环境中，通常将这些文件托管在支持部署静态网站的资源存储服务上（如 腾讯云COS，AWS S3），并通过CDN进行加速。

同样对于像像Next.js这样的服务端渲染（SSR）的网站。我们也可以通过 Serverless 部署一个SSR网站，同时利用CDN的边缘计算优势，使得我们能够使用云函数进行服务器端渲染，并尽可能地接近我们的终端用户。

> 查看[静态站点开发](https://cn-serverless.webflow.io/framework/docs-components-website)来了解如何使用 Serverless 来开发一个静态站点应用。

### 业务 API

![](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-08-typical-serverless-architecture-4.png)

通常我们的应用也需要和后端数据进行交互，比如查询检索数据或创建修改数据。因此，我们使用 API 网关来处理 HTTP 请求和路由规则，为每个路由同步出发一个云函数。云函数中包含处理对应请求所需的业务逻辑，如同数据库进行通信，来读取或修改数据。 

如上所述，我们的架构是事件驱动的，这也意味着我们可以快速响应用户，并继续在后台通过异步方式处理用户请求。 

> 查看[单函数应用开发](https://cn-serverless.webflow.io/framework/docs-function-scf)或[多函数应用开发](https://cn-serverless.webflow.io/framework/docs-function-multi-scf)来了解如何使用 Serverless 来开发函数应用。  
> 查看[Events 事件介绍](https://cn-serverless.webflow.io/framework/docs-events)来了解如何使用 Serverless 来开发基于腾讯云的各种事件的函数应用。

### 异步任务

![](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-08-typical-serverless-architecture-5.png)

因为这里的架构是事件驱动微服务架构的，所以很多函数都是异步执行的，由 EventBridge 事件、 静态存储事件、等事件触发。例如，在这里有一个异步函数，负责在用户注册成功后发送欢迎邮件。

而异步函数的失败处理在分布式异步系统中是至关重要的。因此，对于异步函数，通常使用死信队列（DLQ），并将最后的失败信息消息队列服务（如：腾讯云 CMQ，AWS SQS），然后传再由函数对失败的邮件发送消息进行重试。

### Socket通信

![](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-08-typical-serverless-architecture-6.png)

在使用异步操作，前端不能再只是显示一个加载器来等待 XHR 响应结果。为了更好的体验需要将待定状态和来自后端的数据主动推送到前端。为此，需要借助 API 网关的 WebSocket 能力，来创建并保持了一个 WebSocket 连接，并且由特定的消息来触发对应的函数。

### 文件上传

![](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-08-typical-serverless-architecture-7.png)

相比于使用函数来处理文件上传（这很可能会导致成本会很高），现在的云厂商的文件存储服务通常都提供了通过动态签名的安全的方式来直接上传文件到文件存储服务，而要使用这种方式来上传，通常需要给前端返回一个经过签名的安全的上传 URL 地址，而这正是函数计算擅长的地方。

同时也可以使用函数监听文件上传事件，在文件上传完成之后进行后续操作（如：压缩图片，转码视频等）。

### 认证授权

![](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-08-typical-serverless-architecture-8.png)

类似的，我们也可以使用函数来构建一个身份认证服务，来关联第三方认证授权服务，存储用户的授权数据，刷新用户的访问令牌（Token）或获取用户的个人身份和权限信息。这些都可以使用无服务器架构的函数应用来实现。

### 支付状态机

![](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-11-08-typical-serverless-architecture-9.png)

在某些情况下，应用的逻辑和数据流可能会变得非常复杂，相比于在函数应用中手动艰难的组织和跟踪这些逻辑和流程，不如使用云厂商提供的工作流服务，来将多个函数组成一个简单的状态机。 

以上就是一个使用函数完成支付业务逻辑的工作流实例：

- 第1步：向第三方支付服务发送一个付款请求。
- 第2步：等待付款请求结果状态，并生成所需的支付记录对象。
- 第3步：由第三方支付服务回调的函数，用来接收付款请求结果（成功，失败，处理中）
- 第4步：检查支付记录结果状态，并基于不同的状态调用不同的函数。
  - 第5a步：支付状态为完成（成功或失败），则发送支付完成通知并结束该工作流。
  - 第5b步：如果支付状态为处理中，则返回第2步，继续等待付款结果状态更新。

## 参考引用
* [What a typical 100% Serverless Architecture looks like in AWS!](https://medium.com/serverless-transformation/what-a-typical-100-serverless-architecture-looks-like-in-aws-40f252cd0ecb)
* [EventBridge: The key component in Serverless Architectures](https://medium.com/serverless-transformation/eventbridge-the-key-component-in-serverless-architectures-e7d4e60fca2d)