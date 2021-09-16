---
title: "Tencent Serverless - 静态网站开发"
menuText: "静态网站开发"
menuOrder: 1
description: 静态网站开发
layout: Doc
---

# 静态站点开发

当要部署一个纯静态网站时，可以使用静态网站组件 `website` 来进行相关功能开发，部署后静态网站回部署到腾讯云 COS 中。

## 初始化静态站点应用

在**空目录**下，执行初始化命令：

```sh
# 交互式 serverless 初始化命令
$ serverless
```

接下来按照交互提示，完成项目初始化，选择 `website-starter` 模版，并等待依赖安装结束：

```sh
Serverless: 当前未检测到 Serverless 项目，是否希望新建一个项目？ Yes
Serverless: 请选择你希望创建的 Serverless 应用
  multi-scf-starter - 快速部署多个云函数
  scf-starter - 快速部署一个云函数
❯ website-starter - 快速部署一个静态网站
  react-starter - 快速部署一个 React.js 应用
  vue-starter - 快速部署一个 Vue.js 基础应用
  nextjs-starter - 快速部署一个 nextjs 应用
  nuxtjs-starter - 快速部署一个 Nuxt.js 基础应用

Serverless: 请输入项目名称 my-website-demo
Serverless: 正在安装 website-starter 应用...

- 项目 "my-website-demo" 已在当前目录成功创建
- 执行 "cd my-website-demo && serverless deploy" 部署应用

website-starter › 创建成功
```

### 项目目录

应用创建完成之后，生成的项目目录结构如下：

```sh
├── README.md
├── README_EN.md
├── serverless.yml
└── src
    └── index.html
```

### 配置文件

```yml
app: my-website-demo-968354ba # app名称(app唯一识别标识)。同账号下需唯一
component: website # 要使用组件
name: websiteDemo # 组件实例名称

# ##website 组件配置##
inputs:
  src: ./ # 执行目录
    src: ./src # 项目代码目录
    index: index.html # 静态网站主页
    error: index.html # 静态网站错误页
  region: ap-guangzhou # 部署目标地区
  bucketName: my-website-starter # COS bucket名称
  protocol: https
```

这里需要注意

- `app`: 是当前 serverless 单函数应用的唯一应用名称（在生成时，为了避免冲突会在结尾添加随机字符串以作区分）。
- `component`: 是当前 serverless 要是用的组件，根据不同的开发场景需要使用不同的组件，这里静态网站开发使用`website`组件。
- `name`: 是当前组件的实例名称。这个名称用来在 serverless 应用中识别不同的实例，同一应用内实例名称需要唯一。

- `inputs`: 是组件所需要的配置信息，不同组件的配置信息也会不同。全部配置说明请参考 [腾讯 website 配置说明](https://github.com/serverless-components/tencent-website/blob/master/docs/configure.md)。
- `src.src`: 是生成的静态网站文件目录。
- `src.index`: 是静态网站主页文件。
- `src.error`: 是静态网站错误页文件。
- `bucketName`: 是静态网站的 COS bucket 名称，不存在会新建 bucket。

### 动态构建网站

对于有构建网站步骤的开发流程，需要在`serverless.yml`路径配置中配置构建命令 hook 以及构建后的输出目录路径(具体参考使用框架的说明文档), 在部署之前 Serverless Framework 会自动使用该命令构建网站。

```yml
# nextjs, nuxtjs, react-starter, vue-starter 配置示例
inputs:
  src: # 执行目录
    src: ./src # 项目代码目录
    hook: npm run build # 构建命令，在 Serverless 部署前执行。
    dist: ./dist # 输出的目录。如果配置 hook，此参数必填
```

## 部署应用

使用 `sls deploy`可以快速部署应用到腾讯云，部署成功或可以看到如下信息：

```sh
serverless ⚡components
Action: "deploy" - Stage: "dev" - App: "my-website-demo-968354ba" - Name: "websiteDemo"

region:  ap-guangzhou
website: https://my-website-starter-xxxxxxxxxx.cos-website.ap-guangzhou.myqcloud.com

应用控制台: https://serverless.cloud.tencent.com/apps/my-website-demo-968354ba/websiteDemo/dev

7s › websiteDemo › 执行成功
```

部署成功后通过返回的地址就可以访问网站。
