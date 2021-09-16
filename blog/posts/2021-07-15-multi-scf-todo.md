---
title: 多函数TODO应用示例
description: "本示例使用 Serverless Framework 的多函数组件（multi-scf）和 PostgreSQL组件（postgresql），实现一个基本的TODO应用。"
date: 2021-07-15
layout: Post
thumbnail: https://sp-assets-1300963013.file.myqcloud.com/blog/thumbnails/logo-sf-side-dark.png
authors:
  - OliverWang
category:
  - guides-and-tutorials
---

# 什么是 Serverless

Serverless 的定义和理解在不同的角度和场景会有不同的解读，AWS 将 Serverless(在 AWS 云上) 定义为 “是一种用于描述服务、实践和策略的方式，使您能够构建更敏捷的应用程序，从而能够更快地创新和响应变化”的一种服务。 而红帽认为 Serverless 是 “可使开发人员专注构建和运行应用，而无需管理服务器” 的一种开发模型，并进一步将 Serverless 的产品分为两类：BaaS(后端即服务，让开发人员访问各种各样的第三方服务和应用) 与 FaaS(功能即服务，开发人员编写逻辑，部署到完全由平台管理的容器中，然后按需执行) 两种形态。 而 Serverless Framework 则认为 Serverless 是“一场由开发人员和企业推动,让单个开发人员可以完成高流量的应用开发，同时只将精力集中在产生价值的方面”的运动，

不管哪个方面，哪种角度，Serverless 都具有以下共同特点：

1. 快速开发，快速部署
2. 按量付费，降低成本
3. 自动扩容，无需维护

而目前都是基于各个云厂商的 FaaS 服务来实现，如： 腾讯云的 SCF， AWS 的 Lambda， Azure 云的 Azure Funcitons 等。

## Serverless 解决什么问题

随着计算能力的加强，系统复杂度的增加，用户规模的增长，软件问题（如下， 也称为软件危机）也会发生指数型的增长。

- 软件开发进度难以预测
- 软件开发成本难以控制
- 软件产品质量无法保证
- 软件产品难以维护

而 Serverless 则可以通过以下方式提出了对于软件危机问题的解决方案：

- 通过函数方式将系统功能拆分为更小的颗粒度，更便于设计，开发，测试和维护。
- 通过按量计费大幅度减少资源闲置时的开销费用，降低服务器成本。
- 通过自动扩容以及云平台的支持，大幅减少运维工作量以及软件维护成本。

同时在现在普遍倡导敏捷工作方式的现代工作环境中，Serverless 也为快速验证想法、迭代功能提供了开发方式的最佳实践，同时而不需要担心代码改动会影响系统的其他功能，也无需考虑部署前的服务器配置以及部署后的维护工作。

# Serverless Framework

Serverless Framework 是业界非常受欢迎的无服务器应用框架，通过与众多一流云供应商如腾讯云，AWS 等的紧密合作，为广大开发者提供无需关心底层基础设施，即可编写和部署代码的无服务开发体验。

Serverless Framework 同时提供资源管理、自动伸缩、统计分析等能力，让广大开发者可以节省运维成本，真正做到“按量付费”的同时，也无需花费精力处理日志收集、异常统计等任务。

Serverless Framework 通过 CLI 工具与腾讯云紧密合作，为中国用户提供了基于组件(serverless components)的完整解决方案。覆盖了无服务应用编码、测试、部署等全生命周期，同时切合中国用户的使用场景和习惯。

## 为什么选用 Serverless Framework

通过 Serverless Framework 的短短几行配置文件和 CLI 工具，开发者就可以额外获得：

- 在本地进行函数开发，并一键部署到云端，无需额外适配云函数，也无需登录控制台。
- 支持将传统开发框架的应用 （如：Express, next.js, Flask, Laravel 等）部署为 Serverless 应用。
- 在本地对函数代码进行调试，或使用远程开发模式在本地实时查看部署服务的日志输出，并进行调试。
- 通过简单配置即可完成所有基础设施配置（如：API 网关、COS 存储、DB 链接等）
- 快速切换应用的部署环境（开发，演示，生产），地区。
- 更详细轻松的了解应用状态，查看日志、报错统计等信息。

# 多函数开发示例

本示例使用 Serverless Framework 的多函数组件（multi-scf）和 PostgreSQL 组件（postgresql），实现以下 3 个 API 接口。

- `GET /todos/` 获取所有的 todo 事项
- `POST /todos/` 创建新的 todo 事项
- `POST /todos/{id}/actions/complete` 完成 todo 事项

并使用 Serverless Framework 提供的 invoke 和 logs 功能进行调试以及查看生产环境实时日志。

本示例相关代码可以在[Git 仓库](https://github.com/ole3021/sls-demo-msn-todo)中获取。

## 步骤 1: 安装 Serverless Framework

执行以下命令安装 Serverless Framework

```bash
$ npm install serverless -g
```

如果之前您已经安装过 Serverless Framework，可以通过下列命令升级到最新版：

```bash
$ npm update serverless -g
```

此命令会安装最新的 Serverless Framework 到你的计算机，安装成功后可以通过 `serverless` 或者 `sls` 开始使用 Serverless Framework

## 步骤 2: 初始化多函数项目

```sh
$ sls init multi-scf-nodejs --name sls-demo-msn-todo
```

此命令会使用应用模板 `multi-scf-nodejs` 初始化名为 `my-multi-scf-demo` 的应用目录。初始化成功后该目录结构为

```
.
├── README.md
├── index.js
└── serverless.yml
```

这里的文件用途如下：

- index.js：函数文件。
- serverless.yml：Serverless Framework 配置文件。
  - app：应用名称，会作为应用识别的唯一标识。
  - stage：应用环境，通过不同环境，部署不同的应用实例。
  - component：组件名称
  - name：组件实例名称
  - inputs：组件部署的输入参数

## 步骤 3: 链接数据库

因为 Serverless 是无状态的（运行后就会销毁）， 所以这里需要链接数据库用来持久化 todo 信息。添加数据库需要先借助 VPC 网络连接。

### 添加 VPC

创建子目录 `vpc` 并在子目录中添加新的 `serverless.yml` 文件如下：

```yml
component: vpc # [必选]要使用组件，更多组件请查看 https://github.com/serverless-components
name: sls-demo-msn-vpc # [必选]组件实例名称

inputs:
  region: ap-guangzhou # 实例所属地区
  zone: ap-guangzhou-2 # 实例所属地区区域
  vpcName: ${name} # 实例名称，这里复用字段 name 作为名称。
  subnetName: sls-demo-msn-subnet # 子网的名称
```

更多 VPC 的配置内容，查看 [VPC 私有网络
](https://www.serverless.com/cn/framework/docs/infrastructure/vpc/) 获取更多详情信息。

> 在子组件的配置文件中，app 名称会自动继承父目录的 serverless.yml 中的配置。 同时同一个应用的 app 名称需要保持一致。

### 添加数据库

创建子目录 `db` 并在子目录中添加新的 `serverless.yml` 文件如下：

```yml
component: postgresql #(必填) 引用 component 的名称，当前用到的是 postgresql 组件
name: sls-demo-msn-DB # (必填) 该 postgresql 组件创建的实例名称

inputs:
  region: ap-guangzhou # 实例所属地区
  zone: ap-guangzhou-2 # 实例所属地区区域
  dBInstanceName: ${name}-${stage} # 数据库实例名称唯一，且同一个数据库只能存在同一个vpc内。
  extranetAccess: true # 是否开启实例外网访问
  vpcConfig: # vpc网络配置
    vpcId: ${output:${stage}:${app}:sls-demo-msn-vpc.vpcId} # 私有网络Id
    subnetId: ${output:${stage}:${app}:sls-demo-msn-vpc.subnetId} # 子网Id
```

在数据库配置中添加数据库到 vpc 网络，这里使用输出变量(output)来动态获取 vpc 的 id 信息。

更多变量的配置内容，查看 [Serverless 变量
](https://www.serverless.com/cn/framework/docs/basic/variables/) 获取更多详情信息。

更多 PostgreSQL 的配置内容，查看 [PostgreSQL 数据库
](https://www.serverless.com/cn/framework/docs/infrastructure/postgresql/) 获取更多详情信息。

> 在组件部署完成后，可以在组件目录内，使用 `sls info` 查看组件的输出变量，或者可以到腾讯云的应用控制台查看相关信息。

### 初始化应用目录

1. 创建子目录 `src` 并将创建生成的 `index.js` （重命名为`todos.js`） 和 `serverless.yml` 移动到目录中。
2. 在`src`目录中执行`npm init`初始化 Node.js 项目。
3. 在`src`目录中执行`npm i pg --save`安装数据库链接依赖包`pg`。
4. 在项目根目录添加根配置文件`serverless.yml`，文件如下：

```yml
app: sls-demo-msn-todo-3e5a2134 # 应用唯一识别标识，同账号下需要保持唯一。
stage: dev # 应用部署环境名称，这里使用环境变量 STAGE 的值。
```

> 根目录的配置文件信息会被子组件继承，不需要在子组件中重复定义。（仅限于，app 与 stage）。

最终完成的项目目录结构如下：

```
.
├── README.md
├── db # 数据库
│   └── serverless.yml # 数据库配置文件
├── serverless.yml
├── src # 多函数应用
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json # Node.js依赖文件
│   ├── serverless.yml # 多函数应用配置文件
│   └── todos.js # todo 应用主文件
└── vpc # vpc
    └── serverless.yml # vpc配置文件
```

### 修改多函数应用配置

在多函数目录`src`内修改配置文件如下：

```yml
component: multi-scf
name: sls-demo-msn

inputs:
  src:
    src: ./
    exclude:
      - .env
      - "node_modules/**" # 部署时忽略node_modules目录中所有文件，以加快部署速度
  environments: # 应用环境变量信息
    - key: PG_CONNECT_STRING
      value: ${output:${stage}:${app}:sls-demo-msn-DB.private.connectionString}
  region: ap-guangzhou
  runtime: Nodejs12.16
  memorySize: 128
  vpc: # vpc网络配置
    vpcId: ${output:${stage}:${app}:sls-demo-msn-vpc.vpcId} # 私有网络Id
    subnetId: ${output:${stage}:${app}:sls-demo-msn-vpc.subnetId} # 子网Id
  installDependency: true # 是否在线安装依赖
  timeout: 6 # 默认超时时间（秒）
  functions: # 多函数定义
    allTodo: # 函数别名
      handler: todos.all # 处理函数
      memorySize: 256 # 自定义次函数的内存空间
    addTodo:
      handler: todos.add
      timeout: 9 # 自定义此函数的超时时间（秒）
    completeTodo:
      handler: todos.comp
      timeout: 9
  triggers: # 触发器配置
    - type: apigw
      parameters:
        name: todosAPIGW
        protocols:
          - https
          - http
        apis: # API配置
          - path: /todos/ # 路由路径
            method: GET # 路由方法
            function: allTodo # 路由处理函数别名
          - path: /todos/
            method: POST
            function: addTodo
          - path: /todos/{id}/actions/complete
            method: POST
            function: completeTodo
            param: # 动态路由参数配置
              - name: id
                position: PATH
                required: true
                type: number
                desc: Todo ID
```

这里修改主要内容有：

- 使用`installDependency`开启部署后依赖自动安装并忽略`node_module`目录下的全部文件(无需上传 node_modules，加快部署)
- 使用`vpc`添加 vpc 网络并链接到项目同一个 vpc 网络中。
- 使用`environments`添加项目环境变量，并使用输出变量（output）来动态生成数据库连接字符串。
- 使用`functions`来声明项目中的函数及其别名。
- 使用`triggers`声明函数的触发器，并在触发器的`apis`中配置各个函数对应的路径，以及参数信息。

<!-- 更多函数开发的配置内容和详情，查看 [PostgreSQL 数据库
](https://www.serverless.com/cn/framework/docs/infrastructure/postgresql/) 获取更多详情信息。 -->

更多 函数开发 的说明内容，查看 [函数开发](https://www.serverless.com/cn/framework/docs/function/) 获取更多详情信息。

## 步骤 4: 开发功能

修改`todos.js`并完成相关功能的开发，最终该文件代码如下：

```js
"use strict";
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.PG_CONNECT_STRING,
});

/**
 * 初始化数据库和表结构
 */
const initDB = async () => {
  const isConnected = client && client._connected;

  if (!isConnected) {
    await client.connect();

    await client.query(`
    CREATE TABLE IF NOT EXISTS todo (
      ID              SERIAL          NOT NULL,
      TITLE           VARCHAR         NOT NULL,
      NOTE            TEXT,
      IS_COMPLETE     BOOLEAN         DEFAULT FALSE
    );`);
  }
};

/**
 * 获取所有Todo事项
 */
exports.all = async (event, context) => {
  // async 需要关闭事件循环等待，以避免日志记录超时或函数无返回的问题。
  context.callbackWaitsForEmptyEventLoop = false;
  await initDB();

  const { rows } = await client.query({ text: "SELECT * FROM todo" });

  return {
    message: "Tencent SCF execute successful!",
    data: rows,
  };
};

/**
 * 添加新的Todo事项
 */
exports.add = async (event, context) => {
  // async 需要关闭事件循环等待，以避免日志记录超时或函数无返回的问题。
  context.callbackWaitsForEmptyEventLoop = false;
  const { title, note } = JSON.parse(event.body);
  if (!title) {
    return {
      statusCode: 400,
      message: "Missing Todo Title",
    };
  }

  await initDB();
  const { rowCount } = await client.query({
    text: "INSERT INTO todo (title, note) VALUES($1, $2)",
    values: [title, note],
  });

  return rowCount === 1
    ? {
        statusCode: 201,
        message: "Todo added success.",
      }
    : {
        statusCode: 400,
        message: "Todo added failed.",
      };
};

/**
 * 完成指定Todo事项
 */
exports.comp = async (event, context) => {
  // async 需要关闭事件循环等待，以避免日志记录超时或函数无返回的问题。
  context.callbackWaitsForEmptyEventLoop = false;
  const todoId = event.pathParameters.id;

  if (!todoId && !isNaN(todoId)) {
    return {
      statusCode: 400,
      message: "Missing Todo Id",
    };
  }

  await initDB();
  const { rowCount } = await client.query({
    text: "UPDATE todo SET is_complete = true WHERE id=$1",
    values: [todoId],
  });

  return rowCount === 1
    ? {
        statusCode: 200,
        message: "Todo Complete success.",
      }
    : {
        statusCode: 400,
        message: "Todo Complete failed.",
      };
};
```

## 步骤 5: 调试功能

### Invoke 调试

要调试代码除了使用第三方开发工具通过配置的 API 网关 url 调试，还可以使用 Serverless Framework 的 Invoke 功能 或 远程调试 功能. 这里使用 invoke 功能演示如何调试函数功能。

> invoke 和 远程调试功能 需要在组件的目录内执行。

#### 获取全部 Todo

在 src 目录下执行

```bash
$ serverless invoke -f allTodo
```

执行后可以得到结果

```bash
使用授权信息 default 授权中，如果需要使用临时密钥，请使用 --login 重新登陆
billDuration:      36
duration:          36
errMsg:
functionRequestId: fe6d302d-f6db-42ad-9c7b-8d0c61ead9b3
invokeResult:      0
log:
  """
    START RequestId: fe6d302d-f6db-42ad-9c7b-8d0c61ead9b3
    Event RequestId: fe6d302d-f6db-42ad-9c7b-8d0c61ead9b3

    END RequestId: fe6d302d-f6db-42ad-9c7b-8d0c61ead9b3
    Report RequestId: fe6d302d-f6db-42ad-9c7b-8d0c61ead9b3 Duration:36ms Memory:256MB MemUsage:11.3984MB
  """
memUsage:          11952128
---------------------------------------------
Serverless: 调用成功

{
  message: 'Tencent SCF execute successful!',
  data: []
}
```

在 invoke 返回的结果中，会包含函数执行后的 meta 信息，如运行时间，错误，RequestId，执行的日志 和函数返回的结果。

#### 创建新的 Todo

在 src 目录下执行

```bash
$  serverless invoke -f addTodo --data "{\"body\":\"{\\\"title\\\":\\\"Create multi-scf project demo\\\",\\\"note\\\":\\\"Todo App with postgreSQL\\\"}\"}"
```

执行后可以得到结果

```
使用授权信息 default 授权中，如果需要使用临时密钥，请使用 --login 重新登陆
billDuration:      35
duration:          35
errMsg:
functionRequestId: 93f50016-064f-468d-9e98-31645fc254fd
invokeResult:      0
log:
  """
    START RequestId: 93f50016-064f-468d-9e98-31645fc254fd
    Event RequestId: 93f50016-064f-468d-9e98-31645fc254fd

    END RequestId: 93f50016-064f-468d-9e98-31645fc254fd
    Report RequestId: 93f50016-064f-468d-9e98-31645fc254fd Duration:35ms Memory:128MB MemUsage:11.293MB
  """
memUsage:          11841536
---------------------------------------------
Serverless: 调用成功

{
  statusCode: 201,
  message: 'Todo added success.'
}
```

## 步骤 6：部署和日志

### 部署代码到生产环境

使用下面命令可以快速部署项目到生产环境（这里命名生产环境为`prod`）

```
$ serverless deploy --stage prod
```

### 即时查看生产环境日志

在项目目录`src`中执行以下命令可以查看项目的即时日志信息

```
$ sls logs --tail -f allTodo --stage prod
```

以下是返回结果：

```
使用授权信息 default 授权中，如果需要使用临时密钥，请使用 --login 重新登陆

serverless ⚡components
Action: "logs" - Stage: "prod" - App: "sls-demo-msn-todo-3e5a2134" - Name: "sls-demo-msn"

START RequestId:6f31857109130f092c547337c073ea91

Response RequestId:dbb3a8ed63a32be8e6b7a2dd8a32bbe2 RetMsg:{"message":"Tencent SCF execute successful!","data":[{"id":1,"title":"Create multi-scf project demo","note":"Todo App with postgreSQL","is_complete":false}]}
END RequestId:dbb3a8ed63a32be8e6b7a2dd8a32bbe2
Report RequestId:dbb3a8ed63a32be8e6b7a2dd8a32bbe2 Duration:4ms Memory:256MB MemUsage:12.113281MB

Response RequestId:485a87cfc6ad385b7e9c84343962391b RetMsg:{"message":"Tencent SCF execute successful!","data":[{"id":1,"title":"Create multi-scf project demo","note":"Todo App with postgreSQL","is_complete":false}]}
END RequestId:485a87cfc6ad385b7e9c84343962391b
Report RequestId:485a87cfc6ad385b7e9c84343962391b Duration:4ms Memory:256MB MemUsage:11.886719MB

START RequestId:0ede6d26dca55362a701c10ff51c9021


Serverless › 监听中 ...
```

# 总结

感谢长久以来对 Serverless Framework 支持的广大开发者，未来我们也会继续迭代产品，推出新功能，改进产品使用体验，最终我们会为中国的开发者打造一套符合中国开发者习惯的无服务器开发的完整解决方案。

也欢迎大家到 Serverless 中文社区分享经验和想法以及反馈问题和 BUG。

Serverless 中文社区：[https://github.com/serverless/serverless-tencent/discussions](https://github.com/serverless/serverless-tencent/discussions)

最后希望大家可以参与我们的有奖调查问卷：[https://www.surveymonkey.com/r/blog-msntodo](https://www.surveymonkey.com/r/blog-msntodo)
