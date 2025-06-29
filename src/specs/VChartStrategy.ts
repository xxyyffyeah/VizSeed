import { VizSeedDSL } from '../core/VizSeedDSL';
import { VChartSpec, ChartLibrary } from '../types/specs';
import { ChartType } from '../types/charts';
import { SpecGenerationStrategy } from './SpecGenerationStrategy';
import { CHART_TYPE_LIMITS } from '../config/chartLimits';

export class VChartStrategy implements SpecGenerationStrategy {
  getLibraryName(): ChartLibrary {
    return 'vchart';
  }

  getSupportedChartTypes(): ChartType[] {
    return CHART_TYPE_LIMITS.vchart;
  }

  generateSpec(vizSeed: VizSeedDSL): VChartSpec {
    const { chartConfig, data, metadata } = vizSeed;
    
    const spec: VChartSpec = {
      type: this.mapChartType(chartConfig.type, chartConfig.subType),
      data: {
        values: data.rows
      }
    };
    
    // 添加可选属性
    if (metadata?.theme) {
      spec.theme = metadata.theme;
    }
    if (metadata?.width) {
      spec.width = metadata.width;
    }
    if (metadata?.height) {
      spec.height = metadata.height;
    }

    if (chartConfig.dimensions.length > 0) {
      spec.xField = chartConfig.dimensions[0];
    }

    if (chartConfig.measures.length > 0) {
      spec.yField = chartConfig.measures[0];
    }

    if (chartConfig.color) {
      spec.colorField = chartConfig.color;
    }

    if (chartConfig.size) {
      spec.sizeField = chartConfig.size;
    }

    if (chartConfig.dimensions.length > 1) {
      spec.seriesField = chartConfig.dimensions[1];
    }

    // 饼图和环形图不需要坐标轴
    if (!['pie', 'donut'].includes(chartConfig.type)) {
      spec.axes = this.buildAxes(chartConfig);
    }
    
    // 饼图和环形图通常不需要图例（会自动生成）
    if (!['pie', 'donut'].includes(chartConfig.type)) {
      spec.legends = this.buildLegends(chartConfig);
    }

    if (metadata?.title) {
      spec.title = {
        visible: true,
        text: metadata.title
      };
    }

    return spec;
  }

  private mapChartType(type: ChartType, subType?: string): string {
    if (subType) {
      return `${type}_${subType}`;
    }
    return type;
  }

  private buildAxes(chartConfig: any) {
    const axes = [];
    
    if (chartConfig.dimensions.length > 0) {
      axes.push({
        orient: 'bottom' as const,
        type: 'band' as const,
        title: {
          visible: true,
          text: chartConfig.dimensions[0]
        }
      });
    }

    if (chartConfig.measures.length > 0) {
      axes.push({
        orient: 'left' as const,
        type: 'linear' as const,
        title: {
          visible: true,
          text: chartConfig.measures[0]
        }
      });
    }

    return axes;
  }

  private buildLegends(chartConfig: any) {
    const legends = [];
    
    if (chartConfig.color || chartConfig.dimensions.length > 1) {
      legends.push({
        visible: true,
        orient: 'right' as const,
        title: {
          visible: true,
          text: chartConfig.color || chartConfig.dimensions[1] || 'Legend'
        }
      });
    }

    return legends;
  }
}