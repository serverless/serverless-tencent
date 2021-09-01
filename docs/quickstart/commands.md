---
title: "函数 CLI 命令"
menuText: "函数 CLI 命令"
layout: Doc
---

# Serverless CLI 命令

Serverless CLI 为 serverlss 开发提供了完善的功能支持，使得开发者无需登录控制台，在本地就可以创建、开发、调试、管理您的 serverless 应用。

- 可以通过 `“serverless --help` 或 `sls [command] --help`，查看帮助指令说明。
- 请及时更新 CLI 客户端到最新版本，以便获得 CLI 的最新完整功能。

### init 创建组件应用

通过模板初始化新应用

```sh
# 通过express-starter模版初始 Express 组件应用
$ sls init express-starter

# 通过express-starter模版初始 Express 组件应用并指定目录名称
$ sls init express-starter --name my-express-app
```

#### 命令选项

```sh
init                       通过模板初始化新应用
    {template}               [必填] 模板名称
    --name                   指定应用目录名称
```

> 更多可用的组件模板请通过命令 `serverless registry` 进行查看。
>
> 组件应用名称会在由目录名称与随机字符串拼接构成，详情查看 `serverless.yml` 中 `app` 字段。

### deploy 部署组件应用

部署应用到云端

```sh
# 部署组件应用到到云端服务器
$ sls deploy

# 部署指定目录下的组件实例到云端服务器(适用于多组件应用)
$ sls deploy --target ./src
```

#### 命令选项

```sh
deploy                    部署应用到云端
    --stage / -s             指定环境名称，默认使用配置环境
    --target                 指定要部署的组件实例路径
    --inputs                 覆写 inputs 配置
    --profile                使用指定身份的全局授权信息
    --login                  使用临时授权
    --force                  强制部署，跳过缓存和 serverless 应用校验
    --noCache                跳过缓存
    --noValidation           跳过 serverless 应用校验
    --debug                  显示 debug 信息
```

### info 查看应用信息

获取应用详情

```sh
# 查看组件应用的信息
$ sls info
```

#### 命令选项

```sh
info                      获取应用详情
    --stage / -s             指定环境名称，默认使用配置环境
    --profile                指定身份的全局授权信息
```

以下是一个 express 组件应用的信息示例。

```sh
serverless ⚡ components


最后操作:  deploy (a day ago)
部署次数:  1
应用状态:  active

region: ap-guangzhou
scf:
  functionName: express_component_g6zinoh
  runtime:      Nodejs10.15
  namespace:    default
  lastVersion:  $LATEST
  traffic:      1
apigw:
  serviceId:   service-4mekuq1y
  subDomain:   service-4mekuq1y-1302533238.gz.apigw.tencentcs.com
  environment: release
  url:         https://service-4mekuq1y-1302533238.gz.apigw.tencentcs.com/release/

应用控制台: https://console.cloud.tencent.com/ssr/detail?stageName=dev&appName=express-example-c2482779&instanceName=express-starter&stageList=dev

express-starter › 信息成功加载
```

### dev 远程开发模式

启动远程开发模式，更多调试模式详情请参考[远程开发模式](../basic/dev-mode)

```sh
# 进入组件应用的开发调试模式
$ sls dev
```

#### 命令选项

```sh
dev                       启动远程开发模式模式
    --stage / -s             指定环境名称，默认使用配置环境
    --profile                使用指定身份的全局授权信息
    --target                 指定执行命令的组件实例路径
```

### logs 查看日志

查看应用云端指定时间区间的日志或实时日志

```sh
# 查看当前组建的日志
$ serverless logs

# 启动监听模式查看当前组建的日志并每5秒刷新一次
$ serverless logs --tail --interval 5000
```

#### 命令选项

```sh
logs                      查看应用日志
    --function / -f          查看多函数组件的指定函数日志(单函数组件无需指定)
    --target                 指定要查看的组件实例路径
    --stage / -s             指定环境名称，默认使用配置环境
    --startTime              指定开始时间，如：3h, 20130208T080910，默认10m
    --tail / -t              启动监听模式
    --intervial / -i         监听模式的刷新时间 默认：2000ms
    --region / -r            指定地区名称，默认使用配置地区
    --namespace / -n         指定命名空间，默认使用配置命名空间
    --qualifier / -q         指定函数版本，默认使用配置版本
```

### remove 移除组件应用

移除应用

```sh
# 删除组件应用实例
$ sls remove

# 删除指定目录下的组件应用实例
$ sls remove --target ./src
```

#### 命令选项

```sh
remove                    移除应用
    --stage / -s             指定环境名称，默认使用配置环境
    --target                 指定要移除的组件实例路径
    --profile                使用指定身份的全局授权信息
    --debug                  显示 debug 信息
```

### credentials 全局身份授权

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

#### 命令选项

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

### registry 组件注册中心

查看在应用中心发布的组件模板信息

```sh
# 查看全部组件模板信息
$ sls registry

# 查看指定组件模板信息
$ sls registry express-starter
```

#### 命令选项

```sh
registry                  查看注册中心的组件与模版信息
    {name}                   模板名称
```

### invoke 调用函数

通过此命令调用已部署函数，可以发送自定义 event 数据来调用函数，在结果中可以查看日志，以及其他函数调用相关信息。

```sh
# 调用函数应用默认函数
$ serverless invoke

# 调用函数应用默认函数的生产环境版本并使用指定 Event 数据
$ serverless invoke --stage prod --data '{"foo":"bar"}'

```

#### 命令选项

```sh
invoke                    调用函数
    --function / -f          调用的多函数组件的函数名称(单函数组件无需指定)
    --target                 指定要调用的组件实例路径
    --stage / -s             指定环境名称，默认使用配置环境
    --region / -r            指定地区名称，默认使用配置地区
    --data / -d              指定传入函数的事件(event)参数数据，需要使用序列化的 JSON 格式
    --path / -p              指定传入还输的事件(event)参数的 JSON 文件路径
    --namespace / -n         指定命名空间，默认使用配置命名空间
    --qualifier / -q         指定函数版本，默认使用配置版本
```

> 使用单函数组件（scf）不需要指定 `function` 参数， 只有多函数组件（multi-scf）需要指定 `funciton` 参数

### invoke local 本地调用

通过此命令在本地调用函数。 同时可以发送 event 和 context 数据到函数进行本地调用测试。

```sh
# 调用函数应用默认函数
$ serverless invoke local

# 调用单函数应用函数并指定 Event 数据
$ serverless invoke local --data '{"foo":"bar"}'
```

#### 命令选项

```sh
invoke local              本地调用函数
    --function / -f          调用的多函数组件的函数名称(单函数组件无需指定)
    --target                 指定要调用的组件实例路径
    --data / -d              指定传入函数的事件(event)参数数据，需要使用序列化的 JSON 格式
    --path / -p              指定传入还输的事件(event)参数的 JSON 文件路径
    --context                指定传入函数的上下文(context)参数数据，需要使用序列化的 JSON 格式
    --contextPath / -x       指定传入函数的上下文(context)参数的 JSON 文件路径
    --env / -e               指定环境变量信息 如: --env VAR=val
    --config / -c            指定使用的配置文件
    --py                     指定要使用的本机中的Python版本，默认使用python. 如: --py python3 (此配置只对runtime是Python的配置有效)
    --php                    指定要使用的本机中的Php版本，默认使用php. 如: --php php7.2 (此配置只对runtime是Php的配置有效)
```

> 本地调试函数目前支持单函数与多函数的 Node.js, Python, PHP 运行时，其他运行时的支持会在后续陆续推出。

**下一步：开始 Serverless 开发**

- [开始云函数开发](./function-dev)
- [开始应用开发](./components-dev)
