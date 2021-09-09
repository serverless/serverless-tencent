---
title: "Tencent Serverless - API 网关组件"
menuText: "API 网关组件"
menuOrder: 1
description: API 网关组件
layout: Doc
---

# API 网关组件

API 网关（API Gateway）是 API 托管服务，提供 API 的完整生命周期管理，包括创建、维护、发布、运行、下线等。您可使用 API Gateway 封装自身业务，将您的数据、业务逻辑或功能安全可靠的开放出来，用以实现自身系统集成、以及与合作伙伴的业务连接。

API 网关组件是 serverless-tencent 组件库中的基础组件之一，您可以通过该组件快速且方便地创建、配置和管理腾讯云的 API 网关产品。

## 操作步骤

通过 API 网关组件，您可以对一个 API 服务/接口进行完整的创建、配置、部署和删除等操作，支持的命令如下：

### 安装

通过 npm 安装 Serverless：

```sh
$ npm install -g serverless
```

### 配置

本地创建 `serverless.yml` 文件：

```sh
$ touch serverless.yml
```

在 `serverless.yml` 中进行如下配置：

```yml
# serverless.yml

component: apigateway # (必填) 组件名称，此处为 apigateway
name: apigwDemo # (必填) 实例名称
app: appDemo # (可选) 该 next.js 应用名称
stage: dev # (可选) 用于区分环境信息，默认值是 dev

inputs:
  region: ap-guangzhou
  protocols:
    - http
    - https
  serviceName: serverless
  environment: release
  endpoints:
    - path: /
      protocol: HTTP
      method: GET
      apiName: index
      function:
        functionName: myFunction
```

[查看详细配置文档>>](#1)

### 部署

执行以下命令进行扫码授权部署：

```console
sls deploy
```

> ?微信扫码授权部署有过期时间，如果想要持久授权，请参考 [账号配置](#account)。

### 移除

执行以下命令移除部署的服务：

```console
sls remove
```

<span id="account"></span>

### 账号配置（可选）

当前默认支持 CLI 扫描二维码登录，如您希望配置持久的环境变量/密钥信息，也可以本地创建 `.env` 文件：

```sh
$ touch .env # 腾讯云的配置信息
```

在 `.env` 文件中配置腾讯云的 SecretId 和 SecretKey 信息并保存：

```text
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```

> - 如果没有腾讯云账号，请先 [注册新账号](https://cloud.tencent.com/register)。
> - 如果已有腾讯云账号，可以在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取 SecretId 和 SecretKey。

<span id="1"></span>

## 全量配置

- [全量 yml](#1-1)
- [主要参数说明](#1-2)

<span id="1-1"></span>

```yml
# serverless.yml

app: appDemo #（可选） 该应用名称
stage: dev #（可选） 用于区分环境信息，默认值为 dev
component: apigateway # (必填) 组件名称，此处为 apigateway
name: apigwDemo # (必填) 实例名称

inputs:
  serviceId: service-8dsikiq6
  region: ap-shanghai
  protocols:
    - http
    - https
  serviceName: serverless
  serviceDesc: the serverless service
  environment: release
  netTypes:
    - OUTER
    - INNER
  customDomains:
    - domain: abc.com
      # 如要添加https，需先行在腾讯云-SSL证书进行认证获取cettificateId
      certificateId: abcdefg
      isForcedHttps: true # 是否强制https，如果为true，必须配置 certificateId (SSL证书 ID)
      # 如要设置自定义路径映射，请设置为 false
      isDefaultMapping: false
      pathMappingSet:
        - path: /
          environment: release
      protocols:
        - http
        - https
  endpoints:
    # 前端类型: WEBSOCKET, 后端类型: SCF
    - path: /
      method: GET
      protocol: WEBSOCKET
      function:
        # 前端类型为WEBSOCKET且后端为SCF时, transportFunctionName 为是
        transportFunctionName: myFunction
        registerFunctionName: myFunction
        cleanupFunctionName: myFunction
    # 前端类型: WEBSOCKET, 后端类型: HTTP
    - path: /ws
      protocol: WEBSOCKET
      apiName: "test-ws"
      method: GET
      serviceType: WEBSOCKET
      serviceConfig:
        url: "ws://www.test.com"
        path: /
        method: GET
    # 前端类型: HTTP, 后端类型: SCF
    - path: /test/{abc}/{cde}
      apiId: api-id
      apiDesc: Serverless REST API
      method: GET
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
          required: "TRUE"
          type: string
          defaultValue: abc
          desc: mytest
        - name: cde
          position: PATH
          required: "TRUE"
          type: string
          defaultValue: abc
          desc: mytest
      function:
        isIntegratedResponse: true
        functionQualifier: $LATEST
        functionName: myFunction
      usagePlan:
        usagePlanId: 1111
        usagePlanName: slscmp
        usagePlanDesc: sls create
        maxRequestNum: -1
        maxRequestNumPreSec: 1000
      auth:
        secretName: secret
        secretIds:
          - xxx
    # 前端类型: HTTP, 后端类型: MOCK
    - path: /mo
      protocol: HTTP
      method: GET
      apiName: "mock-api"
      serviceType: MOCK
      serviceMockReturnMessage: "mock response content"
    # 前端类型: HTTP, 后端类型: HTTP
    - path: /rest
      protocol: HTTP
      apiName: "test-http"
      method: GET
      serviceType: HTTP
      serviceConfig:
        url: "http://www.test.com"
        path: /test
        method: GET
    # 下面两个为互相关联的 oauth2.0 接口示例
    # 参考文档 https://cloud.tencent.com/document/product/628/38393
    - path: "/oauth"
      protocol: "HTTP"
      method: "GET"
      apiName: "oauthapi"
      authType: "OAUTH"
      businessType: "OAUTH"
      serviceType: "HTTP"
      serviceConfig:
        method: "GET"
        path: "/check"
        url: "http://10.64.47.103:9090"
      oauthConfig:
        loginRedirectUrl: "http://10.64.47.103:9090/code"
        publicKey: '{"e":"AQAB","kty":"RSA","n":"dkdd"}'
        tokenLocation: "method.req.header.authorization"
        # // tokenLocation: 'method.req.header.cookie',
    - path: "/oauthwork"
      protocol: "HTTP"
      method: "GET"
      apiName: "business"
      authType: "OAUTH"
      businessType: "NORMAL"
      authRelationApi:
        path: "/oauth"
        method: "GET"
      serviceType: "MOCK"
      serviceMockReturnMessage: "helloworld"
```

<span id="1-2"></span>

### 主要参数说明

| 参数          | 必选 |            参数类型             |     默认值     | 描述                                                                       |
| ------------- | :--: | :-----------------------------: | :------------: | :------------------------------------------------------------------------- |
| serviceId     |  否  |             string              |                | 网关服务 ID                                                                |
| region        |  是  |             string              | `ap-guangzhou` | 服务的部署区域                                                             |
| protocols     |  是  |            string[]             |   `['http']`   | 服务的前端请求类型，http 和 https                                          |
| serviceName   |  否  |             string              |  `serverless`  | 用户自定义的服务名称。 如果该参数未传递，则由系统自动生成一个唯一名称      |
| netTypes      |  否  |            string[]             |  `['OUTER']`   | 网络类型列表，用于指定支持的访问类型，INNER 为内网访问，OUTER 为外网访问。 |
| serviceDesc   |  否  |             string              |                | 用户自定义的服务描述说明                                                   |
| environment   |  是  |             string              |   `release`    | 服务要发布的环境的名称，支持三种环境: test、prepub、 release               |
| endpoints     |  是  |     [Endpoint](#Endpoint)[]     |                | API，配置参数参考、                                                        |
| customDomains |  否  | [CustomDomain](#CustomDomain)[] |      `[]`      | 自定义域名                                                                 |

### Endpoint

API 参数说明

| 参数                      | 必选 |                 类型                  |  默认值  | 描述                                                                                                              |
| ------------------------- | :--: | :-----------------------------------: | :------: | :---------------------------------------------------------------------------------------------------------------- |
| apiId                     |  否  |                string                 |          | API 的唯一 ID                                                                                                     |
| protocol                  |  否  |                string                 |  `HTTP`  | 指定的前端 API 类型，支持 `HTTP`、`WEBSOCKET`                                                                     |
| path                      |  是  |                string                 |          | API 路径                                                                                                          |
| method                    |  是  |                string                 |          | 请求方法                                                                                                          |
| serviceType               |  否  |                string                 |  `SCF`   | 指定的后端类型，支持：`SCF`、`HTTP`、MOCK                                                                         |
| description               |  否  |                string                 |          | API 描述                                                                                                          |
| enableCORS                |  否  |                boolean                | `false`  | 是否启用跨域访问。 true：启用， false：不启用                                                                     |
| function                  |  是  |         [Function](#Function)         |          | 对应的 Serverless 云函数                                                                                          |
| usagePlan                 |  否  |        [UsagePlan](#UsagePlan)        |          | 基于 API 维度的使用计划                                                                                           |
| auth                      |  否  |       [SecretAuth](#SecretAuth)       |          | API 密钥鉴权设置                                                                                                  |
| serviceTimeout            |  否  |                number                 |   `15`   | API 的后端服务超时时间，单位为秒                                                                                  |
| responseType              |  否  |                string                 |          | 返回类型: `HTML`、`JSON`、`TEST`、`BINARY`、`XML`                                                                 |
| param                     |  否  | [RequestParameter](#RequestParameter) |          | 前端请求参数                                                                                                      |
| serviceConfig             |  否  |    [ServiceConfig](#ServiceConfig)    |          | API 的后端服务配置                                                                                                |
| serviceMockReturnMessage  |  否  |                string                 |          | Mock 接口类型返回结果，如果 `serviceType` 设置为 `MOCK`，此参数必须                                               |
| authType                  |  否  |                string                 |  `NONE`  | 鉴权类型，支持：`NONE`(免鉴权)、`SECRET`(密钥对)，`OAUTH`(Oauth2.0)                                               |
| businessType              |  否  |                string                 | `NORMAL` | 业务类型，支持：`NORMAL`、`OAUTH`                                                                                 |
| oauthConfig               |  否  |      [OauthConfig](#OauthConfig)      |          | Oauth2.0 鉴权，授业 API 后端配置，当 `authType` 为 `OAUTH`, 并且 businessType 为 `OAUTH` 时，此参数必须           |
| authRelationApi           |  否  |  [AuthRelationApi](#AuthRelationApi)  |          | Oauth2.0 鉴权，业务 API 关联授业 API 配置，当 `authType` 为 `OAUTH`, 并且 businessType 为 `NORMAL` 时，此参数必须 |
| isBase64Encoded           |  否  |                boolean                | `false`  | 是否开启 Base64 编码，只有后端为 scf 时才会生效                                                                   |
| isBase64Trigger           |  否  |                boolean                | `false`  | 是否开启 Base64 编码的 header 触发，只有后端为 scf 时才会生效                                                     |
| base64EncodedTriggerRules |  否  |      [Base64Rule](#Base64Rule)[]      |    []    | Header 触发 Base64 编码规则，总规则数不能超过 10，只有 `isBase64Trigger` 设置为 `true` 才有效                     |

- API 类型补充说明

| 前端 API 类型 (参数:protocol) | 后端服务类型 (参数:serviceType) |
| ----------------------------- | ------------------------------- |
| HTTP (默认)                   | SCF (默认)                      |
|                               | HTTP                            |
|                               | MOCK                            |
| WEBSOCKET                     | SCF (默认)                      |
|                               | WEBSOCKET                       |

### Function

关联云函数参数配置

> 此时 `serviceType` 必须为 `SCF`

| 参数                  | 必选 |  类型   |   默认值   | 描述                                             |
| --------------------- | :--: | :-----: | :--------: | :----------------------------------------------- |
| isIntegratedResponse  |  否  | boolean |  `false`   | 是否开启响应集成，当前端类型为`HTTP`时生效       |
| functionQualifier     |  否  | string  | `$DEFAULT` | scf 函数版本                                     |
| functionName          |  是  | string  |            | 云函数的名称                                     |
| transportFunctionName |  否  | string  |            | 传输函数的名称，`protocol` 为 `WEBSOCKET` 时必须 |
| registerFunctionName  |  否  | string  |            | 注册函数的名称，`protocol` 为 `WEBSOCKET` 时必须 |
| cleanupFunctionName   |  否  | string  |            | 清理函数的名称，`protocol` 为 `WEBSOCKET` 时必须 |

### ServiceConfig

API 的后端服务配置

| 参数   | 必选 |  类型  | 默认值 | 描述                                                               |
| ------ | :--: | :----: | :----: | :----------------------------------------------------------------- |
| url    |  是  | string |        | API 的后端服务 url，如果 `serviceType` 是 `HTTP`，则此参数必传     |
| path   |  是  | string |        | API 的后端服务路径，如果 `serviceType` 是 `HTTP`，则此参数必传     |
| method |  是  | string |        | API 的后端服务请求方法，如果 `serviceType` 是 `HTTP`，则此参数必传 |

### UsagePlan

使用计划参数说明

| 参数                | 必选 |  类型  | 默认值 | 描述                                            |
| ------------------- | :--: | :----: | :----: | :---------------------------------------------- |
| usagePlanId         |  是  | string |        | 用户自定义的基于 API 的使用计划 ID              |
| usagePlanName       |  是  | string |        | 用户自定义的基于 API 的使用计划名称             |
| usagePlanDesc       |  是  | string |        | 用户自定义的基于 API 的使用计划描述             |
| maxRequestNum       |  是  | number |  `-1`  | 允许的请求总数。默认情况下将使用 `-1`，表示禁用 |
| maxRequestNumPreSec |  是  | number |  `-1`  | 每秒最大请求数。默认情况下将使用 `-1`，表示禁用 |

### SecretAuth

密钥鉴权参数说明

| 参数       | 必选 |   类型   | 默认值 | 描述                  |
| ---------- | :--: | :------: | :----: | :-------------------- |
| secretName |  是  |  string  |        | 用户自定义的密钥名称  |
| secretIds  |  否  | string[] |        | 用户自定义的 SecretId |

### RequestParameter

前端请求参数说明

| 参数         | 必选 |  类型   | 默认值 | 描述                                          |
| ------------ | :--: | :-----: | :----: | :-------------------------------------------- |
| name         |  是  | string  |        | 请求参数名称                                  |
| position     |  是  | string  |        | 参数位置，仅支持`PATH`，`QUERY`和`HEADER`类型 |
| type         |  是  | string  |        | 参数类型，如 String 和 int.                   |
| defaultValue |  是  | string  |        | 参数默认值                                    |
| required     |  是  | boolean |        | 参数是否是， true: 是; false: 否              |
| desc         |  是  | string  |        | 参数备注/描述                                 |

### CustomDomain

自定义域名

| 参数             | 必选 |         类型          |   默认值   |                                                                 | 描述 |
| ---------------- | :--: | :-------------------: | :--------: | :-------------------------------------------------------------- | ---- |
| domain           |  是  |        string         |            | 需要绑定的自定义域名                                            |
| certificateId    |  否  |        string         |            | 自定义域名的证书，如果设置为 https，则为必需。                  |
| isDefaultMapping |  否  |        boolean        |   `true`   | 是否使用默认路径映射。 如果要自定义路径映射，请设为`false`      |
| pathMappingSet   |  否  | [PathMap](#PathMap)[] |    `[]`    | 自定义路径映射, 当 `isDefaultMapping` 为 `false` 时，此参数必须 |
| protocols        |  否  |       string[]        | `['http']` | 绑定自定义域协议类型，支持 http 和 https                        |
| isForcedHttps    |  否  |        boolean        |  `false`   | 是否强制 HTTPS。                                                |

### PathMap

| 参数        | 必选 |  类型  | 默认值 | 描述           |
| ----------- | :--: | :----: | :----: | :------------- |
| path        |  是  | string |        | 自定义映射路径 |
| environment |  是  | string |        | 自定义映射环境 |

### OauthConfig

| 参数             | 必选 |  类型  | 默认值 | 描述                                                                                |
| ---------------- | :--: | :----: | :----: | :---------------------------------------------------------------------------------- |
| loginRedirectUrl |  是  | string |        | 重定向地址，用于引导用户登录操作                                                    |
| publicKey        |  是  | string |        | 公钥，用于验证用户 token                                                            |
| tokenLocation    |  是  | string |        | token 传递位置，支持: `method.req.header.authorization`、`method.req.header.cookie` |

有关授业 API 的公钥生成，参考腾讯云官方文档：https://cloud.tencent.com/document/product/628/38393

### AuthRelationApi

Oauth2.0 鉴权，业务 API 关联授业 API 配置，当 `authType` 为 `OAUTH`, 并且 businessType 为 `NORMAL` 时，此参数必须

| 参数   | 必选 |  类型  | 默认值 | 描述                       |
| ------ | :--: | :----: | :----: | :------------------------- |
| path   |  是  | string |        | 关联 `授业 API` 的请求路径 |
| method |  是  | string |        | 关联 `授业 API` 的请求路径 |

### Base64Rule

Header 触发 Base64 编码规则，总规则数不能超过 10，只有 `isBase64Trigger` 设置为 `true` 才有效

参考: https://tcloud-dev.oa.com/document/product/628/16924?!preview&preview_docmenu=1&lang=cn&!document=1#Base64EncodedTriggerRule

| 参数名称 | 类型     | 描述                                                                                                                                          |
| -------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| name     | string   | 进行编码触发的 header，可选值 "Accept"和"Content_Type" 对应实际数据流请求 header 中的 Accept 和 Content-Type                                  |
| value    | string[] | 进行编码触发的 header 的可选值数组, 数组元素的字符串最大长度为 40，元素可以包括数字，英文字母以及特殊字符，特殊字符的可选值为： . + \* - / \_ |

例如 `value` 可以配置为：

```yaml
value:
  - application/zip
```

### 关于 API 网关 Base64 编码

> 注意：开启 API 网关 Base64 编码的后端必须是 `云函数`

如果需要开启 API 网关 Base64 编码，必须配置 `isBase64Encoded` 为 `true`，此时每次请求的请求内容都会被 Base64 编码后再传递给云函数。如果想要部分请求 Base64 编码，可以通过配置 `isBase64Trigger` 为 `true`，配置 `base64EncodedTriggerRules` Header 触发规则，此时 API 网关将根据触发规则对请求头进行校验，只有拥有特定 Content-Type 或 Accept 请求头的请求会被 Base64 编码后再传递给云函数，不满足条件的请求将不进行 Base64 编码，直接传递给云函数。

官方介绍文档：https://cloud.tencent.com/document/product/628/51799
