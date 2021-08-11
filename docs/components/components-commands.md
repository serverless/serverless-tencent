---
title: "组件 CLI 命令"
menuText: "组件 CLI 命令"
layout: Doc
---

# 组件 CLI 命令

Serverless Components CLI 支持以下功能命令：

- 需要在 Serverless Components 项目目录中执行
- 也可以通过输入 `“serverless --help-compoents`，查看组件帮助指令。

> 组件命令需要在组件应用目录内执行，

### init 创建组件应用

通过模板初始化新应用

```sh
# 通过express-starter模版初始 Express 组件应用
$ sls init express-starter

# 通过express-starter模版初始 Express 组件应用并指定目录名称
$ sls init express-starter --name my-express-app
```

#### 命令选项

- `{name}` [必填]模板名称
- `--name` 指定应用目录名称。

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

- `--target` 指定要部署的组件实例路径
- `--inputs` 覆写 inputs 配置
- `--profile` 使用指定身份的全局授权信息
- `--login` 使用临时授权
- `--debug` 显示 debug 信息

### info 查看应用信息

获取应用详情

```sh
# 查看组件应用的信息
$ sls info
```

#### 命令选项

- `--profile` 使用指定身份的全局授权信息

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

- `--profile` 使用指定身份的全局授权信息

### logs 查看日志

查看应用日志

```sh
# 查看当前组建的日志
$ serverless logs

# 启动监听模式查看当前组建的日志并每5秒刷新一次
$ serverless logs --tail --interval 5000
```

#### 命令选项

- `--startTime` 指定开始时间，如：3h, 20130208T080910，默认 10m

- `--tail` 或 `-t` 启动监听模式

- `--intervial` 或 `-i` 监听模式的刷新时间 默认：2000ms

- `--stage` 或 `-s` 指定环境名称，默认使用配置环境

- `--region` 或 `-r` 指定地区名称，默认使用配置地区

  > 需要升级 Serverless CLI 为 3.10.0 以上版本

### remove 移除组件应用

移除应用

```sh
# 删除组件应用实例
$ sls remove

# 删除指定目录下的组件应用实例
$ sls remove --target ./src
```

#### 命令选项

- `--target` 指定要部署的组件实例路径
- `--profile` 使用指定身份的全局授权信息
- `--debug` 显示 debug 信息

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

- credentials 管理全局授权信息
- credentials set 存储用户授权信息
  - `--secretId` 或 `-i` [必填]腾讯云 CAM 账号 secretId
  - `--secretKey` 或 `-k` [必填]腾讯云 CAM 账号 secretKey
  - `--profile {name}` 或 `-n {name}` 身份名称. 默认为 "default"
  - `--overwrite` 或 `-o` 覆写已有身份名称授权信息
- credentials remove 删除用户授权信息
  - `--profile {name}` 或 `-n {name}` 身份名称. 默认为 "default"
- credentials list 查看已有用户授权信息

### registry 组件注册中心

查看在应用中心发布的组件模板信息

```sh
# 查看全部组件模板信息
$ sls registry

# 查看指定组件模板信息
$ sls registry express-starter
```

#### 命令选项

- `{name}` 模板名称
