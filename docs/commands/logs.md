---
title: "Tencent Serverless - Logs 日志"
menuText: "Logs 日志"
menuOrder: 5
description: 查看应用日志
layout: Doc
---

# logs 查看日志

查看应用云端指定时间区间的日志或实时日志

```sh
# 查看当前组建的日志
$ serverless logs

# 启动监听模式查看当前组建的日志并每5秒刷新一次
$ serverless logs --tail --interval 5000
```

## 命令选项

```sh
logs                      查看应用日志
    --function / -f          查看多函数组件的指定函数日志(单函数组件无需指定)
    --target                 指定要查看的组件实例路径
    --stage / -s             指定环境名称，默认使用配置环境
    --startTime              指定开始时间，如：3h, 20130208T080910，默认10m
    --tail / -t              启动监听模式
    --interval / -i          监听模式的刷新时间 默认：2000ms
    --region / -r            指定地区名称，默认使用配置地区
    --namespace / -n         指定命名空间，默认使用配置命名空间
    --qualifier / -q         指定函数版本，默认使用配置版本
```

## 使用说明

使用 `serverless logs --startime xxxx` 来查看指定开始时间的日志，支持传入的时间参数有 `3h` (3 小时之前) , `3d` (3 天之前)， `10m` (10 分钟之前)， `20210520T080910` （2021 年 5 月 20 日 08 点 09 分 10 秒，当前系统时区时间）。

#### 监听最新日志

使用 `serverless logs --tail --interval 5000` 来自动获取并显示最新的日志。获取日志间隔为 5 秒钟。

> 因为 API 限制每次获取最新的日志仅会获取最新的 10 条日志，请合理配置刷新时间。
