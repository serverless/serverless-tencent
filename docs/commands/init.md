---
title: "Tencent Serverless - Init 创建"
menuText: "Init 创建"
menuOrder: 1
description: 通过模板初始化新应用
layout: Doc
---

# init 创建组件应用

通过模板初始化新应用

```sh
# 通过express-starter模版初始 Express 组件应用
$ sls init express-starter

# 通过express-starter模版初始 Express 组件应用并指定目录名称
$ sls init express-starter --name my-express-app
```

## 命令选项

```sh
init                       通过模板初始化新应用
    {template}               [必填] 模板名称
    --name                   指定应用目录名称
```

> 更多可用的组件模板请通过命令 `serverless registry` 进行查看。
>
> 组件应用名称会在由目录名称与随机字符串拼接构成，详情查看 `serverless.yml` 中 `app` 字段。
