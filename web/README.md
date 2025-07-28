# VizSeed Web Interface

VizSeed的交互式Web界面，提供实时的图表编辑和预览功能。

## 🌐 在线访问

访问GitHub Pages部署版本：[https://xxyyffyeah.github.io/VizSeed/](https://xxyyffyeah.github.io/VizSeed/)

## 🚀 功能特性

- **实时VizSeed DSL编辑器**: 支持语法高亮的代码编辑
- **即时图表预览**: 修改DSL立即看到图表变化  
- **规范查看器**: 查看生成的VChart规范
- **多图表类型支持**: 支持柱状图、折线图、饼图等多种图表
- **响应式设计**: 适配不同屏幕尺寸

## 📦 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run web:dev

# 构建生产版本
npm run web:build

# 预览构建结果
npm run web:preview
```

## 🔧 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 6.3
- **图表库**: VChart 1.11 (CDN)
- **编辑器**: Monaco Editor
- **样式**: CSS3

## 📝 使用示例

在DSL编辑器中输入以下代码：

```json
{
  "chartType": "pie",
  "data": [
    { "category": "水果", "sales": 120 },
    { "category": "蔬菜", "sales": 80 },
    { "category": "肉类", "sales": 200 },
    { "category": "乳制品", "sales": 150 }
  ],
  "fieldMap": {
    "category": {
      "id": "category",
      "type": "string",
      "alias": "category",
      "location": "dimension"
    },
    "sales": {
      "id": "sales",
      "type": "number",
      "alias": "sales",
      "location": "measure"
    }
  },
  "dimensions": ["category"],
  "measures": ["sales"],
  "theme": "light"
}
```

点击"执行代码"即可看到饼图效果！

## 🚀 自动部署

每次推送到main分支时，GitHub Actions会自动：
1. 构建核心库
2. 构建Web界面
3. 部署到GitHub Pages

部署配置见 `.github/workflows/deploy.yml`