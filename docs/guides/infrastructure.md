---
title: "Tencent Serverless - 基础组件说明"
menuText: "基础组件说明"
menuOrder: 5
description: Serverless 基础组件说明
layout: Doc
---

# 基础组件说明

Serverless 将腾讯云的基础服务封装在常用的高级组件中以满足开发者不同的功能需求，针对不同开发场景，常用的高级组件有：

|   组件配置   | 云函数开发（[scf 组件](https://github.com/serverless-components/tencent-scf/tree/master/docs)） | 多函数开发([multi-scf 组件](https://github.com/serverless-components/tencent-multi-scf/tree/master/docs)) | 框架应用开发 ([http 组件](https://github.com/serverless-components/tencent-http/tree/master/docs)) | 静态网站开发 ([web 组件](https://github.com/serverless-components/tencent-website/tree/master/docs))] |
| :----------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|    云函数    |                              ✅                               |                              ✅                               |                              ✅                               |                              ❌                               |
|   API 网关   |                              ✅                               |                              ✅                               |                              ✅                               |                              ❌                               |
| COS 对象存储 |                              ❌                               |                              ❌                               |                              ✅                               |                              ✅                               |
| CDN 内容分发 |                              ❌                               |                              ❌                               |                              ✅                               |                              ✅                               |
| VPC 虚拟网络 |                              ✅                               |                              ✅                               |                              ✅                               |                              ❌                               |
| CLS 函数日志 |                              ✅                               |                              ✅                               |                              ❌                               |                              ❌                               |
| CFS 文件存储 |                              ✅                               |                              ✅                               |                              ❌                               |                              ❌                               |
| TCR 容器镜像 |                              ✅                               |                              ✅                               |                              ❌                               |                              ❌                               |
| CAM 访问权限 |                              ✅                               |                              ✅                               |                              ❌                               |                              ❌                               |

除此之外，开发者也可以使用其他基础组件将腾讯云的服务整合到 Serverless 应用中，这里包含组件有：

> 要使用多组件构建应用请参考[项目结构](./infrastructure)中的说明组织多组件 Serverless 应用结构。也可以参考[Express全栈应用示例](https://cn.serverless.com/blog/fullstack-demo)中的说明。

|         组件         |                           对应服务                           |                           相关文档                           |                          示例和配置                          |
| :------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|       API 网关       | [腾讯 API 网关](https://cloud.tencent.com/document/product/628) | [腾讯 API 网关组件介绍](https://cloud.tencent.com/document/product/1154/39268) [Base64 编码说明](https://cloud.tencent.com/document/product/628/51799) | [示例代码](https://github.com/serverless-components/tencent-apigateway/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-apigateway/blob/master/docs/configure.md) |
|      ASW 工作流      | [腾讯 ASW 应用与服务编排工作流](https://cloud.tencent.com/document/product/1272) |                                                              | [示例代码](https://github.com/serverless-components/tencent-asw/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-asw/blob/master/docs/configure.md) |
|     CDN 内容分发     | [腾讯 CDN 内容分发](https://cloud.tencent.com/document/product/228) | [腾讯 CDN 内容分发组件介绍](https://cloud.tencent.com/document/product/1154/40491) | [示例代码](https://github.com/serverless-components/tencent-cdn/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-cdn/blob/master/docs/configure.md) |
|     CFS 文件系统     | [腾讯 CFS 文件存储](https://cloud.tencent.com/document/product/582) |                                                              | [示例代码](https://github.com/serverless-components/tencent-cfs/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-cfs/blob/master/docs/configure.md) |
|     CLS 函数日志     | [腾讯 CLS 函数日志](https://cloud.tencent.com/document/product/614) |                                                              | [示例代码](https://github.com/serverless-components/tencent-cls/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-cls/blob/master/docs/configure.md) |
|     COS 对象存储     | [腾讯 COS 对象存储](https://cloud.tencent.com/document/product/436) | [腾讯 COS 对象存储组件介绍](https://cloud.tencent.com/document/product/1154/39273) | [示例代码](https://github.com/serverless-components/tencent-cos/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-cos/blob/master/docs/configure.md) |
|    cynosDB 数据库    | [腾讯 TDSQL-C 云原生数据库](https://cloud.tencent.com/document/product/1003) | [腾讯 TDSQL-C 组件介绍](https://cloud.tencent.com/document/product/1154/51857) | [示例代码](https://github.com/serverless-components/tencent-cynosdb/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-cynosdb/blob/master/docs/configure.md) |
| EventBridge 事件总线 | [腾讯 EventBridge 事件总线](https://cloud.tencent.com/document/product/1359/54353) |                                                              | [示例代码](https://github.com/serverless-components/tencent-eventbridge/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-eventbridge/tree/master/docs) |
|     Layer 应用层     | [腾讯 SCF 云函数](https://cloud.tencent.com/document/product/583) | [腾讯云 Layer 组件介绍](https://cloud.tencent.com/document/product/1154/43005) [腾讯云函数 - 层管理介绍](https://cloud.tencent.com/document/product/583/40159) | [示例代码](https://github.com/serverless-components/tencent-layer/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-layer/blob/master/docs/configure.md) |
|    MongoDB 数据库    | [腾讯 MongoDB 云数据库](https://cloud.tencent.com/document/product/240) |                                                              | [示例代码](https://github.com/serverless-components/tencent-mongodb/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-mongodb/blob/master/docs/configure.md) |
|  PostgreSQL 数据库   | [腾讯 PostgreSQL 云数据库](https://cloud.tencent.com/document/product/409/4989) | [腾讯 PostgreSQL 数据库组件介绍](https://cloud.tencent.com/document/product/1154/43004) | [示例代码](https://github.com/serverless-components/tencent-postgresql/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-postgresql/blob/master/docs/configure.md) |
|     VPC 虚拟网络     | [腾讯 VPC 虚拟网络](https://cloud.tencent.com/document/product/215) | [腾讯 VPC 私有网络组件介绍](https://cloud.tencent.com/document/product/1154/43005) | [示例代码](https://github.com/serverless-components/tencent-vpc/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-vpc/blob/master/docs/configure.md) |
|      Websocket       | [腾讯 SCF 云函数](https://cloud.tencent.com/document/product/583) |                                                              | [示例代码](https://github.com/serverless-components/tencent-websocket/tree/master/example) [全量配置](https://github.com/serverless-components/tencent-websocket/blob/master/docs/configure.md) |

不同组件的配置方式不尽相同，具体的组件配置字段信息请以对应组件的全量配置文档为准。



