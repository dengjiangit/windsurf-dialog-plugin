# 💬 Windsurf 对话助手 - AI 持久输出扩展

> **开源免费版** | 让 AI 不再中途停止，持续完成你的任务

## 🎯 核心功能

### ✅ 自动弹窗确认
- AI 每次想结束对话时，自动弹出确认窗口
- 你可以选择「继续」或「结束」
- 支持输入新的指令和反馈

### 📸 图片上传支持
- **Ctrl+V** 粘贴图片
- **Ctrl+U** 上传文件
- 支持多张图片同时上传
- AI 可以直接读取图片内容

### 📚 历史记录
- 自动保存每次对话的上下文
- 按项目分类存储
- 可以快速加载历史记录继续工作

### 📊 统计功能
- 显示累计弹窗次数
- 统计本次会话交互次数
- 了解对话助手为你节省的时间

## 🚀 快速开始

### 1. 安装扩展

#### 方式一：从 .vsix 文件安装
```bash
# 在项目目录下打包
npm install -g vsce
vsce package

# 在 Windsurf 中安装
# 打开命令面板 (Cmd+Shift+P)
# 输入 "Install from VSIX"
# 选择生成的 .vsix 文件
```

#### 方式二：开发模式运行
```bash
# 1. 复制项目到 Windsurf 扩展目录
cp -r windsurf-dialog-plugin ~/.vscode/extensions/

# 2. 重启 Windsurf
```

### 2. 使用扩展

安装后，扩展会自动：
1. ✅ 在项目根目录创建 `.windsurfrules` 文件
2. ✅ 启动 HTTP 本地服务（端口 13500-13999）
3. ✅ 配置 AI 在结束前自动调用弹窗命令

**你不需要做任何配置！** 直接开始使用 AI 即可。

### 3. 工作流程

```
1. 你向 AI 提出需求
   ↓
2. AI 开始工作
   ↓
3. AI 完成任务后，自动弹出确认窗口
   ↓
4. 你选择：
   - 「继续」→ 输入新指令，AI 继续工作
   - 「结束」→ 结束对话
```

## 📁 项目结构

```
windsurf-dialog-plugin/
├── package.json           # 扩展配置
├── extension.js           # 核心逻辑（900+ 行）
├── dialog-trigger.js      # 命令行触发脚本
├── icon.svg              # 扩展图标
├── icon.png              # 扩展图标（PNG）
├── README.md             # 说明文档
└── .vscodeignore         # 打包忽略文件
```

## 🔧 技术架构

### 核心机制

1. **HTTP 本地服务**
   - 每个项目根据路径哈希生成固定端口（13500-13999）
   - 接收来自 AI 的弹窗请求
   - 返回用户的反馈和选择

2. **自动规则注入**
   - 扩展启动时自动创建 `.windsurfrules`
   - 包含弹窗命令和端口信息
   - AI 会自动遵守这些规则

3. **端口管理**
   - 端口信息保存在 `~/.windsurf-dialog/port_*.json`
   - 支持多项目同时运行
   - 自动处理端口冲突

4. **弹窗实现**
   - 使用 VS Code Webview API
   - 自定义 HTML/CSS/JS UI
   - 支持图片上传和历史记录

## ⚙️ 配置选项

在 Windsurf 设置中搜索 `windsurfDialog`：

```json
{
  // 是否启用历史记录功能
  "windsurfDialog.historyEnabled": true,
  
  // HTTP 服务端口范围
  "windsurfDialog.portRange": {
    "start": 13500,
    "end": 13999
  }
}
```

## 📂 数据存储位置

所有数据存储在 `~/.windsurf-dialog/` 目录：

```
~/.windsurf-dialog/
├── dialog-trigger.js      # 触发脚本
├── stats.json            # 统计数据
├── port_*.json           # 端口信息
├── images/               # 上传的图片
└── history/              # 历史记录
    └── {项目名}/
        ├── 2026-01-29.md
        └── 2026-01-30.md
```

## 🎨 快捷键

在弹窗中可用的快捷键：

- **Ctrl+Enter** - 继续对话
- **Ctrl+U** - 上传文件
- **Ctrl+V** - 粘贴图片
- **Esc** - 结束对话

## 🔍 故障排查

### 问题：AI 没有自动弹窗

**解决方案：**
1. 检查 `.windsurfrules` 文件是否存在
2. 查看 Windsurf 输出面板中的「对话助手」日志
3. 确认 HTTP 服务是否启动（查看端口信息）
4. 重新加载 Windsurf 窗口

### 问题：端口冲突

**解决方案：**
1. 扩展会自动尝试下一个端口（最多尝试 10 次）
2. 如果仍然失败，修改配置中的端口范围
3. 检查是否有其他程序占用端口

### 问题：历史记录未保存

**解决方案：**
1. 检查配置 `windsurfDialog.historyEnabled` 是否为 `true`
2. 确认 `~/.windsurf-dialog/history/` 目录权限
3. 查看输出面板中的错误信息

## 🆚 与牛马插件的区别

| 特性 | 牛马插件 | Windsurf 对话助手 |
|------|---------|------------------|
| 开源 | ❌ 闭源 | ✅ 开源 MIT |
| 收费 | ✅ CDK 激活 | ❌ 完全免费 |
| 代码质量 | 混淆 | 清晰注释 |
| 自定义 | 受限 | 完全可定制 |
| 社区支持 | 无 | 欢迎贡献 |

## 🛠️ 开发指南

### 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/dengjiangit/windsurf-dialog-plugin
cd windsurf-dialog-plugin

# 2. 安装依赖
npm install

# 3. 在 Windsurf 中打开项目
# 按 F5 启动调试

# 4. 修改代码后重新加载
# 在调试窗口中按 Cmd+R
```

### 打包发布

```bash
# 安装打包工具
npm install -g vsce

# 打包扩展
vsce package

# 生成 windsurf-dialog-assistant-1.0.0.vsix
```

### 代码结构

- **`extension.js`** - 核心逻辑
  - `DialogAssistant` 类：主要功能实现
  - `activate()` 函数：扩展激活入口
  - `deactivate()` 函数：扩展停用清理

- **`dialog-trigger.js`** - 命令行脚本
  - 读取端口信息
  - 发送 HTTP 请求
  - 格式化输出结果

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发规范

1. 代码风格：遵循 JavaScript Standard Style
2. 提交信息：使用语义化提交（Conventional Commits）
3. 测试：确保修改不影响现有功能
4. 文档：更新相关文档

### 功能建议

如果你有好的想法，欢迎：
- 提交 Issue 讨论
- 直接提交 PR
- 在社区中分享

## 📄 许可证

MIT License - 完全开源免费

## 🙏 致谢

- 灵感来源：牛马模式插件
- 基于：VS Code Extension API
- 适配：Windsurf IDE

## 📮 反馈与支持

- **GitHub Issues**: [提交问题或建议](https://github.com/dengjiangit/windsurf-dialog-plugin/issues)
- **GitHub Discussions**: [参与讨论](https://github.com/dengjiangit/windsurf-dialog-plugin/discussions)
- **Star**: 如果这个项目对你有帮助，请给个 ⭐️

---

**享受持续的 AI 对话体验！** 🚀
