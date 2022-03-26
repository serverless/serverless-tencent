---
title: "Tencent Serverless - 框架应用开发"
menuText: "框架应用开发"
menuOrder: 2
description: 框架应用开发
layout: Doc
---

# 框架应用开发

## 初始化框架应用

在**空目录**下，执行初始化命令：

```sh
# 交互式 serverless 初始化命令
$ serverless
```

接下来按照交互提示，选择想要使用的应用框架，完成项目初始化，这里选择 `express-starter` 模版，并等待依赖安装结束：

```sh
Serverless: 当前未检测到 Serverless 项目，是否希望新建一个项目？ Yes
Serverless: 请选择你希望创建的 Serverless 应用
  nextjs-starter - 快速部署一个 nextjs 应用
  nuxtjs-starter - 快速部署一个 Nuxt.js 基础应用
❯ express-starter - 快速部署一个 Express.js 基础应用
  koa-starter - 快速部署一个 Koa.js 基础应用
  eggjs-starter - 快速部署一个Egg.js 基础应用
  flask-starter - 快速部署一个 Flask 基础应用

Serverless: 请输入项目名称 my-express-demo
Serverless: 正在安装 express-starter 应用...

- 项目 "my-express-demo" 已在当前目录成功创建
- 执行 "cd my-express-demo && serverless deploy" 部署应用

express-starter › 创建成功
```

### 项目目录

应用创建完成之后，生成的项目目录结构如下：

```sh
├── README.md
├── app.js
├── index.html
├── package.json
└── serverless.yml
```

### Express 应用文件

在目录中 app.js 为 Express 框架的应用文件

```js
const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

// Serverless 场景只能读写 /tmp 目录，所以这里需要指定上传文件的目录为 /tmp/upload
const upload = multer({ dest: "/tmp/upload" });

// Routes
app.get(`/`, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/user", (req, res) => {
  res.send([
    {
      title: "serverless framework",
      link: "https://serverless.com",
    },
  ]);
});

app.get("/user/:id", (req, res) => {
  const id = req.params.id;
  res.send({
    id: id,
    title: "serverless framework",
    link: "https://serverless.com",
  });
});

app.get("/404", (req, res) => {
  res.status(404).send("Not found");
});

app.get("/500", (req, res) => {
  res.status(500).send("Server Error");
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.send({
    success: true,
    data: req.file,
  });
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send("Internal Serverless Error");
});

app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
});
```

以上示例中展示了使用 express 部署 CURD 和文件上传的 Express 应用。

> 需要注意 Serverless 部署的框架应用需要将应用的监听端口改为 9000

### 配置文件

```yml
# ##Serverless 应用信息##
app: my-express-demo-2403af93 # app名称(app唯一识别标识)。同账号下需唯一，留空则继承组件实例名称
component: http # 要使用组件
name: expressDemo # 组件实例名称

# ##http 组件配置##
inputs:
  src:
    src: ./ # 执行目录
    exclude:
      - .env
  faas:
    runtime: Nodejs12.16 # 框架应用的运行时
    framework: express # 框架名称
    name: ${name} # 腾讯云 SCF 实例名称 (这里复用 name 名称)
  apigw:
    protocols:
      - http
      - https
```

这里

- `app`: 是当前 serverless 单函数应用的唯一应用名称（在生成时，为了避免冲突会在结尾添加随机字符串以作区分）。
- `component`: 是当前 serverless 要是用的组件，根据不同的开发场景需要使用不同的组件，这里单函数开发使用`scf`组件。
- `name`: 是当前组件的实例名称。这个名称用来在 serverless 应用中识别不同的实例，同一应用内实例名称需要唯一。

- `inputs`: 是组件所需要的配置信息，不同组件的配置信息也会不同。全部配置说明请参考 [腾讯 http 配置说明](https://github.com/serverless-components/tencent-http/blob/master/docs/configure.md)。
- `faas.runtime`: 是要使用的运行时。
- `faas.framework`: 是要使用的框架名称

## 远程开发模式

Serverless Framework 提供了快速灵活的调试模式来替代云平台的复杂费时的调试方式。使用 `serverless dev` 就可以快速开启远程开发模式。

```sh
# 进入 serverless 远程开发模式
$ serverless dev

serverless ⚡components
Dev Mode - 项目监控中，任何变更都会通过日志输出

远程调试链接：ws://127.0.0.1:9222
更多信息请参考：https://nodejs.org/en/docs/inspector
请打开 Chrome 浏览器，地址栏访问 chrome://inspect, 点击 [Open dedicated DevTools for Node] 开始调试代码
--------------------- 实时日志 ---------------------
6:35:52 PM - express-starter - deployment
region: ap-guangzhou
scf:
  functionName: express_component_bv2n5cc
  runtime:      Nodejs10.15
  namespace:    default
  lastVersion:  $LATEST
  traffic:      1
apigw:
  serviceId:   service-mt1d84ea
  subDomain:   service-mt1d84ea-xxxxxxxxxx.gz.apigw.tencentcs.com
  environment: release
  url:         https://service-mt1d84ea-xxxxxxxxxx.gz.apigw.tencentcs.com/release/

express-starter › 监听中 ...
```

接下来修改代码保存后都会立即部署到腾讯云上，并可以立即开始测试。更多关于远程开发模式的使用方法请参考[远程开发模式](../commands/dev)

> 远程开发模式不建议频繁保存代码，每次代码保存都会触发部署，过于频繁保存可能导致远程开发模式出现异常。

## 部署应用

使用 `sls deploy` 可以快速部署应用到腾讯云，部署成功或可以看到如下信息：

```sh
serverless ⚡components
Action: "deploy" - Stage: "dev" - App: "my-express-demo-2403af93" - Name: "expressDemo"

faas:
  type:      web
  name:      expressDemo
  runtime:   Nodejs12.16
  namespace: default
apigw:
  id:          service-gdwl6why
  subDomain:   service-gdwl6why-xxxxxxxxxx.gz.apigw.tencentcs.com
  environment: release
  url:         https://service-gdwl6why-xxxxxxxxxx.gz.apigw.tencentcs.com/release/
  apiList:
    -
      path:            /
      method:          ANY
      apiName:         http_api
      created:         true
      authType:        NONE
      businessType:    NORMAL
      isBase64Encoded: false
      apiId:           api-h1742bsy
      internalDomain:
      url:             https://service-gdwl6why-xxxxxxxxxx.gz.apigw.tencentcs.com/release/
region: ap-guangzhou

应用控制台: https://serverless.cloud.tencent.com/apps/my-express-demo-2403af93/expressDemo/dev
```

部署完成后通过访问 API 网关的地址就可以访问部署后的应用了。
