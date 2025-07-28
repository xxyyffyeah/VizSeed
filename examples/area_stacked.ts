import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 时间序列数据 - 多产品线销售趋势（适合堆叠面积图）
const salesData = [
  { month: '2024-01', product: '手机', sales: 15000, profit: 3000 },
  { month: '2024-01', product: '平板', sales: 8000, profit: 1600 },
  { month: '2024-01', product: '笔记本', sales: 12000, profit: 2400 },
  { month: '2024-02', product: '手机', sales: 18000, profit: 3600 },
  { month: '2024-02', product: '平板', sales: 9000, profit: 1800 },
  { month: '2024-02', product: '笔记本', sales: 14000, profit: 2800 },
  { month: '2024-03', product: '手机', sales: 22000, profit: 4400 },
  { month: '2024-03', product: '平板', sales: 11000, profit: 2200 },
  { month: '2024-03', product: '笔记本', sales: 16000, profit: 3200 },
  { month: '2024-04', product: '手机', sales: 20000, profit: 4000 },
  { month: '2024-04', product: '平板', sales: 10000, profit: 2000 },
  { month: '2024-04', product: '笔记本', sales: 15000, profit: 3000 }
];

// 构建堆叠面积图
function buildAreaStackedChart() {
  const builder = new VizSeedBuilder(salesData);

  const vizSeedDSL = builder
    .setChartType('area_stacked')
    .setDimensions(['month', 'product'])
    .setMeasures(['sales', 'profit'])
    .build();

  const vchartSpec = VizSeedBuilder.from(vizSeedDSL).buildSpec();

  return { vizSeedDSL, vchartSpec };
}

// 执行并保存
try {
  const { vizSeedDSL, vchartSpec } = buildAreaStackedChart();
  const outputDir = path.join(__dirname, 'outputs');
  const specFile = path.join(outputDir, 'latest-spec.json');
  const webSpecFile = path.join(__dirname, '..', 'web', 'latest-spec.json');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const specData = {
    timestamp: new Date().toISOString(),
    chartType: 'area_stacked',
    description: '堆叠面积图 - 显示各产品线销售额趋势的累积效果',
    spec: vchartSpec,
    vizSeedDSL: vizSeedDSL,
    chartInfo: {
      type: vchartSpec.type,
      dataCount: vchartSpec.data.length,
      fields: {
        x: vchartSpec.xField,
        y: vchartSpec.yField,
        series: vchartSpec.seriesField
      }
    }
  };

  fs.writeFileSync(specFile, JSON.stringify(specData, null, 2), 'utf8');
  fs.writeFileSync(webSpecFile, JSON.stringify(specData, null, 2), 'utf8');
  
  console.log('AREA_STACKED图规范生成成功！');
} catch (error) {
  console.error('生成AREA_STACKED图规范失败:', error);
  process.exit(1);
}