import { VizSeedBuilder } from '../src';

// 🎯 简单数据
const data = [
  { category: '移动端', value: 45 },
  { category: '桌面端', value: 35 },
  { category: '平板端', value: 20 }
];

console.log('=== 🥧 超简洁饼图演示 ===\n');

// 🔥 仅需一行创建Builder！
const builder = new VizSeedBuilder(data);

// ⚙️ 配置饼图
const vizSeedDSL = builder
  .setChartType('pie')
  .addDimension('category')
  .addMeasure('value')
  .setTitle('用户访问设备分布')
  .build();

// 📊 生成VChart规范
const vchartSpec = builder.buildSpec('vchart');

console.log('📋 VizSeed DSL:');
console.log(JSON.stringify(vizSeedDSL, null, 2));

console.log('\n🎨 VChart Spec (可直接渲染):');
console.log(JSON.stringify(vchartSpec, null, 2));

console.log('\n✨ 核心流程总结:');
console.log('1️⃣ 准备数据数组');
console.log('2️⃣ new VizSeedBuilder(data)');
console.log('3️⃣ 链式配置图表类型和字段');
console.log('4️⃣ buildSpec("vchart") 生成规范');
console.log('🎊 完成！可直接用于VChart渲染');