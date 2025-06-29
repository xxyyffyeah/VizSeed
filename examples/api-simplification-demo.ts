import { VizSeedBuilder, DataSet } from '../src';

// 测试数据
const testRows = [
  { category: 'A', value: 10 },
  { category: 'B', value: 20 },
  { category: 'C', value: 15 }
];

console.log('=== 🚀 API简化演示：三种创建方式的对比 ===\n');

// 🎯 方式1: 超简方式 - 直接传rows数组
console.log('🎯 方式1: 超简方式');
console.log('new VizSeedBuilder(rows)');
const builder1 = new VizSeedBuilder(testRows);
console.log('字段推断结果:', builder1.getAvailableFields());
console.log('维度字段:', builder1.getAvailableDimensions());
console.log('指标字段:', builder1.getAvailableMeasures());
console.log('');

// 🔧 方式2: 通过DataSet
console.log('🔧 方式2: 通过DataSet');
console.log('new VizSeedBuilder(new DataSet(rows))');
const dataSet = new DataSet(testRows);
const builder2 = new VizSeedBuilder(dataSet);
console.log('字段推断结果:', builder2.getAvailableFields());
console.log('');

// 📚 方式3: 静态方法（向后兼容）
console.log('📚 方式3: 静态方法');
console.log('VizSeedBuilder.fromRows(rows)');
const builder3 = VizSeedBuilder.fromRows(testRows);
console.log('字段推断结果:', builder3.getAvailableFields());
console.log('');

// 验证三种方式创建的结果是否一致
console.log('=== ✅ 验证结果一致性 ===');
const chart1 = builder1.setChartType('bar').addDimension('category').addMeasure('value').buildSpec('vchart');
const chart2 = builder2.setChartType('bar').addDimension('category').addMeasure('value').buildSpec('vchart');
const chart3 = builder3.setChartType('bar').addDimension('category').addMeasure('value').buildSpec('vchart');

console.log('方式1与方式2结果相同:', JSON.stringify(chart1) === JSON.stringify(chart2));
console.log('方式2与方式3结果相同:', JSON.stringify(chart2) === JSON.stringify(chart3));
console.log('所有方式结果一致:', 
  JSON.stringify(chart1) === JSON.stringify(chart2) && 
  JSON.stringify(chart2) === JSON.stringify(chart3)
);

console.log('\n🎊 结论: 三种API都能产生相同的结果，用户可以选择最适合的方式！');
console.log('推荐使用: new VizSeedBuilder(rows) - 最简洁直观！');