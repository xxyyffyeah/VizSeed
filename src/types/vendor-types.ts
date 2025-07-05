/**
 * 官方图表库类型定义重新导出
 * 这个文件集中管理所有第三方图表库的类型定义，方便统一管理和版本控制
 */

// ECharts 类型已移除，不再支持

// VChart 官方类型
export type {
  IBarChartSpec,
  ILineChartSpec,
  IPieChartSpec,
  IChartSpec,
  IAreaChartSpec,
  IScatterChartSpec,
  ICartesianChartSpec,
  ICommonChartSpec
} from '@visactor/vchart';

// VTable 官方类型
export type {
  ListTableConstructorOptions,
  PivotTableConstructorOptions,
  PivotChartConstructorOptions,
  ColumnsDefine,
  ColumnDefine,
  TextColumnDefine,
  ImageColumnDefine,
  LinkColumnDefine,
  ChartColumnDefine,
  ProgressbarColumnDefine,
  SparklineColumnDefine,
  GroupColumnDefine,
  BaseTableAPI,
  ListTable,
  PivotTable,
  PivotChart
} from '@visactor/vtable';

