/**
 * 官方类型定义使用示例
 * 展示如何使用VChart、ECharts、VTable的官方TypeScript接口
 */

import { VizSeedBuilder } from '../src/builder/VizSeedBuilder';
import { SpecBuilder } from '../src/specs/SpecBuilder';
import { DataSet } from '../src/types/data';
import { 
  VChartBarSpec, 
  VChartLineSpec, 
  VChartPieSpec,
  VTableSpec,
  EChartsSpec,
  ChartConfig,
  ChartType,
  isVChartSpec,
  isEChartsSpec,
  isVTableSpec,
  EChartsOption,
  IBarChartSpec,
  ListTableConstructorOptions
} from '../src/types/specs';

// 示例数据
const salesData: DataSet = {
  fields: [
    { name: 'month', type: 'string', role: 'dimension', values: [] },
    { name: 'sales', type: 'number', role: 'measure', values: [] },
    { name: 'profit', type: 'number', role: 'measure', values: [] },
    { name: 'region', type: 'string', role: 'dimension', values: [] }
  ],
  rows: [
    { month: '1月', sales: 1000, profit: 200, region: '北京' },
    { month: '2月', sales: 1200, profit: 240, region: '北京' },
    { month: '3月', sales: 1100, profit: 220, region: '北京' },
    { month: '1月', sales: 800, profit: 160, region: '上海' },
    { month: '2月', sales: 900, profit: 180, region: '上海' },
    { month: '3月', sales: 950, profit: 190, region: '上海' }
  ]
};

/**
 * 使用VChart官方类型创建柱状图
 */
function createVChartBarExample(): VChartBarSpec {
  console.log('=== VChart 柱状图示例 ===');
  
  const spec: VChartBarSpec = {
    type: 'bar',
    data: {
      values: salesData.rows
    },
    xField: 'month',
    yField: 'sales',
    seriesField: 'region',
    // 可以使用VChart的所有官方配置选项
    axes: [
      {
        orient: 'bottom',
        type: 'band',
        title: {
          visible: true,
          text: '月份'
        }
      },
      {
        orient: 'left', 
        type: 'linear',
        title: {
          visible: true,
          text: '销售额'
        }
      }
    ],
    legends: [
      {
        visible: true,
        orient: 'top'
      }
    ],
    title: {
      visible: true,
      text: 'VChart官方类型柱状图示例'
    },
    // VizSeed扩展元数据
    _vizSeedMeta: {
      originalDataFields: ['month', 'sales', 'profit', 'region'],
      transformations: ['bar-chart']
    }
  };

  console.log('VChart Bar Spec:', JSON.stringify(spec, null, 2));
  return spec;
}

/**
 * 使用ECharts官方类型创建折线图
 */
function createEChartsLineExample(): EChartsSpec {
  console.log('=== ECharts 折线图示例 ===');

  // 使用完整的EChartsOption接口
  const spec: EChartsSpec = {
    title: {
      text: 'ECharts官方类型折线图示例',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['北京', '上海'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月']
    },
    yAxis: {
      type: 'value',
      name: '销售额'
    },
    series: [
      {
        name: '北京',
        type: 'line',
        data: [1000, 1200, 1100],
        smooth: true
      },
      {
        name: '上海', 
        type: 'line',
        data: [800, 900, 950],
        smooth: true
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    // VizSeed扩展元数据
    _vizSeedMeta: {
      originalDataFields: ['month', 'sales', 'region'],
      transformations: ['line-chart', 'group-by-region']
    }
  };

  console.log('ECharts Line Spec:', JSON.stringify(spec, null, 2));
  return spec;
}

/**
 * 使用VTable官方类型创建表格
 */
function createVTableExample(): VTableSpec {
  console.log('=== VTable 表格示例 ===');

  // 使用VTable的ListTableConstructorOptions接口
  const spec: VTableSpec = {
    type: 'table',
    records: salesData.rows,
    columns: [
      {
        field: 'month',
        title: '月份',
        width: 120,
        cellType: 'text'
      },
      {
        field: 'region',
        title: '地区', 
        width: 120,
        cellType: 'text'
      },
      {
        field: 'sales',
        title: '销售额',
        width: 120,
        cellType: 'text',
        // 可以使用VTable的格式化功能
        // format: (value) => `¥${value}` // VTable格式化比较复杂
      },
      {
        field: 'profit',
        title: '利润',
        width: 120,
        cellType: 'text',
        // format: (value) => `¥${value}` // VTable格式化比较复杂
      }
    ],
    // theme: 'DEFAULT', // VTable主题配置复杂，暂时移除
    // 可以使用VTable的所有官方配置
    hover: {
      highlightMode: 'row'
    },
    select: {
      highlightMode: 'row'
    },
    // VizSeed扩展元数据
    _vizSeedMeta: {
      originalDataFields: ['month', 'sales', 'profit', 'region'],
      transformations: ['table-view']
    }
  };

  console.log('VTable Spec:', JSON.stringify(spec, null, 2));
  return spec;
}

/**
 * 类型守卫函数演示
 */
function demonstrateTypeGuards() {
  console.log('=== 类型守卫函数演示 ===');

  const vchartSpec = createVChartBarExample();
  const echartsSpec = createEChartsLineExample();
  const vtableSpec = createVTableExample();

  const specs = [vchartSpec, echartsSpec, vtableSpec];

  specs.forEach((spec, index) => {
    console.log(`\n第${index + 1}个规范:`);
    
    if (isVChartSpec(spec)) {
      console.log('  类型: VChart规范');
      console.log('  图表类型:', spec.type);
      console.log('  数据字段数量:', spec.data ? 'data' in spec.data ? (spec.data as any).values?.length || 0 : 0 : 0);
    } else if (isEChartsSpec(spec)) {
      console.log('  类型: ECharts规范');
      const title = Array.isArray(spec.title) ? spec.title[0]?.text : spec.title?.text;
      console.log('  标题:', title || '无标题');
      const seriesCount = Array.isArray(spec.series) ? spec.series.length : 1;
      console.log('  系列数量:', seriesCount || 0);
    } else if (isVTableSpec(spec)) {
      console.log('  类型: VTable规范');
      console.log('  记录数量:', spec.records?.length || 0);
      console.log('  列数量:', spec.columns?.length || 0);
    }
  });
}

/**
 * 通过VizSeedBuilder使用官方类型
 */
function demonstrateVizSeedBuilderWithOfficialTypes() {
  console.log('=== VizSeedBuilder + 官方类型演示 ===');

  const builder = new VizSeedBuilder(salesData);
  
  // 构建VizSeed DSL
  const vizSeed = builder
    .setChartType('bar')
    .addDimension('month')
    .addMeasure('sales')
    .setColor('region')
    .setTitle('月度销售对比')
    .build();

  // 使用SpecBuilder生成官方类型规范
  const spec = SpecBuilder.build(vizSeed);
  
  console.log('VizSeed DSL:', JSON.stringify(vizSeed, null, 2));
  console.log('生成的规范:', JSON.stringify(spec, null, 2));

  // 类型检查
  if (isVChartSpec(spec)) {
    console.log('生成的是VChart规范，类型:', spec.type);
    // 现在可以安全地访问VChart特有的属性
    if ('xField' in spec) {
      console.log('X轴字段:', spec.xField);
    }
    if ('yField' in spec) {
      console.log('Y轴字段:', spec.yField);
    }
  }
}

/**
 * 展示官方类型的智能提示和类型安全
 */
function demonstrateTypeIntelliSense() {
  console.log('=== 类型智能提示演示 ===');

  // 创建VChart配置时，TypeScript会提供完整的智能提示
  const vchartConfig: ChartConfig<'vchart-bar'> = {
    type: 'vchart-bar',
    spec: {
      type: 'bar',
      data: { values: salesData.rows },
      xField: 'month',
      yField: 'sales',
      // TypeScript会提示所有可用的VChart配置选项
      // 比如: axes, legends, animation, interactions等
    },
    width: 800,
    height: 400
  };

  // 创建ECharts配置时也有完整的类型提示
  const echartsConfig: ChartConfig<'echarts'> = {
    type: 'echarts',
    spec: {
      // TypeScript会提示所有ECharts选项
      title: { text: '示例图表' },
      series: [{
        type: 'bar',
        data: [1, 2, 3]
      }]
      // 还有: tooltip, legend, xAxis, yAxis等等
    }
  };

  console.log('类型配置演示完成');
}

/**
 * 主函数
 */
function main() {
  console.log('VizSeed 官方类型定义使用示例\n');

  createVChartBarExample();
  console.log('\n' + '='.repeat(50) + '\n');

  createEChartsLineExample();
  console.log('\n' + '='.repeat(50) + '\n');

  createVTableExample();
  console.log('\n' + '='.repeat(50) + '\n');

  demonstrateTypeGuards();
  console.log('\n' + '='.repeat(50) + '\n');

  demonstrateVizSeedBuilderWithOfficialTypes();
  console.log('\n' + '='.repeat(50) + '\n');

  demonstrateTypeIntelliSense();
}

// 如果直接运行此文件则执行main函数
if (require.main === module) {
  main();
}

export {
  createVChartBarExample,
  createEChartsLineExample,
  createVTableExample,
  demonstrateTypeGuards,
  demonstrateVizSeedBuilderWithOfficialTypes
};