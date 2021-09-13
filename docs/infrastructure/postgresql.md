---
title: "Tencent Serverless - PostgreSQL 数据库"
menuText: "PostgreSQL 数据库"
menuOrder: 6
description: PostgreSQL 数据库
layout: Doc
---

# PostgreSQL 数据库

PostgreSQL for Serverless（ServerlessDB）是一款基于 PostgreSQL 数据库实现的按需分配资源的数据库产品，其数据库将根据您的实际请求数来自动分配资源。PostgreSQL for Serverless 仅需创建实例，即可正常使用，您无需关心数据库实例规格，仅需要在数据库处于活动状态期间按照实际用量进行付费，不需要为数据库的闲时进行付费。详情参考 [ServerlessDB](https://cloud.tencent.com/document/product/409/42844) 文档。

通过 PostgreSQL ServerlessDB 组件，您可以快速方便地创建、配置和管理腾讯云的 PostgreSQL 实例。

特性介绍：

- **按需付费** - 按照请求的使用量进行收费，没有请求时无需付费。
- **"0"配置** - 默认配置将由 Serverless 完成。
- **极速部署** - 仅需几秒，创建或更新您的数据库。
- **便捷协作** - 通过云端数据库的状态信息和部署日志，方便的进行多人协作开发。

## 操作步骤

#### 安装

通过 npm 全局安装 [Serverless CLI](https://github.com/serverless/serverless)：

```shell
$ npm install -g serverless
```

#### 账号配置

本地创建`.env`文件：

```bash
$ touch .env # 腾讯云的配置信息
```

在`.env`文件中配置腾讯云的 SecretId 和 SecretKey 信息并保存：

```text
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```

> ?

- 如果没有腾讯云账号，请先 [注册新账号](https://cloud.tencent.com/register)。
- 如果已有腾讯云账号，可以在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取 SecretId 和 SecretKey。

#### 配置

创建并进入一个全新目录：

```
$ mkdir tencent-postgreSQL && cd tencent-postgreSQL
```

在新目录创建`serverless.yml`文件：

```shell
$ touch serverless.yml
```

在`serverless.yml`中进行如下配置：

```yml
# serverless.yml
component: postgresql #(必填) 引用 component 的名称，当前用到的是 postgresql 组件
name: serverlessDB # (必填) 该 postgresql 组件创建的实例名称
org: test # (可选) 用于记录组织信息，默认值为您的腾讯云账户 appid
app: serverlessDB # (可选) 该 sql 应用名称
stage: dev # (可选) 用于区分环境信息，默认值是 dev

inputs:
  region: ap-guangzhou # 可选 ap-guangzhou, ap-shanghai, ap-beijing
  zone: ap-guangzhou-2 # 可选 ap-guangzhou-2, ap-shanghai-2, ap-beijing-3
  dBInstanceName: serverlessDB
  vpcConfig:
    vpcId: vpc-xxxxxxx
    subnetId: subnet-xxxxxx
  extranetAccess: false
```

PostgreSQL 组件支持 0 配置部署，您可以直接通过配置文件中的默认值进行部署。您依然可以修改更多可选配置来进一步开发该项目。

[查看详细配置文档 >>](#1)

> !当前 PGSQL for Serverless 仅支持**北京三区**，**广州二区**，**上海二区**三个地域的创建和部署，因此在填写 yaml 中的地域可用区时需要注意填写为正确的地域和对应的 VPC 子网信息。

#### 部署

如您的账号未 [登录](https://cloud.tencent.com/login) 或 [注册](https://cloud.tencent.com/register) 腾讯云，您可以直接通过**微信**扫描命令行中的二维码进行授权登录和注册。

通过`sls`命令进行部署，并可以添加`--debug`参数查看部署过程中的信息：

> ?`sls`是`serverless`命令的简写。

```bash
$ sls deploy
```

#### 移除

通过以下命令移除部署的 DB 实例：

```bash
$ sls remove
```

<span id="1"></span>

## 全量配置

- [全量 yml](#1-1)
- [主要参数说明](#1-2)

<span id="1-1"></span>

```yml
# serverless.yml
component: postgresql # (必填) 组件名称，此处为 postgresql
name: serverlessDB # (必填) 实例名称
org: test # (可选) 用于记录组织信息，默认值为您的腾讯云账户 appid
app: serverlessDB # (可选) 该应用名称
stage: dev # (可选) 用于区分环境信息，默认值为 dev

inputs:
  region: ap-guangzhou # 可选 ap-guangzhou, ap-shanghai, ap-beijing
  zone: ap-guangzhou-2 # 可选 ap-guangzhou-2, ap-shanghai-2, ap-beijing-3
  dBInstanceName: serverlessDB
  projectId: 0
  dBVersion: 10.4
  dBCharset: UTF8
  vpcConfig:
    vpcId: vpc-123
    subnetId: subnet-123
  extranetAccess: false
```

<span id="1-1"></span>

### 主要参数说明

| 参数               | 必填/可选 | 类型    | 默认值  | 描述                               |
| ------------------ | --------- | ------- | ------- | ---------------------------------- |
| region             | 必填      | String  |         | 数据库的所属地区                   |
| zone               | 必填      | String  |         | 数据库所在地区的区域               |
| dBInstanceName     | 必填      | String  |         | 数据库实例名称，对一用户必须唯一   |
| dBVersion          | 可选      | string  | `10.4`  | PostgreSQL 版本号，目前支持: 10.4  |
| dBCharset          | 可选      | String  | `UTF8`  | 数据库的字符集编码                 |
| projectId          | 可选      | Integer | `0`     | 项目的 ID                          |
| vpcConfig.vpcId    | 必填      | String  |         | VPC 的 ID                          |
| vpcConfig.subnetId | 可选      | String  |         | Subnet 的 ID                       |
| extranetAccess     | 可选      | Boolean | `false` | 是否开启 serverlessDB 实例外网访问 |

## 使用示例

1. **配置环境变量**
2. **配置私有网络：** 通过 Serverless Framework VPC 组件 创建 VPC 和 子网，支持云函数和数据库的网络打通和使用。
3. **配置 Serverless DB：** 通过 Serverless Framework Cynosdb 组件 创建 MySQL 实例，为云函数项目提供数据库服务。
4. **编写业务代码：** 通过 Serverless DB SDK 调用数据库，云函数支持直接调用 Serverless DB SDK，连接 PostgreSQL 数据库进行管理操作。
5. **部署应用：** 通过 Serverless Framework 部署项目至云端，并通过云函数控制台进行测试。
6. **移除项目：** 可通过 Serverless Framework 移除项目。

### 1. 配置环境变量

1.1 在本地建立目录，用于存放代码及依赖模块。本文以 `test-MySQL` 文件夹为例。

```
mkdir test-MySQL && cd test-MySQL
```

1.2 由于目前 TDSQL-C Serverless 只支持 `ap-beijing-3`，`ap-guangzhou-4`，`ap-shanghai-2` 和 `ap-nanjing-1` 四个区域，所以这里还需要配置下，只需要在项目根目录下创建 `.env` 文件，然后配置 `REGION` 和 `ZONE` 两个环境变量：

```text
# .env
REGION=xxx
ZONE=xxx
```

### 2. 配置私有网络

2.1 在 `test-MySQL` 目录下创建文件夹 `VPC`。

```
mkdir VPC && cd VPC
```

2.2 在 `VPC` 中新建 serverless.yml 文件，使用[ VPC 组件](https://github.com/serverless-components/tencent-vpc)完成私有网络和子网的创建。

`serverless.yml` 示例内容如下，全量配置参考[产品文档](https://github.com/serverless-components/tencent-vpc/blob/master/docs/configure.md)

```yml
#serverless.yml
org: mysql-app
app: mysql-app
stage: dev
component: vpc # (required) name of the component. In that case, it's vpc.
name: mysql-app-vpc # (required) name of your vpc component instance.
inputs:
  region: ${env:REGION}
  zone: ${env:ZONE}
  vpcName: serverless-mysql
  subnetName: serverless-mysql
```

### 3. 配置 Serverless DB：

3.1 在 `test-MySQL` 下创建文件夹 `DB`。

3.2 在 `DB` 文件夹下新建 `serverless.yml` 文件，并输入以下内容，通过 Serverless Framework 组件完成云开发环境配置。

`serverless.yml` 示例内容如下，全量配置参考[产品文档](https://github.com/serverless-components/tencent-cynosdb/blob/master/docs/configure.md)

```yml
# serverless.yml
org: mysql-app
app: mysql-app
stage: dev
component: cynosdb
name: mysql-app-db
inputs:
  region: ${env:REGION}
  zone: ${env:ZONE}
  vpcConfig:
    vpcId: ${output:${stage}:${app}:mysql-app-vpc.vpcId}
    subnetId: ${output:${stage}:${app}:mysql-app-vpc.subnetId}
```

### 4. 编写业务代码与配置文件

4.1 在 `test-MySQL` 下创建文件夹 `src`，用于存放业务逻辑代码和相关依赖项。

4.2 在 `src` 文件夹下创建文件 `index.js`，并输入如下示例代码。在函数中通过 SDK 连接数据库，并在其中完成 MySQL 数据库的调用。

```js
exports.main_handler = async (event, context, callback) => {
  var mysql = require("mysql2");
  var connection = mysql.createConnection({
    host: process.env.HOST,
    user: "root",
    password: process.env.PASSWORD,
  });
  connection.connect();
  connection.query(
    "SELECT 1 + 1 AS solution",
    function (error, results, fields) {
      if (error) throw error;
      console.log("The solution is: ", results[0].solution);
    }
  );
  connection.end();
};
```

4.3 安装所需依赖模块

```
npm install mysql2
```

4.4 完成业务代码编写和依赖安装后，创建 `serverless.yml` 文件，示例文件如下：

```yml
org: mysql-app
app: mysql-app
stage: dev
component: scf
name: mysql-app-scf

inputs:
  src: ./
  functionName: ${name}
  region: ${env:REGION}
  runtime: Nodejs10.15
  timeout: 30
  vpcConfig:
    vpcId: ${output:${stage}:${app}:mysql-app-vpc.vpcId}
    subnetId: ${output:${stage}:${app}:mysql-app-vpc.subnetId}
  environment:
    variables:
      HOST: ${output:${stage}:${app}:mysql-app-db.connection.ip}
      PASSWORD: ${output:${stage}:${app}:mysql-app-db.adminPassword}
```

### 5. 快速部署

完成创建后，项目目录结构如下：

```
   ./test-MySQL
   ├── vpc
   │   └── serverless.yml # vpc 配置文件
   ├── db
   │   └── serverless.yml # db 配置文件
   ├── src
   │   ├── serverless.yml # scf 组件配置文件
   │   ├── node_modules # 项目依赖文件
   │   └── index.js # 入口函数
   └── .env # 环境变量文件
```

5.1 使用命令行在 `test-MySQL` 下，执行以下命令进行部署。

```bash
sls deploy
```

> - 部署时需要扫码授权，如果没有腾讯云账号，请 [注册新账号](https://cloud.tencent.com/register)。
> - 如果是子账号，请参考[子账号权限配置](https://cloud.tencent.com/document/product/1154/43006#.E5.AD.90.E8.B4.A6.E5.8F.B7.E6.9D.83.E9.99.90.E9.85.8D.E7.BD.AE)完成授权

返回结果如下所示，即为部署成功。

```
mysql-app-vpc:
  region:        xxx
  zone:          xxx
  vpcId:         xxxx-xxx
  ...

mysql-app-db:
  dbMode:        xxxx
  region:        xxxx
  zone:          xxxx
  ...

mysql-app-scf:
  functionName:  xxxx
  description:   xxx
  ...

59s › test-MySQL › "deploy" ran for 3 apps successfully.

```

2. 部署成功后，您可通过 [云函数控制台](https://console.cloud.tencent.com/scf/index?rid=1)，查看并进行函数调试，测试成功如下图所示：
   ![](https://main.qcloudimg.com/raw/f55346a48e68f78771fb746b58b3c1a0.png)

### 移除项目

在 `test-MySQL` 目录下，执行以下命令可移除项目。

```
sls remove
```

返回如下结果，即为成功移除。

```
serverless ⚡ framework
4s › test-MySQL › Success
```

### 示例代码

其他语言接入数据库的示例代码如下：

#### Python

Python 可使用云函数环境已经内置的 **pymysql** 依赖包进行数据库连接。示例代码如下：

```python
# -*- coding: utf8 -*-
from os import getenv

import pymysql
from pymysql.err import OperationalError

mysql_conn = None

def __get_cursor():
    try:
        return mysql_conn.cursor()
    except OperationalError:
        mysql_conn.ping(reconnect=True)
        return mysql_conn.cursor()

def main_handler(event, context):
    global mysql_conn
    if not mysql_conn:
        mysql_conn = pymysql.connect(
        host        = getenv('DB_HOST', '<YOUR DB HOST>'),
        user        = getenv('DB_USER','<YOUR DB USER>'),
        password    = getenv('DB_PASSWORD','<YOUR DB PASSWORD>'),
        db          = getenv('DB_DATABASE','<YOUR DB DATABASE>'),
        port        = int(getenv('DB_PORT','<YOUR DB PORT>')),
        charset     = 'utf8mb4',
        autocommit  = True
        )

    with __get_cursor() as cursor:
        cursor.execute('select * from employee')
        myresult = cursor.fetchall()
        print(myresult)
        for x in myresult:
            print(x)
```

#### Node.js

Node.js 支持使用连接池进行连接，连接池具备自动重连功能，可有效避免因云函数底层或者数据库释放连接造成的连接不可用情况。示例代码如下：

> ?使用连接池前需先安装 **mysql2** 依赖包，详情请参见 [依赖安装](https://cloud.tencent.com/document/product/583/39780)。

```nodejs
'use strict';

const DB_HOST       = process.env[`DB_HOST`]
const DB_PORT       = process.env[`DB_PORT`]
const DB_DATABASE   = process.env[`DB_DATABASE`]
const DB_USER       = process.env[`DB_USER`]
const DB_PASSWORD   = process.env[`DB_PASSWORD`]

const promisePool = require('mysql2').createPool({
  host              : DB_HOST,
  user              : DB_USER,
  port              : DB_PORT,
  password          : DB_PASSWORD,
  database          : DB_DATABASE,
  connectionLimit   : 1
}).promise();

exports.main_handler = async (event, context, callback) => {
  let result = await promisePool.query('select * from employee');
  console.log(result);
}
```

#### PHP

PHP 可使用 **pdo_mysql** 或 **mysqli** 依赖包进行数据连接。示例代码如下：

```php
<?php
function handler($event, $context) {
try{
  $pdo = new PDO('mysql:host= getenv("DB_HOST");dbname= getenv("DB_DATABASE"),getenv("DB_USER"),getenv("DB_PASSWORD")');
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch(PDOException $e){
  echo '数据库连接失败: '.$e->getMessage();
  exit;
}
}
```

```php
<?php
function main_handler($event, $context) {
     $host = "";
    $username = "";
    $password = "";

    // 创建连接
    $conn = mysqli_connect($servername, $username, $password);

    // 检测连接
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
        }
    echo "连接成功";

    mysqli_close($conn);
    echo "断开连接";
}
?>
```

#### JAVA

1. 请参考 [依赖安装](https://cloud.tencent.com/document/product/583/39780#java-.E8.BF.90.E8.A1.8C.E6.97.B6)，安装以下依赖。

```xml
<dependencies>
    <dependency>
        <groupId>com.tencentcloudapi</groupId>
        <artifactId>scf-java-events</artifactId>
        <version>0.0.2</version>
    </dependency>
    <dependency>
        <groupId>com.zaxxer</groupId>
        <artifactId>HikariCP</artifactId>
        <version>3.2.0</version>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.11</version>
    </dependency>
</dependencies>
```

2. 使用 Hikari 连接池进行连接，示例代码如下：

```java
package example;

import com.qcloud.scf.runtime.Context;
import com.qcloud.services.scf.runtime.events.APIGatewayProxyRequestEvent;
import com.qcloud.services.scf.runtime.events.APIGatewayProxyResponseEvent;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public class Http {
    private DataSource dataSource;

    public Http() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://" + System.getenv("DB_HOST") + ":"+ System.getenv("DB_PORT") + "/" + System.getenv("DB_DATABASE"));
        config.setUsername(System.getenv("DB_USER"));
        config.setPassword(System.getenv("DB_PASSWORD"));
        config.setDriverClassName("com.mysql.jdbc.Driver");
        config.setMaximumPoolSize(1);
        dataSource = new HikariDataSource(config);
    }

    public String mainHandler(APIGatewayProxyRequestEvent requestEvent, Context context) {
        System.out.println("start main handler");
        System.out.println("requestEvent: " + requestEvent);
        System.out.println("context: " + context);

        try (Connection conn = dataSource.getConnection(); PreparedStatement ps = conn.prepareStatement("SELECT * FROM employee")) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                System.out.println(rs.getInt("id"));
                System.out.println(rs.getString("first_name"));
                System.out.println(rs.getString("last_name"));
                System.out.println(rs.getString("address"));
                System.out.println(rs.getString("city"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        APIGatewayProxyResponseEvent apiGatewayProxyResponseEvent = new APIGatewayProxyResponseEvent();
        apiGatewayProxyResponseEvent.setBody("API GW Test Success");
        apiGatewayProxyResponseEvent.setIsBase64Encoded(false);
        apiGatewayProxyResponseEvent.setStatusCode(200);

        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "text");
        headers.put("Access-Control-Allow-Origin", "*");
        apiGatewayProxyResponseEvent.setHeaders(headers);

        return apiGatewayProxyResponseEvent.toString();
    }
}
```

#### SCF DB SDK for MySQL

为了方便使用，云函数团队将 Node.js 和 Python 连接池相关代码封装为 SCF DB SDK for MySQL，请参考 [依赖安装](https://cloud.tencent.com/document/product/583/39780) 进行安装使用。通过该 SDK，您可以在云函数代码中连接 [MySQL](https://cloud.tencent.com/document/product/236/5147)、[TDSQL-C](https://cloud.tencent.com/document/product/1003/30488) 或 [TDSQL MySQL 版](https://cloud.tencent.com/document/product/557/7700) 数据库，并实现对数据库的插入、查询等操作。

SCF DB SDK for MySQL 具备以下特点：

- 自动从环境变量初始化数据库客户端。
- SDK 会在全局维护一个数据库长连接，并处理连接中断后的重连。
- 云函数团队会持续关注 issue，确保获得连接即可用，不需要关注数据库连接。

**1. Node.js SDK**

```JavaScript
'use strict';
const database = require('scf-nodejs-serverlessdb-sdk').database;

exports.main_handler = async (event, context, callback) => {
  let pool = await database('TESTDB2').pool()
  pool.query('select * from coffee',(err,results)=>{
    console.log('db2 callback query result:',results)
  })
  // no need to release pool

  console.log('db2 query result:',result)
}
```

> ?Node.js SDK 具体使用方法请参考 [SCF DB SDK for MySQL](https://www.npmjs.com/package/scf-nodejs-serverlessdb-sdk)。

**2. Python SDK**

```Python
from serverless_db_sdk import database

def main_handler(event, context):
    print('Start Serverlsess DB SDK function')

    connection = database().connection(autocommit=False)
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM name')
    myresult = cursor.fetchall()

    for x in myresult:
        print(x)
```
