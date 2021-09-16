---
title: "Tencent Serverless - 基础组件说明"
menuText: "基础组件说明"
menuOrder: 7
description: Serverless 基础组件说明
layout: Doc
---

# 基础组件说明

- [SCF 函数组件](./scf)
- [API 网关](./api-gateway)
- [COS 对象存储](./cos)
- [CDN 内容分发](./cdn)
- [VPC 私有网络](./vpc)
- [Layer 组件](./layer)
- [PostgreSQL 数据库](./postgresql)
- [TDSQL-C 数据库](./tdsql-c)

不同组件的配置方式不尽相同，具体的组件配置字段信息请查看对应组件的配置示例和说明。

|              | 云函数开发（scf/multi-scf 组件） | 框架应用开发 (http 组件) |
| :----------: | :------------------------------: | :----------------------: |
| VPC 虚拟网络 |                ✅                |            ✅            |
| Layer 层部署 |                ✅                |            ✅            |
| CMQ 消息队列 |                ✅                |            ❌            |
| CLS 函数日志 |                ✅                |            ❌            |
| CFS 文件系统 |                ✅                |            ❌            |
| EVENT 触发器 |                ✅                |            ❌            |
| API 网络网关 |                ✅                |            ✅            |
|   COS 配置   |                ❌                |            ✅            |
|   CDN 配置   |                ❌                |            ✅            |

腾讯云云函数（Serverless Cloud Function，SCF）在使用过程中可能关联和使用到的产品如下。 https://cloud.tencent.com/document/product/583/30512

| 产品名称                                                                    | 与云函数的关系                                                          |
| :-------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| [腾讯私有网络 VPC](https://cloud.tencent.com/document/product/215)          | 可以通过将云函数配置到 VPC，实现访问 VPC 内的资源。                     |
| [腾讯对象存储 COS](https://cloud.tencent.com/document/product/436)          | 可以通过配置对象存储触发器，在对应的 Bucket 产生事件时触发云函数。      |
| [腾讯日志服务 CLS](https://cloud.tencent.com/document/product/614)          | 可以通过配置对接日志服务，将云函数的运行日志写入日志服务中。            |
| [腾讯消息队列 CMQ](https://cloud.tencent.com/document/product/406)          | 可以通过配置消息队列触发器，在对应的队列收到消息时触发云函数。          |
| [腾讯消息队列 Ckafka](https://cloud.tencent.com/document/product/597)       | 可以通过配置 Ckafka 触发器，在对应的 Kafka topic 收到消息时触发云函数。 |
| [腾讯 API 网关 API Gateway](https://cloud.tencent.com/document/product/628) | 可以通过配置 API 网关触发器，在 API URL 上接收 HTTP 请求时触发云函数。  |
| [腾讯访问管理 CAM](https://cloud.tencent.com/document/product/598)          |                                                                         |
