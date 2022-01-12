---
title: 流行的 Serverless 开发应用场景
description: 介绍适合使用 Serverless 进行开发的应用场景，通过典型的应用案例说明 Serverless 在这些场景中发挥的作用和价值。
date: 2021-12-20
layout: Post
thumbnail: https://sp-assets-1300963013.file.myqcloud.com/blog/thumbnails/2021-12-20-serverless-popular-use-cases.png
authors:
  - OliverWang
category:
  - guides-and-tutorials
---

## 为什么要使用 Serverless 来进行开发

自从 2014 年 AWS 推出 AWS Lambda 并开启了无服务器运动以来，Serverless 一直致力于帮助个人与企业开发者更加方便的上手采用无服务器技术。虽然这种新架构存在一些挑战，但迁移到无服务器架构带来的好处通常远远超过这些挑战。

典型的 Serverless 应用具有以下独特的优势：

* 按使用量计费
* 自动根据请求数量扩容或缩容
* 无须（需要极少量）维护
* 支持多种运行时和开发框架
* 支持 HTTP 调用和事件调用

无服务器开发可以适配几乎各种开发场景，下面的示例提供了一些最流行的无服务器架构被采用的场景以及原因。

## 1. 构建部署静态网站

使用 Serverless 的 [website组件](https://cn-serverless.webflow.io/framework/docs-components-website) 构建部署基于 Next.js, Nuxt.js 或其他任何静态网站框架的web应用是 Serverless 广为流行的应用场景之一。

Serverless 可以轻松的将构建的静态网站托管在腾讯 COS 上，同时为静态网站配置国内甚至全球的访问加速并绑定静态网站需要的访问域名，而这一切都只需要一个 serverless.yml 配置文件，以及一个部署命令。

同时因为使用 Serverless 构建部署静态网站，还可以获得以下额外的优势：

* 无需创建管理 网站存储，访问加速，域名管理等基础服务，只需要配置 serverless 应用，开发和部署。 
* 快速方便部署一个线上的预览版本，方便查看您的修改在实际生产环境中的运行效果。
* 配合 COS 组件轻松管理同步静态资源文件到腾讯 COS。 


## 2. 对象批量处理

当需要为用户提供了对象（word 文档，图片，视频）存储服务时，如果能为用户上传的文件进行格式转换将 word 文档转换为 PDF 文件或对图片和视频进行压缩将更为方便后续功能的开发同时也能大幅改善用户的使用体验，而这正是 Serverless 一个广为流行的使用场景。

Serverless 可以开发对应的格式转换和文件压缩应用，并由腾讯对象存储（COS）的上传，修改等事件触发，实现在用户上传文件到 COS 后自动对该文件进行所需的处理。

同时因为使用 Serverless 开发对象批量处理，还可以获得以下额外的优势：

* 按量付费，根据实际使用批处理函数的运行时间和内存的大小计算所需要缴纳的费用。
* 弹性伸缩，根据用户访问的数量，自动扩容和缩容批处理函数数量。
* 可以使用适合的语言进行批量处理脚本功能的开发。
* 无缝融入到 Event-Driven 的系统架构。

## 4. 定时任务脚本

当需要执行定时任务脚本完成每周的统计数据分析过滤或定时启动任务脚本完成网站的每日签到任务时，相比传统服务器需要按月付费，但只使用了有限的服务器资源。使用 Serverless 应用配置定时触发来实现定时任务和脚本的执行是 Serverless 另一个广为流行的使用场景。

Serverless 可以方便的开发这种简单任务的脚本，并且可以轻松集成腾讯云的其他服务，方便的将执行结果以邮件或短信的方式发给用户或将数据存储在腾讯对象存储（COS）服务中，方便以后下载查看。

同时因为使用 Serverless 开发定时任务脚本，还可以获得以下额外的优势：

* 按量付费，根据实际使用函数时间和内存进行计费，不实用不计费。
* 使用任意支持语言，不受开发语言和框架的限制。
* 免运维，在完成部署之后无需对基础设施进行维护和管理，减少工作量。 
* 方便测试查看，可以轻松在线上生产环境中进行测试

## 5. 改造现有的WEB框架应用。

当想要获得无服务器架构的优势而又对于现有应用的的复杂度和迁移的工作量刚到头痛时，这时 Serverless 的 http 组件为开发者提供了简单的框架应用迁移方案来完成传统框架应用到 Serverless 应用的快速迁移，而这一切仅仅需要添加一个 serverless.yml 配置文件。

Serverless 的 http 组件支持的 WEB 框架有：Express, Koa, egg.js, Next.js, Nuxt.js, nest, Flask, Django, Laravel, ThinkPHP。 用可以轻松的将传统的 WEB 框架应用改造为 Serverless 应用。

同时因为使用 Serverless 开发定时任务脚本，还可以获得以下额外的优势：

* 按量付费，根据实际使用函数时间和内存进行几计费，不实用不计费。
* 免运维，在完成部署之后无需对基础设施进行维护和管理，减少工作量。 
* 方便测试查看，可以轻松在线上生产环境中进行测试

## 6. 第三方 API / Webhook 调用与集成

当需要同第三方的 API / Webhook 进行集成或功能开发时，相比于在单体应用中通过包或文件将相关逻辑拆分，也可以使用 Serverless 来进行封装，通常这类的使用场景包括

* [发送验证码服务](https://cloud.tencent.com/document/product/583/62607)
* 发送密码重置邮件服务
* [定时预热刷新 CDN ](https://cloud.tencent.com/document/product/583/62596)
* 需要开发企业微信的机器人，并通过该机器人发送业务所需的自定义消息。

Serverless 的 scf 和 mulit-scf 组件可以轻松的封装第三方应用和接口，并且可以你所熟悉的语言，工具包和应用框架来开发你的代码。 

使用 Serverless 开发第三方 API / Webhook 接口可以获得以下额外优势：

* 功能解耦，无需担心影响核心业务，快速部署
* 方便复用。

## 7. 实时音视频转码

在对象文件的批处理基础上，结合腾讯云的实时音视频服务（TRTC）一起使用，这样可以快速生成回放文件，截取精彩瞬间，以及快速合并音视频。 更多详情请查看[ SCF + TRTC 提供一站式全景录制解决方案](https://cloud.tencent.com/document/product/583/62573)。

因为使用 Serverless 来处理实时音视频转码，还可以获得以下额外的优势：

* 更低的使用成本， 相比于传统解决方案，成本可以降低 60%。
* 超高并发，是云函数具有高并发的承载能力，并可以稳定运行。

## 总结

除了以上的使用场景和用例意外事件，无服务器架构应用随着基础设施（如：应用与服务编排工作流, 事件总线，无服务器数据库）的完善无服务器架构会适合更多的业务场景也更加符合开发者使用习惯。可以查看[无服务器应用架构](https://cn.serverless.com/blog/typical-serverless-architecture-in-general)来了解实践中真实的 Serverless 架构设计。

对于已经在拥抱云原生的开发和无服务器架构的开发者，信任云服务，避免重新发明轮子，充分利用云服务所提供的优势来专注在业务功能的开发而不是维护系统的正常运行，在节省成本的同时，释放最大的生产力。

对于对云原生和无服务器架构保持官方的开发者，可以在以上广泛被大家验证了的使用场景中尝试使用无服务器架构，相信尝试过后，一定会对无服务器架构有更加深入的了解，并且可以更好的完成未来的复杂应用的架构设计。

Serverless 为无服务器开发提供了完善的支持，我们提供了 [Serverless CLI](https://cn.serverless.com/cli) 来帮助开发者轻松创建，部署，调试和管理您的 Serverless 应用。并支持[函数应用开发](https://cn.serverless.com/framework/docs-function)以及丰富的[事件触发](https://cn.serverless.com/framework/docs-events)。此外对于习惯框架应用的开发者，可以通过 [Serverless 组件](https://cn.serverless.com/framework/docs-components) 将传统框架的应用部署为 Serverless 应用。
