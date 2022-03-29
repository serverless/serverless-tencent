---
title: "Tencent Serverless - 账号和授权"
menuText: "账号和授权"
menuOrder: 1
description: Serverless 账号和授权
layout: Doc
---

# 腾讯云账号

Serverless 会将您的项目部署到腾讯云，因此在使用 serverless 前，请确认您已经[注册腾讯云账号](https://cloud.tencent.com/document/product/378/17985)并完成[实名认证](https://cloud.tencent.com/document/product/378/10495)。

## 账号授权

### 扫码授权

通过 `sls deploy` 进行部署时，如果你没有配置其他方式，或者使用参数 `--login`, serverless 会使用扫码鉴权。使用绑定腾讯云的微信扫描弹出网页的二维码即可完成扫码授权，扫码授权后会生成临时密钥信息（过期时间 60 分钟）并写入当前目录下的 .env 文件中：

```
TENCENT_APP_ID=xxxxxx     #授权账号的 AppId
TENCENT_SECRET_ID=xxxxxx  #授权账号的 SecretId
TENCENT_SECRET_KEY=xxxxxx #授权账号的 SecretKey
TENCENT_TOKEN=xxxxx       #临时 token
```

一键授权会自动使用角色 [SLS_QcsRole](#SLS_QcsRole-角色权限说明) 进行授权。

> 如果您的账号为**腾讯云子账号**，扫码部署前需要主账号先进行策略授权配置。配置详情参考 [子账号权限配置](#子账号及权限)。

### 应用密钥授权

为了避免重复扫码授权以及授权时间过短的问题，您可以采用应用密钥方式授权。使用此方式仅需要在应用的根目录下创建 `.env` 文件，并存储要使用的腾讯云账号的 `SecretId` 和 `SecretKey` 信息：

```
# .env
TENCENT_SECRET_ID=xxxxxxxxxx #您账号的 SecretId
TENCENT_SECRET_KEY=xxxxxxxx #您账号的 SecretKey
```

SecretId 和 SecretKey 可以在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取 。

> 为了账号安全性，密钥授权时建议使用**子账号**密钥。子账号必须先被授予相关权限才能进行部署。配置详情参考[子账号权限配置](#子账号及权限)。

### 全局密钥授权

应用密钥授权仅在一个应用内有效，如果您同时开发多个项目，或您有多个账号，想要根据不同的项目使用不同的账号部署，那么全局密钥授权方式会更适合，全局密钥方式需要通过 Serverless CLI 工具的 `credentials` 命令来使用：

```sh
# 设置默认的全局身份认证信息
$ sls credentials set --i MySecretId -k MySecretKey

# 覆写全局身份认证信息名称为 myaccount 的授权信息
$ sls credentials set --i MySecretId -k MySecretKey -n myaccount

# 查看当前的全局用户授权信息
$ sls credentials list

# 删除全局身份认证信息名称为 myaccount 的授权信息
$ sls credentials remove -n myaccount
```

当您配置好全局密钥之后，在部署时，如果没有应用密码，那么会默认使用全局密钥的默认全局身份进行授权。

- 想要扫码登陆，在部署时使用参数 `--login` 会使用扫码授权替代全局密钥。
- 想要使用非默认全局身份，在部署时使用参数 `--profile {全局身份名称}` 会使用指定全局身份进行授权。

## 子账号及权限

如果您的操作账号为腾讯云子账号，没有默认操作权限，则需要 **主账号（或拥有授权操作的子账号）** 进行如下授权操作：

1. 在 [CAM 用户列表](https://console.cloud.tencent.com/cam/user) 页，选取对应子账号，点击 **“授权”**。
   ![](https://img.serverlesscloud.cn/20201121/1605961510862-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-21%2020.24.16.png)
2. 在弹出的窗口内，搜索并选中 `QcloudSLSFullAccess`，单击【确定】，完成授予子账号 Serverless Framework 所有资源的操作权限。
   ![](https://img.serverlesscloud.cn/20201121/1605961581339-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-21%2020.25.29.png)
3. 在 [CAM 用户列表](https://console.cloud.tencent.com/cam/user) 页，选取对应子账号，单击用户名称，进入用户详情页。
   ![](https://img.serverlesscloud.cn/20201121/1605961881460-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-21%2020.30.09.png)
4. 单击【关联策略】，在添加策略页面单击【从策略列表中选取策略关联】> 【新建自定义策略】:
   ![](https://img.serverlesscloud.cn/20201121/1605962160893-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-21%2020.33.04.png)
   ![](https://img.serverlesscloud.cn/20201121/1605962169320-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-21%2020.34.03.png)

5. 选择【按策略语法创建】>【空白模版】，填入如下内容，注意角色参数替换为您自己的主账号 uin（主账号 ID）：

```
{
 "version": "2.0",
 "statement": [
     {
         "action": [
             "cam:PassRole"
         ],
         "resource": [
             "qcs::cam::uin/${填入账号的uin}:roleName/SLS_QcsRole"
         ],
         "effect": "allow"
     },
     {
         "resource": [
             "*"
         ],
         "action": [
             "name/sts:AssumeRole"
         ],
         "effect": "allow"
     }
 ]
}
```

6. 完成自定义策略配置后，回到第四步的授权页面，搜索刚刚创建的自定义策略，点击【下一步】> 【确定】，即可授予子账号 SLS_QcsRole 的操作权限，此时，您的子账号应该拥有一个自定义策略和一个 **QcloudSLSFullAccess** 的预设策略，可以完成 Serverless Framework 的正常使用。
   ![](https://img.serverlesscloud.cn/20201121/1605962495451-%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202020-11-21%2020.39.31.png)

> 除了授权调用默认角色 SLS_QcsRole 外，也可给子账号授权调用自定义角色。通过自定义角色中的细粒度权限策略，达到权限收缩的目的。查看 [指定操作角色配置](https://cloud.tencent.com/document/product/1154/45577) 详情。

### SLS_QcsRole 角色权限说明

| 策略                       | 描述                                                                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| QcloudCOSFullAccess        | COS（对象存储）全读写访问权限                                                                                                                   |
| QcloudSCFFullAccess        | SCF（云函数）全读写权限                                                                                                                         |
| QcloudSSLFullAccess        | SSL 证书（SSL）全读写访问权限                                                                                                                   |
| QcloudTCBFullAccess        | TCB（云开发）全读写权限                                                                                                                         |
| QcloudAPIGWFullAccess      | APIGW（API 网关）全读写权限                                                                                                                     |
| QcloudVPCFullAccess        | VPC（私有网络）全读写权限                                                                                                                       |
| QcloudMonitorFullAccess    | Monitor（云监控）全读写权限                                                                                                                     |
| QcloudSLSFullAccess        | SLS（Serverless Framework）全读写权限                                                                                                           |
| QcloudCDNFullAccess        | CDN（内容分发网络）全读写权限                                                                                                                   |
| QcloudCKafkaFullAccess     | CKafka（消息队列 CKafka）全读写权限                                                                                                             |
| QcloudCodingFullAccess     | CODING DevOps 全读写访问权限                                                                                                                    |
| QcloudPostgreSQLFullAccess | 云数据库 PostgreSQL 全读写访问权限                                                                                                              |
| QcloudCynosDBFullAccess    | 云数据库 CynosDB 全读写访问权限                                                                                                                 |
| QcloudCLSFullAccess        | 日志服务（CLS）全读写访问权限                                                                                                                   |
| QcloudAccessForSLSRole     | 该策略供 Serverless Framework（SLS）服务角色（SLS_QCSRole）进行关联，用于 SLS 一键体验功能访问其他云服务资源。包含访问管理（CAM）相关操作权限。 |
