---
title: "Tencent Serverless - 常见报错"
menuText: "常见报错"
menuOrder: 10
description: 常见报错
layout: Doc
---

# 常见报错及解决办法

> 关于 Serverless Framework 的任何使用问题、建议或者经验分享欢迎到 [Serverless 中文讨论社区](https://github.com/serverless/serverless-tencent/discussions) 分享讨论。同时使用中遇到的 bug 也欢迎通过 [BUG 反馈](https://github.com/serverless/serverless-tencent/issues/new/choose) 提交并追踪。

## 腾讯云身份授权相关

1. [The appid is unavailable due to content illegal](#auth-1)
2. [The appid is unavailable for legal reasons](#auth-2)
3. [you are not authorized to perform operation resource has no permission](#auth-3)
4. [The provided credentials could not be validated. Please check your signature is correct](#auth-4)

## 网络相关错误

1. [socket hang up](#network-1)
2. [timeout 30000ms, https://cam.tencentcloudapi.com/](#network-2)

## 其他错误

1. [An internal error has occurred. Retry your request, but if the problem persists, contact us](#other-1)

<span id="auth-1"></span>

#### The appid is unavailable due to content illegal

此错误通常是所使用的腾讯云账户欠费或没有足够的余额导致的，建议尝试检查腾讯云账户余额，如果余额不足，请充值后重试。

<span id="auth-2"></span>

#### The appid is unavailable for legal reasons

此错误通常是所使用账号被腾讯云封禁了，导致无法正常完成部署，需要向腾讯云提交工单，了解详细错误原因，并寻求腾讯云的帮助来解决相关问题。

<span id="auth-3"></span>

#### you are not authorized to perform operation resource has no permission

此错误通常是因为所使用的账号没有足够的权限完成相关操作导致的， 用户需要确认所使用的账户拥有`SLS_QcsRole`角色的访问权限。 请查看[腾讯授权权限](https://cn.serverless.com/framework/docs-guides-tencent-account#sls_qcsrole-%E8%A7%92%E8%89%B2%E6%9D%83%E9%99%90%E8%AF%B4%E6%98%8E)了解进一步腾讯云账号和权限相关的信息。

Ref: 
https://cloud.tencent.com/document/product/1154/51075

<span id="auth-4"></span>

#### The provided credentials could not be validated. Please check your signature is correct

此错误通常是说使用的授权信息不正确，无法完成校验导致的，建议重新授权后重试，或检查配置的授权信息是否还有效，如果失效需要更新新的有效的授权信息。请查看[腾讯云身份授权](https://cn.serverless.com/framework/docs-guides-tencent-account)了解进一步腾讯云账号和权限相关的信息。

<span id="network-1"></span>

#### socket hang up

此错误是 websocket 链接中断导致的，通常是网络不稳定导致的，建议重试，如果这个问题持续发生，请向我们[提交BUG反馈](https://github.com/serverless/serverless-tencent/issues/new?assignees=&labels=&template=BUG.md), 并请再 BUG 反馈中提供尽可能多的信息（复现步骤，源代码包，requestId 等），以便我们进一步定位并解决相关问题。

<span id="network-2"></span>

#### timeout 30000ms, https://cam.tencentcloudapi.com/

此错误是与腾讯 CAM 服务链接超时导致的，通常是网络不稳定导致的，建议重试，如果这个问题持续发生，请向腾讯[提交问题工单](https://console.cloud.tencent.com/workorder/category?level1_id=876&level2_id=1123&source=0&data_title=Serverless%20Framework&step=1), 寻求腾讯云的帮助来解决相关问题。


<span id="other-1"></span>

#### An internal error has occurred. Retry your request, but if the problem persists, contact us

此错误通常是我们的 SDK 内部功能或执行发生的错误，如果遇到这个错误，请向我们[提交BUG反馈](https://github.com/serverless/serverless-tencent/issues/new?assignees=&labels=&template=BUG.md), 并请再 BUG 反馈中提供尽可能多的信息（复现步骤，源代码包，requestId 等），以便我们进一步定位并解决相关问题。
