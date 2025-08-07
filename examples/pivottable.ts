import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 透视表演示数据 - 多维业务数据分析场景
const pivotData = [
    // 2023年数据
    { "region": "华北", "product": "iPhone", "quarter": "Q1", "year": 2023, "sales": 12000, "profit": 2400 },
    { "region": "华北", "product": "iPhone", "quarter": "Q2", "year": 2023, "sales": 15000, "profit": 3000 },
    { "region": "华北", "product": "iPhone", "quarter": "Q3", "year": 2023, "sales": 18000, "profit": 3600 },
    { "region": "华北", "product": "iPhone", "quarter": "Q4", "year": 2023, "sales": 22000, "profit": 4400 },
    
    { "region": "华北", "product": "MacBook", "quarter": "Q1", "year": 2023, "sales": 8000, "profit": 1600 },
    { "region": "华北", "product": "MacBook", "quarter": "Q2", "year": 2023, "sales": 9500, "profit": 1900 },
    { "region": "华北", "product": "MacBook", "quarter": "Q3", "year": 2023, "sales": 11000, "profit": 2200 },
    { "region": "华北", "product": "MacBook", "quarter": "Q4", "year": 2023, "sales": 13500, "profit": 2700 },
    
    { "region": "华南", "product": "iPhone", "quarter": "Q1", "year": 2023, "sales": 15000, "profit": 3000 },
    { "region": "华南", "product": "iPhone", "quarter": "Q2", "year": 2023, "sales": 18000, "profit": 3600 },
    { "region": "华南", "product": "iPhone", "quarter": "Q3", "year": 2023, "sales": 21000, "profit": 4200 },
    { "region": "华南", "product": "iPhone", "quarter": "Q4", "year": 2023, "sales": 25000, "profit": 5000 },
    
    { "region": "华南", "product": "MacBook", "quarter": "Q1", "year": 2023, "sales": 9000, "profit": 1800 },
    { "region": "华南", "product": "MacBook", "quarter": "Q2", "year": 2023, "sales": 11000, "profit": 2200 },
    { "region": "华南", "product": "MacBook", "quarter": "Q3", "year": 2023, "sales": 13000, "profit": 2600 },
    { "region": "华南", "product": "MacBook", "quarter": "Q4", "year": 2023, "sales": 15500, "profit": 3100 },
    
    // 2024年数据
    { "region": "华北", "product": "iPhone", "quarter": "Q1", "year": 2024, "sales": 25000, "profit": 5000 },
    { "region": "华北", "product": "iPhone", "quarter": "Q2", "year": 2024, "sales": 28000, "profit": 5600 },
    { "region": "华北", "product": "MacBook", "quarter": "Q1", "year": 2024, "sales": 16000, "profit": 3200 },
    { "region": "华北", "product": "MacBook", "quarter": "Q2", "year": 2024, "sales": 18500, "profit": 3700 },
    
    { "region": "华南", "product": "iPhone", "quarter": "Q1", "year": 2024, "sales": 28000, "profit": 5600 },
    { "region": "华南", "product": "iPhone", "quarter": "Q2", "year": 2024, "sales": 32000, "profit": 6400 },
    { "region": "华南", "product": "MacBook", "quarter": "Q1", "year": 2024, "sales": 18000, "profit": 3600 },
    { "region": "华南", "product": "MacBook", "quarter": "Q2", "year": 2024, "sales": 21000, "profit": 4200 }
];

// 构建透视表 - 使用新增的行列维度API
function buildPivotTable() {
    const builder = new VizSeedBuilder(pivotData);

    const vizSeedDSL = builder
        .setChartType('pivottable')
        .setRowDimensions(['region', 'product'])    // 行维度：地区、产品
        .setColumnDimensions(['year', 'quarter'])   // 列维度：年份、季度
        .setMeasures(['sales', 'profit'])           // 指标：销售额、利润
        .setStyle({
            theme: 'DEFAULT',
            autoWrapText: true,
            corner: {
                titleOnDimension: 'row'
            }
        })
        .build();

    // 生成VTable透视表规范
    const vtableSpec = VizSeedBuilder.from(vizSeedDSL).buildSpec();

    return { vizSeedDSL, vtableSpec };
}

// 执行并保存
try {

    // 生成透视表
    const { vizSeedDSL: pivotDSL, vtableSpec: pivotSpec } = buildPivotTable();
    console.log('✅ 透视表生成成功！');

    // 保存结果
    const outputDir = path.join(__dirname, 'outputs');
    const specFile = path.join(outputDir, 'latest-spec.json');
    const webSpecFile = path.join(__dirname, '..', 'web', 'latest-spec.json');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 保存透视表规范为最新规范
    const specData = {
        timestamp: new Date().toISOString(),
        chartType: 'pivottable',
        description: '透视表 - 多维业务数据交叉分析',
        spec: pivotSpec,
        vizSeedDSL: pivotDSL,
        chartInfo: {
            type: pivotSpec.type,
            dataCount: pivotSpec.records?.length || 0,
            rowDimensionCount: pivotSpec.rows?.length || 0,
            columnDimensionCount: pivotSpec.columns?.length || 0,
            indicatorCount: pivotSpec.indicators?.length || 0,
            fields: {
                rowDimensions: pivotDSL.rowDimensions,
                columnDimensions: pivotDSL.columnDimensions,
                measures: pivotDSL.measures
            }
        }
    };

    fs.writeFileSync(specFile, JSON.stringify(specData, null, 2), 'utf8');
    fs.writeFileSync(webSpecFile, JSON.stringify(specData, null, 2), 'utf8');

} catch (error) {
    console.error('❌ 生成透视表失败:', error);
    if (error instanceof Error) {
        console.error('错误详情:', error.message);
        console.error('错误堆栈:', error.stack);
    }
    process.exit(1);
}