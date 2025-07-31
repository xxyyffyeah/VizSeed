import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 销售数据 - 适合饼图的汇总数据，增加地区维度
const salesData = [
  { category: '手机', region: '北京', sales: 54000, profit: 10800 },
  { category: '平板', region: '北京', sales: 15000, profit: 3000 },
  { category: '笔记本', region: '北京', sales: 32000, profit: 6400 },
  { category: '配件', region: '北京', sales: 8000, profit: 2400 },
  { category: '手机', region: '上海', sales: 45000, profit: 9000 },
  { category: '平板', region: '上海', sales: 12000, profit: 2400 },
  { category: '笔记本', region: '上海', sales: 28000, profit: 5600 },
  { category: '配件', region: '上海', sales: 6000, profit: 1800 }
];

// 构建饼图 - 同步版本
function buildPieChart() {
  const builder = new VizSeedBuilder(salesData);

  const vizSeedDSL = builder
    .setChartType('pie')
    .setDimensions(['category'])
    .setMeasures(['sales'])
    .build();

  const vchartSpec = VizSeedBuilder.from(vizSeedDSL).buildSpec();

  return { vizSeedDSL, vchartSpec };
}

// 执行并保存
try {
  const { vizSeedDSL, vchartSpec } = buildPieChart();
  const outputDir = path.join(__dirname, 'outputs');
  const specFile = path.join(outputDir, 'latest-spec.json');
  const webSpecFile = path.join(__dirname, '..', 'web', 'latest-spec.json');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const specData = {
    timestamp: new Date().toISOString(),
    chartType: 'pie',
    description: '饼图 - 显示各产品类别的销售额占比',
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
  
  console.log('饼图规范生成成功！');
} catch (error) {
  console.error('生成饼图规范失败:', error);
  process.exit(1);
}