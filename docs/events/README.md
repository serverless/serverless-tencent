---
title: "Tencent Serverless - Events 事件说明"
menuText: "Events 事件说明"
menuOrder: 6
description: SCF Events 事件说明
layout: Doc
---

# 触发事件

|                          触发器事件                          | 云函数开发（[scf 组件](https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md)） | 多函数开发([multi-scf 组件](https://github.com/serverless-components/tencent-multi-scf/blob/master/docs/configure.md)) |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|                       [Timer 定时触发器](https://cloud.tencent.com/document/product/583/9708)                       |                              ✅                               |                              ✅                               |
|  [API 网关触发器](https://cloud.tencent.com/document/product/583/12513)  |                              ✅                               |                              ✅                               |
| [COS(对象存储) 触发器](https://cloud.tencent.com/document/product/583/9707) |                              ✅                               |                              ✅                               |
| [CMQ(消息队列) 触发器](https://cloud.tencent.com/document/product/583/11517) |                              ✅                               |                              ✅                               |
| [CKafka 触发器](https://cloud.tencent.com/document/product/583/17530) |                              ✅                               |                              ✅                               |
|  [CLS(日志服务) 触发器](https://cloud.tencent.com/document/product/583/49587)  |                              ✅                               |                              ✅                               |
| [MPS(视频处理) 触发器](https://cloud.tencent.com/document/product/583/50833) |                              ✅                               |                              ✅                               |

## 使用方式

### 单函数应用 (scf 组件)

单函数应用(scf 组件)需要在组件的配置文件 `serverless.yml` 中的 **events** 中进行配置:

```yml
# ##Serverless 应用信息##
app: my-scf-node-demo-6d53f98e # app名称(app唯一识别标识)。同账号下需唯一
component: scf # 要使用组件
name: scf-nodejs # 组件实例名称

# ##scf 组件配置##
inputs:
  ...
  events: # 触发器
    - apigw: # api网关触发器
        parameters:
          endpoints:
            - path: /
              method: GET
```

### 多函数应用 (multi-scf 组件)

多函数应用(multi-scf 组件)需要在组件的配置文件 `serverless.yml` 中的 **triggers** 中进行配置:

> 多函数的触发器需要通过函数别名关联到函数。

```yml
app: my-mscf-node-demo-d5c14120 # app名称(app唯一识别标识)。同账号下需唯一
component: multi-scf # 要使用组件
name: event_demo # 组件实例名称

# ##multi-scf 组件配置##
inputs:
  ...
  triggers: # 触发器配置
    - type: timer
      function: index
      parameters:
        name: timer1
        cronExpression: "*/5 * * * * * *" # 每5秒触发一次
        enable: true
        argument: argument # 额外的参数
    - type: apigw
      parameters:
        name: serverless
        protocols:
          - https
          - http
        # id: service-xxx # 如果不配置，会自动创建
        apis: # api网关触发器
          - path: /
            method: GET
            # api 的 function 配置优先级高于外层 function
            function: index
          - path: /hello/{name}
            method: POST
            # api 的 function 配置优先级高于外层 function
            function: hello
            param:
              - name: name
                position: PATH
                required: false
                type: string
                desc: name
```