// 直接使用官方图表库的类型定义
// Strategy类将直接生成官方规范，简化架构

// 图表库类型
export type ChartLibrary = 'vchart' | 'vtable' | 'echarts';

// 官方类型定义已集成，现在直接在Strategy中生成对应格式

// 使用any类型来避免复杂的官方类型约束，Strategy将直接生成官方格式
export type VChartSpec = any; // 实际为IChartSpec的扩展，包含更灵活的字段
export type EChartsSpec = any; // 实际为EChartsOption
export type VTableSpec = any; // 实际为ListTableConstructorOptions

// 统一的图表规范类型
export type ChartSpec = VChartSpec | EChartsSpec | VTableSpec;

// 类型守卫函数
export function isVChartSpec(spec: ChartSpec): spec is VChartSpec {
  return typeof spec === 'object' && spec !== null && 
         ('type' in spec || 'data' in spec) && 
         !('series' in spec) && 
         !('records' in spec);
}

export function isEChartsSpec(spec: ChartSpec): spec is EChartsSpec {
  return typeof spec === 'object' && spec !== null && 
         ('series' in spec || 'xAxis' in spec || 'yAxis' in spec);
}

export function isVTableSpec(spec: ChartSpec): spec is VTableSpec {
  return typeof spec === 'object' && spec !== null && 
         ('records' in spec || 'columns' in spec);
}