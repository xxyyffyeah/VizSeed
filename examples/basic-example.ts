import { VizSeedBuilder } from '../src/builder/VizSeedBuilder';
import { DataSet } from '../src/types/data';

const sampleData: DataSet = {
  fields: [
    {
      name: 'category',
      type: 'string',
      role: 'dimension',
      values: ['水果', '蔬菜', '肉类']
    },
    {
      name: 'product',
      type: 'string',
      role: 'dimension',
      values: ['苹果', '香蕉', '胡萝卜', '白菜', '猪肉', '牛肉']
    },
    {
      name: 'sales',
      type: 'number',
      role: 'measure',
      values: [100, 80, 60, 45, 200, 180]
    },
    {
      name: 'profit',
      type: 'number',
      role: 'measure',
      values: [20, 15, 12, 8, 40, 35]
    }
  ],
  rows: [
    { category: '水果', product: '苹果', sales: 100, profit: 20 },
    { category: '水果', product: '香蕉', sales: 80, profit: 15 },
    { category: '蔬菜', product: '胡萝卜', sales: 60, profit: 12 },
    { category: '蔬菜', product: '白菜', sales: 45, profit: 8 },
    { category: '肉类', product: '猪肉', sales: 200, profit: 40 },
    { category: '肉类', product: '牛肉', sales: 180, profit: 35 }
  ]
};

function createBarChart() {
  const builder = new VizSeedBuilder(sampleData);
  
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
    
  console.log('VizSeed DSL:', JSON.stringify(vizSeed, null, 2));
  
  const spec = builder.buildSpec();
  console.log('VChart Spec:', JSON.stringify(spec, null, 2));
}

function createPieChart() {
  const builder = new VizSeedBuilder(sampleData);
  
  const vizSeed = builder
    .setChartType('pie')
    .addDimension('category')
    .addMeasure('sales')
    .setTitle('各类别销售占比')
    .build();
    
  console.log('饼图 VizSeed DSL:', JSON.stringify(vizSeed, null, 2));
}

function createLineChart() {
  const timeSeriesData: DataSet = {
    fields: [
      {
        name: 'date',
        type: 'date',
        role: 'dimension',
        values: []
      },
      {
        name: 'revenue',
        type: 'number',
        role: 'measure',
        values: []
      }
    ],
    rows: [
      { date: '2024-01', revenue: 1000 },
      { date: '2024-02', revenue: 1200 },
      { date: '2024-03', revenue: 1100 },
      { date: '2024-04', revenue: 1300 },
      { date: '2024-05', revenue: 1500 },
      { date: '2024-06', revenue: 1400 }
    ]
  };

  const builder = new VizSeedBuilder(timeSeriesData);
  
  const vizSeed = builder
    .setChartType('line')
    .addDimension('date')
    .addMeasure('revenue')
    .setTitle('月度收入趋势')
    .build();
    
  console.log('折线图 VizSeed DSL:', JSON.stringify(vizSeed, null, 2));
}

function createTableView() {
  const builder = new VizSeedBuilder(sampleData);
  
  // 表格不需要添加维度和指标，但需要设置图表类型
  const spec = builder
    .setChartType('table')
    .buildSpec();
    
  console.log('表格 VTable Spec:', JSON.stringify(spec, null, 2));
}

function demonstrateDimensionOperations() {
  const builder = new VizSeedBuilder(sampleData);
  
  const vizSeed = builder
    .elevate('category', 'category_dim')
    .reduce('profit', 'profit_measure')
    .groupReduce(['sales', 'profit'], 'value')
    .setChartType('bar')
    .addDimension('variable')
    .addMeasure('value')
    .setTitle('维度重塑示例')
    .build();
    
  console.log('维度重塑后的 VizSeed DSL:', JSON.stringify(vizSeed, null, 2));
}

if (require.main === module) {
  console.log('=== VizSeed 基本示例 ===\n');
  
  console.log('1. 创建分组柱状图:');
  createBarChart();
  
  console.log('\n2. 创建饼图:');
  createPieChart();
  
  console.log('\n3. 创建折线图:');
  createLineChart();
  
  console.log('\n4. 创建表格:');
  createTableView();
  
  console.log('\n5. 维度操作示例:');
  demonstrateDimensionOperations();
}