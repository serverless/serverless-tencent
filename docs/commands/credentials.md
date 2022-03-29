---
title: "Tencent Serverless - Credentials 授权"
menuText: "Credentials 授权"
menuOrder: 7
description: 移除组件应用
layout: Doc
---

# credentials 全局身份授权

管理全局授权信息

```sh
# 设置默认的全局身份认证信息
$ sls credentials set --i MySecretId -k MySecretKey

# 覆写全局身份认证信息名称为 myaccount 的授权信息
$ sls credentials set --i MySecretId -k MySecretKey -n myaccount -o

# 查看当前的全局用户授权信息
$ sls credentials list

# 删除全局身份认证信息名称为 myaccount 的授权信息
$ sls credentials remove -n myaccount
```

## 命令选项

```sh
credentials               管理全局授权信息
credentials set           存储用户授权信息
    --secretId / -i          [必填]腾讯云CAM账号secretId
    --secretKey / -k         [必填]腾讯云CAM账号secretKey
    --profile / -n {name}    身份名称. 默认为 "default"
    --overwrite / -o         覆写已有身份名称授权信息
credentials remove        删除用户授权信息
    --profile / -n {name}    身份名称. 默认为 "default"
credentials list          查看已有用户授权信息
```

## 使用说明

要使用 serverless credential 功能

1. 到 [腾讯云 - 访问管理 - 用户](https://console.cloud.tencent.com/cam)创建一个新的用户，在访问方式中开启 `编程访问` (启用 SecretId 和 SecretKey，支持腾讯云 API、SDK 和其他开发工具访问)， 并分配所需要的访问权限。创建成功后获得该 CAM 用户的 `SecretId` 和 `SecretKey`信息。

2. 使用 `sls credentials set --i ******** -k ********` 来配置全局授权信息。 (如未制定身份名称，默认存储为`default`, 通过不同身份名称可以存储多个身份授权信息)

3. 使用 `sls credentials list` 查看全部已有授权信息的身份名称。

4. 在组件应用命令中执行相关命令都会默认使用[default]的授权信息，不会再弹出代码登陆窗口。

---

- 使用 `sls credentials set --i ******** -k ******** -o` 来覆覆写授权信息。
- 使用 `sls credentials set --i ******** -k ******** -n myProfile` 来创建另外一个名外 `myProfile`的 授权信息。
- 使用 `sls deploy --profile myProfile` 来指定使用 myProfile 的授权信息。
- 使用 `sls deploy --login` 来忽略全局授权信息，并进行扫码登陆获取临时授权。
- 使用 `sls credentials remove -n myProfile` 来删除本地名外 `myProfile`的授权信息。

> 可以储存 `TENCENT_CREDENTIALS_PROFILE={name}` 在项目 .env 文件中, 来固定要使用的授权信息。
> 请确保项目目录(以及上两层目录)中没有环境变量 `TENCENT_SECRET_KEY` 和 `TENCENT_SECRET_ID`， 否则会认为该项目需要使用临时密钥进行授权。
> 删除用户授权信息只会移除本地的授权密钥信息，不会删除腾讯云的 CAM 用户信息。
