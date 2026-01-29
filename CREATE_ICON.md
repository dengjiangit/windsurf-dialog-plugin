# 创建 icon.png 图标

由于系统限制，需要手动创建 `icon.png` 文件。

## 方法一：使用在线工具

1. 访问 https://www.figma.com 或 https://www.canva.com
2. 创建 128x128 像素的画布
3. 设计一个对话气泡图标（参考 icon.svg）
4. 导出为 PNG 格式
5. 保存为 `icon.png`

## 方法二：使用 ImageMagick（如果已安装）

```bash
# 安装 ImageMagick
brew install imagemagick

# 将 SVG 转换为 PNG
convert -background none -size 128x128 icon.svg icon.png
```

## 方法三：使用 Node.js 脚本

```bash
npm install sharp
node -e "require('sharp')('icon.svg').resize(128, 128).png().toFile('icon.png')"
```

## 方法四：简单占位符

如果只是测试，可以使用任意 128x128 的 PNG 图片作为占位符。

---

**注意：** 扩展打包时需要 `icon.png` 文件，否则会有警告（但不影响功能）。
