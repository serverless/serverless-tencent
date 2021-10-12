---
title: "Tencent Serverless - CKafka 消息队列"
menuText: "CKafka 消息队列"
menuOrder: 5
description: CKafka 消息队列
layout: Doc
---

# CKafka 消息队列
用户可以编写云函数来处理 CKafka 中收取到的消息。云函数后台模块可以作为消费者消费 CKafka 中的消息，并将消息传递给云函数。更多细节请看定[腾讯 CKafka 触发器](https://cloud.tencent.com/document/product/583/17530)文档。

```yml
events: # 触发器
  - ckafka: # ckafka触发器
      parameters:
        qualifier: $DEFAULT # 别名配置
        name: ckafka-xxx
        topic: test
        maxMsgNum: 999
        retry: 10000
        offset: latest
        timeout: 60
        enable: true
```

```yml
triggers:
  - type: ckafka
      function: index
      parameters:
        name: ckafka-xxx
        topic: test
        maxMsgNum: 999
        retry: 10000
        offset: latest
        timeout: 60
        enable: true
```

## 配置说明

通常 CKafka 触发器配置包含以下字段，具体的字段和配置方式请参考[单函数组件(scf)](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#ckafka-%E8%A7%A6%E5%8F%91%E5%99%A8)和[多函数组件(multi-scf)](https://github.com/serverless-components/tencent-multi-scf/blob/master/docs/configure.md#ckafka-%E8%A7%A6%E5%8F%91%E5%99%A8)的全量配置说明文档。

| 参数名称  | 必选 | 类型    | 默认值     | 描述                                                       |
| --------- | ---- | ------- | ---------- | ---------------------------------------------------------- |
| qualifier | 否   | string  | `$DEFAULT` | 触发版本，默认为 `$DEFAULT`，即 `默认流量`                 |
| name      | 是   | string  |            | 配置连接的 CKafka 实例，仅支持选择同地域下的实例。         |
| topic     | 是   | string  |            | 支持在 CKafka 实例中已经创建的 Topic。                     |
| maxMsgNum | 是   | number  | `100`      | 5 秒内每汇聚 maxMsgNum 条 Ckafka 消息，则触发一次函数调用  |
| offset    | 是   | string  | `latest`   | offset 为开始消费 Ckafka 消息的位置，目前只能填写 `latest` |
| retry     | 是   | number  | `10000`    | 重试次数，函数调用失败时的最大重试次数。                   |
| timeout   | 是   | number  | `60`       | 单次触发的最长等待时间，最大 60 秒                         |
| enable    | 否   | boolean | `false`    | 触发器是否启用                                             |

> 注意：添加 CKafka 触发器，需要给 `SLS_QcsRole` 添加 `QcloudCKafkaFullAccess` 策略。

## Ckafka 入参

```json
{
    "Records": [
    {
        "Ckafka": {
        "topic": "test-topic",
        "Partition":1,
        "offset":36,
        "msgKey": "None",
        "msgBody": "Hello from Ckafka!"
        }
    },
    {
        "Ckafka": {
        "topic": "test-topic",
        "Partition":1,
        "offset":37,
        "msgKey": "None",
        "msgBody": "Hello from Ckafka again!"
        }
    }
    ]
}
```

数据结构内容详细说明如下：

| 结构名    | 内容                                 |
| :-------- | :----------------------------------- |
| Records   | 列表结构，可能有多条消息合并在列表中 |
| Ckafka    | 标识事件来源为 CKafka                |
| topic     | 消息来源 Topic                       |
| partition | 消息来源的分区 ID                    |
| offset    | 消费偏移编号                         |
| msgKey    | 消息 key                             |
| msgBody   | 消息内容                             |