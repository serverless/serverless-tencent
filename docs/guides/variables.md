---
title: "Tencent Serverless - 变量"
menuText: "变量&执行环境变量"
menuOrder: 3
description: Serverless 变量与执行环境变量
layout: Doc
---

# Serverless 变量

Serverless 支持在项目配置文件中复用配置文件中的**配置变量**，使用**环境变量**，引用其他组件部署后的**输出的变量（output）**来更灵活的进行配置。

## 配置变量

在 serverless 应用配置中，可以通过 `${变量名称}` 来引用当前配置文件中已有的变量，如：

```yml
app: my-serverless-app
component: scf
stage: dev
name: my-scf-sls-instance-name # 实例名称

inputs:
  name: ${name} # 腾讯云 SCF 实例名称
  ...
```

> 这里复用 serverless 配置变量，会使用实例名称 `my-scf-sls-instance-name` 作为腾讯云部署的 SCF 实例名称。

### 环境变量

在 serverless 应用配置中，可以通过 `${env:变量名称}` 来使用环境变量，环境变量会在部署时加载并替换配置文件中的变量。如：

```yml
app: my-serverless-app
component: scf
stage: dev
name: my-scf-sls-instance-name # 实例名称

inputs:
  name: ${env:NAME} # 腾讯云 SCF 实例名称
  ...
```

> 这里使用环境变量 `STAGE` 作为 serverless stage 的配置值。

要使用环境变量，可以在部署时传递，如：

```sh
NAME=scf-instance-name sls deploy
```

或将环境变量保存在 `.env` 文件中，如：

```
NAME=scf-instance-name
```

### stage 环境变量

除了使用 `.env` 来存储环境变量信息，可以使用 `.env.${stage}` 来根据指定 stage 加载不同的环境变量。

要使用 stage 环境变量进行部署 可以使用命令 `sls deploy --stage {stage名称}`

以下是执行 `sls deploy`时，环境变量文件的加载顺序：

1. `./.env.${stage}`
2. `./.env`
3. `../.env.${stage}`
4. `../.env`
5. `../../.env.${stage}`
6. `../../.env`

> 为了方便进行多组件应用开发（详见[Serverless 项目结构](./project-structure)），可以将环境变量文件存储到一级或二级父目录中。

## 输出变量

在进行多组件应用开发时，您可以直接引用其他组件实例的输出信息，Serverless 会自动按照引用依赖顺序进行部署，如：

```yml
app: my-serverless-app
component: scf
stage: dev
name: my-scf-sls-instance-name # 实例名称

inputs:
  vpcName: ${output:prod:my-app:vpc.name} # 获取vpc组件中的输出信息
  vpcName: ${output:${stage}:${app}:vpc.name} # 上述方式也可以组合使用
  ...
```

> 可以通过 `sls info` 查看组件的输出变量信息，也可以在应用控制台查看组件的输出变量信息。

## 执行环境变量

当 serverless 应用执行时，有时需要动态加载环境变量信息，比如当应用需要连接数据库时，会通过执行时的环境变量信息加载配置信息：

```js
// 在代码中动态加载环境信息。
const client = new Client({
  connectionString: process.env.PG_CONNECT_STRING,
});
```

这是可以使用 serverless 的执行环境变量来进行配置，仅需要在 `serverless.yml` 中配置 `envoironments` 信息，之后应用执行时就可以加载对应的环境变量信息，配置示例:

```yml
app: my-app-demo
component: multi-scf
name: sls-demo-msn

inputs:
  ...
  environments:
    - key: PG_CONNECT_STRING_STRING # 使用固定的链接字符串
      value: postgresql://admin:secret@my_pg_host
    - key: PG_CONNECT_STRING_ENV # 使用部署时环境变量传递的链接字符串
      value: ${env:MY_PG_CONNECT_STRING}
    - key: PG_CONNECT_STRING_OUTPUT # 使用实例 sls-demo-msn-DB 部署结果生成的链接字符串
      value: ${output:${stage}:${app}:sls-demo-msn-DB.private.connectionString}
  ...
```

> 在 serverless.yml 的环境变量信息中可以使用固定值，环境变量赋值或其他组件 output 结果赋值方式进行赋值。
