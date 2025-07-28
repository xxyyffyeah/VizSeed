import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 销售数据 - 多店铺多城市分组数据
const salesData = [
  { store: '苹果专卖店', city: '北京', sales: 15000, profit: 3000 },
  { store: '苹果专卖店', city: '上海', sales: 8000, profit: 1600 },
  { store: '苹果专卖店', city: '广州', sales: 6000, profit: 1200 },
  { store: '电子城', city: '北京', sales: 12000, profit: 2400 },
  { store: '电子城', city: '上海', sales: 9000, profit: 1800 },
  { store: '电子城', city: '广州', sales: 5000, profit: 1000 },
  { store: '数码广场', city: '北京', sales: 10000, profit: 2000 },
  { store: '数码广场', city: '上海', sales: 4000, profit: 800 }
];

// 构建分组条形图
function buildColumnGroupedChart() {
  const builder = new VizSeedBuilder(salesData);

  const vizSeedDSL = builder
    .setChartType('column_grouped')
    .setDimensions(['store', 'city'])
    .setMeasures(['sales', 'profit'])
    .build();

  const vchartSpec = VizSeedBuilder.from(vizSeedDSL).buildSpec();

  return { vizSeedDSL, vchartSpec };
}

// 执行并保存
try {
  const { vizSeedDSL, vchartSpec } = buildColumnGroupedChart();
  const outputDir = path.join(__dirname, 'outputs');
  const specFile = path.join(outputDir, 'latest-spec.json');
  const webSpecFile = path.join(__dirname, '..', 'web', 'latest-spec.json');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const specData = {
    timestamp: new Date().toISOString(),
    chartType: 'column_grouped',
    description: '分组垂直条形图 - 显示各店铺按城市分组的销售额和利润并排显示',
    spec: vchartSpec,
    vizSeedDSL: vizSeedDSL,
    chartInfo: {
      type: vchartSpec.type,
      direction: vchartSpec.direction,
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
  
  console.log('COLUMN_GROUPED图规范生成成功！');
} catch (error) {
  console.error('生成COLUMN_GROUPED图规范失败:', error);
  process.exit(1);
}