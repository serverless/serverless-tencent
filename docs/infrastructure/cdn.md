---
title: "Tencent Serverless - CDN 内容分发"
menuText: "CDN 内容分发"
menuOrder: 3
description: CDN 内容分发
layout: Doc
---

# CDN 内容分发

内容分发网络（Content Delivery Network，CDN）是在现有 Internet 中增加的一层新的网络架构，由遍布全球的高性能加速节点构成。这些高性能的服务节点都会按照一定的缓存策略存储您的业务内容，当您的用户向您的某一业务内容发起请求时，请求会被调度至最接近用户的服务节点，直接由服务节点快速响应，有效降低用户访问延迟，提升可用性。

腾讯云 CDN 组件是 serverless-tencent 组件库中的基础组件之一。通过 CDN 组件，您可以快速方便的创建、配置和管理腾讯云的 CDN 产品。

## 前提条件

- 已安装 [Node.js](https://nodejs.org/en/)（Node.js 版本需不低于 8.6，建议使用 Node.js10.0 及以上版本）。
- 需要开通 [内容分发网络](https://console.cloud.tencent.com/cdn) 服务。

## 操作步骤

#### 安装

通过 npm 安装 Serverless：

```console
npm install -g serverless
```

如果之前您已经安装过 Serverless Framework，可以通过下列命令升级到最新版：

```console
npm update -g serverless
```

#### 配置

本地创建 `serverless.yml` 文件：

```shell
touch serverless.yml
```

在 `serverless.yml` 中进行如下配置：

```yml
# serverless.yml

component: cdn
name: cdnDemo
app: appDemo
stage: dev

inputs:
  area: overseas
  domain: mysite.com #域名
  origin:
    origins:
      - xxx.cos.ap-guangzhou.myqcloud.com #源站，可以是域名或 IP
    originType: cos
    originPullProtocol: https
  serviceType: web
  forceRedirect:
    switch: on
    redirectType: https
    redirectStatusCode: 301
  https:
    switch: on
    http2: on
    certInfo:
      certId: "abc"
      # certificate: 'xxx'
      # privateKey: 'xxx'
```

[查看详细配置文档>>](#1)

#### 部署

执行以下命令进行扫码授权部署：

```console
sls deploy
```

> ?
>
> - 请确认您已经开通 [内容分发网络](https://console.cloud.tencent.com/cdn) 服务。
> - 微信扫码授权部署有过期时间，如果想要持久授权，请参考 [账号配置](#account)。

#### 移除

执行以下命令移除部署的 CDN 配置：

```console
sls remove
```

<span id="1"></span>

## 全量配置

- [全量 yml](#1-1)
- [主要参数说明](#1-2)

<span id="1-1"></span>

```yml
# serverless.yml

component: cdn
name: cdnDemo
org: orgDemo
app: appDemo
stage: dev

inputs:
  domain: abc.com
  area: overseas
  async: true
  onlyRefresh: false
  serviceType: web
  origin:
    origins:
      - origin.site.com
    originType: cos
    originPullProtocol: https
  https:
    switch: on
    http2: on
    certInfo:
      certId: "abc"
  refreshCdn:
    urls:
      - https://abc.com
  pushCdn:
    urls:
      - https://abc.com
  cache:
    simpleCache:
      followOrigin: on
      cacheRules:
        - cacheType: all
          cacheContents:
            - "*"
          cacheTime: 1000
  cacheKey:
    fullUrlCache: on
  referer:
    switch: on
    refererRules:
      - ruleType: all
        rulePaths:
          - "*"
        refererType: blacklist
        allowEmpty: true
        referers:
          - "qq.baidu.com"
          - "*.baidu.com"
  ipFilter:
    switch: on
    filterType: blacklist
    filters:
      - "1.2.3.4"
      - "2.3.4.5"
  forceRedirect:
    switch: on
    redirectType: https
    redirectStatusCode: 301
```

<span id="1-2"></span>

### 主要参数说明

| 参数名称    | 是否必选 | 默认       | 描述                                                                                                                                         |
| ----------- | -------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| domain      | 是       |            | CDN 域名。                                                                                                                                   |
| origin      | 是       |            | 源站配置，参考 [origin](#origin)                                                                                                             |     |
| area        | 否       | `mainland` | 域名加速区域，mainland：中国境内加速，overseas：中国境外加速，global：全球加速，（使用中国境外加速、全球加速时，需要先开通中国境外加速服务） |
| serviceType | 否       | `web`      | 加速域名业务类型。web：静态加速，download：下载加速，media：流媒体点播加速                                                                   |
| async       | 否       | `false`    | 是否为异步操作，如果为 true，则不会等待 CDN 创建或更新成功再返回。                                                                           |
| onlyRefresh | 否       | `false`    | 是否只刷新预热 CDN，如果为 `true`，那么只进行刷新操作，不会更新 CDN 配置                                                                     |
| refreshCdn  | 否       |            | 刷新 CDN 相关配置，参考 [refreshCdn](#refreshCdn)，如果想刷新 CDN，必须在同步部署情况下，也就是 async 必须配置为 false.                      |
| pushCdn     | 否       |            | 预热 CDN 相关配置，参考 [pushCdn](#pushCdn)，如果想预热 CDN，必须在同步部署情况下，也就是 async 必须配置为 false.                            |
| https       | 否       |            | Https 加速配置，参考：https://cloud.tencent.com/document/api/228/30987#Https                                                                 |
| cacheKey    | 否       |            | 节点缓存键配置，参考：https://cloud.tencent.com/document/api/228/30987#CacheKey                                                              |
| cache       | 否       |            | 缓存过期时间配置，参考： https://cloud.tencent.com/document/api/228/30987#Cache                                                              |
| referer     | 否       |            | 防盗链设置，参考： https://cloud.tencent.com/document/api/228/30987#Referer                                                                  |
| ipFilter    | 否       |            | IP 黑白名单配置，参考： https://cloud.tencent.com/document/api/228/30987#IpFilter                                                            |

> 注意：`async` 参数对于配置多个 CDN 域名需求，或者在 CI 流程中时，建议配置成 `true`，不然会导致 serverless cli 执行超时，或者 CI 流程超时。

#### origin

参考：https://cloud.tencent.com/document/api/228/30987#Origin

| 参数名称           | 是否必选 | 默认     | 描述                                                                                                                               |
| ------------------ | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| origins            | 是       |          | 主源站列表                                                                                                                         |
| originType         | 是       | `domain` | 主源站类型，domain：域名类型，cos：对象存储源站                                                                                    |
| originPullProtocol | 是       | `http`   | 回源协议配置，http：强制 http 回源，follow：协议跟随回源，https：强制 https 回源，https 回源时仅支持源站 443 端口                  |
| serverName         | 否       |          | 回主源站时 Host 头部，不填充则默认为加速域名。若接入的是泛域名，则回源 Host 默认为访问时的子域名                                   |
| cosPrivateAccess   | 否       |          | originType 为对象存储（COS）时，可以指定是否允许访问私有 bucket。注意：需要先授权 CDN 访问该私有 Bucket 的权限后，才可开启此配置。 |
| backupOrigins      | 否       |          | 备源站列表                                                                                                                         |
| backupOriginType   | 否       | `domain` | 备源站类型，domain：域名类型，cos：对象存储源站                                                                                    |
| backupServerName   | 否       |          | 回备源站时 Host 头部，不填充则默认为加速域名。若接入的是泛域名，则回源 Host 默认为访问时的子域名                                   |

#### refreshCdn

| 参数名称 | 是否必选 | 默认 | 描述                |
| -------- | -------- | ---- | ------------------- |
| urls     | 否       | []   | 需要刷新的 CDN 目录 |

#### pushCdn

| 参数名称 | 是否必选 | 默认 | 描述                |
| -------- | -------- | ---- | ------------------- |
| urls     | 否       | []   | 需要预热的 CDN URLs |

更多配置，请移至官方云 API 文档：https://cloud.tencent.com/document/product/228/41123
