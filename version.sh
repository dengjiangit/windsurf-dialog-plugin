œ#!/bin/bash
# 版本管理脚本

case "$1" in
  patch)
    echo "📌 递增补丁版本 (x.x.X)"
    npm version patch --no-git-tag-version
    ;;
  minor)
    echo "📌 递增次版本 (x.X.0)"
    npm version minor --no-git-tag-version
    ;;
  major)
    echo "📌 递增主版本 (X.0.0)"
    npm version major --no-git-tag-version
    ;;
  *)
    CURRENT=$(node -p "require('./package.json').version")
    echo "当前版本: $CURRENT"
    echo ""
    echo "用法:"
    echo "  ./version.sh patch   # 1.0.0 -> 1.0.1"
    echo "  ./version.sh minor   # 1.0.0 -> 1.1.0"
    echo "  ./version.sh major   # 1.0.0 -> 2.0.0"
    exit 0
    ;;
esac

NEW=$(node -p "require('./package.json').version")
echo "✨ 版本已更新: $NEW"
