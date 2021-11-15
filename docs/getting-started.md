---
title: "Tencent Serverless - 开始使用"
menuText: "开始使用 Serverless"
menuOrder: 2
description: 安装 Serverless CLI 工具并开始使用。
layout: Doc
---

# 开始使用 Serverless

通过 Serverless CLI 命令就可以轻松的完成 Serverless 应用的创建，调试，部署，查看，移除。

## 安装/升级 Serverless CLI

使用前请安装最新版本的 Serverless CLI 工具，您可以在命令行通过以下命令安装/更新：

```sh
# 使用 npm 全局安装 serverless 命令行工具
$ npm install -g serverless

# 升级 serverless 命令行到最新版本
$ npm update -g serverless

# 使用 bash 安装 serverless 工具
curl -o- -L https://slss.io/install | bash

# 使用 choco 安装 serverless 工具
choco install serverless
```

## 创建应用

通过 CLI 可以快速初始化 serverless 应用项目，可以选择使用交互式方式选择组件来进行配置，也可以通过指定组件名称快速创建。

```sh
# 交互式创建 serverless 应用
$ serverless

# 使用模板创建 serverless 应用并指定名称
$ serverless init express-starter --name my-sls-express
```

> 安装完成后可以使用 `sls` 代替 `serverless` 来执行 CLI 命令

## Serverless 应用配置

所有 Serverless 应用的配置，以及基础设施服务配置都在项目文件的 `serverless.yml` 中进行配置。配置分为两部分：

基础配置：

```yml
app: my-app # 应用名称，同账号下需唯一。
component: express # [必选]组件名称
name: my-component-instance # [必选]组件实例名称
stage: prod # 自定义环境信息，用来区分不同环境的实例
```

服务配置：

`inputs` 是组件处理接受的所有参数信息也就是应用 `deploy` 命令处理接受的所有参数信息。在这里进行所有的应用及基础设施服务相关的配置。

```yml
inputs: # 组件部署所需的参数
  src: # 执行目录
    src: ./
    exclude:
      - .env
  region: ap-guangzhou # 部署目标地区
  runtime: Nodejs10.15 # 运行环境
  apigatewayConf: # API 网关
    protocols:
      - http
      - https
    environment: release # 网关发布环境。[test, prepub，release]
```

> 使用不同组件的配置不完全一样，更详细的组件配置说明和使用介绍请查看[组件说明及示例](./components/README)。

## 管理应用

通过 Serverless CLI 命令可以快速对项目进行管理，无需登陆控制台就可以快速部署，查看，删除应用。

```sh
# 部署 Serverless 应用到云端
$ serverless deploy

# 查看部署的 Serverless 应用信息
$ serverless info

# 使用远程开发模式进行开发
$ serverless dev

# 移除部署的 Serverless 应用
$ serverless remove
```

> 更多的命令和使用说明请查看 [CLI 命令](./commands/README)。
