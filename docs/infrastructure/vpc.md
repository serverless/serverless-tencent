---
title: "Tencent Serverless - VPC 私有网络"
menuText: "VPC 私有网络"
menuOrder: 5
description: VPC 私有网络
layout: Doc
---

# VPC 私有网络

私有网络（Virtual Private Cloud，VPC）是基于腾讯云构建的专属云上网络空间，为您在腾讯云上的资源提供网络服务，不同私有网络间完全逻辑隔离。您可以自定义网络环境、路由表、安全策略等；同时，私有网络支持多种方式连接 Internet、连接其他 VPC、连接您的本地数据中心，助力您轻松部署云上网络。

腾讯云 VPC 组件支持通过`serverless.yml`配置，快速创建指定名称的私有网络和子网，并输出 VPCID 和 SubnetID，便于配置其他组件所需的网络信息。

## 操作步骤

### 安装

通过 npm 安装最新版本的 Serverless Framework：

```shell
$ npm install -g serverless
```

### 配置

新建一个目录 vpcDemo，在 vpcDemo 下创建`serverless.yml`文件：

```shell
$ mkdir vpcDemo && cd vpcDemo
$ touch serverless.yml
```

在`serverless.yml`中进行如下配置：

```yml
# serverless.yml
org: orgDemo # (可选) 用于记录组织信息，默认值为您的腾讯云账户 appid.
app: appDemo # (可选) 该VPC应用名称.
stage: dev # (可选) 用于区分环境信息，默认值是 dev.

component: vpc #  (必填) 引用 component 的名称，当前用到的是 tencent-vpc 组件.
name: vpcDemo # (必填) 该组件创建的实例名称.

inputs:
  region: ap-guangzhou
  zone: ap-guangzhou-2
  vpcName: serverless
  subnetName: serverless
```

[查看详细配置文档 >>](#1)

### 部署

运行 sls deploy 进行部署：

```bash
$ sls deploy
serverless ⚡ framework
Action: "deploy" - Stage: "dev" - App: "appDemo" - Instance: "vpcDemo"

region:     ap-guangzhou
zone:       ap-guangzhou-2
vpcId:      vpc-xxxxxxxx
vpcName:    serverless
subnetId:   subnet-xxxxxxxx
subnetName: serverless


3s › vpcDemo › Success
```

如您的账号未 [登录](https://cloud.tencent.com/login) 或 [注册](https://cloud.tencent.com/register) 腾讯云，您可以直接通过**微信**扫描命令行中的二维码进行授权登录和注册。

### 查看信息

运行 `sls info` 进行查看部署成功的信息：

```bash
$ sls info

serverless ⚡ framework

Status:       active
Last Action:  deploy (5 minutes ago)
Deployments:  2

region:     ap-guangzhou
zone:       ap-guangzhou-2
vpcId:      vpc-xxxxxxx
vpcName:    serverless
subnetId:   subnet-xxxxxxx
subnetName: serverless

vpcDemo › Info successfully loaded
```

### 移除

通过以下命令移除部署的 VPC：

```bash
$ sls remove

serverless ⚡ framework
Action: "remove" - Stage: "dev" - App: "appDemo" - Instance: "vpcDemo"

6s › vpcDemo › Success
```

<span id="1"></span>

## 全量配置

- [全量 yml](#1-1)
- [主要参数说明](#1-2)

<span id="1-1"></span>

```yml
# serverless.yml

component: vpc # (必填) 组件名称，此处为 vpc
name: vpcDemo # (必填) 实例名称
org: orgDemo # (可选) 用于记录组织信息，默认值为您的腾讯云账户 appid
app: appDemo # (可选) 该应用名称
stage: dev # (可选) 用于区分环境信息，默认值为 dev

inputs:
  region: ap-guangzhou # 可选 ap-guangzhou, ap-shanghai, ap-beijing
  zone: ap-guangzhou-2 # 可选 ap-guangzhou-2, ap-shanghai-2, ap-beijing-3
  vpcName: serverless
  subnetName: serverless
  cidrBlock: 10.0.0.0/16
  enableMulticast: "FALSE"
  enableSubnetBroadcast: "FALSE"
  dnsServers:
    - 127.0.0.1
  domainName: demo
  tags:
    - Key: City
      Value: guangzhou
  subnetTags:
    - Key: City
      Value: guangzhou
```

<span id="1-2"></span>

### 主要参数说明

| 参数                  | 必填/可选 | 类型   | 默认值        | 描述                                                                          |
| --------------------- | --------- | ------ | ------------- | ----------------------------------------------------------------------------- |
| region                | 必填      | String |               | VPC 的所属地区                                                                |
| zone                  | 必填      | String |               | VPC 所在地区的区域                                                            |
| vpcName               | 必填      | String |               | VPC 的名称                                                                    |
| subnetName            | 必填      | String |               | Subnet 的名称                                                                 |
| cidrBlock             | 可选      | String | `10.0.0.0/16` | VPC 和 Subnet 的 IPv4 CIDR，例如: 10.0.0.0/16，172.16.0.0/16，192.168.0.0/16. |
| enableMulticast       | 可选      | String | `FALSE`       | 是否启用 VPC 组播                                                             |
| dnsServers            | 可选      | Array  |               | VPC DNS 地址，最大数量为 4，第一个为 master                                   |
| domainName            | 可选      | String |               | VPC 域名相应的 cvm 域名后缀                                                   |
| tags                  | 可选      | Array  |               | VPC 绑定的标签键值对，例如: [{"Key": "city", "Value": "shanghai"}]            |
| subnetTags            | 可选      | Array  |               | Subnet 绑定的标签键值对，例如: [{"Key": "city", "Value": "shanghai"}]         |
| enableSubnetBroadcast | 可选      | String | `FALSE`       | 是否启用子网广播                                                              |
