---
title: "Tencent Serverless - WEB 函数开发"
menuText: "WEB 函数开发"
menuOrder: 4
description: WEB 函数开发
layout: Doc
---

# WEB 函数开发

## WEB 函数参数

web 函数可以使用众多框架(如：Express, Koa)进行应用开发，并且在开发过程中可以直接处理 HTTP 请求和响应。

以 Express 框架的 WEB 函数开发为例, web 函数参数为:

req: Express 封装的 request 请求对象。
res: Express 封装的 response 对象。

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

### 返回和异常

函数平台会在执行出错时返回错误的异常代码：

| 状态码 | 返回信息                                       | 说明                                                                                                               |
| :----- | :--------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| 200    | Success                                        | 函数执行成功。                                                                                                     |
| 404    | InvalidSubnetID                                | 当函数执行执调用时子网 id 错误时，会有该返回信息，请检查函数的网络配置信息是否正确以及子网 id 是否有效。           |
| 405    | ContainerStateExitedByUser                     | 容器进程正常退出，请检查您的启动文件是否编写正确。                                                                 |
| 406    | RequestTooLarge                                | 函数调用请求参数体太大时，会有该返回信息，同步请求事件最大为 6MB。                                                 |
| 410    | The HTTP response body exceeds the size limit. | 函数返回 Body 过大，超出 6MB 限制，请调整函数返回值大小后重试。                                                    |
| 430    | User code exception caught                     | 当用户代码执行出现错误时，会有该返回信息，可以根据控制台的错误日志，查看代码错误堆栈信息，检查代码是否能正常执行。 |
| 433    | TimeLimitReached                               | 当函数执行时间超出超时配置，会有该返回信息，请检查业务代码是否有大量耗时处理操作，或在函数配置页调整执行超时时间。 |
| 439    | User process exit when running                 | 当函数执行时用户进程意外退出时，会有该返回信息，可根据返回错误信息查询进程退出原因修复函数代码。                   |
| 446    | PortBindingFailed                              | 未监听指定端口，请检查您的业务代码是否监听`9000`端口。                                                             |
| 499    | kRequestCanceled                               | 用户手动中断请求。                                                                                                 |
| 500    | InternalError                                  | 内部错误。                                                                                                         |

> 如果遇到错误代码 `405` 请检查是否将应用端口配置为 9000，以及是否有特殊依赖或顺序启动项目，可能需要手动配置启动文件。

## 启动文件

Serverless 会在 web 函数部署时自动创建 SCF 所需要的启动文件(scf_bootstrap), 这里唯一需要注意的是，web 函数需要使用指定的 `9000` 端口作为监听端口。
如果要进行更复杂的启动文件配置，请查看[腾讯 SCF 启动文件说明](https://cloud.tencent.com/document/product/583/56126)
