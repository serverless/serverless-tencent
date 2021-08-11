---
title: "函数 CLI 命令"
menuText: "函数 CLI 命令"
layout: Doc
---

# 函数 CLI 命令

> 函数组件命令需要在函数组件目录下执行，组件命令同样适用与函数组件，同时函数组件具有以下帮助进行函数开发的命令。

Serverless CLI 支持以下功能命令：

### invoke 调用函数

通过此命令调用已部署函数，同时可以发送 event 数据到函数，查看日志，以及其他函数调用相关信息。

```sh
# 调用函数应用默认函数
$ serverless invoke

# 调用函数应用默认函数的生产环境版本并使用指定 Event 数据
$ serverless invoke --stage prod --data '{"foo":"bar"}'

```

#### 命令选项

[//]: - `--function` 或 `-f` 调用的函数名称，默认使用配置 handler 指定函数

- `--stage` 或 `-s` 指定环境名称，默认使用配置环境
- `--region` 或 `-r` 指定地区名称，默认使用配置地区
- `--data` 或 `-d` 指定传入函数的事件(event)参数数据，需要使用序列化的 JSON 格式
- `--path` 或 `-p` 指定传入还输的事件(event)参数的 JSON 文件路径

[//]: > 使用单函数 SCF Component 不需要指定 `function` 参数， 只有多函数组件需要指定 `funciton` 参数

> 需要升级 Serverless CLI 为 3.10.0 以上版本

### invoke local 本地调用

通过此命令在本地调用函数。 同时可以发送 event 和 context 数据到函数进行本地调用测试。

```sh
# 调用函数应用默认函数
$ serverless invoke local

# 调用单函数应用函数并指定 Event 数据
$ serverless invoke local --data '{"foo":"bar"}'
```

#### 命令选项

[//]: - `--function` 或 `-f` 调用函数名称，默认使用配置 handler 指定函数

- `--data` 或 `-d` 指定传入函数的事件(event)参数数据，需要使用序列化的 JSON 格式

- `--path` 或 `-p` 指定传入还输的事件(event)参数的 JSON 文件路径

- `--context` 指定传入函数的上下文(context)参数数据，需要使用序列化的 JSON 格式

- `--contextPath` 或 `-x` 指定传入函数的上下文(context)参数的 JSON 文件路径

- `--env` 或 `-e` 指定环境变量信息 如: --env VAR=val

- `--config` 或 `-c` 指定使用的配置文件

  > 本地调试函数目前仅支持 Node.js, 其他运行时的支持会在后续陆续推出。
  >
  > 需要升级 Serverless CLI 为 3.10.0 以上版本

### 其他组件命令

同时其他[组件命令](../components/components-commands)也可以在函数组件中使用。
