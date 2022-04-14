---
title: 'Tencent Serverless - Parameters 参数配置'
menuText: 'Parameters 参数配置'
menuOrder: 11
description: 使用 `parameters` 功能进行动态参数配置
layout: Doc
---

# parameters 命令

通过 `parameters` 功能，用户可以**以项目为范围**进行参数功能的设定和配置. 以下命令必须要在*serverless*项目中执行

## 指定参数

`sls param set key1=value1 key2=value2`

## 列举参数

`sls param list`

## 在配置文件(`serverless.yml`) 从使用参数, 服务端会自动将`key1` 替换为 `sls param set` 中配置的值

```yaml
inputs:
  name: ${param:key1}
```

## 注意事项

`parameters` 功能的作用范围是以 `app` 和 `stage` 两个字段共确定的，也就是说如果*同一个账号*下的两个项目的 `app, stage` 两个字段相同，那么他们的 `parameters` 数据可以通用。例如:

项目 A:

```yaml
app: test
stage: dev
name: testA
```

从执行 `sls param set name=test`

---

项目 B:

```yaml
app: test
stage: dev
name: testB

inputs:
  name: ${param:name}
```

项目 B 执行 `sls deploy` 之后，`name` 字段会自动替换为项目 A 中配置的`test`值
