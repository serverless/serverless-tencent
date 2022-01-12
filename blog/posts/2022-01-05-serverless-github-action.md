---
title: 使用 GitHub Action 部署 Serverless 应用
description: 介绍如何在 GitHub Action 中配置和部署 Serverless 应用
date: 2022-01-05
layout: Post
thumbnail: https://sp-assets-1300963013.file.myqcloud.com/blog/thumbnails/2022-01-05-serverless-github-action.png
authors:
  - TimQian
category:
  - guides-and-tutorials
---

在这篇文章中，作者介绍了如何配置和使用 Github Actions 来方便得部署 Serverless 应用程序。本文用到的所有代码可以[在这里获取](https://github.com/timqian/sls-action)

## 为什么选择 GitHub Action 部署 Serverless 应用

- Action 由 Github 官方提供，部署流程可以和你的代码在一处管理
- 可以使用 YAML 配置文件方便地自定义部署流程
- Github 提供了一种安全的方式来存储环境变量
- 完全免费

## 部署步骤

### 1. 初始化 Serverless 应用

首先，我们使用以下命令创建一个托管在腾讯云 SCF 上的简单的 Node.js 应用

```bash
serverless init scf-starter --name sls-action
cd sls-action
```

该命令会新建一个名为 `sls-action` 的文件夹，并且初始化一个简单的 SCF 函数。

然后, 我们需要在文件夹内创建一个 `.env` 文件来存储腾讯云的 `SecretId` 和 `SecretKey` 信息。（因为涉及密钥，这个文件不应该被推送到的 GitHub 仓库，可以在 `.gitignore` 文件中忽略这个文件）

```bash
SERVERLESS_PLATFORM_VENDOR=tencent
TENCENT_SECRET_ID=******
TENCENT_SECRET_KEY=******
```

`TENCENT_SECRET_ID` 和 `TENCENT_SECRET_KEY` 可以在腾讯云控制台的 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取。关于密钥配置的更多细节可以参考我们的[相关文档](https://cn.serverless.com/framework/docs-guides-tencent-account)

配置完毕之后，可以使用以下命令部署这个 serverless 应用

```bash
serverless deploy
```

如果部署没有问题，我们就可以开始配置 GitHub Action 了。

### 2. 创建 GitHub Action

1. 首先我们在项目中创建一个 `.github/workflows` 目录，用来存放工作流
2. 在 `.github/workflows` 目录中，创建一个名为 `deploy.yml` 的文件描述我们的工作流

```yml
# 工作流名称
name: deploy

# 控制该工作流什么时候运行
on:
  # 当 main 分支有代码 push 时运行
  push:
    branches: [ main ]
  # 允许在 action 页面手动运行
  workflow_dispatch:

# 一个工作流中可以定义多个 jobs
jobs:
  # 我们的 job 名称(deploySCF)
  deploySCF:
    # job 运行的系统
    runs-on: ubuntu-latest

    # job 运行前添加的环境变量
    env:
      SERVERLESS_PLATFORM_VENDOR: tencent
      TENCENT_SECRET_ID: ${{ secrets.TENCENT_SECRET_ID }}
      TENCENT_SECRET_KEY: ${{ secrets.TENCENT_SECRET_KEY }}
    
    # 部署过程
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: '14.x'
      - name: Install serverless cli
        run: sudo npm i serverless -g
      - name: Deploy and invoke SCF
        run: serverless deploy
```

当我们把上述代码推送到 GitHub 仓库之后，我们就创建了这样一个工作流：

当 `main` 分支代码有更新时，Action 会自动帮我们部署最新版代码到腾讯 SCF。同时我们也可以手动执行这个工作流，方便在遇到问题时进行调试。

<!-- 在上述工作流中，我们简要介绍了各个关键词的含义，关于 GitHub Action 工作流配置的详细介绍可以查看 [GitHub 官方文档](https://docs.github.com/cn/actions) -->

#### 在 Github 上存储环境变量

在我们的工作流中，我们引用了存储在 GitHub 项目上的环境变量（`${{ secrets.TENCENT_SECRET_ID }}`)。

为了成功部署项目，我们需要进入项目的 **Setting** 页面，然后在该页面点击侧边栏的 **Secrets** 一栏。就可以在该页面填入我们用到的环境变量 `TENCENT_SECRET_ID` 和 `TENCENT_SECRET_KEY` 两个环境变量了。

![配置环境变量截图](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2022-01-05-serverless-github-action-1.png)

### 运行 workflow 并查看运行结果 

1. 在我们的 GitHub 仓库，进入 action tab。

![action tab](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2022-01-05-serverless-github-action-2.png)

2. 从工作流运行列表中，单击要查看的 Action。

3. 查看运行结果和日志，日志显示了每个步骤是如何处理的。我们可以展开任何步骤查看详细的日志。

![日志](https://sp-assets-1300963013.file.myqcloud.com/blog/posts/2022-01-05-serverless-github-action-3.png)

## 总结

本文介绍了如何通过 GitHub Action 为 Serverless 应用配置一个简单的工作流，实现了当主分支代码更新时自动部署的功能。简单介绍了如何为 Action 配置必要的密钥信息，如何查看工作流运行日志等。
由于篇幅限制，很多地方只是粗略介绍，对于需要深入了解 Serverless 应用和 GitHub Action 的读者，可以参考以下链接：

- [Tencent Serverless 简介和文档](https://cn.serverless.com/framework/docs)
- [GitHub Action 官方介绍](https://docs.github.com/cn/actions)
