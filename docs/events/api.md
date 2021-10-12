---
title: "Tencent Serverless - API 网关"
menuText: "API 网关"
menuOrder: 2
description: API 网关
layout: Doc
---

# API 网关

您可以通过编写 SCF 云函数来实现 Web 后端服务，并通过 API 网关对外提供服务。API 网关会将请求内容以参数形式传递给函数，并将函数返回作为响应返回给请求方。更多细节请看定[腾讯 API 网关触发器](https://cloud.tencent.com/document/product/583/12513)文档。

```yml
# scf 单函数触发器
events:
  - apigw: # api网关触发器，已有apigw服务，配置触发器
      parameters:
        serviceName: serverless
        serviceId: service-8dsikiq6
        protocols:
          - http
        netTypes:
          - OUTER
        description: the serverless service
        environment: release
        endpoints:
          - path: /users
            method: POST
          - path: /test/{abc}/{cde}
            apiId: api-id
            apiName: index
            method: GET
            description: Serverless REST API
            enableCORS: true
            responseType: HTML
            serviceTimeout: 10
            isBase64Encoded: false
            isBase64Trigger: false
            base64EncodedTriggerRules:
              - name: Accept
                value:
                  - image/jpeg
              - name: Content_Type
                value:
                  - image/jpeg
            param:
              - name: abc
                position: PATH
                required: true
                type: string
                defaultValue: abc
                desc: mytest
              - name: cde
                position: PATH
                required: true
                type: string
                defaultValue: abc
                desc: mytest
            function:
              isIntegratedResponse: true
              functionQualifier: $DEFAULT
            usagePlan:
              usagePlanId: 1111
              usagePlanName: slscmp
              usagePlanDesc: sls create
              maxRequestNum: 1000
            auth:
              secretName: secret
              secretIds:
                - xxx
```
```yml
# multi-scf 多函数触发器
triggers: 
  - type: apigw
    parameters:
      name: serverless
      id: service-xxx # 如果不配置，会自动创建
      apis:
        - path: /
          method: GET
          function: index
        - path: /{uid}
          method: POST
          function: userList
          param:
            - name: uid
              position: PATH
              required: true
              type: string
              defaultValue: 0
              desc: user id
```

##  配置说明

通常 API 触发器配置包含以下字段，具体的字段和配置方式请参考[单函数组件(scf)](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#api-%E7%BD%91%E5%85%B3%E8%A7%A6%E5%8F%91%E5%99%A8)和[多函数组件(multi-scf)](https://github.com/serverless-components/tencent-multi-scf/blob/master/docs/configure.md#api-%E7%BD%91%E5%85%B3%E8%A7%A6%E5%8F%91%E5%99%A8)的全量配置说明文档。

| 参数名称    | 必选 | 类型     | 默认值      | 描述                                                         |
| ----------- | ---- | -------- | ----------- | ------------------------------------------------------------ |
| environment | 否   | string   | `release`   | 发布的环境，填写 `release`、`test` 或 `prepub`，不填写默认为`release` |
| serviceId   | 否   | string   |             | 网关 Service ID（不传入则新建一个 Service）                  |
| instanceId  | 否   | string   |             | 网关实例 ID，填写则使用独享型实例创建 API 网关，否则创建共享型实例（该项只能在创建时指定，创建后无法修改） |
| protocols   | 否   | string[] | `['http']`  | 前端请求的类型，如 http，https，http 与 https                |
| netTypes    | 否   | string[] | `['OUTER']` | 网络类型，如 `['OUTER']`, `['INNER']` 与`['OUTER', 'INNER']` |
| serviceName | 否   | string   |             | 网关 API 名称。如果不传递则默认新建一个名称与触发器名称相同的 Apigw API 名称。 |
| description | 否   | string   |             | 网关 API 描述                                                |
| endpoints   | 是   | object[] |             | 参考 [endpoint](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#endpoints-参数) 参数。 |

> 注意：如果配置多个 API 网关触发器，需要配置不同的 `serviceName`


### endpoints 配置

| 参数名称                  | 必选 | 类型                                                         | 默认值  | 描述                                                         |
| ------------------------- | ---- | ------------------------------------------------------------ | ------- | ------------------------------------------------------------ |
| path                      | 是   | string                                                       |         | API 的前端路径，如/path。                                    |
| method                    | 否   | string                                                       |         | API 的前端请求方法，如 GET                                   |
| apiId                     | 否   | string                                                       |         | API ID。如果不传递则根据 path 和 method 创建一个，传递了直接忽略 path 和 method 参数。 |
| apiName                   | 否   | string                                                       |         | API 名称                                                     |
| description               | 否   | string                                                       |         | API 描述                                                     |
| enableCORS                | 是   | boolean                                                      | `false` | 是否需要开启跨域                                             |
| responseType              | 否   | string                                                       |         | 自定义响应配置返回类型，现在只支持 HTML、JSON、TEST、BINARY、XML（此配置仅用于生成 API 文档提示调用者）。 |
| serviceTimeout            | 是   | number                                                       | `15`    | API 的后端服务超时时间，单位是秒。                           |
| param                     | 否   | [Parameter](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#Parameter) |         | 前端参数                                                     |
| function                  | 否   | [Function](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#Function) |         | SCF 配置                                                     |
| usagePlan                 | 否   | [UsagePlan](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#UsagePlan) |         | 使用计划                                                     |
| auth                      | 否   | [Auth](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#Auth) |         | API 密钥配置                                                 |
| authType                  | 否   | string                                                       | `NONE`  | `NONE` 或 `APP`                                              |
| app                       | 否   | [App](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#App) |         | API 绑定 �APP 配置                                           |
| isBase64Encoded           | 否   | boolean                                                      | `false` | 是否开启 Base64 编码，只有后端为 scf 时才会生效              |
| isBase64Trigger           | 否   | boolean                                                      | `false` | 是否开启 Base64 编码的 header 触发，只有后端为 scf 时才会生效 |
| base64EncodedTriggerRules | 否   | [Base64Rule](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#Base64Rule)[] | []      | Header 触发 Base64 编码规则，总规则数不能超过 10，只有 `isBase64Trigger` 设置为 `true` 才有效 |

### Parameter 配置

| 参数名称     | 必选 | 类型    | 默认值 | 描述                                                      |
| ------------ | ---- | ------- | ------ | --------------------------------------------------------- |
| name         | 否   | string  |        | API 的前端参数名称。                                      |
| position     | 否   | string  |        | API 的前端参数位置。当前仅支持 PATH、QUERY、HEADER        |
| required     | 否   | boolean |        | API 的前端参数是否必填，true：表示必填，false：表示可选。 |
| type         | 否   | string  |        | API 的前端参数类型，如 String、Int 等。                   |
| defaultValue | 否   | string  |        | API 的前端参数默认值。                                    |
| desc         | 否   | string  |        | API 的前端参数备注。                                      |

### Function 配置

| 参数名称             | 必选 | 类型    | 默认值     | 描述                     |
| -------------------- | ---- | ------- | ---------- | ------------------------ |
| isIntegratedResponse | 否   | boolean | `false`    | 是否启用 SCF 集成响应。  |
| functionQualifier    | 否   | string  | `$DEFAULT` | 触发器关联的 SCF 版本 。 |

### UsagePlan 配置

| 参数名称      | 必选 | 类型   | 描述                                                    |
| ------------- | ---- | ------ | ------------------------------------------------------- |
| usagePlanId   | 否   | string | 用户自定义使用计划 ID                                   |
| usagePlanName | 否   | string | 用户自定义的使用计划名称                                |
| usagePlanDesc | 否   | string | 用户自定义的使用计划描述                                |
| maxRequestNum | 否   | number | 请求配额总数，如果为空，将使用-1 作为默认值，表示不开启 |

### Auth 配置

| 参数名称   | 必选 | 类型   | 描述     |
| ---------- | ---- | ------ | -------- |
| secretName | 否   | string | 密钥名称 |
| secretIds  | 否   | string | 密钥 ID  |

### APP 配置

| 参数名称    | 必选 | 类型   | 描述                |
| ----------- | ---- | ------ | ------------------- |
| name        | 否   | string | 用户自定义 APP 名称 |
| id          | 否   | string | APP ID              |
| description | 否   | string | 用户自定义 APP 描述 |

### Base64Rule 配置

Header 触发 Base64 编码规则，总规则数不能超过 10，只有 `isBase64Trigger` 设置为 `true` 才有效

| 参数名称 | 类型     | 描述                                                         |
| -------- | -------- | ------------------------------------------------------------ |
| name     | string   | 进行编码触发的 header，可选值 "Accept"和"Content_Type" 对应实际数据流请求 header 中的 Accept 和 Content-Type |
| value    | string[] | 进行编码触发的 header 的可选值数组, 数组元素的字符串最大长度为 40，元素可以包括数字，英文字母以及特殊字符，特殊字符的可选值为： . + * - / _ |

例如 `value` 可以配置为：

```
value:
  - application/zip
```

## API 网关入参

在 API 网关触发器接收到请求时，会将类似以下 JSON 格式的事件数据发送给绑定的云函数。

```json
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
 "headerParameters":{
   "Refer": "10.0.2.14"
 },
 "stageVariables": {
   "stage": "release"
 },
 "path": "/test/value",
 "queryString": {
   "foo" : "bar",
   "bob" : "alice"
 },
 "httpMethod": "POST"
}
```

数据结构内容详细说明如下：

| 结构名                | 内容                                                         |
| :-------------------- | :----------------------------------------------------------- |
| requestContext        | 请求来源的 API 网关的配置信息、请求标识、认证信息、来源信息。其中：serviceId，path，httpMethod 指向 API 网关的服务 ID、API 的路径和方法。stage 指向请求来源 API 所在的环境。requestId 标识当前这次请求的唯一 ID。identity 标识用户的认证方法和认证的信息。sourceIp 标识请求来源 IP。 |
| path                  | 记录实际请求的完整 Path 信息。                               |
| httpMethod            | 记录实际请求的 HTTP 方法。                                   |
| queryString           | 记录实际请求的完整 Query 内容。                              |
| body                  | 记录实际请求转换为 String 字符串后的内容。                   |
| headers               | 记录实际请求的完整 Header 内容。                             |
| pathParameters        | 记录在 API 网关中配置过的 Path 参数以及实际取值。            |
| queryStringParameters | 记录在 API 网关中配置过的 Query 参数以及实际取值。           |
| headerParameters      | 记录在 API 网关中配置过的 Header 参数以及实际取值。          |

## API 网关响应

在 API 网关设置为集成响应时，需要将包含以下 JSON 格式的数据结构返回给 API 网关。

```json
{
   "isBase64Encoded": false,
   "statusCode": 200,
   "headers": {"Content-Type":"text/html"},
   "body": "<html><body><h1>Heading</h1><p>Paragraph.</p></body></html>"
}
```

数据结构内容详细说明如下：

| 结构名          | 内容                                                         |
| :-------------- | :----------------------------------------------------------- |
| isBase64Encoded | 指明 body 内的内容是否为 Base64 编码后的二进制内容，取值需要为 JSON 格式的 true 或 false。 |
| statusCode      | HTTP 返回的状态码，取值需要为 Integer 值。                   |
| headers         | HTTP 返回的头部内容，取值需要为多个 key-value 对象，或 `key:[value,value]` 对象。其中 key、value 均为字符串。headers 请求头暂不支持 Location key。 |
| body            | HTTP 返回的 body 内容。                                      |

在需要返回 key 相同的多个 headers 时，可以使用字符串数组的方式描述不同 value，例如：

```json
{
   "isBase64Encoded": false,
   "statusCode": 200,
   "headers": {"Content-Type":"text/html","Key":["value1","value2","value3"]},
   "body": "<html><body><h1>Heading</h1><p>Paragraph.</p></body></html>"
}
```
