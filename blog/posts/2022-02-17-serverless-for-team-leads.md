---
title: 给团队的 Serverless 最佳实践
description: 介绍适合使用 Serverless 进行开发的应用场景，通过典型的应用案例说明 Serverless 在这些场景中发挥的作用和价值。
date: 2022-02-17
layout: Post
thumbnail: https://sp-assets-1300963013.file.myqcloud.com/blog/thumbnails/2022-02-17-serverless-for-team-leads.png
authors:
  - OliverWang
category:
  - engineering-culture
---

# 背景介绍

这次的分享来自于 Serverless Inc 的 Gareth Mc Cumsky, 他从 2000 年开始进行 Web 开发，从 2016 年开始构建 无服务器应用程序，并在 2019 年加入了 Serverless Inc 并同其他开发人员和社区开发者一起工作，他主要工作内容是帮助人们了解和构建 Serverless 应用程序，以及了解 Serverless 实践中的优点和缺点。

* Serverless Framework：目前最广泛使用的开源的 Serverless 应用构建 serverless 应用。在海外主要适配 AWS 并可通过插件形式扩展其他更多的云厂商，国内主要是以腾讯云的 SCF 作为适配，方便开发者快速开发部署自己的 Serverless 应用。更多请查看 [Serverless CLI 的中文帮助文档](https://cn-serverless.webflow.io/framework/docs-commands)。

* Serverless Dashboard：Serverless 看板是用来查看管理所有 Serverless Framework 部署的 serverless 应用的看板，用户在这里可以查看应用的状态，创建或销毁应用，管理应用的密钥，管理应用的参数，查看应用日志，查看警告通知以及更多方便开发者减少运维工作的功能。 在国内目前主要是使用腾讯云的 Serverless 应用中心来管理腾讯云的 Serverless 应用。 我们未来会在中国推出功能更强大的 [Serverless Console](https://cn-serverless.webflow.io/console)，敬请期待。

* Serverless Cloud：Serverless Cloud 是构建Web应用程序的绝佳工具 

![](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2022-02-17-serverless-for-team-leads-1.jpg)


## Serverless 能给团队带来什么

这一部分主要讨论使用无服务器可以给团队带来些什么，以及你的团队是否适合采用无服务器技术。或者你已经考虑要使用无服务器技术，那么这些内容也可以拿来分享给你团队中的其他人。

关于 Serverless 应用的简要定义：**Serverless 应用是多个 Serverless 服务的组合，而 Serverless 服务是有云厂商负责维护的，无需担心这些服务的容量，配置，以及负载情况。 通常 Serverless 服务也有一些限制。 此外 Serverless 服务通常也提供API接口方便对服务进一步掌控（如：限制集群的大小）**

简单来说，如果一个服务需要你来设定集群大小，或者指定容量，那么它很可能不是 Serverless 服务。

> 技巧1: 当你在构建 Serverless 应用时，优先选择 serverless 类型的服务通常会让事情简单很多。

使用 Serveress 可以为团队带来如下好处：

### 解放生产力，创造力和革新能力

* 大幅减少 MVP 的开发时间。更快的检测产品是否具有吸引力。 
* 用来证明一个使用场景，只需要去做，而无需担心花费过长的时间，以及影响现有的应用。
* 使用异步或者分布式的流程处理过程中具有很好表现。
* 不需要等待基础设施的审批和开通，减少时间浪费。

### 减少头痛

* 传统的服务器需要保持 24 小时运行。 而这些服务器会一致向你收费，不管你是否使用它们。
* 此外配置虚拟机器或一个关系型数据库通常需要几个小时来完成。
* Serverless 服务按照使用量收费，不使用不付费。
* 全部的费用并不仅仅是账单费用。通常还有人力维护的费用。

### 节省运维费用

* 通常一个运维工程师的人工成本是 $126,235 人/年（美国）。
* 以美国 AWS Serverless 服务的使用成本费用举例。
    * 30 亿次请求/每月，并使用 237G 内存。 
    * 每月的 REST API 请求成本大约是 `$7,793.10`。
    * 相对应的内存使用成本是 $3.8 x 730 小时，总成本大约是 `$2,774.00`。
    * 每月需要支付的总成本是 `$10,567.10` ($7,793.10 + $2,774.00)。

经计算出的 Serverless 年度成本会略微高于一个运维工程师的人工成本，而通常当你有 30 亿请求需要处理的时候，你的团队中至少要有2位运维工程师来帮助你解决这些请求的负载问题。而这里还没有包含使用传统服务需要支付的服务器成本。

### 更多的好处

* 通过云厂商托管的服务和函数服务通常都是充分隔离的，进而减少了CPU资源的抢占。
* 如果代码的性能有些差，这通常也不是个问题。
* 如果代码的性能非常的差，也不会导致应用程序的崩溃，也避免了后续的集群重启和维护的工作。
* 可以先让性能不好的代码运行， 然后再更晚的时候优化这些代码。

## Serverless 项目的结构

这一部分主要介绍无服务器应用的结构是什么样，以及将无服务器应用同其他服务一起使用的最佳方式。

### “微”服务是我们推荐的模式

* 改善分布式系统的复杂性。
* 让团队对自己的服务拥有所有权。
* 使用 DDD (领域驱动设计)确定服务边界。
* 服务间使用异步方式通讯。

如下图是一个微服务集合的目录结构，这里包含了一个 身份验证服务、消息通知服务、支付和账单服务等。

![](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2022-02-17-serverless-for-team-leads-2.jpg)

> 技巧2: 当你在构建 Serverless 应用时，应当尽可能的使用异步方式来进行服务间的通讯。

### 版本控制

* 没有绝对的最佳方案。
* 可以是每个服务一个 Repo。
* 可以是多个服务一个 Repo。
* 可以是多个服务多个 Repo。
* 这取决于团队是如何划分的，以及对于服务变量的考量。

## 通常的软件开发生命周期

这一部分主要介绍构建一个无服务器应用的常见的软件开发生命周期。

![](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2022-02-17-serverless-for-team-leads-3.jpg)

* 每个人开发者都拥有自己的账户来进行部署和测试。
* 在用于共享环境中进行集成测试。
* 共享环境是开发者进行可以手动部署的环境，部署前同团队协调何时可以进行部署。
* 开发环境是使用 CI/CD 自动部署的另一个“共享”环境。
* 生产环境也使用 CI/CD 自动部署。
* 每个“共享”环境都有一个独立的云厂商账号进行区分。
* 对生产环境服务进行主动监控和维护。 

> 技巧3: 持续集成非常适合用来构建 Serverless 应用时。

## 个人开发者的日常

这一部分会进一步介绍从团队中的个人开发者角度，是如何构建无服务器应用的。

了解开发者如何从头开始部署一个 Serverless 应用：
* [多函数应用开发](https://cn.serverless.com/framework/docs-function-multi-scf)
* [框架应用(如：Express)开发](https://cn.serverless.com/framework/docs-components-http)

使用 Serverless CLI 可以轻松的完成以下开发工作：

* [部署代码到云厂商(serverless deploy)](https://cn.serverless.com/framework/docs-commands-deploy)
* [查看实时日志(serverless logs --tail)](https://cn.serverless.com/framework/docs-commands-logs)
* [远程调用云端函数调试(serverless invoke)](https://cn.serverless.com/framework/docs-commands-invoke)
* [本地调用函数调试(serverless invoke local)](https://cn.serverless.com/framework/docs-commands-invoke-local)

## 本地测试...要不要做

这一部分将要讨论是否要使用本地测试，而本地测试通常伴随着以下情况。

* 这是你加入的每一个公司都会做的事情。
* 复制一套与生产环境一样的环境是复杂且成本高昂的。
* 准确的复现生产环境也是几乎不可能的。
* 最终会导致...“在我的机器上是工作的”问题。
* 经过多年的积累，为了充分利用本地环境还创造了许多工具来帮助完成本地测试工作。
* 在本地复制云服务会更加困难。

### 在本地测试会遇到的问题

* 复制云厂商的云服务即费时又困难。
* 依赖本地测试会限制解决问题的方案选择，如使用云厂商提供的廉价而高些的新服务作为解决方案。
* 数据模拟（Mocking）同样也是耗时的且不准确的。
* 函数服务的运行方式和你计算机本地运行方式不同。
* 无法覆盖云厂商的系统环境，进程终止，服务间延迟，服务限制等情况。

### 对于非 Serverless 的云服务

* 这是最难解决的一个问题。
* 建议在生产环境之前使用演示环境（staging）。
* 每个开发者都在他们的云平台中部署一个环境的副本。
* 其次：为团队提供共享的环境。
* 另外的选择就是对云服务进行模拟（mocking）。

## 管理共享环境和生产环境

这一部分介绍在你的 Serverless 应用部署发布后，如何管理共享环境和生产环境中的 Serverless 应用

* 建议在云平台中通过账号区分共享环境和生产环境。
* 管理不同的环境需所需的环境配置。
* 充分评估服务的性能表现。
* 密切关注服务的错误或其他问题。
* 这些都可以通过 [Serverless Console](https://cn.serverless.com/console) 得到完美解决。

## 总结

* 直接在云端进行开发和测试。
* 使用云平台的账号组织功能管理账号。
* 本地测试环境很难得到维护。
* 使用工具来帮助管理多个共享环境。
* 监控生产环境状态。
