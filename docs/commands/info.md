---
title: "Tencent Serverless - Info 详情"
menuText: "Info 详情"
menuOrder: 3
description: 查看应用信息
layout: Doc
---

# info 查看应用信息

获取应用详情

```sh
# 查看组件应用的信息
$ sls info
```

## 命令选项

```sh
info                      获取应用详情
    --stage / -s             指定环境名称，默认使用配置环境
    --profile                指定身份的全局授权信息
```

以下是一个 express 组件应用的信息示例。

```sh
serverless ⚡ components


最后操作:  deploy (a day ago)
部署次数:  1
应用状态:  active

region: ap-guangzhou
scf:
  functionName: express_component_g6zinoh
  runtime:      Nodejs10.15
  namespace:    default
  lastVersion:  $LATEST
  traffic:      1
apigw:
  serviceId:   service-4mekuq1y
  subDomain:   service-4mekuq1y-1302533238.gz.apigw.tencentcs.com
  environment: release
  url:         https://service-4mekuq1y-1302533238.gz.apigw.tencentcs.com/release/

应用控制台: https://console.cloud.tencent.com/ssr/detail?stageName=dev&appName=express-example-c2482779&instanceName=express-starter&stageList=dev

express-starter › 信息成功加载
```
