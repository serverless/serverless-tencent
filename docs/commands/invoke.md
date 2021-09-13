---
title: "Tencent Serverless - Invoke 远程调用"
menuText: "Invoke 远程调用"
menuOrder: 9
description: 远程调用已部署的函数
layout: Doc
---

# invoke 调用函数

通过此命令调用已部署函数，可以发送自定义 event 数据来调用函数，在结果中可以查看日志，以及其他函数调用相关信息。

```sh
# 调用函数应用默认函数
$ serverless invoke

# 调用函数应用默认函数的生产环境版本并使用指定 Event 数据
$ serverless invoke --stage prod --data '{"foo":"bar"}'

```

## 命令选项

```sh
invoke                    调用函数
    --function / -f          调用的多函数组件的函数名称(单函数组件无需指定)
    --target                 指定要调用的组件实例路径
    --stage / -s             指定环境名称，默认使用配置环境
    --region / -r            指定地区名称，默认使用配置地区
    --data / -d              指定传入函数的事件(event)参数数据，需要使用序列化的 JSON 格式
    --path / -p              指定传入还输的事件(event)参数的 JSON 文件路径
    --namespace / -n         指定命名空间，默认使用配置命名空间
    --qualifier / -q         指定函数版本，默认使用配置版本
```

> 使用单函数组件（scf）不需要指定 `function` 参数， 只有多函数组件（multi-scf）需要指定 `funciton` 参数

## 使用说明

- 使用 `sls invoke --data "{\"foo\":\"bar\"}"` 来传入调用默认函数的 Event 参数数据。
- 使用 `sls invoke --path ../test/eventSample.json` 来传入调用默认函数的 Event 参数数据所在的 JSON 文件。
- 使用 `sls invoke --stage prod` 来调用 prod 环境的默认函数。
