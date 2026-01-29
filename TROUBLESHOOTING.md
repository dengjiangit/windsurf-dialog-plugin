# 🔧 故障排查指南

## 问题：弹窗不出现

### 症状
AI 结束回复时没有弹出确认窗口

### 排查步骤

#### 1. 检查扩展是否安装
```bash
# 在 Windsurf 中
# Cmd+Shift+X → 搜索 "🐮🐎助手"
```

#### 2. 检查扩展是否激活
打开输出面板（`Cmd+Shift+U`），选择「对话助手」或「🐮🐎助手」，应该看到：
```
[🐮🐎助手] 扩展正在激活...
[🐮🐎助手] 初始化...
[HTTP] Server started on port 13XXX
[对话助手] 规则文件已更新
[🐮🐎助手] 扩展激活完成
```

如果没有看到这些日志，说明扩展没有正确激活。

#### 3. 检查端口是否监听
```bash
# 查看规则文件中的端口
cat .windsurfrules | grep "port"

# 检查端口是否在监听（假设端口是 13883）
lsof -i :13883
```

如果端口没有监听，说明 HTTP 服务没有启动。

#### 4. 重新加载窗口
```bash
# 在 Windsurf 中
# Cmd+Shift+P → 输入 "Reload Window"
```

#### 5. 完全重启 Windsurf
1. 完全退出 Windsurf（Cmd+Q）
2. 重新打开 Windsurf
3. 打开项目
4. 检查输出日志

#### 6. 重新安装扩展
```bash
# 1. 卸载旧版本
# 在扩展面板中右键 → 卸载

# 2. 清理配置（可选）
rm -rf ~/.windsurf-dialog

# 3. 安装最新版本
# 拖拽 niuma-assistant-1.0.3.vsix 到 Windsurf

# 4. 重启 Windsurf
```

## 常见问题

### Q: 输出日志中显示端口冲突
**A:** 扩展会自动尝试下一个端口，这是正常的。

### Q: 规则文件没有生成
**A:** 
1. 确保扩展已激活
2. 手动重新加载窗口
3. 检查项目根目录权限

### Q: 连接被拒绝 (ECONNREFUSED)
**A:** 
1. HTTP 服务没有启动
2. 端口号不匹配
3. 重新加载窗口或重启 Windsurf

## 调试模式

### 查看详细日志
1. 打开开发者工具：`Cmd+Shift+P` → "Developer: Toggle Developer Tools"
2. 切换到 Console 标签
3. 搜索 "🐮🐎" 或 "对话助手"

### 手动测试弹窗
```bash
# 查看当前端口
cat .windsurfrules | grep "port"

# 手动触发弹窗（替换端口号）
node ~/.windsurf-dialog/dialog-trigger.js --port 13883 "测试弹窗"
```

如果返回 `ACTION: continue` 或 `ACTION: end`，说明服务正常。

## 联系支持

如果以上方法都无法解决问题，请提供：
1. Windsurf 版本
2. 扩展版本
3. 输出日志截图
4. 开发者工具 Console 截图
