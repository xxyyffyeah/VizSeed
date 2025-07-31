import { VizSeedBuilder } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// 销售数据 - 适合饼图的汇总数据，增加地区维度
const salesData = [
    {
        "job_location_preference": "In an Office (with Other Developers)",
        "gender": "Female",
        "count": 1414
    },
    {
        "job_location_preference": "In an Office (with Other Developers)",
        "gender": "Prefer not to say",
        "count": 43
    },
    {
        "job_location_preference": "No Preference",
        "gender": "Prefer not to say",
        "count": 51
    },
    {
        "job_location_preference": "From Home",
        "gender": "Female",
        "count": 775
    },
    {
        "job_location_preference": "No Answer",
        "gender": "Prefer not to say",
        "count": 118
    },
    {
        "job_location_preference": "In an Office (with Other Developers)",
        "gender": "Male",
        "count": 5077
    },
    {
        "job_location_preference": "No Preference",
        "gender": null,
        "count": 40
    },
    {
        "job_location_preference": "No Answer",
        "gender": null,
        "count": 104
    },
    {
        "job_location_preference": "No Preference",
        "gender": "Male",
        "count": 3293
    },
    {
        "job_location_preference": "From Home",
        "gender": null,
        "count": 23
    },
    {
        "job_location_preference": "No Preference",
        "gender": "Female",
        "count": 968
    },
    {
        "job_location_preference": "No Answer",
        "gender": "Female",
        "count": 1824
    },
    {
        "job_location_preference": "From Home",
        "gender": "Male",
        "count": 2055
    },
    {
        "job_location_preference": "In an Office (with Other Developers)",
        "gender": null,
        "count": 82
    },
    {
        "job_location_preference": "No Answer",
        "gender": "Male",
        "count": 7494
    },
    {
        "job_location_preference": "From Home",
        "gender": "Prefer not to say",
        "count": 31
    }
];

// 构建饼图 - 同步版本
function buildPieChart() {
    const builder = new VizSeedBuilder(salesData);

    const vizSeedDSL = builder
        .setChartType('pie')
        .setDimensions(['job_location_preference'])
        .setStyle({
            legend: {
                visible: true,
                orient: 'left',
                position: 'top'
            },
            label: {
                visible: true,
                line: {
                    visible: true,
                },
                position: 'outside',
            },
            color: [
                "#3200A7",
                "#004CDA",
                "#0074F1",
                "#0096EF",
                "#53BFFF",
                "#41C8E6",
                "#30DEDE",
                "#04D9C7",
                "#00EAA2",
                "#A6FF93"
            ],
            pie: {
                innerRadius: 0.5,
                outerRadius: 0.8
            }
        },
        )
        .setMeasures(['count'])
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