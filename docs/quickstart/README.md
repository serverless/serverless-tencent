---
title: "快速开始"
menuText: "快速开始"
layout: Doc
---

# 快速开始

Serverless Framework 通过 CLI 命令以及配置文件就可以完成全部配置，部署管理操作。

与国际版本不同，Serverless 在腾讯云也是通过组件方式来进行函数应用的开发。（使用 SCF Components 组件）。

> 需要注意 Serverless CLI 目前包含了组件命令以及 serverless 命令，要执行组件相关命令，需要在项目目录住执行。

## 创建项目

通过 CLI 可以快速初始化 serverless 应用项目，可以选择使用交互式方式选择组件来进行配置，也可以通过指定组件名称快速创建。

```sh
# 交互式创建 serverless 应用
$ serverless

# 使用模板创建 serverless 应用并指定名称
$ serverless init express-starter --name my-sls-express
```

## Serverless 配置文件

所有 Serverless 的相关配置，以及基础设施配置都在项目文件的 `serverless.yml` 中进行配置。配置分为两部分：

基础配置：

```yml
app: my-app # 应用名称，同账号下需唯一。
component: express # [必选]组件名称
name: my-component-instance # [必选]组件实例名称
stage: prod # 自定义环境信息，用来区分不同环境的实例
```

参数配置：

`inputs` 是组件处理接受的所有参数信息也就是应用 `deploy` 命令处理接受的所有参数信息。

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

> 不同组件的配置不完全一样，具体组件支持的参数配置相见相关组件[说明及示例](../components/README)。

## 管理应用

通过 Serverless 命令可以快速对项目进行管理，无需登陆控制台就可以快速部署，查看，删除应用。

```sh
# 部署 Serverless 应用到云端
$ serverless deploy

# 查看部署的 Serverless 应用信息
$ serverless info

# 使用调试模式进行开发
$ serverless dev

# 移除部署的 Serverless 应用
$ serverless remove
```

> 组件命令需要在组件项目目录中执行。更多关于命令的说明请查看 [组件命令](../components/components-commands) 和 [函数命令](../function/function-commands)

**下一步：**

- [安装并使用](./installation)
- [开发函数应用](./function-dev)
- [开发组件应用](./components-dev)
