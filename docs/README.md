---
title: "Tencent Serverless 简介"
menuText: "Tencent Serverless 简介"
layout: Doc
---

# ⚡️ Tencent Serverless 简介

## 关于 Serverless

Serverless 是一种由开发人员和企业共同推动的运动，他们意识到软件正在吞噬世界，但如果您自己构建和维护所有软件，您也会被吞噬。这一运动要求将构建应用程序中最琐碎的部分抽象化，以便开发人员能够真正将时间花在交付业务价值上。

这一运动的目的是让开发人员能够单枪匹马地构建处理生产级流量的应用程序。他们不必管理扩展他们的基础设施，他们不必配置服务器，也不必为未使用的资源付费。他们可以专注于开发。

归根结底，Serverless 是关于将开发人员的精力集中在为用户提供价值的方面（而不是在其他任何事情上浪费时间）。升级 Linux 发行版不会为用户提供价值，管理 Kubernetes 集群不会为用户提供价值，只有提供解决问题的产品才会为用户提供价值。

## Tencent Serverless

Serverless Framework 是业界非常受欢迎的无服务器应用框架，通过与众多一流云供应商如腾讯云，AWS 等的紧密合作，为广大开发者提供无需关心底层基础设施，即可编写和部署代码的无服务开发体验。

Serverless Framework 同时提供资源管理、弹性伸缩、统计分析等能力，让广大开发者可以节省运维成本，真正做到“按量付费”的同时，也无需花费精力处理日志收集、异常统计等任务。

Tencent Serverless (以下简称 Serverless) 是 Serverless Framework 与腾讯云合作，基于组件（serverless components）为中国用户定制的 serverlss 开发完整解决方案。覆盖了开发编码、测试、部署等全生命周期，在保留 Serverless Framework 的特点和优势的同时更加切合中国用户的使用场景和习惯。

## Serverless 优势

### 多语言，多框架支持、远程调试

- Serverless 支持众多编程语言，包含：Node.js, Python, PHP, Java, Go 等。

- Serverless 支持使用框架开发框架进行开发，包括：Express, Koa, Egg.js, next.js, nuxt.js, react.js, vue.js, Flask, Laravel 等。

- Serverless 拥有远程开发模式，开发者可以轻松在本地调试云端代码。

### 灵活配置、一键部署、日志报警

- Serverless 通过 serverless.yml 和简单配置即可完成所有基础设施（云函数、API 网关、COS、DB 等）的创建，部署，和修改。

- Serverless 可以快速在不同环境(stage)和资源地区(region)进行应用部署。同时部署速度可以提升最多 20 倍。

- Serverless 提供了更强大的日志收集，统计分析，异常报警服务。开发者无需任何配置即可直接使用。

### 高可用、低成本、弹性伸缩

- Serverless 部署的应用可靠性可以达到 99.5% 的可靠性，同时支持灰度发布及版本快速切换。

- Serverless 采用按量计费，在闲置时间不收取任何费用，相比传统付费方式可节省 80% 以上的使用成本。

- Serverless 可以进行弹性伸缩，进一步保证了应用的可用性并降低了使用维护成本。

## 开始开发

通过 Serverless CLI 工具无需登录腾讯云控制台就可以轻松创建、开发、调试、部署、查看、移除 serverless 应用，

使用 Serverless 可以进行多种应用开发，同时满足不同的使用场景。

### 云函数开发

Serverless 为[腾讯云函数(SCF)](https://cloud.tencent.com/product/scf)应用开发者提供了完善的支持，通过 serverelss CLI 工具开发者可以快速进行本地单函数/多函数开发，代码调试，日志查看以及一键部署。结合消息队列，文件系统，事件触发器，数据库等其他云上资源，使云函数开发非常便捷同时支持更多使用场景。

### 框架应用开发

Serverless 为框架应用(如：Nextjs, Express, Django, SrpintBoot 等)提供了运行环境支持，通过 serverless 开发者可以轻松进行框架应用进行开发或将已有应用通过简单改造迁移到 serverless 平台，获得 serverless 的全部优势。

### SaaS 应用托管

Serverless 为提供了许多 SaaS 应用(如：Wordpress, DiscuzQ 等)的封装，通过 serverless 简单配置就可以部署并在 serverless 上使用这些应用，在获得 serverless 优势的同时也无需担心应用的后续维护和升级。

**下一步：开始 Serverless 开发**

- [安装 Serverless CLI](/docs/quickstart/installation)
- [开始云函数开发](./quickstart/function-dev)
- [开始应用开发](./quickstart/components-dev)
