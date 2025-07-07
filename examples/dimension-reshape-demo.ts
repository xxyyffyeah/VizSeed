import { VizSeedBuilder } from '../src';
import { ChartType } from '../src/types/charts';
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

console.log('=== 🔄 维度重塑功能演示 ===\n');

// 复杂的多维数据：店铺销售数据
console.log('📊 原始多维数据:');
const complexSalesData = [
  { store: '苹果专卖店', city: '北京', category: '手机', brand: 'iPhone', sales: 15000, profit: 3000 },
  { store: '苹果专卖店', city: '北京', category: '手机', brand: 'Samsung', sales: 8000, profit: 1600 },
  { store: '苹果专卖店', city: '北京', category: '平板', brand: 'iPad', sales: 6000, profit: 1200 },
  { store: '电子城', city: '上海', category: '手机', brand: 'iPhone', sales: 12000, profit: 2400 },
  { store: '电子城', city: '上海', category: '手机', brand: 'Samsung', sales: 9000, profit: 1800 },
  { store: '电子城', city: '上海', category: '平板', brand: 'iPad', sales: 5000, profit: 1000 },
  { store: '数码广场', city: '广州', category: '手机', brand: 'iPhone', sales: 10000, profit: 2000 },
  { store: '数码广场', city: '广州', category: '平板', brand: 'iPad', sales: 4000, profit: 800 }
];

console.log('数据结构: 4个维度 + 2个指标');
console.log('维度: store, city, category, brand');
console.log('指标: sales, profit');
console.log('数据量:', complexSalesData.length);

// 演示1: 饼图自动升维（多指标 → 单指标）
console.log('\n=== 📈 演示1: 饼图自动升维 ===');
console.log('场景: 饼图需要1个维度+1个指标，但原数据有2个指标');

const pieBuilder = new VizSeedBuilder(complexSalesData);
const pieVizSeed = pieBuilder
  .setDimensions(['store', 'city', 'category', 'brand'])
  .setMeasures(['sales', 'profit'])
  .setChartType(ChartType.PIE)
  .setCategoryField('store')
  .setValueField('sales')
  .setTitle('店铺业绩分布')
  .build();

console.log('重塑结果:');
console.log('- 重塑类型:', pieVizSeed.reshapeInfo?.reshapeType);
console.log('- 重塑策略:', pieVizSeed.reshapeStrategy);
console.log('- 原始维度数:', pieVizSeed.reshapeInfo?.originalDimensions?.length);
console.log('- 重塑后维度数:', pieVizSeed.dimensions.length);
console.log('- 原始指标数:', pieVizSeed.reshapeInfo?.originalMeasures?.length);
console.log('- 重塑后指标数:', pieVizSeed.measures.length);
console.log('- 数据量变化:', complexSalesData.length, '->', pieVizSeed.datasets.length);

console.log('\n升维后的数据样例:');
console.log(JSON.stringify(pieVizSeed.datasets.slice(0, 4), null, 2));

// 演示2: 柱状图手动降维（多维度 → 少维度）
console.log('\n=== 📊 演示2: 柱状图手动降维 ===');
console.log('场景: 将brand维度降维，转换为多个指标列');

const barBuilder = new VizSeedBuilder(complexSalesData);
const barVizSeed = barBuilder
  .setDimensions(['store', 'city', 'category', 'brand'])
  .setMeasures(['sales'])
  .setChartType(ChartType.BAR)
  .setXField('store')
  .setYField('sales')
  .setTitle('各店铺品牌销售对比')
  .build();

console.log('降维结果:');
console.log('- 重塑类型:', barVizSeed.reshapeInfo?.reshapeType);
console.log('- 降维的维度:', barVizSeed.reshapeInfo?.reducedDimension);
console.log('- 原始维度:', barVizSeed.reshapeInfo?.originalDimensions);
console.log('- 降维后维度:', barVizSeed.dimensions);
console.log('- 原始指标:', barVizSeed.reshapeInfo?.originalMeasures);
console.log('- 降维后指标:', barVizSeed.measures);

console.log('\n降维后的数据样例:');
console.log(JSON.stringify(barVizSeed.datasets.slice(0, 3), null, 2));

// 演示3: 图表适配分析
console.log('\n=== 🔍 演示3: 图表适配分析 ===');
console.log('场景: 分析数据结构与图表类型的匹配度');

const analysisBuilder = new VizSeedBuilder(complexSalesData);
const analysisResult = analysisBuilder
  .setDimensions(['store', 'city', 'category', 'brand'])
  .setMeasures(['sales', 'profit'])
  .setChartType(ChartType.PIE)
  .setCategoryField('store')
  .setValueField('sales')
  .build();

if (analysisResult.analysisResult) {
  console.log('适配分析结果:');
  console.log('- 当前数据结构:', analysisResult.analysisResult.currentStructure);
  console.log('- 目标图表要求:', analysisResult.analysisResult.targetStructure.description);
  console.log('- 是否需要重塑:', analysisResult.analysisResult.needsReshape);
  console.log('- 建议操作:', analysisResult.analysisResult.strategy.action);
  console.log('- 操作原因:', analysisResult.analysisResult.strategy.reason);
  console.log('- 匹配置信度:', analysisResult.analysisResult.confidence);
}

// 演示4: 生成图表规范
console.log('\n=== 🎨 演示4: 生成图表规范 ===');
console.log('场景: 基于重塑后的数据生成VChart规范');

try {
  const vchartSpec = pieBuilder.buildSpec();
  console.log('VChart饼图规范:');
  console.log(JSON.stringify(vchartSpec, null, 2));
} catch (error: any) {
  console.log('规范生成失败:', error.message);
}

// 演示5: 关闭自动重塑的对比
console.log('\n=== ⚠️ 演示5: 关闭自动重塑的对比 ===');
console.log('场景: 同样的数据和图表类型，但关闭自动重塑');

const noReshapeBuilder = new VizSeedBuilder(complexSalesData);
const noReshapeResult = noReshapeBuilder
  .setDimensions(['store', 'city', 'category', 'brand'])
  .setMeasures(['sales', 'profit'])
  .setChartType(ChartType.PIE)
  .setCategoryField('store')
  .setValueField('sales')
  .build();

console.log('关闭重塑的结果:');
console.log('- 重塑类型:', noReshapeResult.reshapeInfo?.reshapeType || 'none');
console.log('- 维度数量:', noReshapeResult.dimensions.length);
console.log('- 指标数量:', noReshapeResult.measures.length);
console.log('- 数据量:', noReshapeResult.datasets.length);
console.log('⚠️ 注意: 这种情况下数据结构可能不适合饼图要求');

console.log('\n=== 📋 功能总结 ===');
console.log('维度重塑功能提供以下能力:');
console.log('✅ 自动升维: 多指标转为单指标+指标名称维度');
console.log('✅ 手动降维: 指定维度转为多个指标列');
console.log('✅ 智能分析: 自动检测数据结构与图表要求的匹配度');
console.log('✅ 策略建议: 提供最佳的重塑策略和原因');
console.log('✅ 完整追踪: 记录重塑过程和结果信息');
console.log('✅ 类型安全: 保持数据类型和结构的一致性');

// 恢复原始console.log
console.log = originalConsoleLog;

// 保存输出到文件
const outputDir = path.join(__dirname, 'outputs');
const outputFile = path.join(outputDir, 'dimension-reshape-demo-output.txt');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputText = outputCollector.join('\n');
fs.writeFileSync(outputFile, outputText, 'utf8');

console.log(`\n📁 输出已保存到: ${outputFile}`);