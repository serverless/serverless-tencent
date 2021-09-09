---
title: "Tencent Serverless - TDSQL-C 数据库"
menuText: "TDSQL-C 数据库"
menuOrder: 7
description: TDSQL-C 数据库
layout: Doc
---

# TDSQL-C 数据库

云原生数据库 TDSQL-C（Cloud Native Database TDSQL-C，TDSQL-C）是腾讯云自研的新一代高性能高可用的企业级分布式云数据库。融合了传统数据库、云计算与新硬件技术的优势，保障数据安全可靠。

该教程指导您通过 Serverless Framework 组件，快速创建一个 TDSQL-C Serverless MySQL 数据库实例。

## 操作步骤

### 1. 安装 Serverless Framework

通过 npm 全局安装最新版本的 Serverless Framework：

```bash
$ npm install -g serverless
```

### 2. 创建新目录

创建并进入一个全新目录：

```bash
$ mkdir tencent-tdsqlc && cd tencent-tdsqlc
```

### 3. 配置文件

在新目录下创建 `serverless.yml` 文件：

```bash
$ touch serverless.yml
```

在 `serverless.yml` 文件中进行如下配置（[查看全量配置](#1)）：

```yml
# serverless.yml
component: cynosdb
name: cynosdbDemo

inputs:
  region: ap-guangzhou
  zone: ap-guangzhou-4
  vpcConfig:
    vpcId: vpc-xxx
    subnetId: subnet-xxx
```

> !当前仅支持**北京三区、广州四区、上海二区、南京一区**四个地域的创建和部署，因此在填写 yaml 中的地域可用区时需要填写为正确的地域和对应的 VPC 子网信息。

### 4. 部署

如您的账号未 [登录](https://cloud.tencent.com/login) 或 [注册](https://cloud.tencent.com/register) 腾讯云，您可以直接通过**微信**扫描命令行中的二维码进行授权登录和注册。

通过 `sls` 命令进行部署，并可以添加 `--debug` 参数查看部署过程中的信息。

```bash
$ sls deploy
```

> 部署完成后，可以在命令行看到创建的数据库实例信息：
> <img src="https://main.qcloudimg.com/raw/66e70fa9bf9147ff55790db19767dc78.png" width="70%">

#### 4.1 开启外网访问

如果需要数据库实例开启外网访问，只需添加 `enablePublicAccess` 配置为 `true`，如下：
<dx-codeblock>
::: yml

# serverless.yml

app: appDemo
stage: dev
component: cynosdb
name: cynosdbDemo

inputs:
region: ap-guangzhou
zone: ap-guangzhou-4
enablePublicAccess: true
vpcConfig:
vpcId: vpc-xxx
subnetId: subnet-xxx
:::
</dx-codeblock>

然后重新执行部署：

```bash
$ sls deploy
```

#### 4.2 重置密码

组件只支持重置 `root` 用户密码。例如，需要将密码重置为 `123456@abc` 只需运行如下命令：

```bash
$ sls resetpwd --inputs adminPassword=123456@abc
```

### 5. 查看状态

在 `serverless.yml` 文件所在的目录下，通过如下命令查看部署状态：

```bash
$ sls info
```

<span id="1"></span>

## 全量配置

- [全量 yml](#1-1)
- [主要参数说明](#1-2)

<span id="1-1"></span>

```yml
app: appDemo # (可选) 该应用名称，字符串
stage: dev # (可选) 用于区分环境信息，默认值为 dev，字符串
component: cynosdb # (必填) 组件名称，此处为 cynosdb
name: cynosdbDemo # (必填) 实例名称

inputs:
  region: ap-shanghai # 可选 ap-guangzhou, ap-shanghai, ap-nanjing
  zone: ap-shanghai-2 # 可选 ap-guangzhou-4, ap-shanghai-2, ap-beijing-3, ap-nanjing-1
  enablePublicAccess: false
  vpcConfig:
    vpcId: vpc-123
    subnetId: subnet-123
  # 如果只创建 serverless 版本，一下两个参数可忽略
  dbMode: SERVERLESS
  payMode: 0
```

<span id="1-2"></span>

### 主要参数说明

| 参数               | 必选   | 类型    | 默认值       | 描述                 |
| ------------------ | ------ | ------- | ------------ | -------------------- |
| region             | 是     | string  |              | 数据库的所属地区     |
| zone               | 是     | string  |              | 数据库所在地区的区域 |
| vpcConfig.vpcId    | 是     | string  |              | VPC 的 ID            |
| vpcConfig.subnetId | 是     | string  |              | Subnet 的 ID         |
| enablePublicAccess | 否     | boolean | `false`      | 是否开启外网访问     |
| dbMode             | 否     | string  | `SERVERLESS` | 数据库类型           |
| payMode            | number | number  | `0`          | 付费类型             |

> Serverless Cynosdb 当前支持可用区为：`ap-guangzhou-4`, `ap-shanghai-2`, `ap-beijing-3`, `ap-nanjing-1`

### dbMode 说明

```
SERVERLESS - serverless 版本
NORMAL     - 正常版本
```

### payMode 说明

只有在 `dbMode` 配置为 `NORMAL` 时，才生效

```
0         - 按量计费
1         - 包年包月，目前只支持购买一个月
```
