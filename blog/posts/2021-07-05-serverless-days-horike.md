---
title: 投入 Serverless 开源，为我带来了什么？
description: 作为一位工程师，如何参与到 Serverless 中并为之做出贡献，这些意味着什么？
date: 2021-07-05
layout: Post
thumbnail: https://sp-assets-1300963013.file.myqcloud.com/blog/thumbnails/2021-07-05-serverless-days-horike.jpg
authors:
  - TakahiroHorike
category:
  - engineering-culture
---

众多开源项目支持了 Serverless 的发展。开发者如何参与开源，共同打造 Serverless 的未来生态？本文由 Serverless Operations CEO Takahiro Horike 在 Techo TVP 开发者峰会 ServerlessDays China 2021 上的演讲 "The Future of Serverless Accelerated by OpenSource" 整理而成，向大家分享他的经验，本次分享完整视频请见文末。

大家好，我演讲的题目是《由开源加速的无服务器的未来》。Serverless 技术得到了很多开源产品和社区的支持，而不仅仅是云计算厂商提供的产品，这是 Serverless 领域非常有特色的地方之一。今天，我将谈谈我如何参与其中并为之做出贡献，以及作为一名软件工程师，这意味着什么。

## 01. Serverless 开源项目分享

我是 Horike，是 Serverless Operations, Inc. 的 CEO 和联合创始人。我还是一个开源爱好者，创建并维护了一些开源项目，帮助无服务器领域的开发者。同时，我也是日本 Serverless Meetup Tokyo 的组织者之一。在疫情发生之前，我们每年都会举办 Serverless Days Tokyo。

Serverless Operations, Inc 是一家位于日本的公司，本着“用无服务器实现云价值最大化”的公司理念，我们正在为许多公司提供 AWS 无服务器的咨询和开发服务，主要业务在日本。从大企业到小型创业公司，我们都在帮助它们开发使用无服务器技术的应用程序。

<img src="https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-07-05-serverless-days-horike-1.png" width="700"/>

大家知道，几乎所有的 Serverless 产品都是按使用量付费的。这对很多公司来说是个好处，尤其是小型创业公司，因为创业公司的云计算花费大部分下情况都很便宜。但当你的应用有大量的流量或数据量，云计算花费可能就会很昂贵。

进入今天的主体内容。我想告诉大家的是，加入无服务器领域的开源社区的价值，以及这对一个软件工程师有什么大的影响。

<img src="https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-07-05-serverless-days-horike-2.png" width="700"/>

首先，向大家介绍我们正在维护的一些开源项目。

众所周知，AWS Step Functions 是 AWS 无服务器的主要服务之一，它允许你使用 Lambda 函数、ECS、DynamoDB、SQS、Glue 等来控制复杂的工作流，而无需底层应用来管理和协调状态。

来看我们公司的实际用例。我们与 Lixil 公司的开发团队一起为该公司交付了会计系统。Lixil 是一家在日本非常有名的公司，他们的物流业务有很多配送中心。该项目的目的是为配送中心自动计算账单，我们建议用 Serverless Step Functions 插件来实现，最终实现了自动化，并大大节省了成本。

<img src="https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-07-05-serverless-days-horike-3.png" width="700"/>

第二个开源软件是无服务器 API 网关服务代理。这也是 Serverless Framework 的插件，它支持亚马逊 API 网关的 AWS 服务代理集成功能，你可以像这样编写一个 SQS 集成。

在这个例子中，如果你向 API 路径发送一个 POST 请求，斜线 SQS，而 POST 请求直接发送 serverless.yml 文件中 QueueName 部分的指定 SQS 队列，就不需要再编写只连接 AWS 服务的代码了。目前，该插件支持的 AWS 服务有 Kinesis Streams、SQS、S3、SNS、DynamoDB、EventBridge。

<img src="https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-07-05-serverless-days-horike-4.png" width="700"/>

这是我们公司的实际使用情况：

WWD JAPAN 是一个面向日本时尚行业的网络杂志网站，它有一个以 10 分钟间隔的、页面浏览量实时排名功能。通常，为了建立这样的排名功能，我们使用 Google Analytics API。但是，它并不支持获得几分钟前的排名的功能，我们决定使用 Kinesis Streams 作为实时排名的数据存储来取代它。以下是实时排名系统的架构。

<img src="https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-07-05-serverless-days-horike-5.png" width="700"/>

首先，API 网关从 Web 前端接收访问者视图数据，数据被收集并存储在 Kinesis Streams 中。这张图右边的获取排名 API 从 Kinesis 流中获取收集到的排名数据，并将排名响应到 Web 前端，最终效果是可以在网站上浏览排名内容。

通过使用无服务器 API 网关服务代理，我们建立了连接 API 网关和 Kinesis 流的 API。一旦访问者访问了文章页面，API 就会被调用，并将文章 ID 和当前时间发送到 Kinesis 流中。

<img src="https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-07-05-serverless-days-horike-6.png" width="700"/>

接下来，第三个开源软件是 Jeffy。

这是一个名为 Jeffy 的 Python 运行时 Lambda 的应用框架，它是 Lambda 函数的实用程序套件，能让开发无服务器应用程序变得容易。有几个类似的产品，如 DAZN Lambda Powertools、Middy，Jeffy 也提供类似的功能。

## 02. 我为什么要加入开源社区？

以上是我们的开源项目的介绍。接下来，我将说说我的背景和经历，解释为什么我一直在为开源而努力。

从我开始做软件工程师到现在，大概有 15 年了。大概十年前，我已经开始使用 AWS，而 AWS Lambda 在 2014 年发布，这对我影响很大。在那之前，要在 AWS 上运行代码，你需要在运行代码之前使用 EC2 设置基础设施。但是 Lambda 发布了，就变成了只需要写代码，**意味着软件工程师只需要写代码就可以在 AWS 上创建一个新的、有趣的产品**。

<img src="https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-07-05-serverless-days-horike-7.png" width="700"/>

2015 年，亚马逊 API 网关发布，这是对我的第二个重大影响。在那之前，代码只能在 AWS 上运行，它是一个如此封闭的空间。但是 API 网关发布了，你交付的新的、有趣的产品就可以通过 API 发布，并且可以被 AWS 以外的世界各地的人看到。

我一直痴迷于无服务器，花了很多时间来玩 API Gateway、Lambda、DynamoDB，并将我的想法写成很多博客文章发表。当我在使用无服务器时，我注意到无服务器的一些问题，比如：

- Lambda 上的代码无法通过 AWS 管理控制台上传。
- 我怎样才能对我的代码进行版本管理？
- 如何创建 CI/CD 流水线？

那时，我发现了无服务器框架，我心花怒放，因为这些问题已经被它解决了。于是我开始与社区交流，和核心团队讨论它如何能成为更好的工具。就是在那时，我开始加入 Serverless 社区。

<img src="https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-07-05-serverless-days-horike-8.png" width="700"/>

总结一下，什么是参与开源社区的重要的事？无服务器技术实际上得到了很多开源项目的支持，这是无服务器领域的一大特色。

为什么？这并不意味着云厂商的产品质量差。无服务器技术尚未成熟，而且永远不会停止发展。大家都知道，大多数情况下，产品在最初发布时并不都具备你需要的所有功能，因为云厂商的产品一般都是作为最低可行的产品发布的。实际上，AWS Lambda 在 2014 年并没有开发者需要的一些功能，它的执行时间被限制在几秒钟，甚至不能使用环境变量的重要功能。然而，这些缺失的部分为我们带来了通过开源理念修复它的好机遇。

<img src="https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-07-05-serverless-days-horike-9.png" width="700"/>

Serverless 开源社区是如此巨大。**每天，开发者们都在讨论一些东西来促进产品发展，在这样一个巨大的社区里，有很多有才华的开发者，与他们一起工作，你的开发技能会得到提高。开源中采用的优秀工作流程，如发布和测试，对你的工作也很有帮助，所以你可以通过参与开源社区学到很多东西**。不仅如此，参加 Serverless 社区活动时，我很高兴能结识到日本之外的其他国家的社区成员。

这是开源社区中最重要的心态。**想象一下，你的代码在全世界范围内被使用，并为某个地方的人带来快乐。这对开发者来说是一件很好的事**。

<img src="https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2021-07-05-serverless-days-horike-10.png" width="700"/>

无服务器技术还没有成熟，所以有很多事情需要用你的开源想法来解决。如果你对开源社区感兴趣，请快加入吧！

谢谢大家的聆听，今天很高兴来到这里。

### 分享嘉宾

Takahiro Horike，来自日本的 Serverless Operations, Inc.。他们为客户提供咨询或开发服务，以 AWS Serverless 为主。Horike 是一位开源软件爱好者，为 Serverless 维护一些开源软件。

[**点击查看本次分享完整视频**](https://v.qq.com/x/page/h3252fk99sk.html)

