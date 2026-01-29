# 🚀 快速开始指南

## 📦 一键打包安装

```bash
# 1. 进入项目目录
cd /Users/a0000/work/projects/windsurf-dialog-plugin

# 2. 执行打包脚本
./package.sh

# 3. 在 Windsurf 中安装
# - 打开 Windsurf
# - 按 Cmd+Shift+P
# - 输入 "Install from VSIX"
# - 选择生成的 .vsix 文件
# - 重启 Windsurf
```

## ✅ 验证安装

安装后，检查以下内容：

### 1. 查看扩展列表
- 打开扩展面板（`Cmd+Shift+X`）
- 搜索 "windsurf-dialog"
- 确认扩展已启用

### 2. 查看输出日志
- 打开输出面板（`Cmd+Shift+U`）
- 选择「对话助手」通道
- 应该看到：
  ```
  [对话助手] 初始化...
  [HTTP] Server started on port 13XXX
  [对话助手] 规则文件已更新
  ```

### 3. 检查规则文件
在任意项目根目录：
```bash
cat .windsurfrules
```

应该包含弹窗命令。

## 🎯 第一次使用

### 1. 打开一个项目
```bash
cd ~/your-project
code .  # 或在 Windsurf 中打开
```

### 2. 向 AI 提出需求
```
请帮我创建一个 Hello World 程序
```

### 3. 等待弹窗
AI 完成任务后会自动弹出确认窗口。

### 4. 选择操作
- **继续** - 输入新指令，AI 继续工作
- **结束** - 结束对话

## 🎨 测试功能

### 测试图片上传
1. 在弹窗中按 `Ctrl+V` 粘贴图片
2. 或按 `Ctrl+U` 选择文件上传
3. 点击「继续」
4. AI 会读取图片内容

### 测试历史记录
1. 完成几次对话
2. 查看历史文件：
   ```bash
   cat ~/.windsurf-dialog/history/{项目名}/$(date +%Y-%m-%d).md
   ```

### 测试统计功能
弹窗底部会显示：
```
💡 对话助手帮你多获得了 X 次交互
```

## 🔧 常见问题

### Q: 弹窗没有出现？
**A:** 检查以下内容：
1. 扩展是否已启用
2. 输出面板是否有错误
3. `.windsurfrules` 文件是否存在
4. 重新加载 Windsurf 窗口

### Q: 端口冲突？
**A:** 扩展会自动尝试下一个端口，通常无需处理。

### Q: 如何卸载？
**A:** 在扩展面板中右键点击扩展 → 卸载

## 📚 更多文档

- **README.md** - 完整功能说明
- **INSTALL.md** - 详细安装指南
- **DEVELOPMENT.md** - 开发者文档
- **PROJECT_SUMMARY.md** - 项目总结

## 🎉 开始使用

现在你可以享受持续的 AI 对话体验了！

**提示：** 每次 AI 想结束时，都会弹出确认窗口，你可以继续提出新的需求。
