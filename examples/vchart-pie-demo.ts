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
  { store: '苹果专卖店', city: '北京', category: '手机', brand: 'iPhone', sales: 15000, profit: 3000 },
  { store: '苹果专卖店', city: '北京', category: '手机', brand: 'Samsung', sales: 8000, profit: 1600 },
  { store: '苹果专卖店', city: '北京', category: '平板', brand: 'iPad', sales: 6000, profit: 1200 },
  { store: '电子城', city: '上海', category: '手机', brand: 'iPhone', sales: 12000, profit: 2400 },
  { store: '电子城', city: '上海', category: '手机', brand: 'Samsung', sales: 9000, profit: 1800 },
  { store: '电子城', city: '上海', category: '平板', brand: 'iPad', sales: 5000, profit: 1000 },
  { store: '数码广场', city: '广州', category: '手机', brand: 'iPhone', sales: 10000, profit: 2000 },
  { store: '数码广场', city: '广州', category: '平板', brand: 'iPad', sales: 4000, profit: 800 }
];
console.log(JSON.stringify(salesData, null, 2));

// 构建VizSeed和Spec
const builder = new VizSeedBuilder(salesData);
const vizSeedDSL = builder
  .setChartType('pie')
  .setDimensions(['store', 'city', 'category', 'brand'])
  .setMeasures(['sales', 'profit'])
  .build();

const vchartSpec = builder.buildSpec();

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

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputText = outputCollector.join('\n');
fs.writeFileSync(outputFile, outputText, 'utf8');

console.log(`\n📁 输出已保存到: ${outputFile}`);