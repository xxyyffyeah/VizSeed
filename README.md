# VizSeed DSL

VizSeed 是一个创新的数据可视化维度重塑与图表生成工具，基于 TypeScript 开发。它提供了一套领域特定语言（DSL），用于简化数据处理复杂度，将原始数据转换为适合绘图的目标结构。通过策略模式支持多个主流图表库（VChart、ECharts、VTable），提供统一的抽象层。

## 🎯 设计理念

VizSeed 解决了数据可视化中的核心问题：**维度与指标的相对性**。同一个字段在不同场景下可以作为维度或指标使用，传统工具需要用户手动处理数据结构，而 VizSeed 通过维度重塑操作，让数据自动适配图表需求。

### 核心创新点

1. **维度重塑方法**: 提供升维、降维、分组升降维等操作，简化数据处理
2. **多图表库支持**: 通过策略模式统一支持VChart、ECharts、VTable等主流图表库
3. **函数式编程思想**: 减少 if-else 逻辑，通过类型系统保证正确性
4. **构造者模式**: 提供流畅的链式调用 API
5. **类型安全**: 完整的 TypeScript 类型定义和编译时检查
6. **统一抽象**: 一套DSL适配多个图表库，降低学习成本

## ✨ 核心特性

- **🔄 维度重塑**: 支持升维、降维、分组升降维等数据转换操作
- **📊 多图表库支持**: 统一支持VChart、ECharts、VTable，一套DSL生成不同库的规范
- **📈 多图表类型**: 支持柱状图、条形图、折线图、面积图、散点图、饼图、表格等
- **🏗️ 构造者模式**: 采用链式调用的构造者模式，提供流畅的 API 体验
- **🎯 策略模式**: 通过策略模式实现图表库解耦，易于扩展新的图表库
- **🔧 函数式编程**: 遵循函数式编程思想，减少副作用，提高代码复用性
- **🛡️ 类型安全**: 基于 TypeScript 开发，提供完整的类型定义和编译时检查
- **🔍 智能验证**: 自动检查图表类型与图表库的兼容性

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 编译项目

```bash
npm run build
```

### 运行示例

```bash
npm run example
```

### 官方类型支持演示

```bash
npm run example:types   # 运行官方类型示例
```

## 📋 基本用法

### 创建分组柱状图

```typescript
import { VizSeedBuilder } from 'vizseed';

const data = {
  fields: [
    { name: 'category', type: 'string', role: 'dimension', values: ['水果', '蔬菜'] },
    { name: 'sales', type: 'number', role: 'measure', values: [100, 80] },
    { name: 'profit', type: 'number', role: 'measure', values: [20, 15] }
  ],
  rows: [
    { category: '水果', sales: 100, profit: 20 },
    { category: '蔬菜', sales: 80, profit: 15 }
  ]
};

const builder = new VizSeedBuilder(data);

const vizSeed = builder
  .setChartType('bar', 'grouped')
  .addDimension('category')
  .addMeasure('sales')
  .addMeasure('profit')
  .setColor('category')
  .setTitle('销售和利润对比')
  .setTheme('dark')
  .setDimensions(800, 400)
  .build();

// 生成不同图表库的规范
const vchartSpec = builder.buildSpec('vchart');   // VChart规范
const echartsSpec = builder.buildSpec('echarts'); // ECharts规范

// 查看支持的图表库
console.log(builder.getSupportedLibraries()); // ['vchart', 'vtable', 'echarts']
```

### 维度重塑操作

```typescript
const builder = new VizSeedBuilder(data);

const vizSeed = builder
  .elevate('category', 'category_dim')    // 升维：将指标转为维度+指标
  .reduce('profit', 'profit_measure')     // 降维：将维度合并为变量-数值对
  .groupReduce(['sales', 'profit'], 'value')  // 分组降维：多字段合并
  .setChartType('bar')
  .addDimension('variable')
  .addMeasure('value')
  .setTitle('维度重塑示例')
  .build();

// 支持多图表库的维度重塑
const vchartSpec = builder.buildSpec('vchart');
const echartsSpec = builder.buildSpec('echarts');
```

## 🎨 官方类型支持

VizSeed v1.0 起完全支持各图表库的官方TypeScript类型定义，确保类型安全和智能提示。

### 支持的官方类型

- **VChart**: 基于 `@visactor/vchart` v2.0+
- **ECharts**: 基于 `echarts` v5.6+ (内置类型定义)
- **VTable**: 基于 `@visactor/vtable` v1.19+

### 使用官方类型创建图表

```typescript
import { 
  VChartBarSpec, 
  EChartsSpec, 
  VTableSpec,
  isVChartSpec,
  isEChartsSpec,
  isVTableSpec
} from 'vizseed';

// 使用VChart官方类型
const vchartSpec: VChartBarSpec = {
  type: 'bar',
  data: { values: salesData },
  xField: 'month',
  yField: 'sales',
  // 完整的VChart官方配置选项支持
  axes: [...],
  legends: [...],
  // VizSeed扩展元数据
  _vizSeedMeta: {
    originalDataFields: ['month', 'sales'],
    transformations: ['bar-chart']
  }
};

// 使用ECharts官方类型
const echartsSpec: EChartsSpec = {
  title: { text: '销售图表' },
  xAxis: { type: 'category', data: ['1月', '2月'] },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar',
    data: [100, 200]
  }],
  // 完整的ECharts官方配置选项支持
  tooltip: { trigger: 'axis' },
  legend: { data: ['销售额'] }
};

// 使用VTable官方类型  
const vtableSpec: VTableSpec = {
  type: 'table',
  records: salesData,
  columns: [{
    field: 'month',
    title: '月份',
    width: 120
  }],
  // 完整的VTable官方配置选项支持
  theme: 'DEFAULT',
  hover: { highlightMode: 'row' }
};
```

### 类型守卫和智能提示

```typescript
function processChartSpec(spec: ChartSpec) {
  if (isVChartSpec(spec)) {
    // TypeScript自动推断为VChartSpec类型
    console.log('VChart数据:', spec.data?.values);
    console.log('X轴字段:', spec.xField);
  } else if (isEChartsSpec(spec)) {
    // TypeScript自动推断为EChartsSpec类型
    console.log('ECharts标题:', spec.title?.text);
    console.log('系列数量:', spec.series?.length);
  } else if (isVTableSpec(spec)) {
    // TypeScript自动推断为VTableSpec类型
    console.log('表格记录数:', spec.records?.length);
    console.log('列定义:', spec.columns);
  }
}
```

### 类型安全的配置

```typescript
import { ChartConfig, ChartType } from 'vizseed';

// 类型安全的图表配置
const config: ChartConfig<'vchart-bar'> = {
  type: 'vchart-bar',
  spec: {
    type: 'bar',
    data: { values: data },
    xField: 'category',  // TypeScript会验证这个字段
    yField: 'sales'      // TypeScript会验证这个字段
  },
  width: 800,
  height: 400
};
```

## 🏗️ 架构设计

### 整体架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐
│   用户数据       │    │   VizSeed DSL   │    │  多图表库规范            │
│   Raw Data      │───▶│   Intermediate  │───▶│  VChart/ECharts/VTable │
│                 │    │   Representation │    │         Specs          │
└─────────────────┘    └─────────────────┘    └─────────────────────────┘
        │                        │                         │
        │                        │                         │
   ┌────▼────┐              ┌────▼────┐              ┌─────▼─────┐
   │ 维度操作  │              │ 图表配置  │              │  策略模式  │
   │Dimension│              │ Chart   │              │ Strategy  │
   │Operations│              │ Config  │              │  Pattern  │
   └─────────┘              └─────────┘              └───────────┘
```

### 多图表库策略架构

```
VizSeedBuilder ──────────▶ SpecGenerator ──────────▶ SpecGenerationStrategy
       │                         │                          │
       │                         │                          ├── VChartStrategy
       │                         │                          ├── EChartsStrategy
       │                         │                          └── VTableStrategy
       │                         │
   链式API构建              策略选择与管理                各图表库实现
```

### 目录结构详解

```
src/
├── types/                  # 📝 TypeScript类型定义
│   ├── data.ts            #   - 数据相关类型（Field, DataSet, Transformation）
│   ├── charts.ts          #   - 图表类型定义（ChartType, ChartConfig）
│   ├── dsl.ts             #   - DSL接口定义（VizSeedDSL, VizSeedBuilder）
│   ├── specs.ts           #   - 多图表库规范类型（VTableSpec, VChartSpec, EChartsSpec）
│   └── index.ts           #   - 类型导出文件
├── core/                  # 🎯 核心功能
│   └── VizSeedDSL.ts      #   - VizSeed DSL核心类，包含验证和克隆逻辑
├── builder/               # 🏗️ 构造者模式实现
│   └── VizSeedBuilder.ts  #   - 主要构建器，提供链式API
├── operations/            # 🔄 维度操作
│   └── DimensionOperator.ts #  - 升维、降维、聚合、过滤、排序操作
├── charts/                # 📊 图表支持
│   └── ChartRegistry.ts   #   - 图表类型注册表，定义各图表的维度/指标要求
├── specs/                 # ⚙️ 多图表库规范构建器
│   ├── SpecGenerator.ts   #   - 策略模式上下文类，管理图表库选择
│   ├── SpecGenerationStrategy.ts # - 策略接口定义
│   ├── VChartStrategy.ts  #   - VChart图表库策略实现
│   ├── EChartsStrategy.ts #   - ECharts图表库策略实现
│   └── VTableStrategy.ts  #   - VTable表格库策略实现
├── utils/                 # 🛠️ 工具函数
│   └── DataProcessor.ts   #   - 数据处理工具，应用转换操作
└── index.ts               # 📦 主入口文件
```

## 📊 支持的图表类型与图表库

### 图表库兼容性矩阵

| 图表类型 | VChart | ECharts | VTable | 支持子类型 |
|---------|--------|---------|--------|-----------|
| 柱状图 (bar) | ✅ | ✅ | ❌ | grouped, stacked, percent |
| 条形图 (column) | ✅ | ✅ | ❌ | grouped, stacked, percent |
| 折线图 (line) | ✅ | ✅ | ❌ | - |
| 面积图 (area) | ✅ | ✅ | ❌ | stacked, percent |
| 散点图 (scatter) | ✅ | ✅ | ❌ | linear |
| 饼图 (pie) | ✅ | ✅ | ❌ | - |
| 环形图 (donut) | ✅ | ❌ | ❌ | - |
| 表格 (table) | ❌ | ❌ | ✅ | - |

### 使用示例

```typescript
const builder = new VizSeedBuilder(data)
  .setChartType('bar')
  .addDimension('category')
  .addMeasure('sales');

// 查看图表库支持情况
console.log(builder.getSupportedChartTypes('vchart'));  // ['bar', 'column', 'line'...]
console.log(builder.getSupportedChartTypes('echarts')); // ['bar', 'column', 'line'...]
console.log(builder.getSupportedChartTypes('vtable'));  // ['table']

// 生成对应规范
const vchartSpec = builder.buildSpec('vchart');
const echartsSpec = builder.buildSpec('echarts');
// builder.buildSpec('vtable'); // 会报错：bar类型不支持vtable
```

## 🔧 维度重塑方法

### 概念解释

VizSeed 的核心创新在于维度重塑，解决了数据可视化中维度与指标相对性的问题：

- **维度 (Dimension)**: 描述数据特征的字段，通常用于分组或分类
- **指标 (Measure)**: 可量化的数值字段，通常用于度量和计算
- **相对性**: 同一字段在不同场景下可作为维度或指标使用

### 重塑操作

#### 升维 (Elevate)
将一个指标转换为一个维度和一个指标，增加维度数量

#### 降维 (Reduce)
将一个维度转换为变量-数值对，减少维度数量

#### 分组降维 (Group Reduce)
将多个字段合并为变量-数值对

## 🛠️ 开发指南

### 开发环境要求

- **Node.js**: 18+ 
- **TypeScript**: 5+
- **npm**: 10+

### 开发脚本

```bash
npm run dev         # 开发模式运行
npm run watch       # 监听模式编译
npm run build       # 构建项目
npm run example     # 运行基本示例
npm run start       # 运行编译后的项目
```

## 📄 许可证

本项目采用 ISC 许可证。

## 🙏 致谢

感谢所有为数据可视化标准化做出贡献的开发者和研究者。

