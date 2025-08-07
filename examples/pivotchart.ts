import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 从JSON文件导入透视图演示数据
const pivotChartData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'pivotChartExampleData.json'), 'utf8')
);

// 原始内联数据（注释保存）
/*
const pivotChartDataInline = [
    // Consumer 消费者群体数据 - 2015年
    { "Segment-Indicator": "Consumer-Quantity", "Region": "Central", "Category": "Furniture", "Quantity": "16", "Sales": "2580", "Profit": "412", "Sub-Category": "Chairs", "Order Year": "2015", "Segment": "Consumer", "Ship Mode": "First Class" },
    { "Segment-Indicator": "Consumer-Sales", "Region": "East", "Category": "Technology", "Quantity": "12", "Sales": "1800", "Profit": "360", "Sub-Category": "Phones", "Order Year": "2015", "Segment": "Consumer", "Ship Mode": "Standard Class" },
    { "Segment-Indicator": "Consumer-Profit", "Region": "West", "Category": "Office Supplies", "Quantity": "25", "Sales": "625", "Profit": "125", "Sub-Category": "Binders", "Order Year": "2015", "Segment": "Consumer", "Ship Mode": "Second Class" },
    
    // Corporate 企业群体数据 - 2015年
    { "Segment-Indicator": "Corporate-Quantity", "Region": "Central", "Category": "Furniture", "Quantity": "34", "Sales": "6800", "Profit": "1360", "Sub-Category": "Tables", "Order Year": "2015", "Segment": "Corporate", "Ship Mode": "First Class" },
    { "Segment-Indicator": "Corporate-Sales", "Region": "South", "Category": "Technology", "Quantity": "28", "Sales": "4200", "Profit": "840", "Sub-Category": "Accessories", "Order Year": "2015", "Segment": "Corporate", "Ship Mode": "Standard Class" },
    { "Segment-Indicator": "Corporate-Profit", "Region": "East", "Category": "Office Supplies", "Quantity": "45", "Sales": "1350", "Profit": "270", "Sub-Category": "Storage", "Order Year": "2015", "Segment": "Corporate", "Ship Mode": "Second Class" },
    
    // Home Office 家庭办公群体数据 - 2015年
    { "Segment-Indicator": "Home Office-Quantity", "Region": "West", "Category": "Furniture", "Quantity": "19", "Sales": "3800", "Profit": "760", "Sub-Category": "Bookcases", "Order Year": "2015", "Segment": "Home Office", "Ship Mode": "First Class" },
    { "Segment-Indicator": "Home Office-Sales", "Region": "Central", "Category": "Technology", "Quantity": "15", "Sales": "7500", "Profit": "1500", "Sub-Category": "Machines", "Order Year": "2015", "Segment": "Home Office", "Ship Mode": "Standard Class" },
    { "Segment-Indicator": "Home Office-Profit", "Region": "South", "Category": "Office Supplies", "Quantity": "38", "Sales": "760", "Profit": "152", "Sub-Category": "Paper", "Order Year": "2015", "Segment": "Home Office", "Ship Mode": "Second Class" },

    // Consumer 消费者群体数据 - 2016年
    { "Segment-Indicator": "Consumer-Quantity", "Region": "Central", "Category": "Furniture", "Quantity": "22", "Sales": "3520", "Profit": "704", "Sub-Category": "Furnishings", "Order Year": "2016", "Segment": "Consumer", "Ship Mode": "First Class" },
    { "Segment-Indicator": "Consumer-Sales", "Region": "East", "Category": "Technology", "Quantity": "18", "Sales": "2700", "Profit": "540", "Sub-Category": "Copiers", "Order Year": "2016", "Segment": "Consumer", "Ship Mode": "Standard Class" },
    { "Segment-Indicator": "Consumer-Profit", "Region": "West", "Category": "Office Supplies", "Quantity": "31", "Sales": "930", "Profit": "186", "Sub-Category": "Art", "Order Year": "2016", "Segment": "Consumer", "Ship Mode": "Second Class" },
    { "Segment-Indicator": "Consumer-Quantity", "Region": "South", "Category": "Furniture", "Quantity": "27", "Sales": "4050", "Profit": "810", "Sub-Category": "Tables", "Order Year": "2016", "Segment": "Consumer", "Ship Mode": "First Class" },
    
    // Corporate 企业群体数据 - 2016年
    { "Segment-Indicator": "Corporate-Sales", "Region": "South", "Category": "Furniture", "Quantity": "42", "Sales": "10500", "Profit": "2100", "Sub-Category": "Chairs", "Order Year": "2016", "Segment": "Corporate", "Ship Mode": "First Class" },
    { "Segment-Indicator": "Corporate-Profit", "Region": "West", "Category": "Technology", "Quantity": "26", "Sales": "3900", "Profit": "780", "Sub-Category": "Phones", "Order Year": "2016", "Segment": "Corporate", "Ship Mode": "Standard Class" },
    { "Segment-Indicator": "Corporate-Quantity", "Region": "Central", "Category": "Office Supplies", "Quantity": "52", "Sales": "1560", "Profit": "312", "Sub-Category": "Labels", "Order Year": "2016", "Segment": "Corporate", "Ship Mode": "Second Class" },
    { "Segment-Indicator": "Corporate-Sales", "Region": "East", "Category": "Technology", "Quantity": "35", "Sales": "5250", "Profit": "1050", "Sub-Category": "Appliances", "Order Year": "2016", "Segment": "Corporate", "Ship Mode": "Standard Class" },
    
    // Home Office 家庭办公群体数据 - 2016年
    { "Segment-Indicator": "Home Office-Profit", "Region": "East", "Category": "Furniture", "Quantity": "29", "Sales": "5800", "Profit": "1160", "Sub-Category": "Tables", "Order Year": "2016", "Segment": "Home Office", "Ship Mode": "First Class" },
    { "Segment-Indicator": "Home Office-Quantity", "Region": "South", "Category": "Technology", "Quantity": "21", "Sales": "8400", "Profit": "1680", "Sub-Category": "Appliances", "Order Year": "2016", "Segment": "Home Office", "Ship Mode": "Standard Class" },
    { "Segment-Indicator": "Home Office-Sales", "Region": "West", "Category": "Office Supplies", "Quantity": "47", "Sales": "1410", "Profit": "282", "Sub-Category": "Supplies", "Order Year": "2016", "Segment": "Home Office", "Ship Mode": "Second Class" },
    { "Segment-Indicator": "Home Office-Profit", "Region": "Central", "Category": "Office Supplies", "Quantity": "33", "Sales": "990", "Profit": "198", "Sub-Category": "Envelopes", "Order Year": "2016", "Segment": "Home Office", "Ship Mode": "First Class" },

    // 2017年更多数据
    { "Segment-Indicator": "Consumer-Quantity", "Region": "Central", "Category": "Technology", "Quantity": "24", "Sales": "3600", "Profit": "720", "Sub-Category": "Machines", "Order Year": "2017", "Segment": "Consumer", "Ship Mode": "First Class" },
    { "Segment-Indicator": "Corporate-Sales", "Region": "East", "Category": "Furniture", "Quantity": "38", "Sales": "9500", "Profit": "1900", "Sub-Category": "Bookcases", "Order Year": "2017", "Segment": "Corporate", "Ship Mode": "Standard Class" },
    { "Segment-Indicator": "Home Office-Profit", "Region": "West", "Category": "Technology", "Quantity": "16", "Sales": "6400", "Profit": "1280", "Sub-Category": "Copiers", "Order Year": "2017", "Segment": "Home Office", "Ship Mode": "Second Class" },
    { "Segment-Indicator": "Consumer-Sales", "Region": "South", "Category": "Office Supplies", "Quantity": "41", "Sales": "1230", "Profit": "246", "Sub-Category": "Fasteners", "Order Year": "2017", "Segment": "Consumer", "Ship Mode": "Standard Class" }
];
*/

// 构建透视图 - 在透视表单元格中嵌入VChart图表
function buildPivotChart() {
    // 为 Quantity 创建VizSeedDSL
    const quantityDSL = new VizSeedBuilder(pivotChartData)
        .setChartType('column')
        .setDimensions(['Sub-Category'])  // 配置维度
        .setMeasures(['Quantity'])        // 配置指标
        .build();  // 生成VizSeedDSL
    // 为 Sales 创建VizSeedDSL
    const salesDSL = new VizSeedBuilder(pivotChartData)
        .setChartType('line')
        .setDimensions(['Sub-Category', 'Segment-Indicator'])  // 配置维度
        .setMeasures(['Quantity'])           // 配置指标
        .build();  // 生成VizSeedDSL



    const builder = new VizSeedBuilder(pivotChartData);

    const vizSeedDSL = builder
        .setChartType('pivotchart')
        .setRowDimensions(['Order Year', 'Ship Mode'])     // 行维度：地区、子类别
        .setColumnDimensions(['Region', 'Category']) // 列维度：年份、配送方式
        .setMeasures(['Quantity'])     // 指标：数量、销售额、利润
        // 使用新的API配置每个指标的VizSeedDSL
        .setIndicatorChart('Quantity', quantityDSL)
        // .setIndicatorChart('Sales', salesDSL)
        .setStyle({
            theme: 'DEFAULT',
            autoWrapText: true,
            corner: {
                titleOnDimension: 'row'
            }
        })
        .build();

    // 生成VTable透视图规范
    const vtablePivotChartSpec = VizSeedBuilder.from(vizSeedDSL).buildSpec();

    return { vizSeedDSL, vtablePivotChartSpec };
}

// 执行并保存
try {
    // 生成透视图
    const { vizSeedDSL: pivotChartDSL, vtablePivotChartSpec: pivotChartSpec } = buildPivotChart();
    console.log('✅ 透视图生成成功！');

    // 保存结果
    const outputDir = path.join(__dirname, 'outputs');
    const specFile = path.join(outputDir, 'latest-spec.json');
    const webSpecFile = path.join(__dirname, '..', 'web', 'latest-spec.json');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 保存透视图规范
    const specData = {
        timestamp: new Date().toISOString(),
        chartType: 'pivotchart',
        description: '企业分析透视图 - 按地区和子类别分析年度配送方式的销售指标(完全模仿example.ts格式)',
        spec: pivotChartSpec,
        vizSeedDSL: pivotChartDSL,
        chartInfo: {
            type: pivotChartSpec.type,
            dataCount: pivotChartSpec.records?.length || 0,
            rowDimensionCount: pivotChartSpec.rows?.length || 0,
            columnDimensionCount: pivotChartSpec.columns?.length || 0,
            indicatorCount: pivotChartSpec.indicators?.length || 0,
            fields: {
                rowDimensions: pivotChartDSL.rowDimensions,
                columnDimensions: pivotChartDSL.columnDimensions,
                measures: pivotChartDSL.measures
            },
            chartTypes: {
                Quantity: 'bar (自定义配置)',
                Sales: 'bar (自定义配置)',
                Profit: 'line (自定义配置)'
            },
            dataFormat: 'example.ts格式 - 包含Segment-Indicator、Sub-Category、Ship Mode等完整字段'
        }
    };

    fs.writeFileSync(specFile, JSON.stringify(specData, null, 2), 'utf8');
    fs.writeFileSync(webSpecFile, JSON.stringify(specData, null, 2), 'utf8');


} catch (error) {
    console.error('❌ 生成透视图失败:', error);
    if (error instanceof Error) {
        console.error('错误详情:', error.message);
        console.error('错误堆栈:', error.stack);
    }
    process.exit(1);
}