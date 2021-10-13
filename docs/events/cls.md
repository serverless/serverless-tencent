---
title: "Tencent Serverless - CLS 日志"
menuText: "CLS 日志"
menuOrder: 6
description: CLS 日志
layout: Doc
---

# CLS 日志
用户可以编写云函数 SCF 来处理 CLS 日志服务中采集到的日志，通过将采集到的日志作为参数传递来调用 SCF 云函数，函数代码可以对其进行数据加工处理、分析或将其转储到其他云产品。更多细节请看定[腾讯 CLS 触发器](https://cloud.tencent.com/document/product/583/49587)文档。


```yml
events: # 触发器
  - cls: # cls 触发器
        parameters:
          qualifier: '$DEFAULT' # 别名配置
          topicId: 'xxx-228b-42f5-aab5-7f740cc2fb11' # 日志主题 ID
          maxWait: 60 # 最长等待时间，单位秒
          enable: true
```

```yml
triggers:
  - type: cls
      function: index
      parameters:
        topicId: 'xxx-228b-42f5-aab5-7f740cc2fb11' # 日志主题 ID
        maxWait: 60 # 最长等待时间，单位秒
        enable: true
```

## 配置说明

通常 CLS 触发器配置包含以下字段，具体的字段和配置方式请参考[单函数组件(scf)](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#cls-%E8%A7%A6%E5%8F%91%E5%99%A8)和[多函数组件(multi-scf)](https://github.com/serverless-components/tencent-multi-scf/blob/master/docs/configure.md#cls-%E8%A7%A6%E5%8F%91%E5%99%A8)的全量配置说明文档。

| 参数名称  | 必选 | 类型    | 默认值     | 描述                                       |
| --------- | ---- | ------- | ---------- | ------------------------------------------ |
| qualifier | 否   | string  | `$DEFAULT` | 触发版本，默认为 `$DEFAULT`，即 `默认流量` |
| topicId   | 是   | string  |            | CLS 日志主题 ID                            |
| maxWait   | 否   | number  | `60`       | 最长等待时间，单位秒                       |
| enable    | 否   | boolean | `false`    | 触发器是否启用                             |

> 注意：添加 CLS 触发器，需要给 `SLS_QcsRole` 添加 `QcloudCLSFullAccess` 策略。

## CLS 事件入参
在指定的 CLS 触发器接收到消息时，CLS 的后台消费者模块会消费消息，并将消息组装异步调用您的函数。为保证单次触发传递数据的效率，数据字段的值是 Base64 编码的 Gzip 文档。

```json
{
    "clslogs": {
        "data": "ewogICAgIm1lc3NhZ2VUeXBlIjogIkRBVEFfTUVTU0FHRSIsCiAgICAib3duZXIiOiAiMTIzNDU2Nzg5MDEyIiwKICAgICJsb2dHcm91cCI6I..."
    }
} 
```
在解码和解压缩后，日志数据类似以下 JSON 体，以 CLS Logs 消息数据（已解码）为例：

```json
{
    "topic_id": "xxxx-xx-xx-xx-yyyyyyyy",
    "topic_name": "testname",
    "records": [{
        "timestamp": "1605578090000000",
        "content": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }, {
        "timestamp": "1605578090000000",
        "content": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }]
}
```

结构内容详细说明如下：

| 结构名     | 内容                       |
| :--------- | :------------------------- |
| topic_id   | 日志主题的 ID              |
| topic_name | 日志主题的名称             |
| timestamp  | 日志生产时间，微秒级时间戳 |
| content    | 日志内容                   |