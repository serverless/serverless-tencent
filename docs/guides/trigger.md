---
title: "Tencent Serverless - 触发器"
menuText: "触发器"
menuOrder: 7
description: Serverless 触发器
layout: Doc
---

# 触发器

在 SCF 组件中，支持配置不同类型的函数触发器，目前支持的触发器列表如下：

- 定时触发器
- API 网关触发器
- COS 触发器
- CMQ 触发器
- CKAFKA 触发器

其中，如果用户在 `serverless.yml` 文件中没有配置 API 网关的服务 ID 参数，则 SCF 组件会自动创建一个 API 网关的、服务，对于其他触发器，**仅执行配置触发器，不涉及服务资源创建**，请在使用前确保您已完成相关资源创建。

### yml 文件参数配置详情

触发器配置为数组，按照配置的 name 和 param 创建触发器

| 参数名称   | 必选 |  类型  |                默认值                | 描述                                   |
| ---------- | :--: | :----: | :----------------------------------: | :------------------------------------- |
| name       |  是  | string | `触发器类型-${name}-${stage}-${app}` | 触发器名称。                           |
| parameters |  是  | object |                                      | 根据触发器类型，参考以下触发器参数表。 |

parameters 参数的配置信息如下：

#### timer 触发器参数

示例:

```yml
inputs:
  ...
  events:
   - timer: # 定时触发器
        parameters:
           # name: timer # 触发器名称，默认timer-${name}-${stage}
           qualifier: $DEFAULT # 别名配置
           cronExpression: '*/5 * * * * * *' # 每5秒触发一次
           enable: true
           argument: argument # 额外的参数
```

| 参数名称       | 必选 |  类型   |   默认值   | 描述                                             |
| -------------- | :--: | :-----: | :--------: | :----------------------------------------------- |
| qualifier      |  否  | string  | `$DEFAULT` | 触发版本，默认为 `$DEFAULT`，即 `默认流量`       |
| cronExpression |  是  | number  |            | 触发时间，为 [Cron][定时触发器-cron表达式]表达式 |
| enable         |  否  | boolean |   `true`   | 触发器是否启用。默认启用                         |
| argument       |  否  | object  |            | 入参参数。                                       |

#### cos 触发器参数

示例:

```yml
inputs:
  ...
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

| 参数名称  | 必选 |           类型           |   默认值   | 描述                                               |
| --------- | :--: | :----------------------: | :--------: | :------------------------------------------------- |
| qualifier |  否  |          string          | `$DEFAULT` | 触发版本，默认为 `$DEFAULT`，即 `默认流量`         |
| bucket    |  是  |          string          |            | 配置的 COS Bucket，仅支持选择同地域下的 COS 存储桶 |
| enable    |  否  |         boolean          |   `true`   | 触发器是否启用。默认启用                           |
| filter    |  是  | [CosFilter][cos过滤规则] |            | COS 文件名的过滤规则                               |
| events    |  是  |          string          |            | [COS 的事件类型][cos事件类型]                      |

#### cmq 触发器参数

示例:

```yml
inputs:
  ...
  events:
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

| 参数名称   | 必选 | 类型     | 默认值     | 描述                                                                         |
| ---------- | ---- | -------- | ---------- | :--------------------------------------------------------------------------- |
| qualifier  | 否   | string   | `$DEFAULT` | 触发版本，默认为 `$DEFAULT`，即 `默认流量`                                   |
| name       | 是   | string   |            | CMQ Topic 主题队列名称                                                       |
| enable     | 否   | boolean  | `true`     | 触发器是否启用。默认启用                                                     |
| filterType | 否   | number   |            | 消息过滤类型，1 为标签类型，2 为路由匹配类型                                 |
| filterKey  | 否   | string[] |            | 当 filterType 为 1 时表示消息过滤标签，当 filterType 为 2 时表示 Binding Key |

#### ckafka 触发器参数

示例:

```yml
inputs:
  ...
  events:
   - ckafka: # ckafka触发器
        name: #触发器名称，默认ckafka-${name}-${stage}
        parameters:
          qualifier: $DEFAULT # 别名配置
          name: ckafka-2o10hua5
          topic: test
          maxMsgNum: 999
          offset: latest
          enable: true
          retry: 10000
```

| 参数名称  | 必选 | 类型    | 默认值     | 描述                                                       |
| --------- | ---- | ------- | ---------- | :--------------------------------------------------------- |
| qualifier | 否   | string  | `$DEFAULT` | 触发版本，默认为 `$DEFAULT`，即 `默认流量`                 |
| name      | 是   | string  |            | 配置连接的 CKafka 实例，仅支持选择同地域下的实例。         |
| topic     | 是   | string  |            | 支持在 CKafka 实例中已经创建的 Topic。                     |
| maxMsgNum | 是   | number  |            | 5 秒内每汇聚 maxMsgNum 条 Ckafka 消息，则触发一次函数调用  |
| offset    | 是   | string  |            | offset 为开始消费 Ckafka 消息的位置，目前只能填写 `latest` |
| retry     | 是   | number  |            | 重试次数，函数调用失败时的最大重试次数。                   |
| enable    | 否   | boolean | `true`     | 触发器是否启用。默认启用                                   |

#### apigw 触发器参数

示例:

```yml
inputs:
  ...
  events:
   - apigw: # api网关触发器
        parameters:
          serviceId: service-xxxx # 填入该参数，使用已有网关服务完成部署；需要新建网关服务时，删除该配置即可
          protocols:
            - http
          description: the serverless service
          environment: release
          endpoints:
            - path: /users
              method: POST
```

| 参数名称    | 必选 |   类型   | 默认值      | 描述                                                                           |
| ----------- | ---- | :------: | :---------- | :----------------------------------------------------------------------------- |
| environment | 否   |  string  | `release`   | 发布的环境，填写 `release`、`test` 或 `prepub`，不填写默认为`release`          |
| serviceId   | 否   |  string  |             | 网关 Service ID（不传入则新建一个 Service）                                    |
| protocols   | 否   | string[] | `['http']`  | 前端请求的类型，如 http，https，http 与 https                                  |
| netTypes    | 否   | string[] | `['OUTER']` | 网络类型，如 `['OUTER']`, `['INNER']` 与`['OUTER', 'INNER']`                   |
| serviceName | 否   |  string  |             | 网关 API 名称。如果不传递则默认新建一个名称与触发器名称相同的 Apigw API 名称。 |
| description | 否   |  string  |             | 网关 API 描述                                                                  |
| endpoints   | 是   | object[] |             | 参考 [endpoint](#endpoints-参数) 参数。                                        |
