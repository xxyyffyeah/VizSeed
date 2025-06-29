# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VizSeed是一个创新的数据可视化维度重塑与图表生成工具，基于TypeScript开发。它提供了一套DSL（领域特定语言），用于简化数据处理复杂度，将原始数据转换为适合绘图的目标结构，支持多个主流图表库（VChart、ECharts、VTable）。

核心创新：
- **维度重塑方法** - 解决了数据可视化中维度与指标相对性的问题，同一字段在不同场景下可作为维度或指标使用
- **多图表库支持** - 通过策略模式实现，一套DSL可生成不同图表库的规范

## Development Commands

```bash
# 构建项目
npm run build

# 开发模式运行
npm run dev

# 监听模式编译（用于开发时自动编译）
npm run watch

# 运行编译后的项目
npm run start

# 运行基本示例
npm run example

# 目前没有配置测试（package.json中test脚本为空）
npm test  # 会报错
```

## Architecture

### 核心架构
```
用户数据 -> VizSeed DSL -> SpecGenerator -> VChart/ECharts/VTable Specs
Raw Data -> Intermediate -> Strategy     -> Chart Library Specs
           Representation  Pattern
```

### 多图表库架构
使用策略模式实现多图表库支持：
```
VizSeedBuilder -> SpecGenerator -> SpecGenerationStrategy
                      |              |
                      |              ├── VChartStrategy
                      |              ├── EChartsStrategy  
                      |              └── VTableStrategy
                      |
                 图表库选择与规范生成
```

### 关键组件

#### 核心组件
1. **VizSeedDSL** (`src/core/VizSeedDSL.ts`): 核心DSL类，包含数据验证和克隆逻辑
2. **VizSeedBuilder** (`src/builder/VizSeedBuilder.ts`): 构造者模式实现，提供链式API和多库支持
3. **DimensionOperator** (`src/operations/DimensionOperator.ts`): 维度重塑操作（升维、降维、分组操作）

#### 多图表库支持组件  
4. **SpecGenerator** (`src/specs/SpecGenerator.ts`): 策略模式上下文类，管理图表库选择
5. **SpecGenerationStrategy** (`src/specs/SpecGenerationStrategy.ts`): 策略接口定义
6. **VChartStrategy** (`src/specs/VChartStrategy.ts`): VChart图表库策略实现
7. **EChartsStrategy** (`src/specs/EChartsStrategy.ts`): ECharts图表库策略实现  
8. **VTableStrategy** (`src/specs/VTableStrategy.ts`): VTable表格库策略实现

#### 辅助组件
9. **ChartRegistry** (`src/charts/ChartRegistry.ts`): 图表类型注册表
10. **DataProcessor** (`src/utils/DataProcessor.ts`): 数据处理工具

### 类型系统
- `src/types/data.ts`: 数据相关类型（Field, DataSet, Transformation）
- `src/types/charts.ts`: 图表类型定义（ChartType, ChartConfig）
- `src/types/dsl.ts`: DSL接口定义（VizSeedDSL, VizSeedBuilder）
- `src/types/specs.ts`: 多图表库规范类型（VTableSpec, VChartSpec, EChartsSpec, ChartLibrary）

## Core Concepts

### 维度重塑操作
- **升维 (elevate)**: 将指标转换为维度+指标，增加维度数量
- **降维 (reduce)**: 将维度转换为变量-数值对，减少维度数量  
- **分组降维 (groupReduce)**: 将多个字段合并为变量-数值对
- **分组升维 (groupElevate)**: 按组进行升维操作

### 支持的图表类型与图表库
#### VChart支持的类型
- 柱状图 (bar): grouped, stacked, percent
- 条形图 (column): grouped, stacked, percent  
- 折线图 (line)
- 面积图 (area): stacked, percent
- 散点图 (scatter): linear
- 饼图 (pie)
- 环形图 (donut)

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

- **Runtime**: `@visactor/vchart` ^2.0.0
- **Development**: TypeScript 5+, ts-node, @types/node
- **Build**: 编译到CommonJS模块格式，输出到dist/目录

## Examples

基本用法参考 `examples/basic-example.ts`，包含：
- 分组柱状图创建（支持VChart和ECharts）
- 饼图创建  
- 折线图创建
- 表格创建（VTable）
- 多图表库支持演示
- 维度重塑操作演示

### 多图表库使用示例
```typescript
const builder = new VizSeedBuilder(data)
  .setChartType('bar')
  .addDimension('category')
  .addMeasure('sales');

// 生成不同图表库的规范
const vchartSpec = builder.buildSpec('vchart');   // VChart规范
const echartsSpec = builder.buildSpec('echarts'); // ECharts规范
const vtableSpec = builder.buildSpec('vtable');   // VTable规范（仅table类型）

// 查看支持的图表库和类型
console.log(builder.getSupportedLibraries());     // ['vchart', 'vtable', 'echarts']
console.log(builder.getAllSupportedChartTypes()); // 各库支持的类型映射
```

## TypeScript Configuration

- 目标: ES2016, CommonJS模块
- 严格模式启用
- 生成声明文件和源码映射
- 输出目录: ./dist
- 根目录: ./src
EOF < /dev/null