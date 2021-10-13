---
title: "Tencent Serverless - CMQ 消息队列"
menuText: "CMQ 消息队列"
menuOrder: 4
description: CMQ 消息队列
layout: Doc
---

# CMQ 消息队列

用户可以编写云函数来处理 CMQ Topic 主题队列中收到的消息。CMQ Topic 可将消息传递给云函数并将消息内容和相关信息作为参数来调用该函数。更多细节请看定[腾讯 CMQ 触发器](https://cloud.tencent.com/document/product/583/11517)文档。


```yml
events: # 触发器
  - cmq: # CMQ Topic 触发器
      parameters:
        qualifier: $DEFAULT # 别名配置
        name: test-topic-queue
        enable: true
        filterType: 1 # 消息过滤类型，1为标签类型，2为路由匹配类型
        filterKey: # 当 filterType 为1时表示消息过滤标签，当 filterType 为2时表示 Binding Key
          - key1
          - key2
```

```yml
triggers:
  - type: cmq
      function: index
      parameters:
        name: test-topic-queue
        enable: true
        filterType: 1
        filterKey:
          - key1
          - key2
```

## 配置说明

通常 CMQ 触发器配置包含以下字段，具体的字段和配置方式请参考[单函数组件(scf)](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#cmq-%E8%A7%A6%E5%8F%91%E5%99%A8)和[多函数组件(multi-scf)](https://github.com/serverless-components/tencent-multi-scf/blob/master/docs/configure.md#cmq-%E8%A7%A6%E5%8F%91%E5%99%A8)的全量配置说明文档。

| 参数名称   | 必选 | 类型     | 默认值     | 描述                                                         |
| ---------- | ---- | -------- | ---------- | ------------------------------------------------------------ |
| qualifier  | 否   | string   | `$DEFAULT` | 触发版本，默认为 `$DEFAULT`，即 `默认流量`                   |
| name       | 是   | string   |            | CMQ Topic 主题队列名称                                       |
| filterType | 否   | number   |            | 消息过滤类型，1 为标签类型，2 为路由匹配类型                 |
| filterKey  | 否   | string[] |            | 当 filterType 为 1 时表示消息过滤标签，当 filterType 为 2 时表示 Binding Key |
| enable     | 否   | boolean  | `false`    | 触发器是否启用                                               |

> 注意：添加 CMQ 触发器，需要给 `SLS_QcsRole` 添加 `QcloudCMQFullAccess` 策略。

## CMQ 消息入参

在指定的 CMQ Topic 主题队列接受到消息时，会将类似以下的 JSON 格式事件数据发送给绑定的云函数。

```json
{
    "Records": [
    {
        "CMQ": {
        "type": "topic",
        "topicOwner":120xxxxx,
        "topicName": "testtopic",
        "subscriptionName":"xxxxxx",
        "publishTime": "1970-01-01T00:00:00.000Z",
        "msgId": "123345346",
        "requestId":"123345346",
        "msgBody": "Hello from CMQ!",
        "msgTag": "tag1,tag2"
        }
    }
    ]
}
```

数据结构内容详细说明如下：

| 结构名           | 内容                                    |
| :--------------- | :-------------------------------------- |
| Records          | 列表结构，可能有多条消息合并在列表中    |
| CMQ              | 标识数据结构来源为 CMQ 消息队列         |
| type             | 使用 type 区分消息来源为 topic 或 queue |
| topicOwner       | 记录 topic 所有者账号 ID                |
| topicName        | 记录 topic 名称                         |
| subscriptionName | 记录云函数在 topic 处的订阅名称         |
| publishTime      | 记录消息的发布时间                      |
| msgId            | 记录消息的唯一 ID                       |
| requestId        | 记录消息推送的请求 ID                   |
| msgBody          | 记录消息内容                            |
| msgTag           | 通过字符串记录消息标签                  |