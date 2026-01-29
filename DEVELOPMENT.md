# 🛠️ 开发文档

## 📚 代码架构详解

### 核心类：DialogAssistant

位置：`extension.js`

#### 主要职责
1. **HTTP 服务管理** - 启动和维护本地 HTTP 服务器
2. **弹窗交互** - 显示 Webview 弹窗并处理用户响应
3. **规则注入** - 自动创建和更新 `.windsurfrules` 文件
4. **历史记录** - 保存和管理对话历史
5. **统计功能** - 记录弹窗次数和使用情况

#### 关键方法

##### 1. `_startHttpServer()`
启动 HTTP 本地服务，处理弹窗请求。

**端口分配策略：**
- 根据项目路径哈希生成固定端口（13500-13999）
- 如果端口被占用，自动尝试下一个端口（最多 10 次）
- 每个项目有独立的端口，避免多窗口冲突

**端点说明：**
- `GET /trigger?summary=xxx` - 接收弹窗请求
- `GET /ping` - 健康检查
- `GET /status` - 获取服务状态和统计信息

##### 2. `_collectFeedback(summary, callCount)`
显示弹窗并收集用户反馈。

**返回值：**
```javascript
{
  feedback: string,    // 用户输入的反馈
  action: 'continue' | 'stop',  // 用户选择
  images: Array<string>,  // Base64 图片数据
  files: Array<{name, content}>  // 上传的文件
}
```

**特性：**
- 使用 Promise 等待用户操作
- 支持图片粘贴和上传
- 播放系统提示音
- 显示状态栏提醒

##### 3. `_ensureWindsurfRules()`
自动创建/更新 `.windsurfrules` 文件。

**规则内容：**
- 包含弹窗命令和端口信息
- 强制 AI 在结束前执行弹窗命令
- 定义 AI 的行为规范

##### 4. `_saveInteraction()`
保存对话历史记录。

**存储格式：**
```markdown
# 对话历史记录 - 2026-01-29

## 轮次 1 (14:30:25)
- **AI摘要**: 已完成功能开发
- **用户反馈**: 继续优化性能
- **用户选择**: 继续
```

### 命令行脚本：dialog-trigger.js

#### 工作流程
1. 解析命令行参数（`--port`, `--workspaceKey`, summary）
2. 读取端口信息（优先使用 `--port` 参数）
3. 发送 HTTP GET 请求到 `/trigger` 端点
4. 等待响应（无超时限制）
5. 格式化输出结果

#### 输出格式
```
ACTION: continue
FEEDBACK: 用户的反馈内容
IMAGES: /path/to/image1.png,/path/to/image2.png
```

## 🔧 关键技术点

### 1. 端口管理

**问题：** 多个项目同时打开，如何避免端口冲突？

**解决方案：**
- 使用项目路径的 SHA1 哈希值生成固定端口
- 同一项目始终使用相同端口
- 不同项目使用不同端口

```javascript
_getProjectPort() {
  const pathKey = workspaceFolders[0].uri.fsPath.toLowerCase();
  let hash = 0;
  for (let i = 0; i < pathKey.length; i++) {
    hash = ((hash << 5) - hash) + pathKey.charCodeAt(i);
  }
  return PORT_RANGE_START + (Math.abs(hash) % (PORT_RANGE_END - PORT_RANGE_START + 1));
}
```

### 2. 无超时等待

**问题：** 用户可能需要很长时间才做出选择，如何避免超时？

**解决方案：**
- HTTP 服务器禁用超时：`server.timeout = 0`
- 客户端请求无超时限制：`timeout: 86400000`（24小时）
- 使用 Promise 等待用户操作

### 3. 图片处理

**流程：**
1. 用户在弹窗中粘贴/上传图片
2. 前端将图片转换为 Base64
3. 发送到扩展后端
4. 后端解析 Base64，保存为文件
5. 返回文件路径给 AI

```javascript
// 保存图片
const match = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
if (match) {
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const fileName = `img_${Date.now()}_${i}.${ext}`;
  fs.writeFileSync(filePath, Buffer.from(match[2], 'base64'));
}
```

### 4. 多窗口隔离

**问题：** 多个 Windsurf 窗口打开不同项目，如何确保弹窗路由正确？

**解决方案：**
- 每个项目生成唯一的 `workspaceKey`（路径哈希）
- 端口信息保存在 `port_{workspaceKey}.json`
- 命令行脚本根据当前目录查找对应的端口文件

## 🎨 UI 设计

### 弹窗界面

**技术栈：**
- HTML + CSS + JavaScript
- VS Code Webview API
- 渐变背景 + 毛玻璃效果

**交互设计：**
- 主操作按钮（继续）使用绿色渐变，视觉突出
- 次要操作按钮（结束）使用红色边框，降低优先级
- 快捷键提示放在底部，不干扰主要操作

**响应式布局：**
- 最大宽度 800px，居中显示
- 摘要区域最大高度 300px，超出滚动
- 图片网格自适应排列

## 📊 数据流图

```
用户 → AI 提出需求
  ↓
AI 开始工作
  ↓
AI 完成任务，调用弹窗命令
  ↓
dialog-trigger.js 读取端口信息
  ↓
发送 HTTP 请求到扩展服务
  ↓
扩展显示 Webview 弹窗
  ↓
用户做出选择（继续/结束）
  ↓
扩展返回响应
  ↓
dialog-trigger.js 输出结果
  ↓
AI 读取输出，继续或结束
```

## 🔍 调试技巧

### 1. 查看扩展日志
```javascript
// 在代码中添加日志
console.log('[对话助手] 调试信息');
this._output.appendLine('[调试] 详细信息');
```

**查看位置：**
- 输出面板：`Cmd+Shift+U` → 选择「对话助手」
- 开发者工具：`Cmd+Option+I` → Console

### 2. 测试 HTTP 服务
```bash
# 查看端口信息
cat ~/.windsurf-dialog/port_*.json

# 测试 ping 端点
curl http://127.0.0.1:13XXX/ping

# 测试弹窗（会真的弹出窗口）
curl "http://127.0.0.1:13XXX/trigger?summary=测试弹窗"
```

### 3. 调试弹窗 UI
在 Webview 中右键 → "Open Webview Developer Tools"

### 4. 模拟命令行调用
```bash
node ~/.windsurf-dialog/dialog-trigger.js --port 13XXX "测试摘要"
```

## 🚀 性能优化

### 1. 减少文件 I/O
- 统计数据批量保存，避免频繁写入
- 端口信息只在启动时写入一次

### 2. 异步处理
- HTTP 请求处理使用 async/await
- 弹窗显示不阻塞主线程

### 3. 内存管理
- 及时释放 Webview 资源
- 图片保存后清理 Base64 数据

## 🔐 安全考虑

### 1. 本地服务安全
- 只监听 127.0.0.1，不暴露到外网
- 不处理敏感数据
- 端口范围限制在 13500-13999

### 2. 文件路径安全
- 使用 `path.join()` 避免路径注入
- 清理文件名中的特殊字符
- 限制文件保存位置在配置目录

### 3. 输入验证
- 转义 HTML 内容，防止 XSS
- 限制图片大小（由浏览器自动处理）

## 📝 代码规范

### 命名约定
- 私有方法：`_methodName()`
- 配置变量：`this._configName`
- 常量：`UPPER_SNAKE_CASE`

### 注释规范
```javascript
/**
 * 方法描述
 * 
 * @param {string} param1 - 参数说明
 * @returns {Promise<Object>} 返回值说明
 */
async _methodName(param1) {
  // 实现逻辑
}
```

### 错误处理
```javascript
try {
  // 可能出错的代码
} catch (e) {
  console.error('[对话助手] 错误描述:', e);
  this._output.appendLine('[错误] 详细信息');
  // 优雅降级，不影响其他功能
}
```

## 🧪 测试清单

### 功能测试
- [ ] 扩展激活成功
- [ ] HTTP 服务启动
- [ ] 规则文件自动创建
- [ ] 弹窗正常显示
- [ ] 继续按钮功能正常
- [ ] 结束按钮功能正常
- [ ] 图片上传功能
- [ ] 历史记录保存
- [ ] 统计数据更新

### 兼容性测试
- [ ] macOS
- [ ] Windows
- [ ] Linux
- [ ] 多项目同时打开
- [ ] 端口冲突处理

### 边界测试
- [ ] 超长摘要文本
- [ ] 大量图片上传
- [ ] 快速连续弹窗
- [ ] 网络异常处理

## 🔄 版本更新流程

1. **修改代码**
2. **更新版本号**（`package.json` 中的 `version`）
3. **更新 CHANGELOG**（记录变更）
4. **测试功能**
5. **打包扩展**（`vsce package`）
6. **发布/分享**

---

**Happy Coding!** 🎉
