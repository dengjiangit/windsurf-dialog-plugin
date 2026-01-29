#!/bin/bash
# 快速打包脚本

set -e

echo "🚀 开始打包 🐮🐎助手扩展..."

# 检查 vsce 是否安装
if ! command -v vsce &> /dev/null; then
    echo "❌ vsce 未安装，正在安装..."
    npm install -g vsce
fi

# 读取当前版本
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📌 当前版本: $CURRENT_VERSION"

# 询问是否递增版本
read -p "是否递增版本号? (y/n, 默认 y): " INCREMENT
INCREMENT=${INCREMENT:-y}

if [[ $INCREMENT == "y" || $INCREMENT == "Y" ]]; then
    # 自动递增补丁版本号
    npm version patch --no-git-tag-version
    NEW_VERSION=$(node -p "require('./package.json').version")
    echo "✨ 版本已更新: $CURRENT_VERSION -> $NEW_VERSION"
fi

# 打包扩展
echo "📦 打包中..."
vsce package

# 显示打包结果
echo "✅ 打包完成！"
echo ""
ls -lh *.vsix | tail -1

echo ""
echo "📝 安装方法："
echo "1. 打开 Windsurf"
echo "2. 按 Cmd+Shift+P"
echo "3. 输入 'Install from VSIX'"
echo "4. 选择上面的 .vsix 文件"
echo ""
echo "🎉 享受持续的 AI 对话体验！"
