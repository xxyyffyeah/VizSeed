/**
 * 图表Pipeline策略
 * 使用策略模式注册不同图表类型的Pipeline
 */

import { pipeline, PipelineStep, PipelineContext } from '../PipelineBuilder';
import { initData, processDimensionData } from '../modules/DataModule';
import { configureLegend, configureLabel, configureTooltip, configureAxes } from '../modules/StyleModule';
import { initVChartBar, initVChartPie, initVTableList } from '../modules/ChartModule';

// Pipeline策略接口
export interface ChartPipelineStrategy {
  execute(context: PipelineContext): any;
}

// VChart柱状图Pipeline策略
export class VChartBarPipelineStrategy implements ChartPipelineStrategy {
  private pipeline: (context: PipelineContext) => any;

  constructor() {
    this.pipeline = pipeline([
      initVChartBar,
      initData,
      processDimensionData,
      configureAxes,
      configureLegend,
      configureLabel,
      configureTooltip
    ], {});
  }

  execute(context: PipelineContext): any {
    return this.pipeline(context);
  }
}

// VChart饼图Pipeline策略
export class VChartPiePipelineStrategy implements ChartPipelineStrategy {
  private pipeline: (context: PipelineContext) => any;

  constructor() {
    this.pipeline = pipeline([
      initVChartPie,
      initData,
      processDimensionData,
      configureLegend,
      configureLabel,
      configureTooltip
    ], {});
  }

  execute(context: PipelineContext): any {
    return this.pipeline(context);
  }
}

// VTable列表表格Pipeline策略
export class VTableListTablePipelineStrategy implements ChartPipelineStrategy {
  private pipeline: (context: PipelineContext) => any;

  constructor() {
    this.pipeline = pipeline([
      initVTableList,
      initData
    ], {});
  }

  execute(context: PipelineContext): any {
    return this.pipeline(context);
  }
}

// VizSeed构建Pipeline策略
export class VizSeedBuildPipelineStrategy implements ChartPipelineStrategy {
  private pipeline: (context: PipelineContext) => any;

  constructor() {
    // VizSeed构建的Pipeline步骤
    const buildVizSeedSteps: PipelineStep[] = [
      // 数据处理步骤
      (vizSeed: any, context: PipelineContext) => {
        const { data, chartConfig, transformations } = context;
        return {
          ...vizSeed,
          chartType: chartConfig?.type || 'bar',
          datasets: data?.rows || [],
          fieldMap: this.buildFieldMap(data, chartConfig)
        };
      },
      // 视觉通道映射步骤
      (vizSeed: any, context: PipelineContext) => {
        const { chartConfig } = context;
        return {
          ...vizSeed,
          visualChannel: [{
            x: chartConfig?.dimensions?.[0] || 'category',
            y: chartConfig?.measures?.[0] || '__MeasureValue__',
            group: chartConfig?.color || '__MeasureName__'
          }]
        };
      },
      // 视觉样式步骤
      (vizSeed: any, context: PipelineContext) => {
        const { metadata } = context;
        return {
          ...vizSeed,
          visualStyle: {
            title: { visible: !!metadata?.title },
            legend: { visible: true },
            label: { visible: true },
            tooltip: { visible: true }
          }
        };
      }
    ];

    this.pipeline = pipeline(buildVizSeedSteps, {});
  }

  execute(context: PipelineContext): any {
    return this.pipeline(context);
  }

  private buildFieldMap(data: any, chartConfig: any): any {
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
  }
}