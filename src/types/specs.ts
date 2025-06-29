// 导入官方类型定义
import type { 
  EChartsOption, 
  IBarChartSpec, 
  ILineChartSpec, 
  IPieChartSpec, 
  ListTableConstructorOptions 
} from './vendor-types';

// VChart规范类型 - 基于官方接口
export interface VChartBarSpec extends IBarChartSpec {
  // 可以添加VizSeed特有的扩展属性
  _vizSeedMeta?: {
    originalDataFields?: string[];
    transformations?: string[];
  };
}

export interface VChartLineSpec extends ILineChartSpec {
  _vizSeedMeta?: {
    originalDataFields?: string[];
    transformations?: string[];
  };
}

export interface VChartPieSpec extends IPieChartSpec {
  _vizSeedMeta?: {
    originalDataFields?: string[];
    transformations?: string[];
  };
}

// VChart通用类型
export type VChartSpec = VChartBarSpec | VChartLineSpec | VChartPieSpec;

// ECharts规范类型 - 直接使用官方类型
export interface EChartsSpec extends EChartsOption {
  // 可以添加VizSeed特有的扩展属性
  _vizSeedMeta?: {
    originalDataFields?: string[];
    transformations?: string[];
  };
}

// VTable规范类型 - 基于官方接口
export interface VTableSpec extends Partial<ListTableConstructorOptions> {
  type: 'table';
  // 覆盖records类型以确保兼容性
  records: Record<string, any>[];
  // VizSeed扩展属性
  _vizSeedMeta?: {
    originalDataFields?: string[];
    transformations?: string[];
  };
}

// 图表类型映射
export interface ChartTypeMapping {
  // VChart图表类型
  'vchart-bar': VChartBarSpec;
  'vchart-line': VChartLineSpec;
  'vchart-pie': VChartPieSpec;
  // ECharts图表类型
  'echarts': EChartsSpec;
  // VTable类型
  'vtable': VTableSpec;
}

// 统一的图表规范类型
export type ChartSpec = ChartTypeMapping[keyof ChartTypeMapping];

// 图表库类型
export type ChartLibrary = 'vchart' | 'vtable' | 'echarts';

// 具体图表类型
export type ChartType = keyof ChartTypeMapping;

// 图表配置选项
export interface ChartConfig<T extends ChartType = ChartType> {
  type: T;
  spec: ChartTypeMapping[T];
  container?: string | HTMLElement;
  width?: number;
  height?: number;
}

// 类型守卫函数
export function isVChartSpec(spec: ChartSpec): spec is VChartSpec {
  return 'type' in spec && ['bar', 'line', 'pie'].includes(spec.type as string);
}

export function isEChartsSpec(spec: ChartSpec): spec is EChartsSpec {
  return 'series' in spec || 'xAxis' in spec || 'yAxis' in spec;
}

export function isVTableSpec(spec: ChartSpec): spec is VTableSpec {
  return 'type' in spec && spec.type === 'table';
}

// 导出具体的图表选项类型，方便外部使用
export type { 
  EChartsOption,
  IBarChartSpec,
  ILineChartSpec, 
  IPieChartSpec,
  ListTableConstructorOptions
} from './vendor-types';