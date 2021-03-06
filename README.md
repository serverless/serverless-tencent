# serverless-tencent

[![serverless](http://public.serverless.com/badges/v3.svg)](http://cn.serverless.com)

<!-- [![Build Status](https://github.com/serverless/serverless/workflows/Integrate/badge.svg)](https://github.com/serverless/serverless/actions?query=workflow%3AIntegrate) -->
<!-- [![npm version](https://badge.fury.io/js/serverless.svg)](https://badge.fury.io/js/serverless) -->
<!-- [![codecov](https://codecov.io/gh/serverless/serverless/branch/master/graph/badge.svg)](https://codecov.io/gh/serverless/serverless) -->
<!-- [![Known Vulnerabilities](https://snyk.io/test/github/serverless/serverless/badge.svg)](https://snyk.io/test/github/serverless/serverless) -->
<!-- [![license](https://img.shields.io/npm/l/serverless.svg)](https://www.npmjs.com/package/serverless) -->

[![Serverless Framework](https://sp-assets-1300963013.file.myqcloud.com/blog/thumbnails/logo-sf-side-dark.png)](https://cn.serverless.com)

<p align="center">
  <a href="https://cn.serverless.com">ð¨ð³ ä¸­æç½ç«</a> â¢
  <a href="https://cn.serverless.com/cn/framework/docs/">ð å¸®å©ææ¡£</a> â¢
  <a href="https://github.com/serverless/serverless-tencent/discussions">ð¬ è®¨è®ºåº</a> â¢
  <a href="https://github.com/serverless/serverless-tencent/issues/new/choose">ð BUGåé¦</a> â¢
  <a href="https://serverless.com/company/jobs/"> ð©âð»ð¨âð» æèèä½</a>
</p>

> æ­¤æä»¶æä¾äº [Serverless](https://cn.serverless.com/) å¨è¾è®¯äºä¸è¿è¡å¼ååè°è¯çç¸å³åè½ï¼å¹¶ä¼åäºä½¿ç¨æµç¨åä½éªã

## ç®å½

- [å¿«éå¼å§](#quickstart)
- [ç¤ºä¾](https://cn.serverless.com/examples)
- [æ¯æçå½ä»¤](#commands)
- [åè½ç¹ç¹](#features)
- [è´¡ç®ä»£ç ](#contribute)

## <a name="quickstart"></a>å¿«éå¼å§

### åç½®æ¡ä»¶

1. Nodejs 12.x åä»¥ä¸çæ¬
2. Serverless CLI `v3.0+`, å¦ææ²¡æå®è£å¯ä»¥ä½¿ç¨ `npm i -g serverless` å½ä»¤å®è£
3. [æ³¨å](https://cloud.tencent.com/register)è¾è®¯äºè´¦å·å¹¶[å¼éç¸å³æé](https://cloud.tencent.com/document/product/1154/43006)

### å®è£ä½¿ç¨

#### ç´æ¥ä½¿ç¨ serverless-tencent CLI

```sh
$ npm i -g serverless-tencent
$ slt init express-starter --name example
$ cd example
$ slt deploy
```

#### Serverless Framework CLI éæä½¿ç¨

```sh
$ npm i -g serverless
$ sls init express-starter --name example
$ cd example
$ sls deploy
```

## <a name="commands"></a>æ¯æçå½ä»¤

- [Init åå»º](/docs/commands/init.md)
- [Deploy é¨ç½²](/docs/commands/deploy.md)
- [Info è¯¦æ](/docs/commands/info.md)
- [Dev è¿ç¨å¼å](/docs/commands/dev.md)
- [Logs æ¥å¿](/docs/commands/logs.md)
- [Remove ç§»é¤](/docs/commands/remove.md)
- [Credentials ææ](/docs/commands/credentials.md)
- [Registry æ³¨åä¸­å¿](/docs/commands/registry.md)
- [Invoke è¿ç¨è°ç¨](/docs/commands/invoke.md)
- [Invoke Local æ¬å°è°ç¨](/docs/commands/invoke-local.md)

## <a name="features"></a>åè½ç¹ç¹

- æ¯æ `Node.js, Python, Java, Go, Php, `, ä¹å¯ä»¥ä½¿ç¨[èªå®ä¹è¿è¡ç¯å¢](https://cloud.tencent.com/document/product/583/47274)
- å¯ä»¥éè¿**serverless-tencent CLI**ç®¡çä½ ç serverless é¡¹ç®çæ´ä¸ªçå½å¨æ:
  - é¨ç½²: `sls deploy`
  - è°ç¨: `sls invoke`
  - æ¬å°è°ç¨: `sls invoke local`, å½åæ¯æ`Node.js, Python, Php` é¡¹ç®
  - æ¥å¿æ¥ç: `sls logs`
  - å®ä¾ä¿¡æ¯æ¥ç: `sls info`
  - å®ä¾å é¤: `sls remove`
  - å®æ¶è°è¯: `sls dev`
- ä¸°å¯ç[å®æ¹ç»ä»¶æ¯æ, ä¸é¢æååºä»ä¸ºä¸é¨å](https://github.com/orgs/serverless-components/repositories?language=&q=tencent&sort=&type=all)
  - [scf](https://github.com/serverless-components/tencent-scf)
  - [http](https://github.com/serverless-components/tencent-http)
  - [multi-scf](https://github.com/serverless-components/tencent-multi-scf)
  - [website](https://github.com/serverless-components/tencent-website)
  - [DiscusQ](https://github.com/serverless-components/tencent-discuzq)
- å¯¹ä¸åç»ä»¶çéç½®æä»¶å­æ®µè¿è¡æ ¡éª, åæ¬*å­æ®µç±»åï¼å­æ®µå¼çèå´ï¼å­æ®µå¯åéå¶ç­*ï¼ä¸ºç¨æ·æä¾æ´åå¥½çå¼åä½éªåéè¯¯ææ¥ã å½åæ¯æå¯¹`scf, multi-scf, http, website`ç»ä»¶çéç½®æä»¶è¿è¡æ ¡éª

## <a name="contribute"></a>è´¡ç®ä»£ç 

_serverless-tencent_ æ¯ä¸ä¸ªåå®¹åå¥½çå¼æºé¡¹ç®ï¼æ¬¢è¿ä¸åçä»£ç è´¡ç®è

### ååæµè¯è¡¥å

1. æä»¬çååæµè¯ä»£ç ä½äº `tests/` ç®å½ä¹ä¸ï¼ä½¿ç¨[jest](https://jestjs.io/) ä½ä¸ºæµè¯å·¥å·ï¼`npm run test` è¿è¡ææçååæµè¯
2. æ¨éè¦ä¸ºä½ æäº¤çåè½ä»£ç è¡¥åå¯¹åºçååæµè¯, å¹¶ä¸ä¸å¯ä»¥ç ´åå·²æçå¶ä»æ¨¡çå¯¹åºçååæµè¯ã è¿æ¯æä»¬ä¿è¯*serverless-tencent* ä»£ç å¥å£®æ§çåºæ¬æ¡ä»¶

### Canary æµè¯çæ¬

æäº¤ä»£ç å° `master` åæ¯ï¼åå¹¶ä¹åä¼èªå¨åå¸é¡¹ç®ç `canary` çæ¬ï¼å¯ä»¥éè¿ `npm i -g serverless-tencent@canary` å®è£æµè¯

### åå¸æ­£å¼çæ¬

1. åè½å®æä¹åï¼éè¦ä¿®æ¹ `package.json/version` å­æ®µä»¥åå¨ `CHANGELOG.md` ä¸­åææ´æ°æ¥å¿
2. æäº¤ä»£ç å° `master`, åå¹¶ä¹åèªå¨åå¸æ­£å¼çæ¬
