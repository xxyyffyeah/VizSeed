export type ChartType = 
  | 'bar'           // 柱状图
  | 'column'        // 条形图  
  | 'line'          // 折线图
  | 'area'          // 面积图
  | 'scatter'       // 散点图
  | 'pie'           // 饼图
  | 'donut'         // 环形图
  | 'table';        // 表格

// 通道映射接口
export interface ChannelMapping {
  // 通用通道
  x?: string;           // X轴字段（通常是指标）
  y?: string;           // Y轴字段（可以是维度或指标）
  color?: string;       // 颜色字段（维度）
  
  // 饼图专用
  category?: string;    // 分类字段（维度）
  value?: string;       // 数值字段（指标）
  
  // 表格专用
  rowDimension?: string;    // 行维度
  columnDimension?: string; // 列维度
  measure?: string;         // 指标字段
}

export interface ChartConfig {
  type: ChartType;
  mapping: ChannelMapping;
}

// // 图表类型约束配置
// export interface ChartRequirement {
//   required: string[];    // 必须的通道
//   optional: string[];    // 可选的通道
//   minFields: number;     // 最少字段数
//   validation?: (mapping: ChannelMapping) => boolean; // 自定义验证
// }

// 图表类型约束配置
// export const CHART_REQUIREMENTS: Record<ChartType, ChartRequirement> = {
//   line: {
//     required: ['x'],
//     optional: ['y', 'color'],
//     minFields: 1,
//     validation: (mapping) => !!mapping.x
//   },
//   scatter: {
//     required: ['x', 'y'],
//     optional: ['color'],
//     minFields: 2,
//     validation: (mapping) => !!mapping.x && !!mapping.y
//   },
//   pie: {
//     required: ['category', 'value'],
//     optional: [],
//     minFields: 2,
//     validation: (mapping) => !!mapping.category && !!mapping.value
//   },
//   table: {
//     required: [],
//     optional: ['rowDimension', 'columnDimension', 'measure'],
//     minFields: 0
//   },
//   // 保留其他类型以免编译错误
//   bar: {
//     required: ['y'],
//     optional: ['x', 'color'],
//     minFields: 1,
//     validation: (mapping) => !!mapping.y || !!mapping.value
//   },
//   column: {
//     required: ['y'],
//     optional: ['x', 'color'],
//     minFields: 1,
//     validation: (mapping) => !!mapping.y || !!mapping.value
//   },
//   area: {
//     required: ['x'],
//     optional: ['y', 'color'],
//     minFields: 1,
//     validation: (mapping) => !!mapping.x
//   },
//   donut: {
//     required: ['category', 'value'],
//     optional: [],
//     minFields: 2,
//     validation: (mapping) => !!mapping.category && !!mapping.value
//   }
// } as const;

// 通道定义接口
export interface ChartChannels {
  dimensionChannels: string[];  // 维度通道
  measureChannels: string[];    // 指标通道
}

// 图表数据结构要求
export interface ChartDataRequirement {
  channels: ChartChannels;      // 通道配置
  idealDimensions: number;      // 理想维度数量
  idealMeasures: number;        // 理想指标数量
  minDimensions: number;        // 最小维度数量
  minMeasures: number;          // 最小指标数量
  chartType: string;            // 图表类型
}
// 图表类型数据要求配置
export const CHART_DATA_REQUIREMENTS: Record<ChartType, ChartDataRequirement> = {
  bar: {
    channels: {
      dimensionChannels: ['x', 'color'],
      measureChannels: ['y']
    },
    idealDimensions: 1,
    idealMeasures: 1,
    minDimensions: 1,
    minMeasures: 1,
    chartType: 'bar'
  },
  column: {
    channels: {
      dimensionChannels: ['x', 'color'],
      measureChannels: ['y']
    },
    idealDimensions: 1,
    idealMeasures: 1,
    minDimensions: 1,
    minMeasures: 1,
    chartType: 'column'
  },
  line: {
    channels: {
      dimensionChannels: ['x', 'color'],
      measureChannels: ['y']
    },
    idealDimensions: 1,
    idealMeasures: 1,
    minDimensions: 1,
    minMeasures: 1,
    chartType: 'line'
  },
  area: {
    channels: {
      dimensionChannels: ['x', 'color'],
      measureChannels: ['y']
    },
    idealDimensions: 1,
    idealMeasures: 1,
    minDimensions: 1,
    minMeasures: 1,
    chartType: 'area'
  },
  scatter: {
    channels: {
      dimensionChannels: ['color'],
      measureChannels: ['x', 'y']
    },
    idealDimensions: 0,
    idealMeasures: 2,
    minDimensions: 0,
    minMeasures: 2,
    chartType: 'scatter'
  },
  pie: {
    channels: {
      dimensionChannels: ['category'],
      measureChannels: ['value']
    },
    idealDimensions: 1,
    idealMeasures: 1,
    minDimensions: 1,
    minMeasures: 1,
    chartType: 'pie'
  },
  donut: {
    channels: {
      dimensionChannels: ['category'],
      measureChannels: ['value']
    },
    idealDimensions: 1,
    idealMeasures: 1,
    minDimensions: 1,
    minMeasures: 1,
    chartType: 'donut'
  },
  table: {
    channels: {
      dimensionChannels: ['rowDimension', 'columnDimension'],
      measureChannels: ['measure']
    },
    idealDimensions: 1,
    idealMeasures: 1,
    minDimensions: 0,
    minMeasures: 0,
    chartType: 'table'
  }
};