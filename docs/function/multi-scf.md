---
title: "Tencent Serverless - 多函数应用开发"
menuText: "多函数应用开发"
menuOrder: 2
description: 多函数应用开发
layout: Doc
---

# 多函数应用开发

对于需要开发多个函数应用的情况（如使用 serverless 实现资源的 CURD），可以使用多函数组件 `multi-scf` 来进行相关功能开发，部署后应用的每一个函数都会部署为一个云函数 SCF 实例。

## 初始化多函数应用

在**空目录**下，执行初始化命令：

```sh
# 交互式 serverless 初始化命令
$ serverless
```

接下来按照交互提示，完成项目初始化，选择 `multi-scf-starter` 模版，并选择所需要的运行时（这里使用 nodejs 运行时），并等待依赖安装结束：

```sh
Serverless: 当前未检测到 Serverless 项目，是否希望新建一个项目？ Yes
Serverless: 请选择你希望创建的 Serverless 应用 (Use arrow keys or type to search)
❯ multi-scf-starter - 快速部署多个云函数
  scf-starter - 快速部署一个云函数
  website-starter - 快速部署一个静态网站
  react-starter - 快速部署一个 React.js 应用
  vue-starter - 快速部署一个 Vue.js 基础应用
  nextjs-starter - 快速部署一个 nextjs 应用
  nuxtjs-starter - 快速部署一个 Nuxt.js 基础应用

Serverless: 请选择应用的运行时 (Use arrow keys)
❯ multi-scf-nodejs - 快速部署多个事件类型的 nodejs 云函数
  multi-scf-python - 快速部署多个事件类型的 Python 云函数
  multi-scf-db-starter - 快速部署多个事件类型的 nodejs 云函数

Serverless: 请输入项目名称 my-mscf-node-demo
Serverless: 正在安装 multi-scf-nodejs 应用...

- 项目 "my-mscf-node-demo" 已在当前目录成功创建
- 执行 "cd my-mscf-node-demo && serverless deploy" 部署应用

multi-scf-nodejs › 创建成功
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
exports.index = async (event, context) => {
  return {
    message: "Tencent SCF execute successful!",
    input: event,
  };
};

exports.hello = async (event, context) => {
  const name = event.pathParameters.name;
  return {
    message: `Hello from ${name || "Anonymous"}`,
    body: event.body || null,
    queries: event.queryString || null,
  };
};
```

> 在多函数应用的函数文件中可以定义多个函数，默认创建的函数是事件函数，如过需要进行 WEB 函数的开发，可以替换为 WEB 函数的结构。

### 配置文件

应用创建完成之后，可以在项目目录看到生成的 `serverless.yml` 配置文件：

```yml
app: my-mscf-node-demo-d5c14120 # app名称(app唯一识别标识)。同账号下需唯一
component: multi-scf # 要使用组件
name: event_demo # 组件实例名称

# ##multi-scf 组件配置##
inputs:
  src: # 执行目录
    src: ./
    exclude:
      - .env
  type: event # 函数类型（默认event）
  region: ap-guangzhou
  runtime: Nodejs12.16
  memorySize: 128
  timeout: 3
  functions: # 多函数配置
    index:
      handler: index.index
    hello:
      handler: index.hello
      memorySize: 256
      timeout: 10
  triggers: # 触发器配置
    - type: timer
      function: index
      parameters:
        name: timer1
        cronExpression: "*/5 * * * * * *" # 每5秒触发一次
        enable: true
        argument: argument # 额外的参数
    - type: apigw
      parameters:
        name: serverless
        protocols:
          - https
          - http
        # id: service-xxx # 如果不配置，会自动创建
        apis: # api网关触发器
          - path: /
            method: GET
            # api 的 function 配置优先级高于外层 function
            function: index
          - path: /hello/{name}
            method: POST
            # api 的 function 配置优先级高于外层 function
            function: hello
            param:
              - name: name
                position: PATH
                required: false
                type: string
                desc: name
```

这里需要注意

- `app`: 当前 serverless 单函数应用的唯一应用名称（在生成时，为了避免冲突会在结尾添加随机字符串以作区分）。
- `component`: 要使用的组件，根据不同的开发场景需要使用不同的组件，这里单函数开发使用`scf`组件。
- `name`: 当前组件的实例名称。这个名称用来在 serverless 应用中识别不同的实例，同一应用内实例名称需要唯一。

- `inputs`: 组件所需要的配置信息，不同组件的配置信息也会不同。全部配置说明请参考 [multi-scf 配置说明](https://github.com/serverless-components/tencent-multi-scf/blob/master/docs/configure.md)。
- `functions`: 多函数组件配置要暴露函数的对象。
  - 函数别名: 对于多函数需要为没个暴露的函数定义一个别名，别名用于在触发器中引用具体函数使用。
    - `handler`: 别名对应的暴露函数的文件名称和文件中的函数名称
- `type`: 函数类型，默认为 `event` 如果进行 WEB 函数开发需要修改为 `web`
- `triggers`: 函数触发器配置，用于配置如何调用函数，可以通过消息队列，API 网关等多种方式调用。

## 部署应用

使用 `sls deploy`可以快速部署应用到腾讯云，部署成功或可以看到如下信息：

```sh
serverless ⚡components
Action: "deploy" - Stage: "dev" - App: "my-mscf-node-demo-d5c14120" - Name: "event_demo"

region:    ap-guangzhou
functions:
  -
    key:        hello
    region:     ap-guangzhou
    type:       Event
    name:       event_demo-dev-my-mscf-node-demo-d5c14120-hello
    timeout:    10
    namespace:  default
    runtime:    Nodejs12.16
    handler:    index.hello
    memorySize: 256
  -
    key:        index
    region:     ap-guangzhou
    type:       Event
    name:       event_demo-dev-my-mscf-node-demo-d5c14120-index
    timeout:    3
    namespace:  default
    runtime:    Nodejs12.16
    handler:    index.index
    memorySize: 128
triggers:
  -
    name:     event_demo-dev-my-mscf-node-demo-d5c14120-index
    triggers:
      -
        AddTime:          2021-08-25 23:53:18
        AvailableStatus:  Available
        BindStatus:
        CustomArgument:   argument
        Enable:           1
        ModTime:          2021-08-25 23:53:18
        ResourceId:
        TriggerAttribute:
        TriggerDesc:      {"cron":"*/5 * * * * * *"}
        TriggerName:      timer1
        Type:             timer
        Qualifier:        $DEFAULT
        triggerType:      timer
      -
        created:     true
        serviceId:   service-4bsxcuby
        serviceName: serverless
        subDomain:   service-4bsxcuby-xxxxxxxxx.gz.apigw.tencentcs.com
        protocols:   http&https
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
            apiId:           api-me9lft6w
            internalDomain:
            url:             https://service-4bsxcuby-xxxxxxxxxx.gz.apigw.tencentcs.com/release/
        url:         https://service-4bsxcuby-xxxxxxxxxx.gz.apigw.tencentcs.com
        triggerType: apigw
  -
    name:     event_demo-dev-my-mscf-node-demo-d5c14120-hello
    triggers:
      -
        created:     true
        serviceId:   service-4bsxcuby
        serviceName: serverless
        subDomain:   service-4bsxcuby-xxxxxxxxxx.gz.apigw.tencentcs.com
        protocols:   http&https
        environment: release
        apiList:
          -
            path:            /hello/{name}
            method:          POST
            apiName:         index
            created:         true
            authType:        NONE
            businessType:    NORMAL
            isBase64Encoded: false
            apiId:           api-c2frt5m4
            internalDomain:
            url:             https://service-4bsxcuby-xxxxxxxxxx.gz.apigw.tencentcs.com/release/hello/{name}
        url:         https://service-4bsxcuby-xxxxxxxxxx.gz.apigw.tencentcs.com
        triggerType: apigw

应用控制台: https://serverless.cloud.tencent.com/apps/my-mscf-node-demo-d5c14120/event_demo/dev

19s › event_demo › 执行成功
```

### 访问函数

部署成功后，通过访问 API 网关的触发器 URL 地址就可以对函数进行访问，这里访问函数`index`的网关地址后会看到函数返回的结果和事件对象:

```json
{
  "message": "Tencent SCF execute successful!",
  "input": {
    "headerParameters": {},
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
      "connection": "keep-alive",
      "host": "service-4bsxcuby-1302533238.gz.apigw.tencentcs.com",
      "requestsource": "APIGW",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "sec-gpc": "1",
      "upgrade-insecure-requests": "1",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.115 Safari/537.36",
      "x-api-requestid": "73837518616af99bbeace99522926399",
      "x-api-scheme": "https",
      "x-b3-traceid": "73837518616af99bbeace99522926399",
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
      "serviceId": "service-4bsxcuby",
      "sourceIp": "20.197.69.95",
      "stage": "release"
    }
  }
}
```

### 调用函数

部署成功后，使用 `sls invoke -f index` 就可以调用指定函数(调用别名为`index`的函数)，调用成功后会返回调用结果和日志：

```sh
billDuration:      1
duration:          1
errMsg:
functionRequestId: 28327fa9-4bc4-4025-be2b-d062df1ecb58
invokeResult:      0
log:
  """
    START RequestId: 28327fa9-4bc4-4025-be2b-d062df1ecb58
    Event RequestId: 28327fa9-4bc4-4025-be2b-d062df1ecb58

    END RequestId: 28327fa9-4bc4-4025-be2b-d062df1ecb58
    Report RequestId: 28327fa9-4bc4-4025-be2b-d062df1ecb58 Duration:1ms Memory:128MB MemUsage:10.4414MB
  """
memUsage:          10948608
---------------------------------------------
Serverless: 调用成功

{
  message: 'Tencent SCF execute successful!',
  input: {}
}
```

> 这里因为没有传入自定义 event 对象，所以调用后返回结果中 event 为空，也可以通过 `-d` 参数传入了 event 的序列化 JSON 对象。

### 查看日志

部署成功后，使用 `sls logs -f index` 就可以查看指定函数日志(调用别名为`index`的函数)，函数日志执行成功后会返回日志结果：

```sh
serverless ⚡components
Action: "logs" - Stage: "dev" - App: "my-mscf-node-demo-d5c14120" - Name: "event_demo"

START RequestId:ff5a7ecf-82ea-4d4d-8e9e-a589f3bcea9e
Response RequestId:ff5a7ecf-82ea-4d4d-8e9e-a589f3bcea9e RetMsg:{"message":"Tencent SCF execute successful!","input":{"Message":"argument","Time":"2021-08-25T15:55:10Z","TriggerName":"timer1","Type":"Timer"}}
END RequestId:ff5a7ecf-82ea-4d4d-8e9e-a589f3bcea9e
Report RequestId:ff5a7ecf-82ea-4d4d-8e9e-a589f3bcea9e Duration:1ms Memory:128MB MemUsage:48.542969MB

START RequestId:c7db20cc-fb8c-40cd-90b8-87b05ffa4cdc
Response RequestId:c7db20cc-fb8c-40cd-90b8-87b05ffa4cdc RetMsg:{"message":"Tencent SCF execute successful!","input":{"Message":"argument","Time":"2021-08-25T15:55:15Z","TriggerName":"timer1","Type":"Timer"}}
END RequestId:c7db20cc-fb8c-40cd-90b8-87b05ffa4cdc
Report RequestId:c7db20cc-fb8c-40cd-90b8-87b05ffa4cdc Duration:1ms Memory:128MB MemUsage:8.250000MB

START RequestId:73837518616af99bbeace99522926399
Response RequestId:73837518616af99bbeace99522926399 RetMsg:{"message":"Tencent SCF execute successful!","input":{"headerParameters":{},"headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9","accept-encoding":"gzip, deflate, br","accept-language":"en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7","connection":"keep-alive","host":"service-4bsxcuby-1302533238.gz.apigw.tencentcs.com","requestsource":"APIGW","sec-fetch-dest":"document","sec-fetch-mode":"navigate","sec-fetch-site":"none","sec-fetch-user":"?1","sec-gpc":"1","upgrade-insecure-requests":"1","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.115 Safari/537.36","x-api-requestid":"73837518616af99bbeace99522926399","x-api-scheme":"https","x-b3-traceid":"73837518616af99bbeace99522926399","x-qualifier":"$DEFAULT"},"httpMethod":"GET","isBase64Encoded":false,"path":"/","pathParameters":{},"queryString":{},"queryStringParameters":{},"requestContext":{"httpMethod":"GET","identity":{},"path":"/","serviceId":"service-4bsxcuby","sourceIp":"20.197.69.95","stage":"release"}}}
END RequestId:73837518616af99bbeace99522926399
Report RequestId:73837518616af99bbeace99522926399 Duration:1ms Memory:128MB MemUsage:48.542969MB

```
