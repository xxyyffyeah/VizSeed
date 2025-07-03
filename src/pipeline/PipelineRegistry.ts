/**
 * Pipeline注册表
 * 使用函数映射实现图表Pipeline管理，简洁高效的架构
 */

import { pipeline, PipelineStep, PipelineContext } from './PipelineCore';
import { initData, processDimensionData } from './modules/DataModule';
import { configureLegend, configureLabel, configureTooltip, configureAxes } from './modules/StyleModule';
import { initVChartBar, initVChartPie, initVTableList } from './modules/ChartModule';

// Pipeline函数类型
type PipelineFunction = (context: PipelineContext) => any;

// 创建VChart通用Pipeline（柱状图、折线图、散点图等）
const createVChartPipeline = () => pipeline([
  initVChartBar,
  initData,
  processDimensionData,
  configureAxes,
  configureLegend,
  configureLabel,
  configureTooltip
], {});

// 创建VChart饼图Pipeline
const createVChartPiePipeline = () => pipeline([
  initVChartPie,
  initData,
  processDimensionData,
  configureLegend,
  configureLabel,
  configureTooltip
], {});

// 创建VTable表格Pipeline
const createVTablePipeline = () => pipeline([
  initVTableList,
  initData
], {});

// 创建VizSeed构建Pipeline
const createVizSeedBuildPipeline = () => {
  const buildFieldMap = (data: any): any => {
    const fieldMap: any = {};
    
    if (data?.fields) {
      data.fields.forEach((field: any) => {
        fieldMap[field.name] = {
          id: field.name,
          type: field.type,
          alias: field.name,
          role: field.role
        };
      });
    }

    // 添加维度重塑的特殊字段
    fieldMap['__MeasureValue__'] = {
      id: '__MeasureValue__',
      alias: '指标值'
    };
    fieldMap['__MeasureName__'] = {
      id: '__MeasureName__',
      alias: '指标名称'
    };

    return fieldMap;
  };

  const buildVizSeedSteps: PipelineStep[] = [
    // 数据处理步骤
    (vizSeed: any, context: PipelineContext) => {
      const { data, chartConfig } = context;
      return {
        ...vizSeed,
        chartType: chartConfig?.type || 'bar',
        datasets: data?.rows || [],
        fieldMap: buildFieldMap(data)
      };
    },
    // 视觉通道映射步骤
    (vizSeed: any, context: PipelineContext) => {
      const { chartConfig } = context;
      const mapping = chartConfig?.mapping || {};
      
      return {
        ...vizSeed,
        visualChannel: [{
          x: mapping.x || mapping.category || 'category',
          y: mapping.y || mapping.value || '__MeasureValue__',
          group: mapping.color || '__MeasureName__'
        }]
      };
    },
    // 视觉样式步骤
    (vizSeed: any, context: PipelineContext) => {
      const { visualStyle } = context;
      return {
        ...vizSeed,
        visualStyle: {
          title: { visible: !!visualStyle?.title },
          legend: { visible: visualStyle?.legend !== false },
          label: { visible: visualStyle?.label !== false },
          tooltip: { visible: visualStyle?.tooltip !== false }
        }
      };
    }
  ];

  return pipeline(buildVizSeedSteps, {});
};

// Pipeline映射表 - 按照图中的抽象设计
const pipelineMap: Record<string, PipelineFunction> = {
  // VChart图表类型
  'vchart-bar': createVChartPipeline(),
  'vchart-column': createVChartPipeline(), 
  'vchart-line': createVChartPipeline(),
  'vchart-area': createVChartPipeline(),
  'vchart-scatter': createVChartPipeline(),
  
  // VChart饼图类型
  'vchart-pie': createVChartPiePipeline(),
  'vchart-donut': createVChartPiePipeline(),
  
  // VTable表格类型
  'vtable-table': createVTablePipeline(),
  
  // VizSeed构建
  'vizseed-build': createVizSeedBuildPipeline()
};

// 简化的构建规范函数
export const buildSpec = (chartType: string, library: 'vchart' | 'vtable', context: PipelineContext): any => {
  // 构建pipeline key
  const pipelineKey = library === 'vtable' && chartType === 'table' 
    ? 'vtable-table' 
    : `${library}-${chartType}`;
  
  // 获取对应的pipeline
  const selectedPipeline = pipelineMap[pipelineKey];
  
  if (!selectedPipeline) {
    throw new Error(`不支持的图表类型组合: ${pipelineKey}`);
  }
  
  // 执行pipeline并返回结果
  return selectedPipeline(context);
};

// 构建VizSeed对象的函数
export const buildVizSeed = (context: PipelineContext): any => {
  const vizSeedPipeline = pipelineMap['vizseed-build'];
  return vizSeedPipeline(context);
};

// 获取所有支持的pipeline类型
export const getSupportedPipelineTypes = (): string[] => {
  return Object.keys(pipelineMap);
};

// 检查pipeline是否支持
export const isPipelineSupported = (key: string): boolean => {
  return key in pipelineMap;
};