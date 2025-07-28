import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 时间序列销售数据 - 适合折线图的趋势数据，增加产品线维度
const salesData = [
  { month: '2024-01', product: '手机', sales: 15000, profit: 3000, users: 450 },
  { month: '2024-01', product: '平板', sales: 8000, profit: 1600, users: 280 },
  { month: '2024-02', product: '手机', sales: 18000, profit: 3600, users: 520 },
  { month: '2024-02', product: '平板', sales: 9500, profit: 1900, users: 320 },
  { month: '2024-03', product: '手机', sales: 22000, profit: 4400, users: 680 },
  { month: '2024-03', product: '平板', sales: 11000, profit: 2200, users: 380 },
  { month: '2024-04', product: '手机', sales: 20000, profit: 4000, users: 650 },
  { month: '2024-04', product: '平板', sales: 10500, profit: 2100, users: 360 },
  { month: '2024-05', product: '手机', sales: 25000, profit: 5000, users: 780 },
  { month: '2024-05', product: '平板', sales: 12500, profit: 2500, users: 420 },
  { month: '2024-06', product: '手机', sales: 28000, profit: 5600, users: 850 },
  { month: '2024-06', product: '平板', sales: 14000, profit: 2800, users: 480 },
  { month: '2024-07', product: '手机', sales: 32000, profit: 6400, users: 920 },
  { month: '2024-07', product: '平板', sales: 16000, profit: 3200, users: 550 },
  { month: '2024-08', product: '手机', sales: 30000, profit: 6000, users: 880 },
  { month: '2024-08', product: '平板', sales: 15000, profit: 3000, users: 520 },
  { month: '2024-09', product: '手机', sales: 35000, profit: 7000, users: 1050 },
  { month: '2024-09', product: '平板', sales: 17500, profit: 3500, users: 620 },
  { month: '2024-10', product: '手机', sales: 38000, profit: 7600, users: 1120 },
  { month: '2024-10', product: '平板', sales: 19000, profit: 3800, users: 680 },
  { month: '2024-11', product: '手机', sales: 42000, profit: 8400, users: 1250 },
  { month: '2024-11', product: '平板', sales: 21000, profit: 4200, users: 750 },
  { month: '2024-12', product: '手机', sales: 45000, profit: 9000, users: 1350 },
  { month: '2024-12', product: '平板', sales: 22500, profit: 4500, users: 800 }
];

// 构建基础折线图
function buildLineChart() {
  const builder = new VizSeedBuilder(salesData);

  const vizSeedDSL = builder
    .setChartType('line')
    .setDimensions(['month', 'product'])
    .setMeasures(['sales'])
    .build();

  const vchartSpec = VizSeedBuilder.from(vizSeedDSL).buildSpec();

  return { vizSeedDSL, vchartSpec };
}

// 执行并保存
try {
  const { vizSeedDSL, vchartSpec } = buildLineChart();
  const outputDir = path.join(__dirname, 'outputs');
  const specFile = path.join(outputDir, 'latest-spec.json');
  const webSpecFile = path.join(__dirname, '..', 'web', 'latest-spec.json');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const specData = {
    timestamp: new Date().toISOString(),
    chartType: 'line',
    description: '多线折线图 - 显示不同产品线的月度销售额趋势对比',
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
  
  console.log('LINE图规范生成成功！');
} catch (error) {
  console.error('生成LINE图规范失败:', error);
  process.exit(1);
}