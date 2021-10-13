---
title: "Tencent Serverless - COS 对象存储"
menuText: "COS 对象存储"
menuOrder: 3
description: COS 对象存储
layout: Doc
---

# COS 对象存储
用户可以编写 SCF 函数来处理 COS Bucket 中的对象创建和对象删除事件。COS 可将事件发布给 SCF 函数并将事件数据作为参数来调用该函数。用户可以在 COS Bucket 中添加存储桶通知配置，该配置可标识触发函数的事件类型和希望调用的函数名称等信息。更多细节请看定[腾讯 COS 触发器](https://cloud.tencent.com/document/product/583/9707)文档。

```yml
# scf 单函数触发器
events: 
  - cos: # cos触发器
      parameters:
        qualifier: $DEFAULT # 别名配置
        bucket: cli-appid.cos.ap-beijing.myqcloud.com
        filter:
          prefix: filterdir/
          suffix: .jpg
        events: 'cos:ObjectCreated:*'
        enable: true
```

```yml
# multi-scf 多函数触发器
triggers: 
  - type: cos
    function: index
    parameters:
      name: cos1
      bucket: bucket-name
      filter:
        prefix: filterdir/
        suffix: .jpg
      events: 'cos:ObjectCreated:*'
      enable: true
```

## 配置说明

通常 COS 触发器配置包含以下字段，具体的字段和配置方式请参考[单函数组件(scf)](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#cos-%E8%A7%A6%E5%8F%91%E5%99%A8)和[多函数组件(multi-scf)](https://github.com/serverless-components/tencent-multi-scf/blob/master/docs/configure.md#cos-%E8%A7%A6%E5%8F%91%E5%99%A8)的全量配置说明文档。

| 参数名称  | 必选          | 类型                                                         | 默认值     | 描述                                                         |
| --------- | ------------- | ------------------------------------------------------------ | ---------- | ------------------------------------------------------------ |
| name      |               | string                                                       |            | 触发器名称, 多函数组件(multi-scf)必填                                                   |
| qualifier | 否            | string                                                       | `$DEFAULT` | 触发版本，默认为 `$DEFAULT`，即 `默认流量`                   |
| bucket    | 是            | string                                                       |            | 配置的 COS Bucket，仅支持选择同地域下的 COS 存储桶           |
| filter    | 是            | [CosFilter](https://cloud.tencent.com/document/product/583/39901#CosFilter) |            | COS 文件名的过滤规则                                         |
| events    | 是            | string                                                       |            | [COS 的事件类型](https://cloud.tencent.com/document/product/583/9707#cos-.E8.A7.A6.E5.8F.91.E5.99.A8.E5.B1.9E.E6.80.A7) |
| enable    | 否            | boolean                                                      | `false`    | 触发器是否启用                                               |

## COS 触发器入参

在指定的 COS Bucket 发生对象创建或对象删除事件时，会将类似以下的 JSON 格式事件数据发送给绑定的 SCF 函数。

```json
{
    "Records": [{
        "cos": {
            "cosSchemaVersion": "1.0",
            "cosObject": {
                "url": "http://testpic-1253970026.cos.ap-chengdu.myqcloud.com/testfile",
                "meta": {
                    "x-cos-request-id": "NWMxOWY4MGFfMjViMjU4NjRfMTUyMVxxxxxxxxx=",
                    "Content-Type": "",
                    "x-cos-meta-mykey": "myvalue"
                },
                "vid": "",
                "key": "/1253970026/testpic/testfile",
                "size": 1029
            },
            "cosBucket": {
                "region": "cd",
                "name": "testpic",
                "appid": "1253970026"
            },
            "cosNotificationId": "unkown"
        },
        "event": {
            "eventName": "cos:ObjectCreated:*",
            "eventVersion": "1.0",
            "eventTime": 1545205770,
            "eventSource": "qcs::cos",
            "requestParameters": {
                "requestSourceIP": "192.168.15.101",
                "requestHeaders": {
                    "Authorization": "q-sign-algorithm=sha1&q-ak=xxxxxxxxxxxxxx&q-sign-time=1545205709;1545215769&q-key-time=1545205709;1545215769&q-header-list=host;x-cos-storage-class&q-url-param-list=&q-signature=xxxxxxxxxxxxxxx"
                }
            },
            "eventQueue": "qcs:0:scf:cd:appid/1253970026:default.printevent.$LATEST",
            "reservedInfo": "",
            "reqid": 179398952
        }
    }]
}
```

数据结构内容详细说明如下：

| 结构名    | 内容                                                         |
| :-------- | :----------------------------------------------------------- |
| Records   | 列表结构，可能有多条消息合并在列表中。                       |
| event     | 记录事件信息，包括事件版本、事件源、事件名称、时间、队列信息、请求参数、请求 ID。 |
| cos       | 记录事件对应的 COS 信息。                                    |
| cosBucket | 记录具体事件发生的 Bucket，包含 Bucket 名称、地域、所属用户 APPID。 |
| cosObject | 记录具体事件发生的对象，包含对象文件路径、大小、自定义元数据、访问 URL。 |
