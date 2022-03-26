---
title: "Tencent Serverless - Invoke Local 本地调用"
menuText: "Invoke Local 本地调用"
menuOrder: 10
description: 本地调用函数
layout: Doc
---

# invoke local 本地调用

通过此命令在本地调用函数。 同时可以发送 event 和 context 数据到函数进行本地调用测试。

```sh
# 调用函数应用默认函数
$ serverless invoke local

# 调用单函数应用函数并指定 Event 数据
$ serverless invoke local --data '{"foo":"bar"}'
```

## 命令选项

```sh
invoke local              本地调用函数
    --function / -f          调用的多函数组件的函数名称(单函数组件无需指定)
    --target                 指定要调用的组件实例路径
    --data / -d              指定传入函数的事件(event)参数数据，需要使用序列化的 JSON 格式
    --path / -p              指定传入函数的事件(event)参数的 JSON 文件路径
    --context                指定传入函数的上下文(context)参数数据，需要使用序列化的 JSON 格式
    --contextPath / -x       指定传入函数的上下文(context)参数的 JSON 文件路径
    --env / -e               指定环境变量信息 如: --env VAR=val
    --config / -c            指定使用的配置文件
    --py                     指定要使用的本机中的Python版本，默认使用python. 如: --py python3 (此配置只对runtime是Python的配置有效)
    --php                    指定要使用的本机中的Php版本，默认使用php. 如: --php php7.2 (此配置只对runtime是Php的配置有效)
```

> 本地调试函数目前支持单函数与多函数的 Node.js, Python, PHP 运行时，其他运行时的支持会在后续陆续推出。

## 使用说明

- 使用 `sls invoke local --data "{\"foo\":\"bar\"}" --context "{\"baz\":\"qux\"}"` 来传入调用默认函数的 Event 和 Context 参数数据。
- 使用 `sls invoke local --path ../test/eventSample.json -- contextPath ../test/contextSample.json` 来传入调用默认函数的 Event 和 Context 参数数据所在的 JSON 文件。
