---
title: "函数开发"
menuText: "函数开发"
layout: Doc
---

# 函数开发

> 与国际版本不同，Serverless 中国通过 SCF 组件实现了国际版的函数开发功能。

Serverless Framework 通过 SCF Component 提供了基于腾讯 SCF 的函数开发能力，用户可以使用 SCF Component 快速进行函数开发。

腾讯 SCF Component 的全部配置说明请参考 [配置说明](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md)。

在函数开发的过程中，需要关注每个函数的两个参数，这两个参数是

- event：传递触发事件数据内容
- context：传递运行时信息内容

### Event 事件

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

同时 Serverless Framework 还支持的事件有 [API 网关触发器](https://cloud.tencent.com/document/product/583/12513), [COS 触发器](https://cloud.tencent.com/document/product/583/9707), [CLS 触发器](https://cloud.tencent.com/document/product/583/49587), [定时触发器](https://cloud.tencent.com/document/product/583/9708), [CMQ Topic 触发器](https://cloud.tencent.com/document/product/583/11517), [CKafka 触发器](https://cloud.tencent.com/document/product/583/17530), [MPS 触发器](https://cloud.tencent.com/document/product/583/50833), [CLB 触发器](https://cloud.tencent.com/document/product/583/52635), [云 API 触发器](https://cloud.tencent.com/document/product/583/18198)， 更多请查看[触发器配置](../basic/trigger)。

### Context 运行时

Context 包括了当前调用的执行超时时间，内存限制，以及当次请求 ID。

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

## 使用步骤

### 创建项目

```sh
# 使用命令行创建指定运行时项目
# sls init scf-nodejs
```

> 更多使用介绍请查看[函数应用开发](../quickstart/function-dev).

Serverless Framework 支持创建以下语言的函数应用模板

- Node.js 函数应用([scf-nodejs](https://github.com/serverless-components/tencent-examples/tree/master/scf-nodejs)): Node.js 10.15 和 Node.js12.16
- Python 函数应用([scf-python](https://github.com/serverless-components/tencent-examples/tree/master/scf-python)): Python2.7 和 Python3.6
- Golang 函数应用([scf-golang](https://github.com/serverless-components/tencent-examples/tree/master/scf-golang)): Golang1.8 及以上版本
- PHP 函数应用([scf-php](https://github.com/serverless-components/tencent-examples/tree/master/scf-php)): PHP5 和 PHP7

**下一步：开始函数开发**

- [函数 CLI 命令](./function-commands)
- [Node.js 函数应用开发](./nodejs)
- [Python 函数应用开发](./python)
- [Golang 函数应用开发](./golang)
- [PHP 函数应用站点](./php)
