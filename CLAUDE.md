# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VizSeed是一个创新的数据可视化维度重塑与图表生成工具，基于TypeScript开发。它提供了一套DSL（领域特定语言），用于简化数据处理复杂度，将原始数据转换为适合绘图的目标结构，支持多个主流图表库（VChart、ECharts、VTable）。

核心创新：
- **维度重塑方法** - 解决了数据可视化中维度与指标相对性的问题，同一字段在不同场景下可作为维度或指标使用
- **多图表库支持** - 通过策略模式实现，一套DSL可生成不同图表库的规范
- **官方类型集成** - 完整集成ECharts、VChart、VTable的官方TypeScript类型定义，确保类型安全
- **Web交互界面** - 提供实时的可视化配置和预览功能

## Development Commands

### 核心开发命令
```bash
# 编译TypeScript到dist/目录
npm run build

# 直接运行TypeScript源码（开发测试）
npm run dev

# 监听文件变化自动重编译（开发时保持运行）
npm run watch

# 运行编译后的代码
npm run start

# 运行基本示例
npm run example
```

### Web界面开发（推荐）
```bash
# 完整开发环境 - 同时启动前端和WebSocket服务器
npm run dev:full

# 单独启动前端界面（端口3000）
npm run web:dev

# 构建前端生产版本
npm run web:build

# 预览构建后的前端
npm run web:preview
```

### 服务器命令
```bash
# 启动WebSocket服务器（端口8080）
npm run server:ts

# 启动简单HTTP服务器
npm run server:dev
```

### 测试
```bash
# 目前没有配置测试框架
npm test  # 会报错
```

## Web界面功能

### 🌐 访问地址
- **前端界面**: http://localhost:3000
- **WebSocket服务器**: ws://localhost:8080
- **API端点**: http://localhost:8080/api/

### 🎯 主要特性
- **静态图表展示**: 预设的ECharts演示图表
- **交互式VizSeed IDE**: 实时代码编辑和图表生成
- **多库支持**: ECharts、VChart、VTable
- **可视化配置**: 图表参数配置面板
- **实时预览**: 修改配置立即看到图表变化
- **规范显示**: 查看生成的官方图表规范
- **执行日志**: 实时查看处理过程和错误信息

### 🔧 API端点
- `GET /api/health` - 健康检查
- `GET /api/capabilities` - 获取支持的图表库和类型
- `POST /api/execute` - 执行VizSeed代码

## Architecture

### 核心架构
```
用户数据 -> VizSeedBuilder -> Pipeline系统 -> VChart/ECharts/VTable Specs
Raw Data -> Builder模式    -> 函数式管道  -> Chart Library Specs
```

### Pipeline架构
基于函数式管道的双阶段处理：
```
VizSeedBuilder -> PipelineRegistry -> VizSeed Pipeline -> Spec Pipeline -> 图表规范
     |                 |                    |                |
     |                 |                    |                └── DataModule
     |                 |                    |                    StyleModule
     |                 |                    |                    init/各图表类型
     |                 |                    └── VizSeedInitModule
     |                 |                         ChartAdapterModule
     |                 |                         DataReshapeModule
     |                 |                         ChannelMappingSteps
     |                 |                         VizSeedCleanupModule
     |                 └── buildVizSeed()
     |                     buildSpec()
     └── 数据集管理、字段选择、图表配置
```

### Web界面架构
```
浏览器界面 (Vite + TypeScript)
        ↕ WebSocket
WebSocket服务器 (Node.js + Express)
        ↕ 直接调用
VizSeed核心库 (TypeScript)
        ↓
官方图表规范 (ECharts/VChart/VTable)
```

### 关键组件

#### 核心组件
1. **VizSeedBuilder** (`src/builder/VizSeedBuilder.ts`): 构造者模式实现，提供链式API和多库支持
2. **DataSet** (`src/datasets/DataSet.ts`): 数据集管理类，处理数据验证和推断
3. **PipelineCore** (`src/pipeline/PipelineCore.ts`): 函数式管道处理系统核心

#### Pipeline架构组件
4. **PipelineRegistry** (`src/pipeline/PipelineRegistry.ts`): Pipeline注册表，管理VizSeed和Spec构建
5. **VizSeed Pipeline** (`src/pipeline/vizSeed/`): VizSeed构建管道
   - `VizSeedPipelines.ts`: 各图表类型的VizSeed构建管道
   - `VizSeedInitModule.ts`: VizSeed初始化模块
   - `ChartAdapterModule.ts`: 图表适配模块
   - `DataReshapeModule.ts`: 数据重塑模块
   - `channelMapping/`: 按功能分类的通道映射步骤
     - `CategoryValueMapping.ts`: 类别-数值映射（饼图、环形图）
     - `HorizontalBarMapping.ts`: 水平条形图映射（柱状图、条形图）
     - `TimeSeriesMapping.ts`: 时间序列映射（折线图、面积图）
     - `TwoMeasureMapping.ts`: 双指标映射（散点图）
     - `TableRowColumnMapping.ts`: 表格行列映射（表格）
   - `VizSeedCleanupModule.ts`: VizSeed清理模块
   - `dataReshape/DataReshapeModule_1M1D1G.ts`: 1M1D1G数据重塑模块
   - `utils/`: 维度操作工具
6. **Spec Pipeline** (`src/pipeline/spec/`): 图表规范生成管道
   - `SpecPipelines.ts`: 各图表类型的Spec构建管道
   - `DataModule.ts`: 数据初始化模块
   - `StyleModule.ts`: 样式配置模块
   - `init/`: 各图表类型初始化模块

#### Web界面组件
7. **WebSocket服务器** (`server/websocket-server.ts`): 实时双向通信服务
8. **简单HTTP服务器** (`server/simple-server.js`): 静态资源和API服务
9. **前端界面** (`web/src/`): Vite构建的交互式界面

#### 辅助组件
10. **DataProcessor** (`src/utils/DataProcessor.ts`): 数据处理工具

### 类型系统
- `src/types/data.ts`: 数据相关类型（Field, DataSet, Transformation）
- `src/types/charts.ts`: 图表类型定义（ChartType, ChartConfig）
- `src/types/dsl.ts`: DSL接口定义（VizSeedDSL, VizSeedBuilder）
- `src/types/specs.ts`: 多图表库规范类型（VTableSpec, VChartSpec, EChartsSpec, ChartLibrary）
- `src/types/vendor-types.ts`: 第三方库类型导入

## Core Concepts

### Pipeline系统架构
VizSeed使用函数式管道架构，包含两个主要阶段：
1. **VizSeed Pipeline**: 数据处理和维度重塑阶段
2. **Spec Pipeline**: 图表规范生成阶段

### Pipeline开发模式
- **模块化设计**: 每个功能模块都是独立的Pipeline Step
- **函数式编程**: 纯函数处理，无副作用
- **类型安全**: 完整的TypeScript类型约束
- **可组合性**: 通过`pipeline()`函数组合多个步骤

### 维度重塑操作
- **升维 (elevate)**: 将指标转换为维度+指标，增加维度数量
- **降维 (reduce)**: 将维度转换为变量-数值对，减少维度数量  
- **分组降维 (groupReduce)**: 将多个字段合并为变量-数值对
- **分组升维 (groupElevate)**: 按组进行升维操作

### Pipeline扩展指南
当需要添加新的图表类型或数据处理逻辑时：
1. 在`src/pipeline/vizSeed/`中添加新的处理模块
2. 在`src/pipeline/spec/init/`中添加新的图表初始化模块
3. 在对应的Pipeline文件中注册新的处理步骤
4. 更新`PipelineRegistry`中的映射关系

### 支持的图表类型与图表库

#### VChart支持的类型
- 柱状图 (bar): grouped, stacked, percent
- 条形图 (column): grouped, stacked, percent  
- 折线图 (line)
- 面积图 (area): stacked, percent
- 散点图 (scatter): linear
- 饼图 (pie)
- ⚠️ **注意**: VChart不支持donut（环形图），请使用pie类型

#### ECharts支持的类型
- 柱状图 (bar): grouped, stacked, percent
- 条形图 (column): grouped, stacked, percent
- 折线图 (line)
- 面积图 (area): stacked, percent
- 散点图 (scatter): linear
- 饼图 (pie)

#### VTable支持的类型
- 表格 (table)

## Dependencies

- **Runtime**: `@visactor/vchart` ^2.0.0, `@visactor/vtable` ^1.19.1, `echarts` ^5.6.0
- **Development**: TypeScript 5+, ts-node, @types/node, Vite ^6.3.5
- **Server**: Express ^5.1.0, WebSocket (ws) ^8.18.3
- **Build**: 编译到CommonJS模块格式，输出到dist/目录

## Examples

基本用法参考：
- `examples/basic-example.ts`: 基础功能演示
- `examples/vchart-pie-demo.ts`: VChart饼图完整演示
- `examples/api-simplification-demo.ts`: API简化演示
- `examples/simple-pie-demo.ts`: 简单饼图示例

### 多图表库使用示例
```typescript
import { VizSeedBuilder } from 'vizseed';

const builder = new VizSeedBuilder(data)
  .setChartType('bar')
  .addDimension('category')
  .addMeasure('sales');

// 生成VizSeed简化规范
const vchartSpec = builder.buildSpec('vchart');   // VChart规范
const echartsSpec = builder.buildSpec('echarts'); // ECharts规范
const vtableSpec = builder.buildSpec('vtable');   // VTable规范（仅table类型）

// 查看支持的图表库和类型
console.log(builder.getSupportedLibraries());     // ['vchart', 'vtable', 'echarts']
console.log(builder.getAllSupportedChartTypes()); // 各库支持的类型映射
```

### Web界面使用示例

1. **启动完整开发环境**:
```bash
npm run dev:full
```

2. **访问Web界面**: http://localhost:3000

3. **配置数据和图表**:
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

## 常见问题和注意事项

### 图表类型兼容性
- VChart不支持donut类型，使用pie替代
- 不同图表库对同一类型的实现可能有差异
- 建议先查看 `getSupportedLibraries()` 和 `getAllSupportedChartTypes()` 确认支持情况

### Web界面开发
- 确保端口8080和3000未被占用
- WebSocket连接失败时检查服务器是否正常启动
- 大数据集建议控制在1000行以内以保证性能

### TypeScript配置
- 目标: ES2016, CommonJS模块
- 严格模式启用
- 生成声明文件和源码映射
- 输出目录: ./dist
- 根目录: ./src
- Web构建输出: ./dist-web
EOF < /dev/null