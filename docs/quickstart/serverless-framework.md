# 什么是 Serverless 

Serverless 是一种由开发人员和企业共同推动的运动，他们意识到软件正在吞噬世界，但如果您自己构建和维护所有软件，您也会被吞噬。这一运动要求将构建应用程序中最琐碎的部分抽象化，以便开发人员能够真正将时间花在交付业务价值上。

这一运动的目的是让开发人员能够单枪匹马地构建处理生产级流量的应用程序。他们不必管理扩展他们的基础设施，他们不必配置服务器，也不必为未使用的资源付费。他们可以专注于开发。

归根结底，Serverless 是关于将开发人员的精力集中在为用户提供价值的方面（而不是在其他任何事情上浪费时间）。升级 Linux 发行版不会为用户提供价值，管理 Kubernetes 集群不会为用户提供价值，只有提供解决问题的产品才会为用户提供价值。

## Serverless Framework

Serverless Framework 是业界非常受欢迎的无服务器应用框架，通过与众多一流云供应商如腾讯云，AWS 等的紧密合作，为广大开发者提供无需关心底层基础设施，即可编写和部署代码的无服务开发体验。

Serverless Framework 同时提供资源管理、自动伸缩、统计分析等能力，让广大开发者可以节省运维成本，真正做到“按量付费”的同时，也无需花费精力处理日志收集、异常统计等任务。

### Serverless Framework (Traditional)

Serverless Framework（Traditional）用来构建事件驱动的微服务应用程序，为您自动扩展，并且仅在它们运行时向您收费。这降低了维护应用程序的总成本，使您能够更快地构建更多逻辑。

该框架使用新的事件驱动计算服务，例如 AWS Lambda、Google Cloud Functions 等。通过命令行工具，提供用于开发和部署 serverless 架构的脚手架、工作流自动化和最佳实践。也可以通过插件完全扩展。

详细介绍可以参考 [Github 上的 Serverless 项目](https://github.com/serverless/serverless)。

> Serverless Framework（Traditional）的功能目前主要用于在 AWS， Goolgle Cloud 等海外云平台进行函数应用的开发。

### Serverless 组件（Components）

Serverless 组件通过定制的基础设施支持更多开发场景，如 Express, Next.js, Wordpress 等。同时具有 serverless 的弹性扩缩容，按量付费等优势。让开发者在不改变代码和开发习惯的情况下获得 serverless 的强大优势。此外 serverless 组件还具有以下特点：

-  **全面覆盖** - 既能支持基础设施的 Components，也可以支持更高维度的，场景级别的 Components。
-  **快速部署** - Components 支持在 4-6s 内极速部署 Serverless 应用。
-  **灵活配置** - Components 支持灵活配置和方便的部署
-  **注册中心** - 通过注册中心，支持将你构建的组件（Component）或者模板 (Template) 分享给团队或公开支持他人复用。

详细介绍可以参考 [Github 上的 Serverless Components 项目](https://github.com/serverless/components)。

