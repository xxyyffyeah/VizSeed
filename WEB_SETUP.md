# 🌐 VizSeed Web界面设置指南

## 🚀 快速启动

### 方式一：完整开发环境（推荐）
同时启动前端和后端服务：

```bash
npm run dev:full
```

这会同时启动：
- **WebSocket服务器**: `ws://localhost:8080`
- **前端界面**: `http://localhost:3000`

### 方式二：分别启动

#### 1. 启动后端WebSocket服务器
```bash
npm run server:dev
```
- 服务地址: `http://localhost:8080`
- WebSocket: `ws://localhost:8080`
- API端点: `http://localhost:8080/api/`

#### 2. 启动前端界面
```bash
npm run web:dev
```
- 前端地址: `http://localhost:3000`

## 🎯 功能特性

### 📊 **静态图表展示**
- ECharts柱状图演示
- ECharts饼图演示 
- ECharts折线图演示
- 实时规范显示

### 💻 **交互式VizSeed IDE**
- **实时代码编辑**: 在浏览器中编辑数据和配置
- **即时图表生成**: 修改后立即看到图表变化
- **多库支持**: 支持ECharts、VChart、VTable
- **配置面板**: 可视化配置图表参数
- **实时日志**: 查看执行过程和错误信息
- **规范预览**: 查看生成的官方图表规范

### 🔧 **API端点**

- `GET /api/health` - 健康检查
- `GET /api/capabilities` - 获取支持的图表库和类型
- `POST /api/execute` - 执行VizSeed代码（REST版本）

## 🎮 **使用方法**

### 1. 打开浏览器
访问 `http://localhost:3000`

### 2. 查看静态演示
页面上部展示了预设的图表示例

### 3. 使用交互式编辑器
- **编辑数据**: 在左侧数据配置面板修改JSON数据
- **配置图表**: 选择图表库、类型、维度、度量等
- **生成图表**: 点击"🚀 生成图表"按钮
- **查看结果**: 右侧显示生成的图表和规范
- **查看日志**: 底部日志面板显示执行过程

### 4. 实时交互
- 修改任何配置后点击生成图表
- 支持实时预览（目前仅ECharts）
- 可以查看生成的完整规范

## 🔍 **示例配置**

### 默认数据格式
```json
{
  "fields": [
    {
      "name": "category",
      "type": "string", 
      "role": "dimension",
      "values": ["水果", "蔬菜", "肉类", "乳制品"]
    },
    {
      "name": "sales",
      "type": "number",
      "role": "measure", 
      "values": [120, 80, 200, 150]
    }
  ],
  "rows": [
    { "category": "水果", "sales": 120 },
    { "category": "蔬菜", "sales": 80 },
    { "category": "肉类", "sales": 200 },
    { "category": "乳制品", "sales": 150 }
  ]
}
```

### 配置说明
- **图表库**: echarts, vchart, vtable
- **图表类型**: bar, line, pie, scatter, table
- **子类型**: grouped, stacked, percent
- **维度字段**: 用逗号分隔，如 `category,date`
- **度量字段**: 用逗号分隔，如 `sales,profit`

## 🛠️ **技术架构**

```
浏览器界面 (Vite + TypeScript)
        ↕ WebSocket
WebSocket服务器 (Node.js + Express)
        ↕ 直接调用
VizSeed核心库 (TypeScript)
        ↓
官方图表规范 (ECharts/VChart/VTable)
```

### 连接流程
1. 前端通过WebSocket连接到服务器
2. 用户在界面中配置数据和图表参数
3. 前端发送配置到WebSocket服务器
4. 服务器调用VizSeed生成官方规范
5. 服务器返回结果给前端
6. 前端渲染图表并显示规范

## 🚨 **故障排除**

### 连接问题
- 确保两个服务都在运行
- 检查端口8080和3000是否被占用
- 查看浏览器控制台的WebSocket连接状态

### 图表渲染问题
- 检查数据格式是否正确
- 确保维度和度量字段存在于数据中
- 查看执行日志了解具体错误

### 性能优化
- 大数据集可能影响渲染性能
- 建议数据行数控制在1000行以内

## 📈 **扩展功能**

当前版本支持的扩展：
- ✅ 实时图表预览（ECharts）
- ✅ 配置面板
- ✅ 执行日志
- ✅ 规范显示
- ⏳ VChart实时预览
- ⏳ VTable实时预览
- ⏳ 更多图表类型
- ⏳ 导出功能

## 🎉 **开始使用**

现在就运行 `npm run dev:full` 开始体验VizSeed的强大功能吧！