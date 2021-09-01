---
title: "Serverless 变量"
menuText: "Serverless 变量"
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

以下是执行 `sls deploy`是 环境变量文件的加载顺序如下：

1. `./.env.${stage}`
2. `./.env`
3. `../.env.${stage}`
4. `../.env`
5. `../../.env.${stage}`
6. `../../.env`

> 为了方便进行多组件应用开发（详见[Serverless 项目结果](./project-structure)），可以将环境变量文件存储到一级或二级父目录中。

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
