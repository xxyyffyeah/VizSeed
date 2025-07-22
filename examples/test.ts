import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 输出收集器
const outputCollector: string[] = [];
const originalConsoleLog = console.log;

// 重写console.log以收集输出
console.log = (...args: any[]) => {
  const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)).join(' ');
  outputCollector.push(message);
  originalConsoleLog(...args); // 同时输出到控制台
};

console.log('=== 🥧 VChart 饼图演示 ===\n');

// 原始输入数据
console.log('📊 原始输入:');
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
console.log(JSON.stringify(salesData, null, 2));

// 构建VizSeed和Spec的异步函数
async function buildChartExample() {
  const builder = new VizSeedBuilder(salesData);
  
  console.log('\n⏳ 构建VizSeed DSL...');
  const vizSeedDSL = await builder
    .setChartType('bar')
    .setDimensions(['store', 'city', 'category', 'brand'])
    // .setDimensions([])
    // .setMeasures(['sales', 'profit', 'cost', 'quantity', 'rating'])
    .setMeasures(['sales'])
    .build();

  console.log('⏳ 构建VChart规范...');
  const vchartSpec = await builder.buildSpec();

  return { vizSeedDSL, vchartSpec };
}

// 执行异步函数
buildChartExample().then(({ vizSeedDSL, vchartSpec }) => {

// VizSeed DSL
console.log('\n📋 VizSeed DSL:');
console.log(JSON.stringify(vizSeedDSL, null, 2));

// VChart Spec
console.log('\n🎨 VChart Spec:');
console.log(JSON.stringify(vchartSpec, null, 2));

// 恢复原始console.log
console.log = originalConsoleLog;

// 保存输出到文件
const outputDir = path.join(__dirname, 'outputs');
const outputFile = path.join(outputDir, 'vchart-pie-demo-output.txt');
const specFile = path.join(outputDir, 'latest-spec.json');
const webSpecFile = path.join(__dirname, '..', 'web', 'latest-spec.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputText = outputCollector.join('\n');
fs.writeFileSync(outputFile, outputText, 'utf8');

// 保存spec到JSON文件（给网页使用）
const specData = {
  timestamp: new Date().toISOString(),
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

console.log(`\n📁 输出已保存到: ${outputFile}`);
console.log(`📊 Spec已保存到: ${specFile}`);
console.log(`🌐 Web Spec已保存到: ${webSpecFile}`);
}).catch(error => {
  console.error('❌ 构建示例失败:', error);
  process.exit(1);
});