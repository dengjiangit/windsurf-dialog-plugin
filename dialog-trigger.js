#!/usr/bin/env node
/**
 * Windsurf 对话助手 - 弹窗触发脚本
 * 跨平台：Windows/Mac/Linux
 * 
 * 用法：node dialog-trigger.js --port 13881 "AI想要结束的原因"
 * 
 * 流程：从端口文件读取HTTP服务端口，发送请求到扩展服务
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const http = require('http');

const configDir = path.join(os.homedir(), '.windsurf-dialog');

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
}

// 解析参数
const portArg = getArgValue('--port');
const workspaceKeyArg = getArgValue('--workspaceKey');

// 过滤掉参数，获取summary
const filteredArgs = process.argv.slice(2).filter((a, i, arr) => {
  if (a === '--port' || a === '--workspaceKey') return false;
  if (i > 0 && (arr[i-1] === '--port' || arr[i-1] === '--workspaceKey')) return false;
  return true;
});
const summary = filteredArgs[0] || 'AI has completed the task.';

// 输出响应（格式化，最重要信息放最前面避免被截断）
function outputResponse(response) {
  const action = response.action || 'unknown';
  const feedback = response.feedback || '';
  
  // 最重要的信息放最前面
  console.log('');
  console.log('ACTION:', action);
  
  if (feedback.trim()) {
    console.log('');
    console.log('FEEDBACK:', feedback);
    console.log('');
  }
  
  if (response.images && response.images.length > 0) {
    console.log('IMAGES:', response.images.join(','));
  }
  if (response.files && response.files.length > 0) {
    console.log('');
    console.log('FILES:');
    for (const file of response.files) {
      console.log(`\n### ${file.name}\n\`\`\`\n${file.content}\n\`\`\``);
    }
  }
}

// HTTP模式：直接请求扩展服务
function triggerViaHttp(port) {
  const encodedSummary = encodeURIComponent(summary);
  const url = `http://127.0.0.1:${port}/trigger?summary=${encodedSummary}`;
  
  console.log('[对话助手] 正在连接扩展服务...');
  
  const req = http.get(url, { timeout: 86400000 }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.error) {
          console.error('[对话助手] 服务错误:', response.error);
          console.log('ACTION: error');
          process.exit(1);
        }
        outputResponse(response);
        process.exit(0);
      } catch (e) {
        console.error('[对话助手] 解析响应失败:', e.message);
        console.log('ACTION: error');
        process.exit(1);
      }
    });
  });
  
  req.on('error', (e) => {
    console.error('[对话助手] 连接失败:', e.message);
    console.log('ACTION: error');
    console.log('FEEDBACK: 请确保 Windsurf 已打开且对话助手扩展已激活');
    process.exit(1);
  });
  
  req.on('timeout', () => {
    console.log('ACTION: timeout');
    process.exit(1);
  });
}

// 主逻辑：从端口文件读取端口并连接
const cwd = String(process.cwd()).toLowerCase().replace(/\\/g, '/');
const workspaceKey = workspaceKeyArg || crypto.createHash('sha1').update(cwd).digest('hex').slice(0, 10);

if (portArg) {
  // 1. 优先使用命令行指定的端口（推荐方式，.windsurfrules中包含端口）
  triggerViaHttp(parseInt(portArg, 10));
} else {
  // 2. 尝试从当前目录的workspaceKey查找
  const portFile = path.join(configDir, `port_${workspaceKey}.json`);
  
  if (fs.existsSync(portFile)) {
    try {
      const portInfo = JSON.parse(fs.readFileSync(portFile, 'utf8'));
      if (portInfo.port && (Date.now() - portInfo.timestamp) < 86400000) {
        triggerViaHttp(portInfo.port);
      } else {
        console.log('ACTION: error');
        console.log('FEEDBACK: 端口信息已过期，请重新加载 Windsurf 窗口');
        process.exit(1);
      }
    } catch (e) {
      console.log('ACTION: error');
      console.log('FEEDBACK: 读取端口信息失败');
      process.exit(1);
    }
  } else {
    // 3. 找不到端口文件，提示用户
    console.log('ACTION: error');
    console.log('FEEDBACK: 未找到当前项目的端口信息，请确保：1.Windsurf已打开当前项目 2.对话助手扩展已激活 3.检查.windsurfrules中的命令是否包含--port参数');
    process.exit(1);
  }
}
