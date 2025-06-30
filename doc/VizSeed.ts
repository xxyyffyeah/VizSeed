const vizSeed = {
    chartType: 'bar',
    datasets: [
          { date: '2025-06-04', '__MeasureValue__': 1, '__MeasureName__': 'profit' },
          { date: '2025-06-05', '__MeasureValue__': 2, '__MeasureName__': 'profit' },
          { date: '2025-06-06', '__MeasureValue__': 3, '__MeasureName__': 'profit'},
          { date: '2025-06-04', '__MeasureValue__': 4, '__MeasureName__': 'sales' },
          { date: '2025-06-05', '__MeasureValue__': 5, '__MeasureName__': 'sales' },
          { date: '2025-06-06', '__MeasureValue__': 6, '__MeasureName__': 'sales' },
    ],
    fieldMap:{
        'date': {
            id: 'date',
            type: 'date',
            alias: '日期',
            role: 'dimension',
            unique: true,
            nullable: true,
            domain: ['2025-06-04', '2025-06-05', '2025-06-06]
        },
        'sales': {
            id: 'sales',
            type: 'float',
            alias: '销售额',
            role: 'measure',
            format: {},
        },
        'profit': {
            id: 'profit',
            type: 'float',
            alias: '利润',
            role: 'measure',
            format: {},
        },
        '10001': {
            alias: "指标名称",
        },
        '10002': {
            alias: "指标值",
        },
        '20001': {
            alias: '图例项',
            domain: ['销售额', '利润'],
            format: {},
        },
    },
    visualChannel: [{
        'x': 'date',
        'y': '__MeasureValue__',
        'group': '__MeasureName__',
    }],
    visualStyle: {
        legend: {
            visible: true    
        },
        label: {
            visible: true
        },
        tooltip: {
            visible: true
        }
    }
}