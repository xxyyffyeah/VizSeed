import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 🎯 简单数据
const data = [
  { category: '移动端', value: 45 },
  { category: '桌面端', value: 35 },
  { category: '平板端', value: 20 }
];

// 🔥 仅需一行创建Builder！
const builder = new VizSeedBuilder(data);

// ⚙️ 配置饼图
const vizSeedDSL = builder
  .setChartType('pie')
  .setCategoryField('category')  // 分类字段（维度）
  .setValueField('value')        // 数值字段（指标）
  .setTitle('用户访问设备分布')
  .build();

// 📊 生成图表规范（自动选择VChart）
const vchartSpec = builder.buildSpec();

// 准备输出内容
const output: string[] = [];
output.push('=== 🥧 超简洁饼图演示 ===\n');
output.push('📋 VizSeed DSL:');
output.push(JSON.stringify(vizSeedDSL, null, 2));
output.push('\n🎨 VChart Spec (可直接渲染):');
output.push(JSON.stringify(vchartSpec, null, 2));
output.push('\n✨ 核心流程总结:');
output.push('1️⃣ 准备数据数组');
output.push('2️⃣ new VizSeedBuilder(data)');
output.push('3️⃣ 链式配置图表类型和字段');
output.push('4️⃣ buildSpec() 生成规范');
output.push('🎊 完成！可直接用于VChart渲染');

// 输出到控制台
const outputText = output.join('\n');
console.log(outputText);

// 写入文件
const outputDir = path.join(__dirname, 'outputs');
const outputFile = path.join(outputDir, 'simple-pie-demo-output.txt');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, outputText, 'utf8');

console.log(`\n📁 输出已保存到: ${outputFile}`);