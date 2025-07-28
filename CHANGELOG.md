# Changelog

VizSeed项目的所有重要变更都会记录在这个文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

## [1.0.0] - 2025-07-27

### 🎉 首个正式版本

#### ✨ 新增功能
- **核心DSL系统**: 完整的数据可视化维度重塑DSL实现
- **多图表库支持**: 统一支持VChart、ECharts、VTable（17种图表类型）
- **函数式Pipeline**: 双阶段Pipeline架构，支持模块化数据处理
- **智能通道映射**: 根据图表类型自动选择最佳映射策略
- **TypeScript集成**: 完整的类型定义和编译时检查
- **按需加载**: 真正的动态import实现，减少初始包体积

#### 📊 支持的图表类型
- **柱状图系列**: bar, column (支持stacked, grouped, percent变体)
- **趋势图系列**: line, area (支持stacked, percent变体)  
- **分析图系列**: scatter, pie
- **数据表格**: table (通过VTable)

#### 🏗️ 架构特性
- **构造者模式**: 流畅的链式API设计
- **策略模式**: 图表库解耦，易于扩展
- **Pipeline系统**: 68个源码文件的模块化架构
- **依赖优化**: 核心库仅依赖必需包，图表库作为peerDependencies

#### 🌐 Web界面
- **实时IDE**: Monaco编辑器支持的VizSeed代码编辑
- **多库渲染**: 支持ECharts、VChart、VTable实时预览
- **交互配置**: 可视化参数调整和配置面板
- **WebSocket通信**: 实时双向数据传输

#### 📚 示例和文档
- **13个完整示例**: 覆盖所有支持的图表类型
- **完整文档**: README、API文档、开发指南
- **npm发布优化**: 精简包结构，优化依赖关系

### 🔧 技术实现

#### Pipeline架构
```
VizSeed Pipeline (数据处理) -> Spec Pipeline (规范生成) -> 图表规范
```

#### 依赖策略
- **核心依赖**: `radash`, `zod`
- **Peer依赖**: `@visactor/vchart`, `@visactor/vtable`
- **可选依赖**: Web界面相关包

#### 文件结构
```
src/
├── builder/VizSeedBuilder.ts     # 核心构建器
├── pipeline/                     # Pipeline系统（52个文件）
├── types/                        # 完整类型定义
└── utils/                        # 工具函数
```

### 📦 发布信息

- **包名**: `vizseed`
- **版本**: `1.0.0`
- **许可证**: ISC
- **Node.js要求**: >=18.0.0
- **包大小**: ~50KB（核心库，压缩后）

### 🎯 使用方式

```typescript
import { VizSeedBuilder } from 'vizseed';

const builder = new VizSeedBuilder(data);
const vizSeedDSL = await builder
  .setChartType('pie')
  .setDimensions(['category'])
  .setMeasures(['sales'])
  .build();

const vchartSpec = await VizSeedBuilder.from(vizSeedDSL).buildSpec();
```

### 🔮 下一版本计划

- [ ] **v1.1.0**: 增加ECharts完整支持和错误处理优化
- [ ] **v1.2.0**: Web界面独立包和插件系统
- [ ] **v2.0.0**: 支持更多图表库（D3.js、Observable Plot）

---

## [Unreleased]

### 🚧 开发中
- ECharts规范生成器完善
- 更多数据重塑操作
- 性能优化和大数据集支持

---

**说明**: 
- 🎉 Major features
- ✨ New features  
- 🔧 Technical changes
- 📦 Package/Build changes
- 📊 Chart support
- 🌐 Web interface
- 📚 Documentation