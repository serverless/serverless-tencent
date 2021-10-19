---
title: Express 全栈应用示例
description: 本示例使用 Serverless Framework 的多个组件开发一个Vue + Express + PostgreSQL 的全栈 Serverless 应用。
date: 2021-07-10
layout: Post
thumbnail: https://sp-assets-1300963013.file.myqcloud.com/blog/thumbnails/2021-07-10-fullstack-demo.png
authors:
  - OliverWang
category:
  - guides-and-tutorials
---

# Express 全栈应用

本示例使用 fullstack 模板来快速配置并部署一个基于 Vue + Express + PostgreSQL 的全栈 Serverless 应用。此模板包含：

- RESTful API：通过**云函数**和 **API 网关**构建一个基于 Express 框架的 RESTful API。
- 静态网站：在**COS 对象存储**的部署的由 Vue.js 构建的静态页面。
- PostgreSQL：基于 **PostgreSQL DB** 创建的应用数据库。
- VPC：通过 **VPC** 服务，将应用后台与数据库连接在一个私有网络中。

## 步骤 1: 安装 Serverless Framework

执行以下命令安装 Serverless Framework

```bash
$ npm install serverless -g
```

如果之前您已经安装过 Serverless Framework，可以通过下列命令升级到最新版：

```bash
$ npm update serverless -g
```

此命令会安装最新的 Serverless Framework 到你的计算机，安装成功后可以通过 `serverless` 或者 `sls` 开始使用 Serverless Framework。

## 步骤 2: 通过模板初始化全站应用

```bash
$ sls init fullstack --name sls-fullstack-demo
```

此命令会使用应用模板 `fullstack` 初始化名为 `sls-fullstack-demo` 的应用目录。初始化成功后该目录结构为

```bash
.
├── README.md
├── README_EN.md
├── api # Express 开发的应用后台 REATful API 服务。
│   ├── controller
│   ├── package-lock.json
│   ├── package.json
│   ├── serverless.yml # 应用后台服务的 serverless 配置文件。
│   └── sls.js
├── db
│   └── serverless.yml # 数据库的 serverless 配置文件。
├── frontend
│   ├── README.md
│   ├── babel.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── serverless.yml # 静态页面的 serverless 配置文件。
│   ├── src
│   └── vue.config.js
├── package-lock.json
├── package.json
├── scripts
│   └── bootstrap.js # 应用依赖安装脚本。
├── serverless.yml # Serverless 配置文件，配置应用名称和stage信息，会覆盖子目录的配置文件中的名称和stage。
├── tests
│   ├── integration.test.js
│   └── utils.js
└── vpc
    └── serverless.yml # 私有网络的 serverless 配置文件。
```

## 步骤 3: 安装并部署

1. 执行自定义命令 bootstrap 命令来安装各个子目录的所有依赖。

```bash
$ npm run bootstrap
```

2. 执行自定义命令 `sls deploy` 部署代码到腾讯云

```bash
$ sls deploy
```

以下是返回结果：

```console
serverless ⚡components

fullstack-vpc 部署成功:
---------------------------------------------
region:     ap-guangzhou
zone:       ap-guangzhou-2
vpcId:      vpc-lzd2bc3n
vpcName:    serverless
subnetId:   subnet-ktdy49n4
subnetName: serverless

fullstack-db 部署成功:
---------------------------------------------
region:         ap-guangzhou
zone:           ap-guangzhou-2
vpcConfig:
  subnetId: subnet-ktdy49n4
  vpcId:    vpc-lzd2bc3n
dBInstanceName: fullstack-db
dBInstanceId:   postgres-xxxxxxxx
private:
  connectionString: postgresql://tencentdb_xxxxxxxx:XeHFS)97UZ%244Q-0@10.0.0.9:5432/tencentdb_xxxxxxxx
  host:             10.0.0.9
  port:             5432
  user:             tencentdb_xxxxxxxx
  password:         XeHFS)97UZ$4Q-0
  dbname:           tencentdb_xxxxxxxx

fullstack-api 部署成功:
---------------------------------------------
region: ap-guangzhou
scf:
  functionName: fullstack-api
  runtime:      Nodejs10.15
  namespace:    default
  lastVersion:  $LATEST
  traffic:      1
apigw:
  serviceId:   service-keltclza
  subDomain:   service-keltclza-xxxxxxxxxx.gz.apigw.tencentcs.com
  environment: release
  url:         https://service-keltclza-xxxxxxxxxx.gz.apigw.tencentcs.com/release/

fullstack-frontend 部署成功:
---------------------------------------------
region:  ap-guangzhou
website: https://fullstack-serverless-frontend-xxxxxxxxxx.cos-website.ap-guangzhou.myqcloud.com

66s › my-fullstack-demo › 已成功部署组件4个
```

部署成功后，通过前端 `fullstack-frontend` 返回的静态页面地址就可以查看您的应用了。

3. 执行 `sls info` 查看部署信息。返回信息如下所示：

```bash
serverless ⚡components
Action: "info" - Stage: "dev" - App: "my-fullstack-demo-8ccd1c4a" - Name: "my-fullstack-demo"

fullstack-api
  最后操作:  deploy (a day ago)
  部署次数:  active
  应用状态:  1
  输出:
    region: ap-guangzhou
    scf:
      functionName: fullstack-api
      runtime:      Nodejs10.15
      namespace:    default
      lastVersion:  $LATEST
      traffic:      1
    apigw:
      serviceId:   service-keltclza
      subDomain:   service-keltclza-xxxxxxxxxx.gz.apigw.tencentcs.com
      environment: release
      url:         https://service-keltclza-xxxxxxxxxx.gz.apigw.tencentcs.com/release/

fullstack-db
  最后操作:  deploy (a day ago)
  部署次数:  active
  应用状态:  1
  输出:
    region:         ap-guangzhou
    zone:           ap-guangzhou-2
    vpcConfig:
      subnetId: subnet-ktdy49n4
      vpcId:    vpc-lzd2bc3n
    dBInstanceName: fullstack-db
    dBInstanceId:   postgres-xxxxxxxx
    private:
      connectionString: postgresql://tencentdb_xxxxxxxx:XeHFS)97UZ%244Q-0@10.0.0.9:5432/tencentdb_xxxxxxxx
      host:             10.0.0.9
      port:             5432
      user:             tencentdb_xxxxxxxx
      password:         XeHFS)97UZ$4Q-0
      dbname:           tencentdb_xxxxxxxx

fullstack-frontend
  最后操作:  deploy (a day ago)
  部署次数:  active
  应用状态:  1
  输出:
    region:  ap-guangzhou
    website: https://fullstack-serverless-frontend-xxxxxxxxxx.cos-website.ap-guangzhou.myqcloud.com

fullstack-vpc
  最后操作:  deploy (a day ago)
  部署次数:  active
  应用状态:  1
  输出:
    region:     ap-guangzhou
    zone:       ap-guangzhou-2
    vpcId:      vpc-lzd2bc3n
    vpcName:    serverless
    subnetId:   subnet-ktdy49n4
    subnetName: serverless

前往控制台查看应用详细信息: https://serverless.cloud.tencent.com/?q=my-fullstack-demo-8ccd1c4a

my-fullstack-demo › 信息成功加载
```

## 总结

开发者可以通过这个 Express 全栈应用了解如何使用 serverless 进行全栈开发，或者也可以进一步改造模板中的内容按照自己的需要进行开发部署。
