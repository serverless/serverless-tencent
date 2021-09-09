---
title: "Tencent Serverless - Layer 组件"
menuText: "Layer 组件"
menuOrder: 6
description: Layer 组件
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

## 全量配置

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

# 层部署

由于云函数限制，目前只支持上传小于 50MB 的代码包，当您的项目过大时，您可以将依赖放在层中而不是部署包中，可确保部署包保持较小的体积。层的具体使用请参考 [层管理相关操作](https://cloud.tencent.com/document/product/583/45760)。

## 操作步骤

### 创建层

新建层并上传依赖，您可以通过以下两种方式操作：

- 通过 [Serverless 应用控制台](https://console.cloud.tencent.com/ssr) 直接创建
- 使用 Serverless Framework 的 Layer 组件（参考 [Layer 组件](https://cloud.tencent.com/document/product/1154/45874)）

### 使用层

您可以通过控制台配置和本地配置两种方法，在项目配置中使用层部署，具体如下：

#### 控制台配置

- 对于 Node.js 框架应用，Serverless Framework 会自动为您创建名为 `${appName}-layer` 的层，并自动帮您把应用的依赖项 node_modules 上传到该层中。
- 导入已有项目时，您也可以选择使用新建层或已有层完成部署，选择新建层时，Serverless Framework 会自动帮您把应用的依赖项 node_modules 上传到该层中。
  ![](https://main.qcloudimg.com/raw/faa03a285b9d5ee56541bd8f4d71be79.png)

  > 新建层操作仅支持 Node.js 框架，其它框架使用层时，请确保已经完成层的创建并已经把相关依赖想上传到层中。

#### 通过 Layer 组件配置

1. 此处以 Next.js 组件为例，调整本地项目目录，新增 layer 文件夹，并创建 **serverless.yml** 文件，完成层的名称与版本配置，yml 模版如下：

   ```yml
   app: appDemo
   stage: dev

   component: layer
   name: layerDemo

   inputs:
     name: test
     region: ap-guangzhou
     src: ../node_modules #需要上传的目标文件路径
     runtimes:
       - Nodejs10.14
   ```

   查看详细配置，请参考 [layer 组件全量配置文档](https://github.com/serverless-components/tencent-layer/blob/master/docs/configure.md)。

   更新后的项目目录结构如下：

   ```
   .
   ├── node_modules
   ├── src
   │   ├── serverless.yml # 函数配置文件
   │   └── index.js # 入口函数
   ├── layer
   │   └── serverless.yml # layer 配置文件
   └── .env # 环境变量文件
   ```

2. 打开项目配置文件，增加 layer 配置项，并引用 layer 组件的输出作为项目配置文件的输入，模版如下：

   ```yml
   app: appDemo
   stage: dev

   component: nextjs
   name: nextjsDemo

   inputs:
     src:
       src: ./
       exclude:
         - .env

     region: ap-guangzhou
     runtime: Nodejs10.15
     apigatewayConf:
        protocols:
          - http
          - https
        environment: release
     layers:
        - name: ${output:${stage}:${app}:layerDemo.name} #  layer名称
        version: ${output:${stage}:${app}:layerDemo.version} #  版本
   ```

   引用格式请参考[变量引用说明](https://github.com/AprilJC/Serverless-Framework-Docs/blob/main/docs/%E5%87%BD%E6%95%B0%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91/%E6%9E%84%E5%BB%BA%E5%BA%94%E7%94%A8.md#%E5%8F%98%E9%87%8F%E5%BC%95%E7%94%A8%E8%AF%B4%E6%98%8E)。

3. 在项目根目录下，执行 `sls deploy`，即可完成 Layer 的创建，并将 Layer 组件的输出作为 Next.js 组件的输入完成层的配置。
