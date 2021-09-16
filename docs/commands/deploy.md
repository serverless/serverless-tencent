---
title: "Tencent Serverless - Deploy 部署"
menuText: "Deploy 部署"
menuOrder: 2
description: 部署应用到云端
layout: Doc
---

# deploy 部署组件应用

部署应用到云端

```sh
# 部署组件应用到到云端服务器
$ sls deploy

# 部署指定目录下的组件实例到云端服务器(适用于多组件应用)
$ sls deploy --target ./src
```

## 命令选项

```sh
deploy                    部署应用到云端
    --stage / -s             指定环境名称，默认使用配置环境
    --target                 指定要部署的组件实例路径
    --inputs                 覆写 inputs 配置
    --profile                使用指定身份的全局授权信息
    --login                  使用临时授权
    --force                  强制部署，跳过缓存和 serverless 应用校验
    --noCache                跳过缓存
    --noValidation           跳过 serverless 应用校验
    --debug                  显示 debug 信息
```
