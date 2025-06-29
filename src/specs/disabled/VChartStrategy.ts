import { VizSeedDSL } from '../core/VizSeedDSL';
import { VChartSpec, ChartLibrary } from '../types/specs';
import { ChartType } from '../types/charts';
import { SpecGenerationStrategy } from './SpecGenerationStrategy';

export class VChartStrategy implements SpecGenerationStrategy {
  getLibraryName(): ChartLibrary {
    return 'vchart';
  }

  getSupportedChartTypes(): ChartType[] {
    return ['bar', 'column', 'line', 'area', 'scatter', 'pie', 'donut'];
  }

  generateSpec(vizSeed: VizSeedDSL): VChartSpec {
    const { chartConfig, data, metadata } = vizSeed;
    
    const spec: VChartSpec = {
      type: this.mapChartType(chartConfig.type, chartConfig.subType),
      data: {
        values: data.rows
      },
      theme: metadata?.theme,
      width: metadata?.width,
      height: metadata?.height
    };

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

    spec.axes = this.buildAxes(chartConfig);
    spec.legends = this.buildLegends(chartConfig);

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