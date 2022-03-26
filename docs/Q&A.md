---
title: "Tencent Serverless - 常见问题 Q&A"
menuText: "常见问题 Q&A"
menuOrder: 10
description: 常见问题 Q&A
layout: Doc
---

# 常见问题 Q&A

> 关于 Serverless Framework 的任何使用问题、建议或者经验分享欢迎到 [Serverless 中文讨论社区](https://github.com/serverless/serverless-tencent/discussions) 分享讨论。同时使用中遇到的 bug 也欢迎通过 [BUG 反馈](https://github.com/serverless/serverless-tencent/issues/new/choose) 提交并追踪。

## Serverless 相关问题

1. [Serverless 相比于 AWS SAM 和其他类似产品有什么优势?](#sls-1)
2. [如何部署 Serverless 应用到 AWS，以及如何访问全球官网？](#sls-2)
3. [为什么 Serverless 在国内默认使用腾讯云？](#sls-3)

## CLI 常见问题

1. [安装过于缓慢怎么办？](#cli-1)
2. [无法使用 serverless 或 sls 创建项目？](#cli-2)
3. [如何指定将 Serverless 应用部署到腾讯云上？](#cli-3)
4. [在中国境外进行部署时，如何加速？](#cli-4)
5. [如何在部署时，使用代理网络？](#cli-5)
6. [使用 Windows Powershell 部署无权限如何处理？](#cli-6)

## Serverless 应用问题

1. [通过组件创建 API 网关触发器和云函数，为什么函数控制台不显示触发器信息?](#app-1)


<span id="sls-1"></span>

### Serverless 相比于 AWS SAM 和其他类似产品有什么优势?

Serverless 提供了一整套完成的 Serverless 应用开发、集成、监控、管理的产品和相关工具。例如
* Serverless CLI 提供了用户使用本地编辑器，工具开发、调试、管理 Serverless 应用的功能。
* Serverless Console(控制台) 
  * Serverless Monitoring 提供了 Serverless 应用的全面监控，包括请求详情，错误，冷启动，以及使用成本。
  * Serverless CI/CD 提供了 Serverless 应用的自动集成，预览发布，部署管理等功能。
  * Serverless Secrets 提供了 Serverless 应用的密钥信息集成，管理功能。
  * Serverless Teams 提供了 Serverless 应用团队账号管理，无需额外提供授权，就可以进行协同开发。
  * Serverless Integrations 提供了提供了日志和警告的导出功能，方便将应用日志集成进任意第三方平台。
* Serverless Cloud 提供了秒级的 Serverless 应用开发云平台，同时更加轻松的查看和分享您的 Serverless 应用。

Serverless 致力于提供不限定云厂商的一致的无服务器开发体验，我们最终的目标是让开发者无需关心云厂商基础设施的不同，以及无需配置应用集成部署流程，也无需关心应用的维护工作。让开发者集中精力在应用开发和实现用户增长上。

> 以上部分功能处于开发或预览阶段，如需体验请前往 Serverless 全球站点了解，如果您想了解某些功能的最新进度请同我们取得联系。

<span id="sls-2"></span>

### 如何部署 Serverless 应用到 AWS，以及如何访问全球官网？

如果要部署和创建 AWS 上的 Serverless 应用项目，需要在使用时通过环境变量进行切换，如：`SERVERLESS_PLATFORM_VENDOR=aws`。 同时创建和部署 AWS 的Serverless应用项目也需要再命令中添加这个环境变量。

如果通过 www.serverless.com 或 serverless.com 访问 Serverless 官方网站，会根据用户的 IP 地址，为中国用户自动跳转到中文官方网站，如果想要访问 Serverless 全球官方，可以通过地址 wb.serverless.com 进行访问。 

<span id="sls-3"></span>

### 为什么 Serverless 在国内默认使用腾讯云？

Serverless 与腾讯云达成了战略合作伙伴的关系，Serverless 同腾讯云一起通过深度定制的云厂商基础服务设施，解决了 Serverless 产品功能上面的许多局限性，比如对传统 WEB 框架（ Express, Django, Spring ）应用的支持等, 并集成进腾讯云现有的云控制中心方便用户进行统一管理。 我们通过与腾讯云的深度合作，来为用户带来超越其他云厂商的 Serverless 应用开发体验。

<span id="cli-1"></span>

### 安装过于缓慢怎么办？

如果您在安装过程中等待时间过长或者安装不成功，建议使用国内的 npm 镜像地址来完成安装 `npm i serverless -g --registry=https://registry.npmmirror.com`。此外也可以安装 yarn, cnpm 等替代工具，然后再使用替代工具的进行安装。

<span id="cli-2"></span>

### 无法使用 serverless 或 sls 创建项目？

初始化新的项目需要在非 Serverless 应用目录中才能进行， 请检查当前目录是否包含 Serverless 应用的配置文件 `serverless.yml`。需要确保目录不包含该配置文件才能创建项目。

<span id="cli-3"></span>

### 如何指定将 Serverless 应用部署到腾讯云上？

如果开发者想要在腾讯云上创建部署 Serverless 应用，可以通过 `SERVERLESS_PLATFORM_VENDOR=tencent sls deploy` 来手动指定要使用的云厂商，也可以将该配置存储在 .env 环境配置文件中。

<span id="cli-4"></span>

### 在中国境外进行部署时，如何加速？

在境外部署时，可以通过 `GLOBAL_ACCELERATOR_NA=true sls deploy` 使用境外的存储节点加速部署。

<span id="cli-5"></span>

### 如何在部署时，使用代理网络？

可以在部署时配置网络代理来使用制定的代理网络进行部署，如 `HTTP_PROXY=http://127.0.0.1:12345 sls deploy` 或 `HTTPS_PROXY=http://127.0.0.1:12345 sls deploy`

<span id="cli-6"></span>

### 使用 Windows Powershell 部署无权限如何处理？

Windows powershell 的权限管理比较严格，需要执行 `set-executionpolicy remotesigned` 命令后即可正常部署。此外，Windows 环境下建议通过 `serverless` 完整名称来使用 Serverless，以避免同系统命令发生冲突。

<span id="app-1"></span>

### 通过组件创建 API 网关触发器和云函数，为什么函数控制台不显示触发器信息?

Serverless 组件通过调用 API 网关接口完成网关触发器创建，目前 SCF 控制台不支持显示通过网关接口创建的触发器，您可以在 [API 网关控制台](https://console.cloud.tencent.com/apigateway/index) 完成相关触发器的配置管理。
