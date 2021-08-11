---
title: "全栈应用开发"
menuText: "全栈应用开发"
layout: Doc
---

# 全栈应用开发
Serverless Framework 通过组件提供了各种框架和模板来进行前端和后端开发，当涉及到全栈开发工作的时候依然可以使用 Serverless Framework 完成全栈开发工作。 这里不在赘述前端开发和后端开发使用 Serverless Framework 需要注意的的内容和用法，详情请参考:

- [前端组件应用开发](./frontend)
- [后端组件应用开发](./backend)

这里主要介绍如何整合前端组件，与后端组件一起进行全栈项目开发。 目前提供的官方组件有:

- 全栈项目模板(fullstack): vuejs + express + postgres 的全栈项目模板

## 项目结构

全栈应用通过将多个组件拆分到不同的项目目录中，进行更好的组织和管理。在单个目录都可以进行部署开发，也可以在项目目录一次性进行部署。下面的目录结构是全栈应用模板目录结构。

```yml
# fullstack 模板目录
. # 项目跟目录
├── api # 后端 Express 组件目录
│   ├── serverless.yml
├── db # 数据库组件目录
│   ├── serverless.yml
├── frontend # vuejs 组件目录
│   ├── serverless.yml
├── scripts # 脚本目录
│   ├── bootstrap.js
├── tests # 测试文件目录
├── vpc # vpc 组件目录
│   ├── serverless.yml
└── serverless.yml
```

在跟目录的 `serverless.yml` 中可以定义同一的 `app`, 和 `stage` (默认为`dev`) 信息。 然后所有子目录中的 `serverless.yml` 都会继承这两个字段。(如果在子目录定义 `app` 或 `stage` 也会被跟目录的配置覆写，同时这两个字段可以不在子目录的 `serverless.yml` 中定义)。

不同组件资源的配置可以通过 `output` 在不同的组件 `serverless.yml` 配置文件中共享，更多请查看 [Serverless 变量](../basic/variables)。
