---
title: "Tencent Serverless - Serverless开发流程"
menuText: "Serverless开发流程"
menuOrder: 3
description: serverless 开发流程
layout: Doc
---

# Serverless 开发流程

Serverless 支持函数应用开发，框架应用开发以及 SaaS 应用开发，要开发 Serverless 应用除了相关的代码外，仅需要额外配置一个 **serverless 配置文件**，就可以将代码部署为 serverless 应用。Serverless 应用的整个开发生命周期都需要使用 Serverless CLI 完成，详见 [Serverless CLI 安装说明](./installation) 以及 [Serverless CLI 命令](./commands)

## 创建 Serverless 项目

开发者可以使用模板创建项目，也可以手动创建 serverless 配置文件(`serverless.yml`)将已有的项目转化为 serverless 项目

- 使用 CLI 命令 `sls` (命令行交互) 来创建一个 serverless 官方模板应用。
- 使用 CLI 命令 `sls init {模板名称}` （指定模板） 来创建一个已发布的 serverless 模板应用。
- 手动添加 `serverless.yml` 并完成 serverless 应用配置将任意项目转化为 serverless 应用。

## 配置项目

项目创建完成之后，可以在配置文件（`serverless.yml`）完成对应用的配置。这里有以下几部分

### Serverelss 应用配置

- `app`: 是当前 serverless 单函数应用的唯一应用名称（在生成时，为了避免冲突会在结尾添加随机字符串以作区分）。
- `component`: 是当前 serverless 要是用的组件，根据不同的开发场景需要使用不同的组件。
- `name`: 组件的实例名称。这个名称用来在 serverless 应用中识别不同的实例，同一应用内实例名称需要唯一。

- `inputs`: 组件所需要的配置信息，不同组件的配置信息也会不同。

> inputs 的配置都是腾讯云相关设施的配置信息，如： inputs.name 是腾讯云部署的实例名称，region 是腾讯云的地区信息等

更多的组件和配置说明详见 [云函数开发](./function/README) 或 [框架及 SaaS 应用](./components/README)

## 调试开发

应用开发过程中，可以通过 Serverless CLI 的功能方便进行调试，开发，包含一下主要命令

- `sls dev` : 启动远程开发模式，更多调试模式详情请参考[远程开发模式](./guides/dev-mode)。
- `sls invoke local` : (仅支持云函数开发) 本地调用函数。 同时可以发送 event 和 context 数据到函数进行本地调用测试。
- `sls invoke` : (仅支持云函数开发) 调用已部署函数，可以发送自定义 event 数据来调用函数，在结果中可以查看日志，以及其他函数调用相关信息。
- `sls logs` : 查看应用云端指定时间区间的日志或实时日志。

更多命令详见[Serverless CLI 命令](./commands)

## 部署发布

应用开发完成后，可以通过 Serverless CLI 的**`deploy`命令**轻松部署到腾讯云。在部署的时候可以指定部署应用的**环境(`stage`)**信息,如

```sh
$ sls deploy --stage prod
```

通过 stage 信息 Serverless 在部署时会自动加载相关环境的配置`.env.${stage}`信息，默认加载`.env` 环境变量配置文件，详见[Serverless 变量](./guides/variables)

## 账号管理

Serverless 部署时使用腾讯云账号，分为几种情况：

- 全局身份认证信息：使用 `sls credentials` 进行管理，如果应用项目内没有指定应用的身份密钥信息，会使用默认的全局身份认证信息。
- 应用身份认证信息：在环境变量中通过指定`TENCENT_SECRET_ID` 和 `TENCENT_SECRET_KEY` 来制定应用部署所需要的身份认证信息。
- 扫码授权：在为配置全局身份，也没有使用应用身份部署时，或部署时传入参数 `--login` 回弹出登陆二维码，用绑定腾讯云的微信扫码后即可部署。

更多腾讯云账号使用说明详见 [腾讯云账号](./guides/tencent-account)。

## 应用管理

在应用部署完成后可以通过 Serverless CLI 即可查看和管理 serverless 应用。

- `sls info`: 查看部署应用的详情和 component output 信息。
- `sls remove`: 删除已部署的 serverless 应用。
