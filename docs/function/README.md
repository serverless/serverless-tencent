---
title: "Tencent Serverless - 云函数开发"
menuText: "云函数开发"
menuOrder: 5
description: Serverless 云函数开发
layout: Doc
---

# 云函数开发

通过 Serverless 可以快速进行函数功能的开发，开发者可以使用 Serverless 轻松在本地进行函数开发，Serverless 可以轻松配置云函数所依赖的其他云设施，并且还支持本地和远程调试，日志查看以及一键部署。

> 目前云函数开发支持运行时有：Nodejs12.16, Nodejs10.15, Python3.6, Python2.7, Php7, Php5, Go, Java8, 自定义运行时。更多的运行时会在未来逐步添加。

## 单函数与多函数

Serverless 同腾讯云一起提供了 `scf` 组件和 `multi-scf` 组件供开发者进行云函数开发。可以基于您的使用场景进行选择

- `scf` 组件提供了单一的云函数开发的支持，适合替换 SCF 的云开发工具进行本地开发。
- `multi-scf` 组件提供了多个个云函数开发支持，适合使用 SCF 进行复杂场景开发，如： 某个资源的增删改查（CURD）功能。

## 事件（Event）函数与 WEB 函数

默认的云函数开发为事件（EVENT）处理函数，使用事件方式更方便进行事件驱动架构的应用功能开发，一个典型的事件云函数如下：

```js
"use strict";
exports.main_handler = async (event, context) => {
  console.log("Hello World");
  console.log(event);
  console.log(event["non-exist"]);
  console.log(context);
  return event;
};
```

在事件函数中开发者需要处理事件对象（Event）以及函数的上下文（Context）。

同时开发者也可以进行 WEB 函数开发，直接处理 HTTP 请求并返回结果，一个典型的 WEB 函数如下：

```js
const express = require("express");
const app = express();
const port = 9000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

> WEB 函数需要监听固定的`9000` 端口。
