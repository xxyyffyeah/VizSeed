import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 销售数据 - 适合环形图的汇总数据
const salesData = [
  { category: '手机', sales: 54000, profit: 10800 },
  { category: '平板', sales: 15000, profit: 3000 },
  { category: '笔记本', sales: 32000, profit: 6400 },
  { category: '配件', sales: 8000, profit: 2400 }
];

// 构建环形图
async function buildDonutChart() {
  const builder = new VizSeedBuilder(salesData);

  const vizSeedDSL = await builder
    .setChartType('donut')
    .setDimensions(['category'])
    .setMeasures(['sales'])
    .build();

  const vchartSpec = await VizSeedBuilder.from(vizSeedDSL).buildSpec();

  return { vizSeedDSL, vchartSpec };
}

// 执行并保存
buildDonutChart().then(({ vizSeedDSL, vchartSpec }) => {
  const outputDir = path.join(__dirname, 'outputs');
  const specFile = path.join(outputDir, 'latest-spec.json');
  const webSpecFile = path.join(__dirname, '..', 'web', 'latest-spec.json');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const specData = {
    timestamp: new Date().toISOString(),
    chartType: 'donut',
    description: '环形图 - 显示各产品类别的销售额占比（中心空洞）',
    spec: vchartSpec,
    vizSeedDSL: vizSeedDSL,
    chartInfo: {
      type: vchartSpec.type,
      dataCount: vchartSpec.data.length,
      fields: {
        angle: vchartSpec.angleField || vchartSpec.valueField,
        category: vchartSpec.categoryField
      }
    }
  };

  fs.writeFileSync(specFile, JSON.stringify(specData, null, 2), 'utf8');
  fs.writeFileSync(webSpecFile, JSON.stringify(specData, null, 2), 'utf8');
}).catch(() => {
  process.exit(1);
});