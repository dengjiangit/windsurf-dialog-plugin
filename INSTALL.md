# 📦 安装和打包指南

## 🚀 快速安装

### 方式一：直接安装（推荐）

1. **下载或打包扩展**
   ```bash
   cd /Users/a0000/work/projects/windsurf-dialog-plugin
   npm install -g vsce
   vsce package
   ```
   
   这会生成 `windsurf-dialog-assistant-1.0.0.vsix` 文件

2. **在 Windsurf 中安装**
   - 打开 Windsurf
   - 按 `Cmd+Shift+P` 打开命令面板
   - 输入 "Install from VSIX"
   - 选择生成的 `.vsix` 文件
   - 重启 Windsurf

### 方式二：开发模式（用于调试）

1. **复制到扩展目录**
   ```bash
   # Windsurf 扩展目录（可能需要根据实际情况调整）
   cp -r /Users/a0000/work/projects/windsurf-dialog-plugin \
         ~/.vscode/extensions/windsurf-dialog-assistant-1.0.0
   ```

2. **重启 Windsurf**
   - 完全退出 Windsurf
   - 重新打开

## 📋 安装前准备

### 1. 安装 Node.js
确保已安装 Node.js (v14 或更高版本)：
```bash
node --version
npm --version
```

### 2. 安装 vsce 打包工具
```bash
npm install -g vsce
```

## 🔧 打包详细步骤

### 1. 进入项目目录
```bash
cd /Users/a0000/work/projects/windsurf-dialog-plugin
```

### 2. 安装依赖（可选）
```bash
npm install
```

### 3. 打包扩展
```bash
vsce package
```

**输出示例：**
```
Executing prepublish script 'npm run vscode:prepublish'...
DONE  Packaged: /Users/a0000/work/projects/windsurf-dialog-plugin/windsurf-dialog-assistant-1.0.0.vsix (XX files, XX KB)
```

### 4. 验证打包文件
```bash
ls -lh *.vsix
```

## 🎯 安装后验证

### 1. 检查扩展是否激活
- 打开 Windsurf
- 查看左侧活动栏是否有「对话助手」图标
- 打开输出面板（`Cmd+Shift+U`）
- 选择「对话助手」通道
- 应该看到类似日志：
  ```
  [对话助手] 初始化...
  [HTTP] Server started on port 13XXX
  [对话助手] 规则文件已更新
  ```

### 2. 检查规则文件
在任意项目根目录下，应该自动生成 `.windsurfrules` 文件：
```bash
cat .windsurfrules
```

应该包含弹窗命令：
```
node "/Users/你的用户名/.windsurf-dialog/dialog-trigger.js" --port 13XXX "AI想要结束的原因摘要"
```

### 3. 测试弹窗功能
- 向 AI 提出一个简单需求
- AI 完成后应该自动弹出确认窗口
- 测试「继续」和「结束」按钮

## 🔍 故障排查

### 问题：打包失败

**错误：`vsce: command not found`**
```bash
# 解决方案：安装 vsce
npm install -g vsce
```

**错误：`Missing publisher name`**
```bash
# 解决方案：在 package.json 中添加 publisher
# 已经包含在项目中，无需修改
```

### 问题：安装后扩展未激活

**解决方案 1：检查扩展列表**
- 打开扩展面板（`Cmd+Shift+X`）
- 搜索 "windsurf-dialog"
- 确认扩展已启用

**解决方案 2：查看开发者工具**
- 打开命令面板（`Cmd+Shift+P`）
- 输入 "Developer: Toggle Developer Tools"
- 查看 Console 中的错误信息

**解决方案 3：重新安装**
```bash
# 1. 卸载扩展
# 在扩展面板中右键点击扩展 → 卸载

# 2. 删除配置目录
rm -rf ~/.windsurf-dialog

# 3. 重新安装
# 按照安装步骤重新操作
```

### 问题：端口冲突

**现象：**输出面板显示 "端口被占用"

**解决方案：**
扩展会自动尝试下一个端口（最多 10 次），通常无需手动处理。
如果仍然失败，检查端口占用：
```bash
# macOS/Linux
lsof -i :13500-13999

# 关闭占用端口的进程
kill -9 <PID>
```

## 📁 文件位置说明

### 扩展文件
```
~/.vscode/extensions/windsurf-dialog-assistant-1.0.0/
├── extension.js
├── dialog-trigger.js
├── package.json
└── ...
```

### 配置和数据文件
```
~/.windsurf-dialog/
├── dialog-trigger.js      # 触发脚本（从扩展复制）
├── stats.json            # 统计数据
├── port_*.json           # 端口信息
├── images/               # 上传的图片
└── history/              # 历史记录
```

### 项目规则文件
```
{你的项目根目录}/.windsurfrules
```

## 🔄 更新扩展

### 1. 卸载旧版本
在扩展面板中卸载旧版本

### 2. 安装新版本
按照安装步骤安装新的 `.vsix` 文件

### 3. 重启 Windsurf
完全退出并重新打开

## 🎨 自定义配置

### 修改端口范围
在 Windsurf 设置中：
```json
{
  "windsurfDialog.portRange": {
    "start": 14000,
    "end": 14999
  }
}
```

### 禁用历史记录
```json
{
  "windsurfDialog.historyEnabled": false
}
```

## 📤 分享扩展

### 1. 打包扩展
```bash
vsce package
```

### 2. 分享 .vsix 文件
将生成的 `.vsix` 文件发送给其他用户

### 3. 接收方安装
- 打开 Windsurf
- `Cmd+Shift+P` → "Install from VSIX"
- 选择 `.vsix` 文件

## 🛠️ 开发者模式

### 启动调试
1. 在 VS Code/Windsurf 中打开项目
2. 按 `F5` 启动扩展开发主机
3. 在新窗口中测试扩展
4. 修改代码后按 `Cmd+R` 重新加载

### 查看日志
- 输出面板：`Cmd+Shift+U` → 选择「对话助手」
- 开发者工具：`Cmd+Shift+P` → "Developer: Toggle Developer Tools"

---

**安装完成后，享受持续的 AI 对话体验！** 🚀
