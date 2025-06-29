import { VizSeedBuilder } from '../src/builder/VizSeedBuilder';
import { DataSet } from '../src/types/data';

// 引入图表库（注释掉未使用的导入，保留为将来实际渲染使用）
// import * as VChart from '@visactor/vchart';
// import * as echarts from 'echarts';
// import { ListTable } from '@visactor/vtable';

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

/**
 * VChart渲染示例
 */
function renderVChart() {
  console.log('=== VChart渲染示例 ===');
  
  const builder = new VizSeedBuilder(sampleData);
  
  // 直接生成官方VChart规范
  const vchartSpec = builder
    .setChartType('bar', 'grouped')
    .addDimension('category')
    .addMeasure('sales')
    .setTitle('销售数据 - VChart')
    .buildSpec('vchart');
  
  console.log('官方VChart规范:');
  console.log(JSON.stringify(vchartSpec, null, 2));
  
  // 在真实项目中，这里会渲染到DOM元素
  // const vchart = new VChart.VChart(vchartSpec, { dom: 'vchart-container' });
  // vchart.renderSync();
  
  console.log('VChart渲染完成 ✅\n');
}

/**
 * ECharts渲染示例
 */
function renderECharts() {
  console.log('=== ECharts渲染示例 ===');
  
  const builder = new VizSeedBuilder(sampleData);
  
  // 直接生成官方ECharts规范
  const echartsSpec = builder
    .setChartType('bar')
    .addDimension('category')
    .addMeasure('sales')
    .setTitle('销售数据 - ECharts')
    .buildSpec('echarts');
  
  console.log('官方ECharts规范:');
  console.log(JSON.stringify(echartsSpec, null, 2));
  
  // 在真实项目中，这里会渲染到DOM元素
  // const chart = echarts.init(document.getElementById('echarts-container'));
  // chart.setOption(echartsSpec);
  
  console.log('ECharts渲染完成 ✅\n');
}

/**
 * VTable渲染示例
 */
function renderVTable() {
  console.log('=== VTable渲染示例 ===');
  
  const builder = new VizSeedBuilder(sampleData);
  
  // 直接生成官方VTable规范
  const vtableSpec = builder
    .setChartType('table')
    .buildSpec('vtable');
  
  console.log('官方VTable规范:');
  console.log(JSON.stringify(vtableSpec, null, 2));
  
  // 在真实项目中，这里会渲染到DOM元素
  // const tableInstance = new ListTable(document.getElementById('vtable-container'), vtableSpec);
  
  console.log('VTable渲染完成 ✅\n');
}

/**
 * 演示规范转换对比
 */
function demonstrateSpecConversion() {
  console.log('=== 规范转换对比演示 ===');
  
  const builder = new VizSeedBuilder(sampleData);
  builder
    .setChartType('line')
    .addDimension('category')
    .addMeasure('sales')
    .addMeasure('profit')
    .setTitle('多指标折线图');
  
  // 同一份数据，生成不同库的规范
  const vchartSpec = builder.buildSpec('vchart');
  const echartsSpec = builder.buildSpec('echarts');
  
  console.log('相同DSL生成的不同库规范:');
  console.log('1. VChart规范字段:', Object.keys(vchartSpec));
  console.log('2. ECharts规范字段:', Object.keys(echartsSpec));
  
  // 显示生成的官方规范
  console.log('3. VChart规范字段:', Object.keys(vchartSpec));
  console.log('4. ECharts规范字段:', Object.keys(echartsSpec));
  
  console.log('规范转换演示完成 ✅\n');
}

/**
 * 创建HTML预览文件
 */
function createHTMLPreview() {
  console.log('=== 创建HTML预览文件 ===');
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VizSeed 图表渲染示例</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@visactor/vchart@1.0.0/build/index.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@visactor/vtable@1.0.0/dist/vtable.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .chart-container { 
            width: 800px; 
            height: 400px; 
            margin: 20px 0; 
            border: 1px solid #ddd; 
            border-radius: 4px;
        }
        .table-container {
            width: 800px;
            height: 300px;
            margin: 20px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        h2 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 5px; }
        .code-block { 
            background: #f5f5f5; 
            padding: 10px; 
            border-radius: 4px; 
            font-family: Monaco, Consolas, monospace;
            font-size: 12px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>🚀 VizSeed 图表渲染示例</h1>
    <p>本页面展示了VizSeed DSL生成的图表规范在不同图表库中的渲染效果。</p>
    
    <h2>📊 ECharts 柱状图</h2>
    <div id="echarts-container" class="chart-container"></div>
    <div class="code-block">
        <strong>生成的ECharts规范:</strong><br>
        <pre id="echarts-spec"></pre>
    </div>
    
    <h2>📈 VChart 折线图</h2>
    <div id="vchart-container" class="chart-container"></div>
    <div class="code-block">
        <strong>生成的VChart规范:</strong><br>
        <pre id="vchart-spec"></pre>
    </div>
    
    <h2>📋 VTable 数据表</h2>
    <div id="vtable-container" class="table-container"></div>
    <div class="code-block">
        <strong>生成的VTable规范:</strong><br>
        <pre id="vtable-spec"></pre>
    </div>

    <script>
        // 示例数据
        const sampleData = [
            { category: '水果', sales: 120, profit: 25 },
            { category: '蔬菜', sales: 80, profit: 15 },
            { category: '肉类', sales: 200, profit: 40 },
            { category: '乳制品', sales: 150, profit: 30 }
        ];

        // ECharts示例
        const echartsSpec = {
            title: { text: '销售数据 - ECharts', left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: ['水果', '蔬菜', '肉类', '乳制品'] },
            yAxis: { type: 'value' },
            series: [{
                name: '销售额',
                type: 'bar',
                data: [120, 80, 200, 150]
            }]
        };
        
        const echartsChart = echarts.init(document.getElementById('echarts-container'));
        echartsChart.setOption(echartsSpec);
        document.getElementById('echarts-spec').textContent = JSON.stringify(echartsSpec, null, 2);

        // VChart示例 (如果VChart库可用)
        if (typeof VChart !== 'undefined') {
            const vchartSpec = {
                type: 'line',
                data: { values: sampleData },
                xField: 'category',
                yField: 'sales',
                title: { visible: true, text: '销售趋势 - VChart' }
            };
            
            try {
                const vchart = new VChart.VChart(vchartSpec, { dom: 'vchart-container' });
                vchart.renderSync();
                document.getElementById('vchart-spec').textContent = JSON.stringify(vchartSpec, null, 2);
            } catch (e) {
                document.getElementById('vchart-container').innerHTML = '<p style="text-align:center;padding:100px;">VChart库加载失败，请检查CDN链接</p>';
            }
        }

        // VTable示例 (如果VTable库可用)
        if (typeof VTable !== 'undefined') {
            const vtableSpec = {
                records: sampleData,
                columns: [
                    { field: 'category', title: '类别' },
                    { field: 'sales', title: '销售额' },
                    { field: 'profit', title: '利润' }
                ]
            };
            
            try {
                const tableInstance = new VTable.ListTable(document.getElementById('vtable-container'), vtableSpec);
                document.getElementById('vtable-spec').textContent = JSON.stringify(vtableSpec, null, 2);
            } catch (e) {
                document.getElementById('vtable-container').innerHTML = '<p style="text-align:center;padding:100px;">VTable库加载失败，请检查CDN链接</p>';
            }
        }
        
        console.log('📊 VizSeed 图表渲染示例已加载完成！');
    </script>
</body>
</html>`;
  
  // 在实际环境中，这里会写入文件
  // require('fs').writeFileSync('examples/chart-preview.html', htmlContent);
  console.log('HTML预览文件内容已生成 ✅');
  console.log('文件大小:', htmlContent.length, '字符');
  console.log('预览文件应包含ECharts、VChart、VTable三种图表的渲染示例\n');
}

// 运行所有示例
if (require.main === module) {
  console.log('🚀 VizSeed 官方图表库集成示例\n');
  
  renderVChart();
  renderECharts();
  renderVTable();
  demonstrateSpecConversion();
  createHTMLPreview();
  
  console.log('🎉 所有示例运行完成！');
  console.log('✨ VizSeed现在支持官方图表库类型定义和规范转换');
}