---
title: "Tencent Serverless - Timer 定时触发器"
menuText: "Timer 定时触发器"
menuOrder: 1
description: Timer 定时触发器
layout: Doc
---

# Timer 定时触发器

下面的配置将附加一个定时器触发器，使相关函数每5秒被调用一次。该配置允许你在同一个函数上附加多个定时器触发器。您可以使用[Cron](https://cloud.tencent.com/document/product/583/9708#cron-.E8.A1.A8.E8.BE.BE.E5.BC.8F)语法。更多细节请看[腾讯定时触发器](https://cloud.tencent.com/document/product/583/9708)文档。

```yml
# scf 单函数触发器
events: 
    - timer: # 定时触发器
        parameters:
            name: timer # 触发器名称，默认timer-${name}-${stage}
            cronExpression: '*/5 * * * * * *' # 每5秒触发一次
            qualifier: $DEFAULT # 别名配置
            enable: true # 是否启动定时器，默认为启动
            argument: argument # 额外的参数
```
```yml
# multi-scf 多函数触发器
triggers: 
    - type: timer # 定时触发器
        function: index # 关联的函数别名
        parameters:
            name: timer1 # 触发器名称
            cronExpression: '*/5 * * * * * *' # 每5秒触发一次
            qualifier: $DEFAULT # 别名配置
            enable: true
            argument: argument # 额外的参数
```

## 配置说明

通常定时触发器配置包含以下字段，具体的字段和配置方式请参考[单函数组件(scf)](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md#%E5%AE%9A%E6%97%B6%E8%A7%A6%E5%8F%91%E5%99%A8)和[多函数组件(multi-scf)](https://github.com/serverless-components/tencent-multi-scf/blob/master/docs/configure.md#%E5%AE%9A%E6%97%B6%E8%A7%A6%E5%8F%91%E5%99%A8)的全量配置说明文档。

|    参数名称    |       必选        | 类型    | 默认值     | 描述                                                         |
| :------------: | :---------------: | ------- | ---------- | ------------------------------------------------------------ |
|      name      |                    | string  |            | 触发器名称，多函数组件(multi-scf)必填                                                   |
| cronExpression |         是         | string  |            | 触发时间，为 [Cron](https://cloud.tencent.com/document/product/583/9708#cron-.E8.A1.A8.E8.BE.BE.E5.BC.8F)表达式 |
|   qualifier    |         否         | string  | `$DEFAULT` | 触发版本，默认为 `$DEFAULT`，即 `默认流量`                   |
|     enable     |         否         | boolean | `false`    | 触发器是否启用                                               |
|    argument    |         否         | object  |            | 入参参数                                                     |

### 定时器配置

定时器配置使用[Cron](https://cloud.tencent.com/document/product/583/9708#cron-.E8.A1.A8.E8.BE.BE.E5.BC.8F)表达式进行配置，一下为定时器的配置示例:

| 表达式                | 相关含义                               |
| :-------------------- | :------------------------------------- |
| */5 * * * * * *       | 表示每5秒触发一次                      |
| 0 15 10 1 * * *       | 表示在每月的1日的上午10:15触发         |
| 0 15 10 * * MON-FRI * | 表示在周一到周五每天上午10:15触发      |
| 0 0 10,14,16 * * * *  | 表示在每天上午10点，下午2点，4点触发   |
| 0 */30 9-17 * * * *   | 表示在每天上午9点到下午5点每半小时触发 |
| 0 0 12 * * WED *      | 表示在每个星期三中午12点触发           |


## 定时器入参

定时触发器在触发函数时，会把如下的数据结构封装在 event 里传给云函数。同时，定时触发器支持自定义传入 Message，缺省为空。

```json
{
   "Type":"Timer",
   "TriggerName":"EveryDay",
   "Time":"2019-02-21T11:49:00Z",
   "Message":"user define msg body"
}
```

| 字段        | 含义                                                         |
| :---------- | :----------------------------------------------------------- |
| Type        | 触发器的类型，值为 Timer                                     |
| TriggerName | 定时触发器的名称。最大支持60个字符，支持 `a-z`，`A-Z`，`0-9`，`-`和`_`。必须以字母开头，且一个函数下不支持同名的多个定时触发器 |
| Time        | 触发器创建时间，0时区                                        |
| Message     | 字符串类型                                                   |
