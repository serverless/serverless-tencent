---
title: "Tencent Serverless - 事件函数开发"
menuText: "事件函数开发"
menuOrder: 3
description: 事件函数开发
layout: Doc
---

# 事件函数开发

## 事件函数参数

在事件函数开发的过程中，需要关注每个函数的两个参数，这两个参数是

- event：传递触发事件数据内容
- context：传递运行时信息内容

### Event 事件

Event 用于传递事件信息，以下是一个 API 网关的事件示例：

```json
// API 网关EVENT示例
{
  "requestContext": {
    "serviceId": "service-f94sy04v",
    "path": "/test/{path}",
    "httpMethod": "POST",
    "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
    "identity": {
      "secretId": "abdcdxxxxxxxsdfs"
    },
    "sourceIp": "10.0.2.14",
    "stage": "release"
  },
  "headers": {
    "accept-Language": "en-US,en,cn",
    "accept": "text/html,application/xml,application/json",
    "host": "service-3ei3tii4-251000691.ap-guangzhou.apigateway.myqloud.com",
    "user-Agent": "User Agent String"
  },
  "body": "{\"test\":\"body\"}",
  "pathParameters": {
    "path": "value"
  },
  "queryStringParameters": {
    "foo": "bar"
  },
  "headerParameters": {
    "Refer": "10.0.2.14"
  },
  "stageVariables": {
    "stage": "release"
  },
  "path": "/test/value",
  "queryString": {
    "foo": "bar",
    "bob": "alice"
  },
  "httpMethod": "POST"
}
```

同时 Serverless 还支持的事件有 [API 网关触发器](https://cloud.tencent.com/document/product/583/12513), [COS 触发器](https://cloud.tencent.com/document/product/583/9707), [CLS 触发器](https://cloud.tencent.com/document/product/583/49587), [定时触发器](https://cloud.tencent.com/document/product/583/9708), [CMQ Topic 触发器](https://cloud.tencent.com/document/product/583/11517), [CKafka 触发器](https://cloud.tencent.com/document/product/583/17530), [MPS 触发器](https://cloud.tencent.com/document/product/583/50833), [CLB 触发器](https://cloud.tencent.com/document/product/583/52635), [云 API 触发器](https://cloud.tencent.com/document/product/583/18198)， 更多请查看[触发器配置](../guides/trigger)。

### Context 运行时信息

Context 包括了当前调用的执行超时时间，内存限制，以及当次请求 ID，一下是一个运行时信息示例：

```js
{
    getRemainingTimeInMillis: [Function: getRemainingTimeInMillis],
    memory_limit_in_mb: 128,
    time_limit_in_ms: 3000,
    request_id: '4ca7089c-3bb0-48cf-bcdb-26d130fed2ae',
    environment: '{"SCF_NAMESPACE":"default"}',
    environ: 'SCF_NAMESPACE=default;SCF_NAMESPACE=default',
    function_version: '$LATEST',
    function_name: 'test',
    namespace: 'default',
    tencentcloud_region: 'ap-chengdu',
    tencentcloud_appid: '1253970226',
    tencentcloud_uin: '3473058547'
}

```

## 事件函数开发

### Node.js 事件函数

#### 定义函数

- event：使用此参数传递触发事件数据。
- context：使用此参数向您的处理程序传递运行时信息。
- callback（可选）：使用此参数用于将您所希望的信息返回给调用方。使用 async 描述的入口函数，需要使用 return 关键字返回，非 async 模式的入口函数，需要使用 callback 入参返回。

```js
// callback 方式定义函数
module.exports = (event, context, callback) => {
  console.log(event);
  callback(null, { code: 0 });
};

// async 方式定义
module.exports = async (event, context) => {
  console.log(event);
  return { code: 0 };
};
```

#### 返回和异常

您的处理程序可以使用 callback 入参，或代码中的 return 关键字来返回信息。使用 callback 或 return 进行返回的支持情况如下 callback 方式的回调参数说明

```js
callback(error, result);
```

- error：【可选】函数执行失败时使用此参数返回错误。成功情况下反回 null。
- result：【可选】函数执行成功的结果信息。参数需兼容 JSON.stringify 以便序列化为 JSON 格式。

如果使用 return 关键字进行返回，可直接使用 return object 来返回一个对象或值。
如果在代码中未调用 callback 或 return，云函数后台将会隐式调用，并且返回 null。

根据调用函数时的调用类型不同，返回值会有不同的处理方式。同步调用的返回值将会序列化为 JSON 格式后返回给调用方，异步调用的返回值将会被抛弃。同时，无论同步调用还是异步调用，返回值均会在函数日志中 ret_msg 位置显示。

#### 注意事项

由于部分外部引入的库的原因，可能会导致事件循环持续不为空。这种情况将会在某些条件下导致函数无法返回直至超时。为了避免外部库的影响，可以通过关闭事件循环等待来自行控制函数的返回时机。通过如下方式，可以修改默认的回调行为，避免等待事件循环为空。

设置 `context.callbackWaitsForEmptyEventLoop` 为 false。
通过在 callback 回调执行前设置 `context.callbackWaitsForEmptyEventLoop = false`; ，可以使云函数后台在 callback 回调被调用后立刻冻结进程，不再等待事件循环内的事件，而在同步过程完成后立刻返回。

#### 日志

您可以在程序中使用如下语句来完成日志输出：

```js
console.log(...);
console.error(...);
console.warn(...);
console.info(...);
```

#### 内建依赖库

Serverless 腾讯内置了许多常用工具库，方便开发者在函数开发过程中使用，具体使用方法如下。

```js
const COS = require("cos-nodejs-sdk-v5");
```

目前包含的库 请参考[腾讯 Node.js 内建依赖说明文档](https://cloud.tencent.com/document/product/583/11060#.E7.8E.AF.E5.A2.83.E5.86.85.E7.9A.84.E5.86.85.E7.BD.AE.E5.BA.93)

### Python 事件函数

event：使用此参数传递触发事件数据。
context：使用此参数向您的处理程序传递运行时信息。

```py
import json

def main_handler(event, context):
    print("Received event: " + json.dumps(event, indent = 2))
    print("Received context: " + str(context))
    return("Hello World")
```

#### 返回和异常

您的处理程序可以使用 return 来返回值，根据调用函数时的调用类型不同，返回值会有不同的处理方式。

同步调用：使用同步调用时，返回值会序列化后以 JSON 的格式返回给调用方，调用方可以获取返回值已进行后续处理。例如通过控制台进行的函数调试的调用方法就是同步调用，能够在调用完成后捕捉到函数返回值并显示。
异步调用：异步调用时，由于调用方法仅触发函数就返回，不会等待函数完成执行，因此函数返回值会被丢弃。
同时，无论同步调用还是异步调用，返回值均会在函数日志中 ret_msg 位置显示。

您可以在函数内使用 raise Exception 的方式抛出异常。抛出的异常会在函数运行环境中被捕捉到并在日志中以 Traceback 的形式展示。

#### 日志

您可以在程序中使用 print 或使用 logging 模块来完成日志输出。例如，如下函数：

```py
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
def main_handler(event, context):
    logger.info('got event{}'.format(event))
    print("got event{}".format(event))
    return 'Hello World!'
```

输出内容您可以在函数日志中的 log 位置查看。

#### 使用内建依赖库

目前包含的库请参考[腾讯 Python 内建依赖说明文档](https://cloud.tencent.com/document/product/583/55592#.E5.86.85.E7.BD.AE.E7.9A.84.E5.BA.93.E5.88.97.E8.A1.A8)
