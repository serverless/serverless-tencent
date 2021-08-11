---
title: "后端组件应用开发"
menuText: "后端组件应用开发"
layout: Doc
---

# 后端组件应用开发

Serverless Framework 提供了许多流行前端组件来帮助前端使用 serverless 进行前端开发。目前提供的官方组件有

- Express 应用([express-starter](https://github.com/serverless-components/tencent-examples/tree/master/express-starter)): Express 框架模板(Node.js)
- Koa 应用([koa-starter](https://github.com/serverless-components/tencent-examples/tree/master/koa-starter)): Koa 框架模板(Node.js)
- Egg.js 应用([eggjs-starter](https://github.com/serverless-components/tencent-examples/tree/master/eggjs-starter)): Eggjs 框架模板(Node.js)
- Restful API 应用([restful-api](https://github.com/serverless-components/tencent-examples/tree/master/restful-api)): Python + API gateway 模板。
- Flask 应用([flask-starter](https://github.com/serverless-components/tencent-examples/tree/master/flask-starter)): Flask 框架模板(Python)
- Laravel 应用([laravel-starter](https://github.com/serverless-components/tencent-examples/tree/master/laravel-starter)): Laravle 框架模板(PHP)

## 后端应用

在创建后端框架模板之后，用户可以按照框架的开发方式进行后端应用开发。Serverless Framework 组件应用对后端并没有任何特殊限制。

## 调试模式

在项目部署之后，可以通过`sls dev`开启调试模式， 调试会链接到云端的函数，进行在线调试开发。

在本地代码变动保存之后，会自动部署并继续监听远程日志，所有通过日志输出的内容都会同步到本地。

关于调试的更多内容和使用方法请查看[调试模式](../basic/dev-mode)中的说明。

## 内部私有网络

再后端项目开发中，需要通过使用 VPC 来确保后端服务间通讯使用内部网络，而减少系统安全风险。这里需要使用 VPC 来创建私有网络。要使用 VPC 组件，项目目录新建目录，并创建 `serverless.yml` 声明如下:

```yml
app: sls-my-backend # 这里需要保证app名称一致。
component: vpc # 声明这里使用 vpc 组件
name: vpc-net # vpc 组件实例名称

inputs:
  region: ap-beijing # VPC 所在地区
  zone: ap-beijing-1 # VPC 所在地区的区域
  vpcName: my-vpc # 实例名称
  subnetName: my-subnet # 子网的名称
```

## 数据库

在后端项目中经常需要使用各种数据库来进行永久化存储，这里可以使用腾讯云提供的 PostgreSQL 组件来初始化数据库使用。要使用 PostgreSQL 在项目目录新建目录，并创建 `serverless.yml` 声明如下:

```yml
app: sls-my-backend # 这里需要保证app名称一致。
component: postgresql # 声明这里使用 postgresql 组件
name: posgres-db # postgresql 组件实例名称

inputs:
  region: ap-beijing # 数据库所在地区
  zone: ap-beijing-1 # 数据库所在地区的区域
  dBInstanceName: my-postgresql # 数据库实例名称。
  vpcConfig: # 私有网络配置
    vpcId: ${output:${stage}:${app}:vpc-net.vpcId} # 私有网络Id
    subnetId: ${output:${stage}:${app}:vpc-net.subnetId} # 子网Id
  extranetAccess: false # 是否开启外网访问
```

> 这里的`vpcConfig`是使用私有网络与后端服务链接。  
> `output` 用来引用其他服务资源的变量信息，通过此变量可以将配置分散到不同的 `serverless.yml` 中来消除耦合。

更多关于变量的内容请查看[Serverless 变量](../basic/variables)
