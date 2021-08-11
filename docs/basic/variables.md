---
title: "Serverless 变量"
menuText: "Serverless 变量"
layout: Doc
---

# Serverless 变量

Serverless Framework 支持在项目部署过程中，直接引用其它项目输出的变量信息或者环境变量信息，简化开发步骤，方便应用组织编排。

### 顶级参数引用
  在 `inputs` 字段里，支持直接引用顶级配置信息，引用语法如下：
  ```
  ${stage}
  ${app}
  ```

### 环境变量引用
   当您需要使用一些全局变量配置，或想要把机密信息和项目本身区分时，您可以在**项目根目录下**创建 .env 文件，并在里面配置通用环境变量，再在 yml 里直接引用即可，示例如下：

   1. 项目目录下新建 .env 文件
   ```
   .
   ├── serverless.yml  # 配置文件
   ├── src
   │   ├── package.json # 依赖项文件
   │   └── index.js # 入口函数
   └── .env # 环境变量文件
   ```

   2. 在 .env 文件中，配置您的环境变量信息
   ```txt
   TENCENT_APP_ID=xxxxxx     #授权账号的 AppId
   TENCENT_SECRET_ID=xxxxxx  #授权账号的 SecretId
   TENCENT_SECRET_KEY=xxxxxx #授权账号的 SecretKey
   REGION=ap-guangzhou #部署地域
   ```

   3. 在配置文件 `serverless.yml` 中，直接通过 `${env:Key}` 的方式，直接引用环境变量配置

    例如，通过`${env:REGION}`，引用环境变量 REGION

### 输出变量引用
在进行多组件资源编排是，您可以直接引用其他组件实例的输出信息，来实现确定部署顺序的目的，引用语法如下：

```
${output:[app]:[stage]:[instance name].[output]}
```

### 示例：

```yml
app: demo
component: scf
name: rest-api
stage: dev

inputs:
  name: ${stage}-${app}-${name} # 命名最终为 "dev-demo-rest-api"
  region: ${env:REGION} # 环境变量中指定的 REGION=xxx 信息
  vpcName: ${output:prod:my-app:vpc.name} # 获取其他组件中的输出信息
  vpcName: ${output:${stage}:${app}:vpc.name} # 上述方式也可以组合使用
```

### Output 参数参考

| 组件名称      | 输出变量参考                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| Express 组件  | [输出变量参考](https://github.com/serverless-components/tencent-express/blob/master/docs/output.md)  |
| Koa 组件      | [输出变量参考](https://github.com/serverless-components/tencent-koa/blob/master/docs/output.md)      |
| Egg 组件      | [输出变量参考](https://github.com/serverless-components/tencent-egg/blob/master/docs/output.md)      |
| CynosDB 数据库组件    | [输出变量参考](https://github.com/serverless-components/tencent-cynosdb/blob/master/docs/output.md)    |