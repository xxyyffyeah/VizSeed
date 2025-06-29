import { VizSeedBuilder } from '../src';

console.log('=== 🥧 VChart 饼图完整演示 ===\n');

// 🎯 步骤1: 准备数据 - 只需要简单的数组！
console.log('📊 原始数据:');
const salesData = [
  { region: '华东', sales: 2800 },
  { region: '华北', sales: 2200 },
  { region: '华南', sales: 1900 },
  { region: '华中', sales: 1600 },
  { region: '西北', sales: 1200 },
  { region: '西南', sales: 1000 }
];
console.log(JSON.stringify(salesData, null, 2));

// 🎯 步骤2: 创建VizSeed Builder - 超简洁！
console.log('\n🔧 创建Builder (超简API):');
console.log('const builder = new VizSeedBuilder(salesData);');
const builder = new VizSeedBuilder(salesData);

// 查看智能推断的字段信息
console.log('\n🧠 智能字段推断结果:');
console.log('所有字段:', builder.getAvailableFields());
console.log('维度字段:', builder.getAvailableDimensions());
console.log('指标字段:', builder.getAvailableMeasures());

// 🎯 步骤3: 配置图表 - 链式API
console.log('\n⚙️ 配置饼图:');
const vizSeedDSL = builder
  .setChartType('pie')
  .addDimension('region')    // 分类维度
  .addMeasure('sales')       // 数值指标
  .setTitle('各地区销售额占比')
  .setTheme('light')
  .build();

// 🎯 步骤4: 生成VizSeed DSL
console.log('\n📋 VizSeed DSL 输出:');
console.log(JSON.stringify(vizSeedDSL, null, 2));

// 🎯 步骤5: 生成VChart规范
console.log('\n🎨 VChart 规范 (可直接用于渲染):');
const vchartSpec = builder.buildSpec('vchart');
console.log(JSON.stringify(vchartSpec, null, 2));

// 🎯 步骤6: 演示如何在实际项目中使用
console.log('\n💻 实际使用示例代码:');
console.log(`
// 1. 在React/Vue项目中使用:
import VChart from '@visactor/vchart';

const chartSpec = ${JSON.stringify(vchartSpec, null, 0)};

// 渲染图表
const chart = new VChart(chartSpec, { dom: 'chart-container' });
chart.renderAsync();

// 2. 响应式更新数据:
chart.updateData('dataId', newSalesData);
`);

console.log('\n✨ 总结:');
console.log('🎯 从原始数据到可渲染图表，只需要4行核心代码！');
console.log('✅ 自动智能推断字段类型和角色');
console.log('✅ 链式API配置，简洁直观');
console.log('✅ 生成标准VChart规范，可直接使用');
console.log('✅ 支持主题、标题等丰富配置选项');

// 额外演示：不同的饼图变体
console.log('\n🔄 饼图变体演示:');

// 环形图 (donut)
const donutBuilder = new VizSeedBuilder(salesData);
const donutSpec = donutBuilder
  .setChartType('donut')
  .addDimension('region')
  .addMeasure('sales')
  .setTitle('各地区销售额占比 (环形图)')
  .buildSpec('vchart');

console.log('\n🍩 环形图 VChart 规范:');
console.log(JSON.stringify(donutSpec, null, 2));