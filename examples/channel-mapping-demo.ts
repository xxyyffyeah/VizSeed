import { VizSeedBuilder } from '../src';

// 演示新的通道映射API
console.log('=== 🎯 通道映射API演示 ===\n');

// 测试数据
const salesData = [
  { region: '华东', category: '水果', sales: 1200, profit: 240 },
  { region: '华东', category: '蔬菜', sales: 800, profit: 160 },
  { region: '华北', category: '水果', sales: 1000, profit: 200 },
  { region: '华北', category: '蔬菜', sales: 600, profit: 120 },
  { region: '华南', category: '水果', sales: 1100, profit: 220 },
  { region: '华南', category: '蔬菜', sales: 700, profit: 140 }
];

const timeData = [
  { date: '2024-01', revenue: 1000, growth: 5.2 },
  { date: '2024-02', revenue: 1200, growth: 8.1 },
  { date: '2024-03', revenue: 1100, growth: -2.3 },
  { date: '2024-04', revenue: 1300, growth: 6.8 },
  { date: '2024-05', revenue: 1500, growth: 9.1 },
  { date: '2024-06', revenue: 1400, growth: -1.2 }
];

// 1. 折线图示例 - X指标 + Y维度 + Color维度
console.log('1. 折线图 (line) - X指标 + Y维度 + Color维度:');
try {
  const lineChart = new VizSeedBuilder(timeData)
    .setChartType('line')
    .setXField('date')        // X指标（至少1个指标）
    .setYField('revenue')     // Y维度
    .setColorField('growth')  // Color维度（可选）
    .setTitle('月度收入趋势')
    .buildSpec();
  
  console.log('✅ 折线图生成成功');
  console.log('配置:', { x: 'date', y: 'revenue', color: 'growth' });
} catch (error) {
  console.error('❌ 折线图生成失败:', (error as Error).message);
}

// 2. 散点图示例 - X指标 + Y指标 + Color维度  
console.log('\n2. 散点图 (scatter) - X指标 + Y指标 + Color维度:');
try {
  const scatterChart = new VizSeedBuilder(salesData)
    .setChartType('scatter')
    .setXField('sales')       // X指标（必须）
    .setYField('profit')      // Y指标（必须）
    .setColorField('region')  // Color维度（可选）
    .setTitle('销售与利润关系')
    .buildSpec();
  
  console.log('✅ 散点图生成成功');
  console.log('配置:', { x: 'sales', y: 'profit', color: 'region' });
} catch (error) {
  console.error('❌ 散点图生成失败:', (error as Error).message);
}

// 3. 饼图示例 - category + value
console.log('\n3. 饼图 (pie) - category + value:');
try {
  const pieChart = new VizSeedBuilder(salesData.slice(0, 3))
    .setChartType('pie')
    .setCategoryField('category')  // 分类维度（必须）
    .setValueField('sales')        // 数值指标（必须）
    .setTitle('类别销售占比')
    .buildSpec();
  
  console.log('✅ 饼图生成成功');
  console.log('配置:', { category: 'category', value: 'sales' });
} catch (error) {
  console.error('❌ 饼图生成失败:', (error as Error).message);
}

// 4. 表格示例 - 行维度 + 列维度 + 指标
console.log('\n4. 表格 (table) - 行维度 + 列维度 + 指标:');
try {
  const tableChart = new VizSeedBuilder(salesData)
    .setChartType('table')
    .setRowDimension('region')     // 行维度（可选）
    .setColumnDimension('category') // 列维度（可选）
    .setMeasureField('sales')      // 指标字段（可选）
    .buildSpec();
  
  console.log('✅ 表格生成成功');
  console.log('配置:', { rowDimension: 'region', columnDimension: 'category', measure: 'sales' });
} catch (error) {
  console.error('❌ 表格生成失败:', (error as Error).message);
}

// 5. 测试验证错误
console.log('\n5. 🚨 验证错误测试:');

// 测试折线图缺少必需的X指标
console.log('测试: 折线图缺少X指标');
try {
  new VizSeedBuilder(timeData)
    .setChartType('line')
    .setYField('revenue')     // 只有Y，没有X
    .buildSpec();
  console.log('❌ 应该失败但却成功了');
} catch (error) {
  console.log('✅ 正确捕获错误:', (error as Error).message);
}

// 测试散点图缺少Y指标
console.log('\n测试: 散点图缺少Y指标');
try {
  new VizSeedBuilder(salesData)
    .setChartType('scatter')
    .setXField('sales')       // 只有X，没有Y
    .buildSpec();
  console.log('❌ 应该失败但却成功了');
} catch (error) {
  console.log('✅ 正确捕获错误:', (error as Error).message);
}

// 测试饼图缺少value字段
console.log('\n测试: 饼图缺少value字段');
try {
  new VizSeedBuilder(salesData)
    .setChartType('pie')
    .setCategoryField('category')  // 只有category，没有value
    .buildSpec();
  console.log('❌ 应该失败但却成功了');
} catch (error) {
  console.log('✅ 正确捕获错误:', (error as Error).message);
}

console.log('\n=== 🎊 通道映射API演示完成 ===');