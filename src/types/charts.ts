import { z } from 'zod';

export enum ChartType {
  BAR = 'bar',           // 柱状图
  COLUMN = 'column',     // 条形图  
  LINE = 'line',         // 折线图
  AREA = 'area',         // 面积图
  SCATTER = 'scatter',   // 散点图
  PIE = 'pie',           // 饼图
  DONUT = 'donut',       // 环形图
  TABLE = 'table'        // 表格
}

// Zod schema用于验证和转换字符串为ChartType枚举
export const ChartTypeSchema = z.enum([
  'bar', 'column', 'line', 'area', 'scatter', 'pie', 'donut', 'table'
]).transform((value) => {
  // 将字符串转换为对应的枚举值
  const enumMap: Record<string, ChartType> = {
    'bar': ChartType.BAR,
    'column': ChartType.COLUMN,
    'line': ChartType.LINE,
    'area': ChartType.AREA,
    'scatter': ChartType.SCATTER,
    'pie': ChartType.PIE,
    'donut': ChartType.DONUT,
    'table': ChartType.TABLE
  };
  return enumMap[value];
});

// 便捷函数：将字符串转换为ChartType枚举
export function parseChartType(input: string): ChartType {
  return ChartTypeSchema.parse(input);
}

// 获取所有支持的图表类型字符串
export function getSupportedChartTypes(): string[] {
  return ['bar', 'column', 'line', 'area', 'scatter', 'pie', 'donut', 'table'];
}

// 通道映射接口 - 仅供内部自动映射使用
export interface ChannelMapping {
  // 通用通道
  x?: string;           // X轴字段（通常是指标）
  y?: string;           // Y轴字段（可以是维度或指标）
  color?: string;       // 颜色字段（维度）
  group?: string;       // 分组字段（维度）
  
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
  mapping?: ChannelMapping; // 改为可选，由自动映射模块填充
}

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