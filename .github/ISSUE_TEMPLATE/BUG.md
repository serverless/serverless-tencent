---
name: '🐛 BUG 反馈'
about: 提交一个可以稳定复现的BUG
---

<!--

* 非常感谢您的问题反馈，为了我们更好的定位问题以及提交修正，请务必提交完整的BUG描述和复现步骤。

* 对于其他 疑问，想法，建议，分享 请到 [Discussion](https://github.com/serverless/serverless-tencent/discussions) 中提交进行讨论。

-->

### BUG 描述:

<!-- 请简单清晰的说明BUG是什么。-->

### 复现步骤:

1. <!-- 执行 '...' -->
2. <!-- 修改 '....' -->
3. <!-- 然后... -->

### 预期结果:

<!-- 预期出现的结果 -->

### 实际结果:

<!-- 实际发生的结果 -->

### 调试信息:

<!-- 如果方便请提供项出现问题的目地址 -->

<details>
<summary>环境版本</summary>

```yaml
- requestId: ... # 如果在异常信息中显示请提供
- traceId: ... # 如果在异常信息中显示请提供
- 操作系统(OS): ... # 如: MacOS 11.2.3
- Node 版本: ... # 如: 12.20.1
# 使用 "serverless --version" 查看serverless版本信息
- Components 版本: ... # 如: 3.7.2
- Framework 版本: ... # 如: 2.28.7
- SDK 版本: ... # 如: 2.3.2
```

</details>

---

<details>
<summary>serverless.yml 配置</summary>

```yaml
# 在这里填写完整的serverless.yml配置信息
```

</details>

---

<details>
<summary>DEBUG 输出</summary>

```yml
# 添加环境变量 SLS_DEBUG=* 并重新执行命令，然后复制命令以及控制台输出粘贴在这里。
```

</details>

### 额外信息

<!-- 添加有助于定位问题的额外信息 -->
