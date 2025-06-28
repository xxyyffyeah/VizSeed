export type ChartType = 
  | 'bar'           // 柱状图
  | 'column'        // 条形图  
  | 'line'          // 折线图
  | 'area'          // 面积图
  | 'scatter'       // 散点图
  | 'pie'           // 饼图
  | 'donut'         // 环形图
  | 'table';        // 表格

export type ChartSubType =
  | 'grouped'       // 分组
  | 'stacked'       // 堆叠  
  | 'percent'       // 百分比
  | 'normalized'    // 标准化
  | 'parallel'      // 并列
  | 'linear';       // 线性

export interface ChartConfig {
  type: ChartType;
  subType?: ChartSubType;
  dimensions: string[];     // 维度字段名
  measures: string[];       // 指标字段名
  color?: string;          // 颜色字段
  size?: string;           // 大小字段
  shape?: string;          // 形状字段
  label?: string;          // 标签字段
}

export interface ChartRequirement {
  minDimensions: number;
  maxDimensions: number;
  minMeasures: number;
  maxMeasures: number;
  supportedSubTypes?: ChartSubType[];
}