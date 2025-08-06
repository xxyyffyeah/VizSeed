import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 销售数据 - 适合表格展示的详细数据
const salesData = [
    {
        "product_name": "苹果",
        "category": "水果",
        "region": "华北",
        "sales": 1200,
        "profit": 240,
        "date": "2024-01-15"
    },
    {
        "product_name": "香蕉",
        "category": "水果", 
        "region": "华南",
        "sales": 800,
        "profit": 160,
        "date": "2024-01-15"
    },
    {
        "product_name": "牛奶",
        "category": "乳制品",
        "region": "华东",
        "sales": 1500,
        "profit": 450,
        "date": "2024-01-16"
    },
    {
        "product_name": "面包",
        "category": "面包",
        "region": "华北",
        "sales": 600,
        "profit": 180,
        "date": "2024-01-16"
    },
    {
        "product_name": "鸡蛋",
        "category": "蛋类",
        "region": "华中",
        "sales": 900,
        "profit": 270,
        "date": "2024-01-17"
    },
    {
        "product_name": "猪肉",
        "category": "肉类",
        "region": "华南",
        "sales": 2000,
        "profit": 400,
        "date": "2024-01-17"
    },
    {
        "product_name": "大米",
        "category": "粮食",
        "region": "华东",
        "sales": 1800,
        "profit": 360,
        "date": "2024-01-18"
    },
    {
        "product_name": "橙子",
        "category": "水果",
        "region": "华中",
        "sales": 1100,
        "profit": 220,
        "date": "2024-01-18"
    }
];

// 构建表格 - 同步版本
function buildTable() {
    const builder = new VizSeedBuilder(salesData);

    const vizSeedDSL = builder
        .setChartType('table')
        .setDimensions(['product_name', 'category', 'region', 'date'])  // 设置维度字段
        .setMeasures(['sales', 'profit'])  // 设置数值字段
        .setStyle({
            // 表格样式配置
            theme: 'DEFAULT',
            widthMode: 'standard',
            heightMode: 'autoHeight',
            autoWrapText: true,
            columnHeaderTitle: {
                textAlign: 'center',
                textBaseline: 'middle'
            },
            bodyStyle: {
                textAlign: 'center',
                textBaseline: 'middle'
            }
        })
        .build();

    // 生成VTable规范
    const vtableSpec = VizSeedBuilder.from(vizSeedDSL).buildSpec();

    return { vizSeedDSL, vtableSpec };
}

// 执行并保存
try {
    const { vizSeedDSL, vtableSpec } = buildTable();
    const outputDir = path.join(__dirname, 'outputs');
    const specFile = path.join(outputDir, 'latest-spec.json');
    const webSpecFile = path.join(__dirname, '..', 'web', 'latest-spec.json');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const specData = {
        timestamp: new Date().toISOString(),
        chartType: 'table',
        description: '表格 - 显示产品销售数据详情',
        spec: vtableSpec,
        vizSeedDSL: vizSeedDSL,
        chartInfo: {
            type: vtableSpec.type,
            dataCount: vtableSpec.records?.length || 0,
            fields: {
                dimensions: ['product_name', 'category', 'region', 'date'],
                measures: ['sales', 'profit']
            }
        }
    };

    fs.writeFileSync(specFile, JSON.stringify(specData, null, 2), 'utf8');
    fs.writeFileSync(webSpecFile, JSON.stringify(specData, null, 2), 'utf8');

    console.log('表格规范生成成功！');
    console.log('VizSeed DSL:', JSON.stringify(vizSeedDSL, null, 2));
    console.log('VTable Spec:', JSON.stringify(vtableSpec, null, 2));
} catch (error) {
    console.error('生成表格规范失败:', error);
    if (error instanceof Error) {
        console.error('错误详情:', error.message);
        console.error('错误堆栈:', error.stack);
    }
    process.exit(1);
}