// 简化版演示，仅使用ECharts（最容易集成）
import * as echarts from 'echarts';

// 导入VizSeed核心库
import { VizSeedBuilder } from '../../src/builder/VizSeedBuilder';
import { DataSet } from '../../src/types/data';

// 示例数据
const sampleData: DataSet = {
  fields: [
    {
      name: 'category',
      type: 'string', 
      role: 'dimension',
      values: ['水果', '蔬菜', '肉类', '乳制品']
    },
    {
      name: 'sales',
      type: 'number',
      role: 'measure', 
      values: [120, 80, 200, 150]
    },
    {
      name: 'profit',
      type: 'number',
      role: 'measure',
      values: [25, 15, 40, 30]
    }
  ],
  rows: [
    { category: '水果', sales: 120, profit: 25 },
    { category: '蔬菜', sales: 80, profit: 15 },
    { category: '肉类', sales: 200, profit: 40 },
    { category: '乳制品', sales: 150, profit: 30 }
  ]
};

// 饼图数据
const pieData: DataSet = {
  fields: [
    { name: 'category', type: 'string', role: 'dimension', values: ['移动端', '桌面端', '平板'] },
    { name: 'users', type: 'number', role: 'measure', values: [335, 310, 234] }
  ],
  rows: [
    { category: '移动端', users: 335 },
    { category: '桌面端', users: 310 },
    { category: '平板', users: 234 }
  ]
};

// 时间序列数据
const timeData: DataSet = {
  fields: [
    { name: 'month', type: 'string', role: 'dimension', values: [] },
    { name: 'revenue', type: 'number', role: 'measure', values: [] }
  ],
  rows: [
    { month: '1月', revenue: 1000 },
    { month: '2月', revenue: 1200 },
    { month: '3月', revenue: 1100 },
    { month: '4月', revenue: 1300 },
    { month: '5月', revenue: 1500 },
    { month: '6月', revenue: 1400 }
  ]
};

// 更新规范显示
function updateSpecDisplay(containerId: string, spec: any) {
  const specElement = document.getElementById(containerId + '-spec');
  if (specElement) {
    const preElement = specElement.querySelector('pre');
    if (preElement) {
      preElement.textContent = JSON.stringify(spec, null, 2);
    }
  }
}

// 渲染ECharts柱状图
function renderBarChart() {
  try {
    console.log('🔄 开始生成柱状图...');
    
    const builder = new VizSeedBuilder(sampleData);
    const spec = builder
      .setChartType('bar')
      .addDimension('category')
      .addMeasure('sales')
      .setTitle('销售数据分析')
      .buildSpec('echarts');
    
    console.log('📊 ECharts规范生成成功:', spec);
    updateSpecDisplay('echarts', spec);
    
    const container = document.getElementById('echarts-container');
    if (container) {
      const chart = echarts.init(container);
      chart.setOption(spec);
      
      // 响应式
      window.addEventListener('resize', () => chart.resize());
      console.log('✅ ECharts柱状图渲染成功');
    }
  } catch (error) {
    console.error('❌ 柱状图渲染失败:', error);
    const container = document.getElementById('echarts-container');
    if (container) {
      container.innerHTML = `<div class="error">渲染失败: ${error}</div>`;
    }
  }
}

// 渲染饼图
function renderPieChart() {
  try {
    console.log('🔄 开始生成饼图...');
    
    const builder = new VizSeedBuilder(pieData);
    const spec = builder
      .setChartType('pie')
      .addDimension('category')
      .addMeasure('users')
      .setTitle('用户设备分布')
      .buildSpec('echarts');
    
    console.log('🥧 饼图规范生成成功:', spec);
    updateSpecDisplay('echarts-pie', spec);
    
    const container = document.getElementById('echarts-pie-container');
    if (container) {
      const chart = echarts.init(container);
      chart.setOption(spec);
      
      window.addEventListener('resize', () => chart.resize());
      console.log('✅ ECharts饼图渲染成功');
    }
  } catch (error) {
    console.error('❌ 饼图渲染失败:', error);
    const container = document.getElementById('echarts-pie-container');
    if (container) {
      container.innerHTML = `<div class="error">渲染失败: ${error}</div>`;
    }
  }
}

// 渲染折线图
function renderLineChart() {
  try {
    console.log('🔄 开始生成折线图...');
    
    const builder = new VizSeedBuilder(timeData);
    const spec = builder
      .setChartType('line')
      .addDimension('month')
      .addMeasure('revenue')
      .setTitle('月度收入趋势')
      .buildSpec('echarts');
    
    console.log('📈 折线图规范生成成功:', spec);
    updateSpecDisplay('echarts-line', spec);
    
    const container = document.getElementById('echarts-line-container');
    if (container) {
      const chart = echarts.init(container);
      chart.setOption(spec);
      
      window.addEventListener('resize', () => chart.resize());
      console.log('✅ ECharts折线图渲染成功');
    }
  } catch (error) {
    console.error('❌ 折线图渲染失败:', error);
    const container = document.getElementById('echarts-line-container');
    if (container) {
      container.innerHTML = `<div class="error">渲染失败: ${error}</div>`;
    }
  }
}

// 演示VizSeed DSL的强大功能
function demonstrateVizSeedPower() {
  console.log('🚀 VizSeed DSL 演示开始...');
  
  // 展示同一数据源生成不同图表的能力
  const builder = new VizSeedBuilder(sampleData);
  
  // 获取支持的库和图表类型
  const supportedLibraries = ['echarts'] as const;
  const chartTypes = ['bar', 'pie', 'line'] as const;
  
  console.log('📊 支持的图表库:', supportedLibraries);
  console.log('📈 支持的图表类型:', chartTypes);
  
  // 展示相同数据的不同可视化
  console.log('🎨 相同数据的不同可视化展示:');
  
  chartTypes.forEach(type => {
    try {
      const spec = builder
        .setChartType(type)
        .addDimension('category')
        .addMeasure('sales')
        .setTitle(`${type} 图表示例`)
        .buildSpec('echarts');
      
      console.log(`  ✅ ${type}: 规范生成成功, 字段数: ${Object.keys(spec).length}`);
    } catch (error) {
      console.log(`  ❌ ${type}: ${error}`);
    }
  });
}

// 主函数
export function initializeDemo() {
  console.log('🚀 VizSeed简化演示开始加载...');
  
  // 展示VizSeed能力
  demonstrateVizSeedPower();
  
  // 渲染图表
  setTimeout(() => {
    renderBarChart();
  }, 100);
  
  setTimeout(() => {
    renderPieChart();
  }, 200);
  
  setTimeout(() => {
    renderLineChart();
  }, 300);
  
  console.log('🎉 所有图表已开始渲染！');
}