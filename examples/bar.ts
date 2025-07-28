import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 销售数据
const salesData = [
  { store: '苹果专卖店', city: '北京', category: '手机', brand: 'iPhone', sales: 15000, profit: 3000, cost: 12000, quantity: 30, rating: 4.8 },
  { store: '苹果专卖店', city: '北京', category: '手机', brand: 'Samsung', sales: 8000, profit: 1600, cost: 6400, quantity: 20, rating: 4.5 },
  { store: '苹果专卖店', city: '北京', category: '平板', brand: 'iPad', sales: 6000, profit: 1200, cost: 4800, quantity: 12, rating: 4.7 },
  { store: '电子城', city: '上海', category: '手机', brand: 'iPhone', sales: 12000, profit: 2400, cost: 9600, quantity: 24, rating: 4.6 },
  { store: '电子城', city: '上海', category: '手机', brand: 'Samsung', sales: 9000, profit: 1800, cost: 7200, quantity: 18, rating: 4.4 },
  { store: '电子城', city: '上海', category: '平板', brand: 'iPad', sales: 5000, profit: 1000, cost: 4000, quantity: 10, rating: 4.5 },
  { store: '数码广场', city: '广州', category: '手机', brand: 'iPhone', sales: 10000, profit: 2000, cost: 8000, quantity: 20, rating: 4.7 },
  { store: '数码广场', city: '广州', category: '平板', brand: 'iPad', sales: 4000, profit: 800, cost: 3200, quantity: 8, rating: 4.6 }
];

// 构建基础BAR图表
function buildBarChart() {
  const builder = new VizSeedBuilder(salesData);

  const vizSeedDSL = builder
    .setChartType('bar')
    .setDimensions(['store'])
    .setMeasures(['sales'])
    .build();

  const vchartSpec = VizSeedBuilder.from(vizSeedDSL).buildSpec();

  return { vizSeedDSL, vchartSpec };
}

// 执行并保存
try {
  const { vizSeedDSL, vchartSpec } = buildBarChart();
  const outputDir = path.join(__dirname, 'outputs');
  const specFile = path.join(outputDir, 'latest-spec.json');
  const webSpecFile = path.join(__dirname, '..', 'web', 'latest-spec.json');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const specData = {
    timestamp: new Date().toISOString(),
    chartType: 'bar',
    description: '基础水平条形图 - 显示各店铺销售额',
    spec: vchartSpec,
    vizSeedDSL: vizSeedDSL,
    chartInfo: {
      type: vchartSpec.type,
      direction: vchartSpec.direction || 'vertical',
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
  
  console.log('BAR图规范生成成功！');
} catch (error) {
  console.error('生成BAR图规范失败:', error);
  process.exit(1);
}