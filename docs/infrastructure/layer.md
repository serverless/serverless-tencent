---
title: "Layer 组件"
menuText: "Layer 组件"
layout: Doc
---

# Layer 组件

如果您的云函数（SCF）拥有较多的依赖库或公共代码文件，您可以使用 SCF 中的层进行管理。使用层管理，您可以将依赖放在层中而不是部署包中，可确保部署包保持较小的体积

Layer 组件是 serverless-tencent 组件库中的基础组件之一。 您可以通过该组件快速且方便地创建、配置和管理腾讯云函数的层资源。

## 前提条件

已安装 [Node.js](https://nodejs.org/en/)

> !2020 年 9 月 1 日起，Serverless 组件不再支持 Node.js10.0 以下版本，请注意升级。

## 操作步骤

### 安装

通过 npm 安装 Serverless：

```console
npm install -g serverless
```

如果之前您已经安装过 Serverless Framework，可以通过下列命令升级到最新版：

```console
npm update -g serverless
```

### 配置

本地创建 `serverless.yml` 文件，在其中进行如下配置：

```console
touch serverless.yml
```

```yml
# serverless.yml

component: layer
name: layerDemo
app: appDemo
stage: dev

inputs:
  region: ap-guangzhou
  name: layerDemo
  src: ./layer-folder
  runtimes:
    - Nodejs10.15
```

[查看详细配置文档 >>](#1)

### 部署

执行以下命令进行扫码授权部署：

```console
sls deploy
```

### 移除

执行以下命令移除部署的服务：

```
sls remove
```

<span id="1"></span>
##  全量配置
- [全量 yml](#1-1)
- [配置描述](#1-2)

<span id="1-1"></span>
```yml
# serverless.yml

component: layer
name: layerDemo
org: orgDemo
app: appDemo
stage: dev

inputs:
  name: test
  region: ap-guangzhou
  src: ./node_modules
  # src:
  #   src: ./node_modules
  #   targetDir: /node_modules
  #   exclude:   # 被排除的文件或目录
  #     - .env
  #     - node_modules
  # src:
  #   bucket: layers
  #   object: sls-layer-test-1584524206.zip
  #   exclude:   # 被排除的文件或目录
  #     - .env
  #     - node_modules
  runtimes:
    - Nodejs10.14
  description: test project layer
```

<span id="1-2"></span>
### 配置描述

| 参数名称    | 是否必填 | 参数类型 | 默认值 | 描述                                                           |
| ----------- | :------: | :------: | :----: | -------------------------------------------------------------- |
| region      |    是    |  String  |        | 地区                                                           |
| name        |    是    |  String  |        | 层名称                                                         |
| src         |    是    |  String  |        | 默认为当前目录, 如果是对象, 配置参数参考 [执行目录](#执行目录) |
| runtimes    |    是    | String[] |        | 层支持的运行环境                                               |
| description |    否    |  String  |        | 描述                                                           |

## 执行目录

| 参数名称 | 是否必填 |    参数类型     | 默认值 | 描述                                                                                                                                                                                 |
| -------- | :------: | :-------------: | :----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| src      |    否    |     String      |        | 代码路径。与 object 不能同时存在。                                                                                                                                                   |
| exclude  |    否    | Array of String |        | 不包含的文件或路径, 遵守 [glob 语法](https://github.com/isaacs/node-glob)                                                                                                            |
| bucket   |    否    |     String      |        | bucket 名称。如果配置了 src，表示部署 src 的代码并压缩成 zip 后上传到 bucket-appid 对应的存储桶中；如果配置了 object，表示获取 bucket-appid 对应存储桶中 object 对应的代码进行部署。 |
| object   |    否    |     String      |        | 部署的代码在存储桶中的路径。                                                                                                                                                         |