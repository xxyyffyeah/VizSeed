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
  { region: '华东', sales: 2800 },
  { region: '华北', sales: 2200 },
  { region: '华南', sales: 1900 },
  { region: '华中', sales: 1600 },
  { region: '西北', sales: 1200 },
  { region: '西南', sales: 1000 }
];
console.log(JSON.stringify(salesData, null, 2));

// 构建VizSeed和Spec
const builder = new VizSeedBuilder(salesData);
const vizSeedDSL = builder
  .setChartType('pie')
  .setCategoryField('region')
  .setValueField('sales')
  .setTitle('各地区销售额占比')
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