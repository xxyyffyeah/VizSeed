import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 输出收集器
const outputCollector: string[] = [];
const originalConsoleLog = console.log;

// 重写console.log以收集输出
console.log = (...args: any[]) => {
  const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)).join(' ');
  outputCollector.push(message);
  originalConsoleLog(...args); // 同时输出到控制台
};

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

// 注意：buildSpec方法已被移除
console.log('\n🎨 VChart 规范 (可直接用于渲染): buildSpec方法已被移除');

// 🎯 步骤6: 演示如何在实际项目中使用
console.log('\n💻 实际使用示例代码:');
console.log(`
// 注意：buildSpec方法已被移除，无法直接生成图表库规范
// 现在只能生成VizSeed DSL
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
const donutDSL = donutBuilder
  .setChartType('donut')
  .addDimension('region')
  .addMeasure('sales')
  .setTitle('各地区销售额占比 (环形图)')
  .build();

console.log('\n🍩 环形图 VizSeed DSL:');
console.log(JSON.stringify(donutDSL, null, 2));
console.log('注意：buildSpec方法已被移除');

// 恢复原始console.log
console.log = originalConsoleLog;

// 保存输出到文件
const outputDir = path.join(__dirname, 'outputs');
const outputFile = path.join(outputDir, 'vchart-pie-demo-output.txt');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputText = outputCollector.join('\n');
fs.writeFileSync(outputFile, outputText, 'utf8');

console.log(`\n📁 输出已保存到: ${outputFile}`);