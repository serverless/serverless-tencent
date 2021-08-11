---
title: "自动集成"
menuText: "自动集成"
layout: Doc
---

## 自动集成

在 Serverless 应用开发中，我们需要手动执行部署命令将开发项目部署到云端。通过引入一些 CI 能力进行 Serverless 应用的自动化部署，本教程主要介绍以下 CI 部署方案：

- [基于腾讯云应用控制台实现自动化部署](#1)
- [基于 GitHub Action 的自动化部署](#2)
- [基于 CODING 构建计划完成自动化部署](#3)

<span id="1"></span>

## 基于腾讯云应用控制台实现自动化部署

### 部署场景

针对常用框架组件，Serverless Framework 提供了[应用控制台](https://console.cloud.tencent.com/ssr)开发部署方案，帮助用户通过控制台实现完整的应用开发部署流程。


### 当前支持框架

- Express
- Koa
- Egg.js
- Next.js
- Nuxt.js
- Flask
- Laravel
- SpringBoot
- 静态网站 website

### 权限配置

#### 主账号授权

1. 登录 [Serverless 应用控制台](https://console.cloud.tencent.com/sls)，单击【前往授权】进入访问管理控制台。
2. 在访问管理控制台的【角色】列表页，查看 **SLS_QcsRole** 和 **CODING_QCSRole** 服务角色是否创建成功。

   > !如果您已经创建过 CODING_QCSRole，请检查角色拥有权限是否完整，该角色需要基本策略列表如下：QcloudSLSFullAccess、QcloudSSLFullAccess、QcloudAccessForCODINGRole，如有缺少，请手动添加。

3. 确定角色与权限都符合要求后，即可开始使用服务。

#### 子账号授权

如果未开通 **Serverless Framework** 和 **Coding DevOps** 的服务，请先与主账号联系，完成服务开通与角色创建（步骤同上）。

### 操作步骤

#### 步骤 1：创建应用

1. 登录 [Serverless 应用控制台](https://console.cloud.tencent.com/sls)。
2. 单击【新建应用】 ，进入项目创建页面。
3. 根据页面提示，填写应用基本信息。

- 应用名：2 - 63 个字符，只能包含小写字母、数字及分隔符“-”、且必须以小写字母开头，数字或小写字母结尾。创建后不可更改。
- 环境：选择 dev、test、prod 任一种方式，也支持自定义环境。
- 地域：与云函数支持地域相同，详情请参考 [地域列表](https://cloud.tencent.com/document/api/583/17238#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8)。
- 创建方式：支持 **[应用模版](#1-1)** 创建和 **[导入已有项目](#2-1)** 两种方式，您可以根据自己的实际情况，选择相应的创建方案。

  > 导入已有项目时，部分框架需要做一定简单的改造，请参考相关框架迁移文档，完成项目改造。

4. 单击【创建】，将为您自动部署应用，您可以查看项目的部署日志。

<span id="1-1"></span>

- #### 应用模版创建

如果选择模版创建，您可以通过选择 Serverless Framework 提供的项目模版，快速创建一个 web 应用，模版部署时，将为默认您完成以下配置：

1. 【仅限 Node.js 框架】新建层，并将项目依赖包 node_modules 存放在层中，层的使用请参考 [层管理](https://cloud.tencent.com/document/product/583/40159)。
2. 【仅限 Next.js、Nuxt.js 框架】新建 COS 存储桶，拆分静态资源，将静态资源托管到 COS 桶中。
   ![](https://main.qcloudimg.com/raw/33a09a5fcf29dce6cb97f512c1113744.png)

您还可以在【高级配置】部分，为您的项目进行自定义域名、函数详细配置等更多能力的配置。

> 配置自定义域名时，请确定您的域名已在腾讯云备案并配置了 CNAME 解析，详细步骤参考 [自定义域名配置](https://cloud.tencent.com/document/product/628/11791)。

<span id="2-1"></span>

- #### 导入已有项目

Serverless 控制台支持您通过**代码托管导入**和**文件夹上传**两种方式实现已有项目迁移。

- 代码托管
  目前支持 **GitHub、GitLab、Gitee** 的代码仓库地址，也支持公开的自定义代码库，您可以通过选择应用的触发方式，完成应用的自动更新，详情请参考 [项目触发方式管理](https://cloud.tencent.com/document/product/1242/49637)。
  ![](https://main.qcloudimg.com/raw/120257e5c810fb9050965806f37fae0b.png)

- 文件夹上传
  您可以通过上传文件夹的方式直接导入本地项目，对于 Node.js 框架，Serverless Framework 将自动为您创建层，并将依赖包 node_modules 传入层中完成部署。
  ![](https://main.qcloudimg.com/raw/3ad3998d05ec22d309b3fe60505f069c.png)

#### 步骤 2：资源管理

在 [Serverless 应用](https://console.cloud.tencent.com/ssr) 页面，单击目标应用进入应用详情页，查看项目部署后输出的基本信息、项目请求次数、项目报错统计等多项监控指标，方便您轻松实现项目的管理运维。
<img src="https://main.qcloudimg.com/raw/b55916d9b944ce1281e5530c1db54115.png" width="770px">

#### 步骤 3：开发部署

在应用详情页顶部，单击【开发部署】，您可以轻松地实现应用的配置修改与二次部署上传，支持**本地上传、代码托管、CLI 开发**三种方式。
<img src="https://main.qcloudimg.com/raw/5b727ac0d6715f339574e37d3580ac89.png" width="770px">

<span id="2"></span>

## 基于 GitHub 的自动化部署

### 前提条件

- 已创建 Serverless 应用项目。
- 已托管您的 Serverless 项目到 Github 或其它代码仓库。

### 操作步骤

在开发测试阶段，为了方便开发、测试和调试，希望代码每次提交后进行自动化部署。操作如下：

1. 选取一个您需要执行自动化部署的分支（本示例选择 dev 分支）。
2. 在该分支下创建您的 action。
   ![](https://main.qcloudimg.com/raw/6863deb3acfb9a8de75d8a0447ec4d20.png)
   
   > !GitHub 规定如果事件发生在特定仓库分支上，则工作流程文件必须存在于该分支的仓库中 。
3. 配置腾讯云密钥。
   ![](https://main.qcloudimg.com/raw/e67ecc4fd932124db5d6bfa54b3ebb73.png)
4. 配置 action 部署步骤。

```
# 当代码推动到 dev 分支时，执行当前工作流程
# 更多配置信息: https://docs.github.com/cn/actions/getting-started-with-github-actions

name: deploy serverless

on: #监听的事件和分支配置
  push:
    branches:
      - dev

jobs:
  test: #配置单元测试
    name: test
    runs-on: ubuntu-latest
    steps:
      - name: unit test
        run: ''
  deploy:
    name: deploy serverless
    runs-on: ubuntu-latest
    needs: [test]
    steps:
      - name: clone local repository
        uses: actions/checkout@v2
      - name: install serverless
        run: npm install -g serverless
      - name: install dependency
        run: npm install
      - name: build
        run: npm build
      - name: deploy serverless
        run: sls deploy --debug
        env: # 环境变量
          STAGE: dev #您的部署环境
          SERVERLESS_PLATFORM_VENDOR: tencent #serverless 境外默认为 aws，配置为腾讯
          TENCENT_SECRET_ID: ${{ secrets.TENCENT_SECRET_ID }} #您的腾讯云账号 sercret ID
          TENCENT_SECRET_KEY: ${{ secrets.TENCENT_SECRET_KEY }} #您的腾讯云账号 sercret key

```

完成上述配置后，开发者每次提交代码到 dev 分支时，就会自动部署。

<span id="3"></span>

## 基于 Coding 的自动化部署

### 前提条件

- 已开通 Coding 账号。腾讯云用户可以通过 [CODING DevOps](https://console.cloud.tencent.com/coding) 快速开通。
- 已创建 Serverless 应用项目。如果您未创建 Serverless 应用项目，请参考 [开发项目 ](https://cloud.tencent.com/document/product/1154/47288)创建您的 Serverless 项目并创建各个环境与分支。
- 已托管您的 Serverless 项目到 Coding/Github/Gitlab/码云。

### 操作场景

在开发测试阶段，为了方便开发、测试和调试，希望代码每次提交后进行自动化部署。操作如下：

1. 创建您的 Coding Devops 项目。
   ![](https://main.qcloudimg.com/raw/89a7c0952c861f2d20312f82421bb185.png)
2. 创建一个构建计划，选择自定义构建过程。
   ![](https://main.qcloudimg.com/raw/ff4344b46b6e7294305b11d375625478.png)
3. 配置构建计划。

   1. 基础信息配置。本例中配置 Github 仓库：June1991/express-demo。
      ![](https://main.qcloudimg.com/raw/b98edca31948731cd1c7cd9d8bb1389a.png)
   2. 触发规则配置。本例中配置代码推送到 dev 分支时触发构建。
      ![](https://main.qcloudimg.com/raw/02f29fde9198c894ac2781966e09a1ed.png)
   3. 环境变量配置。本例中配置 STAGE 变量为部署环境 dev，TENCENT_CLOUD_API_CRED 为腾讯云账号密钥（密钥配置路径：左下角项目设置 > 开发者选项 > 凭据管理 > 录入凭据 > 腾讯云 API 密钥）。
      ![](https://main.qcloudimg.com/raw/c27da8efffef370ca82456455591dc0c.png)
   4. 流程配置。

      ```
      pipeline {
        agent any
        stages {
          stage('检出') {
            steps {
              checkout([$class: 'GitSCM', branches: [[name: env.GIT_BUILD_REF]],
                  userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: env.CREDENTIALS_ID]]])
            }
          }
          stage('安装依赖') {
            steps {
              echo '安装依赖中...'
              sh 'npm i -g serverless'
              sh 'npm install'
              echo '安装依赖完成.'
            }
          }
          stage('部署') {
            steps {
              echo '部署中...'
      
              withCredentials([
                cloudApi(
                  credentialsId: "${env.TENCENT_CLOUD_API_CRED}",
                  secretIdVariable: 'TENCENT_SECRET_ID',
                  secretKeyVariable: 'TENCENT_SECRET_KEY'
                ),
              ]) {
      
                   // 生成凭据文件
                   sh 'echo "TENCENT_SECRET_ID=${TENCENT_SECRET_ID}\nTENCENT_SECRET_KEY=${TENCENT_SECRET_KEY}" > .env'
                   // 部署
                   sh 'sls deploy --debug'
                   // 移除凭据
                   sh 'rm .env
              }
      
              echo '部署完成'
            }
          }
        }
      }
      ```

完成以上配置后，开发者每次提交代码到 dev 分支时，就会自动部署。
