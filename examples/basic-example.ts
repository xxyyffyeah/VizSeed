import { VizSeedBuilder, DataSet } from '../src';
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

// 新的简化数据格式 - 只需要rows！
const sampleRows = [
  { category: '水果', product: '苹果', sales: 100, profit: 20 },
  { category: '水果', product: '香蕉', sales: 80, profit: 15 },
  { category: '蔬菜', product: '胡萝卜', sales: 60, profit: 12 },
  { category: '蔬菜', product: '白菜', sales: 45, profit: 8 },
  { category: '肉类', product: '猪肉', sales: 200, profit: 40 },
  { category: '肉类', product: '牛肉', sales: 180, profit: 35 }
];

// 🔥 演示不同的DataSet创建方式
// const sampleData = new DataSet(sampleRows);  // 最简方式
// const sampleData = DataSet.fromRows(sampleRows);  // 静态方法

function createBarChart() {
  // 🎯 最简用法：直接传rows数组！
  const builder = new VizSeedBuilder(sampleRows);
  
  // 其他方式也支持：
  // const builder = new VizSeedBuilder(sampleData);  // 使用DataSet对象
  // const builder = VizSeedBuilder.fromRows(sampleRows);  // 静态方法（可选）
  
  const vizSeed = builder
    .setChartType('bar')
    .setXField('category')     // X轴（维度）
    .setYField('sales')        // Y轴（指标）
    .setColorField('category') // 颜色字段
    .setTitle('销售和利润对比')
    .setLegend(true)
    .setLabel(true)
    .setTooltip(true)
    .build();
    
  console.log('VizSeed DSL:', JSON.stringify(vizSeed, null, 2));
  
  // 生成VChart图表库的spec
  const vchartSpec = builder.buildSpec();
  console.log('VChart Spec:', JSON.stringify(vchartSpec, null, 2));
}

function createPieChart() {
  const builder = new VizSeedBuilder(sampleRows);
  
  const vizSeed = builder
    .setChartType('pie')
    .setCategoryField('category') // 分类维度
    .setValueField('sales')       // 数值指标
    .setTitle('各类别销售占比')
    .build();
    
  console.log('饼图 VizSeed DSL:', JSON.stringify(vizSeed, null, 2));
}

function createLineChart() {
  // 新的简化方式 - 只需要rows数据！
  const timeSeriesRows = [
    { date: '2024-01', revenue: 1000 },
    { date: '2024-02', revenue: 1200 },
    { date: '2024-03', revenue: 1100 },
    { date: '2024-04', revenue: 1300 },
    { date: '2024-05', revenue: 1500 },
    { date: '2024-06', revenue: 1400 }
  ];

  // 🔥 超简洁：直接传数组！
  const builder = new VizSeedBuilder(timeSeriesRows);
  
  const vizSeed = builder
    .setChartType('line')
    .setXField('date')        // X轴（指标）
    .setYField('revenue')     // Y轴（维度）
    .setTitle('月度收入趋势')
    .build();
    
  console.log('折线图 VizSeed DSL:', JSON.stringify(vizSeed, null, 2));
}

function createTableView() {
  const builder = new VizSeedBuilder(sampleRows);
  
  // 表格不需要添加维度和指标，但需要设置图表类型
  const spec = builder
    .setChartType('table')
    .buildSpec();
    
  console.log('表格 VTable Spec:', JSON.stringify(spec, null, 2));
}

function demonstrateMultiLibrarySupport() {
  console.log('=== 多图表库支持演示 ===');
  
  const builder = new VizSeedBuilder(sampleRows);
  builder
    .setChartType('bar')
    .setXField('category')     // X轴（维度）
    .setYField('sales')        // Y轴（指标）
    .setTitle('不同图表库的柱状图');
  
  // 生成VChart规范
  try {
    const vchartSpec = builder.buildSpec();
    console.log('VChart规范生成成功');
  } catch (error) {
    console.error('VChart规范生成失败:', (error as Error).message);
  }
  
  // 尝试生成表格（应该失败，因为bar类型不支持vtable）
  try {
    const vtableSpec = builder.setChartType('table').buildSpec();
    console.log('VTable规范生成成功');
  } catch (error) {
    console.error('VTable规范生成失败:', (error as Error).message);
  }
}

function demonstrateDimensionOperations() {
  const builder = new VizSeedBuilder(sampleRows);
  
  const vizSeed = builder
    .elevate('category', 'category_dim')
    .reduce('profit', 'profit_measure')
    .groupReduce(['sales', 'profit'], 'value')
    .setChartType('bar')
    .setXField('variable')     // X轴（维度）
    .setYField('value')        // Y轴（指标）
    .setTitle('维度重塑示例')
    .build();
    
  console.log('维度重塑后的 VizSeed DSL:', JSON.stringify(vizSeed, null, 2));
}

function demonstrateNewFeatures() {
  console.log('=== 💡 超简API演示：直接用数组创建图表！ ===');
  
  // 🎯 现在可以直接用数组，无需任何包装！
  const builder = new VizSeedBuilder(sampleRows);
  
  console.log('🔥 对比不同的创建方式：');
  console.log('✅ 最简方式: new VizSeedBuilder(rows)');
  console.log('✅ DataSet方式: new VizSeedBuilder(new DataSet(rows))');
  console.log('✅ 静态方法: VizSeedBuilder.fromRows(rows)');
  
  console.log('\n📊 智能字段推断结果：');
  
  console.log('自动推断的字段信息:');
  console.log('所有字段:', builder.getAvailableFields());
  console.log('维度字段:', builder.getAvailableDimensions());
  console.log('指标字段:', builder.getAvailableMeasures());
  
  // 查看DataSet的详细信息
  const dataSet = builder.getDataSet();
  console.log('\n字段详细信息:');
  dataSet.fields.forEach(field => {
    console.log(`- ${field.name}: ${field.type} (${field.role})`);
    if (field.aggregation) {
      console.log(`  默认聚合: ${field.aggregation}`);
    }
  });
  
  // 演示获取字段统计信息
  console.log('\nsales字段统计:', dataSet.getFieldStats('sales'));
}

if (require.main === module) {
  console.log('=== 🚀 VizSeed 超简API演示 ===\n');
  
  console.log('0. 💡 超简API演示:');
  demonstrateNewFeatures();
  
  console.log('\n1. 创建分组柱状图:');
  createBarChart();
  
  console.log('\n2. 创建饼图:');  
  createPieChart();
  
  console.log('\n3. 创建折线图:');
  createLineChart();
  
  console.log('\n4. 创建表格:');
  createTableView();
  
  console.log('\n5. 多图表库支持演示:');
  demonstrateMultiLibrarySupport();
  
  console.log('\n6. 维度操作示例:');
  demonstrateDimensionOperations();
  
  // 恢复原始console.log
  console.log = originalConsoleLog;
  
  // 保存输出到文件
  const outputDir = path.join(__dirname, 'outputs');
  const outputFile = path.join(outputDir, 'basic-example-output.txt');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputText = outputCollector.join('\n');
  fs.writeFileSync(outputFile, outputText, 'utf8');
  
  console.log(`\n📁 输出已保存到: ${outputFile}`);
}