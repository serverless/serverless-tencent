---
title: "Tencent Serverless - 单函数应用开发"
menuText: "单函数应用开发"
menuOrder: 1
description: 单函数应用开发
layout: Doc
---

# 单函数应用开发

对于开发单个函数应用的情况，可以使用单函数组件 `scf` 来进行相关功能开发，部署后应用会部署为一个云函数 SCF 实例。

## 初始化单函数应用

在**空目录**下，执行初始化命令：

```sh
# 交互式 serverless 初始化命令
$ serverless
```

接下来按照交互提示，完成项目初始化，选择 `scf-starter` 模版，并选择所需要的运行时（这里使用 nodejs 运行时），并等待依赖安装结束：

```sh
Serverless: 当前未检测到 Serverless 项目，是否希望新建一个项目？ Yes
Serverless: 请选择你希望创建的 Serverless 应用
  multi-scf-starter - 快速部署多个云函数
❯ scf-starter - 快速部署一个云函数
  website-starter - 快速部署一个静态网站
  react-starter - 快速部署一个 React.js 应用
  vue-starter - 快速部署一个 Vue.js 基础应用
  nextjs-starter - 快速部署一个 nextjs 应用
  nuxtjs-starter - 快速部署一个 Nuxt.js 基础应用

Serverless: 请选择应用的运行时 (Use arrow keys)
❯ scf-nodejs - 快速部署一个 nodejs 云函数
  scf-python - 快速部署一个 python 云函数
  scf-php - 快速部署一个 PHP 云函数
  scf-golang - 快速部署一个 golang 云函数

Serverless: 请输入项目名称 my-scf-node-demo
Serverless: 正在安装 scf-nodejs 应用...

- 项目 "my-scf-node-demo" 已在当前目录成功创建
- 执行 "cd my-scf-node-demo && serverless deploy" 部署应用

scf-nodejs › 创建成功
```

### 项目目录

应用创建完成之后，生成的项目目录结构如下：

```sh
├── README.md
├── README_EN.md
├── index.js # 主函数文件
└── serverless.yml # Serverless 配置文件
```

### 函数文件

其中函数文件如下:

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

> 默认创建的函数是事件函数，如果需要进行 WEB 函数的开发，可以替换为 WEB 函数的结构。

### 配置文件

应用创建完成之后，可以在项目目录看到生成的 `serverless.yml` 配置文件：

```yml
# ##Serverless 应用信息##
app: my-scf-node-demo-6d53f98e # app名称(app唯一识别标识)。同账号下需唯一
component: scf # 要使用组件
name: scf-nodejs # 组件实例名称

# ##scf 组件配置##
inputs:
  src: ./ # 执行目录
  type: event # 函数类型（默认event）
  name: my-scf-instance-name # 实例名称(可选)
  handler: index.main_handler # 函数方法名称
  region: ap-guangzhou # 部署目标地区
  runtime: Nodejs10.15 # 运行环境
  memorySize: 128
  timeout: 3
  events: # 触发器
    - apigw: # api网关触发器
        parameters:
          endpoints:
            - path: /
              method: GET
```

这里

- `app`: 是当前 serverless 单函数应用的唯一应用名称（在生成时，为了避免冲突会在结尾添加随机字符串以作区分）。
- `component`: 是当前 serverless 要是用的组件，根据不同的开发场景需要使用不同的组件，这里单函数开发使用`scf`组件。
- `name`: 组件的实例名称。这个名称用来在 serverless 应用中识别不同的实例，同一应用内实例名称需要唯一。

- `inputs`: 组件所需要的配置信息，不同组件的配置信息也会不同。全部配置说明请参考 [腾讯 scf 配置说明](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md)。
- `handler`: 单函数组件要暴露的文件名称和文件中的函数名称。
- `type`: 函数类型，默认为 `event` 如果进行 WEB 函数开发需要修改为 `web`
- `events`: 函数触发器，用于配制如何调用函数，可以通过消息队列，API 网关等多种方式调用。

## 部署应用

使用 `sls deploy`可以快速部署应用到腾讯云，部署成功或可以看到如下信息：

```sh
serverless ⚡components
Action: "deploy" - Stage: "dev" - App: "my-scf-node-demo-6d53f98e" - Name: "scf-nodejs"

type:         event
functionName: scf-nodejs-dev-my-scf-node-demo-6d53f98e
code:
  bucket: sls-cloudfunction-ap-guangzhou-code
  object: /scf_component_z40q8qm2-1629904939.zip
description:  This is a function in my-scf-node-demo-6d53f98e application
namespace:    default
runtime:      Nodejs10.15
handler:      index.main_handler
memorySize:   128
lastVersion:  $LATEST
traffic:      1
triggers:
  -
    NeedCreate:  true
    created:     true
    serviceId:   service-bylee882
    serviceName: serverless
    subDomain:   service-bylee882-xxxxxxxxxx.gz.apigw.tencentcs.com
    protocols:   http
    environment: release
    apiList:
      -
        path:            /
        method:          GET
        apiName:         index
        created:         true
        authType:        NONE
        businessType:    NORMAL
        isBase64Encoded: false
        apiId:           api-75qme2hu
        internalDomain:
        url:             http://service-bylee882-xxxxxxxxxx.gz.apigw.tencentcs.com/release/
    url:         http://service-bylee882-xxxxxxxxxx.gz.apigw.tencentcs.com
    urls:
      - http://service-bylee882-xxxxxxxxxx.gz.apigw.tencentcs.com/release/

应用控制台: https://serverless.cloud.tencent.com/apps/my-scf-node-demo-6d53f98e/scf-nodejs/dev

12s › scf-nodejs › 执行成功
```

### 访问函数

部署成功后，通过访问 API 网关的触发器 URL 地址就可以对函数进行访问，访问成功后会看到函数返回的事件对象:

```json
{
  "headerParameters": {},
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate",
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "connection": "keep-alive",
    "host": "service-bylee882-xxxxxxxxxx.gz.apigw.tencentcs.com",
    "requestsource": "APIGW",
    "sec-gpc": "1",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.115 Safari/537.36",
    "x-api-requestid": "dd07d1c3558237a8881322d5f8109e5e",
    "x-api-scheme": "http",
    "x-b3-traceid": "dd07d1c3558237a8881322d5f8109e5e",
    "x-qualifier": "$DEFAULT"
  },
  "httpMethod": "GET",
  "isBase64Encoded": false,
  "path": "/",
  "pathParameters": {},
  "queryString": {},
  "queryStringParameters": {},
  "requestContext": {
    "httpMethod": "GET",
    "identity": {},
    "path": "/",
    "serviceId": "service-bylee882",
    "sourceIp": "20.197.69.95",
    "stage": "release"
  }
}
```

### 调用函数

部署成功后，使用 `sls invoke` 就可以调用函数，函数调用成功后会返回调用结果和日志：

```sh
billDuration:      1
duration:          1
errMsg:
functionRequestId: aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3
invokeResult:      0
log:
  """
    START RequestId: aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3
    Event RequestId: aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3
    2021-08-25T15:37:23.239Z	aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3	Hello World
    2021-08-25T15:37:23.239Z	aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3	{ foo: 'bar' }
    2021-08-25T15:37:23.239Z	aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3	undefined
    2021-08-25T15:37:23.239Z	aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3	{ callbackWaitsForEmptyEventLoop: [Getter/Setter],
      getRemainingTimeInMillis: [Function: getRemainingTimeInMillis],
      memory_limit_in_mb: 128,
      time_limit_in_ms: 3000,
      request_id: 'aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3',
      environment: '{"SCF_NAMESPACE":"default"}',
      environ: 'SCF_NAMESPACE=default;SCF_NAMESPACE=default',
      function_version: '$LATEST',
      function_name: 'scf-nodejs-dev-my-scf-node-demo-6d53f98e',
      namespace: 'default',
      tencentcloud_region: 'ap-guangzhou',
      tencentcloud_appid: '1302533238',
      tencentcloud_uin: '100006388220' }

    END RequestId: aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3
    Report RequestId: aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3 Duration:1ms Memory:128MB MemUsage:53.3672MB
  """
memUsage:          55959552
---------------------------------------------
Serverless: 调用成功

{
  foo: 'bar'
}
```

> 这里因为有传入自定义 event 对象，所以调用后返回结果与之前不同，上面例子中使用 `sls invoke -d "{key:"value"}"` 传入了 event 序列化的 JSON 对象。

### 查看日志

部署成功后，使用 `sls logs` 就可以查看函数日志，函数日志执行成功后会返回日志结果：

```sh
serverless ⚡components
Action: "logs" - Stage: "dev" - App: "my-scf-node-demo-6d53f98e" - Name: "scf-nodejs"

START RequestId:aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3
2021-08-25T15:37:23.239Z	aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3	Hello World
2021-08-25T15:37:23.239Z	aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3	{ foo: 'bar' }
2021-08-25T15:37:23.239Z	aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3	undefined
2021-08-25T15:37:23.239Z	aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3	{ callbackWaitsForEmptyEventLoop: [Getter/Setter],
  memory_limit_in_mb: 128,
  getRemainingTimeInMillis: [Function: getRemainingTimeInMillis],
  environment: '{"SCF_NAMESPACE":"default"}',
  time_limit_in_ms: 3000,
  request_id: 'aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3',
  environ: 'SCF_NAMESPACE=default;SCF_NAMESPACE=default',
  function_name: 'scf-nodejs-dev-my-scf-node-demo-6d53f98e',
  tencentcloud_region: 'ap-guangzhou',
  tencentcloud_appid: '1302533238',
  function_version: '$LATEST',
  namespace: 'default',
  tencentcloud_uin: '100006388220' }
Response RequestId:aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3 RetMsg:{"foo":"bar"}
END RequestId:aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3
Report RequestId:aa7b70e6-ab76-40d7-a2cb-76bb9f5a30a3 Duration:1ms Memory:128MB MemUsage:53.476562MB
```
