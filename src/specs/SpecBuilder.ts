import { VizSeedDSL, VTableSpec, VChartSpec } from '../types';
import { ChartType } from '../types/charts';

export class SpecBuilder {
  public static build(vizSeed: VizSeedDSL): VTableSpec | VChartSpec {
    const { chartConfig } = vizSeed;
    
    if (chartConfig.type === 'table') {
      return this.buildVTableSpec(vizSeed);
    } else {
      return this.buildVChartSpec(vizSeed);
    }
  }

  private static buildVTableSpec(vizSeed: VizSeedDSL): VTableSpec {
    const { data, metadata } = vizSeed;
    
    const columns = data.fields.map(field => ({
      field: field.name,
      title: field.name,
      cellType: this.mapFieldTypeToColumnType(field.type)
    }));

    return {
      type: 'table',
      data: {
        values: data.rows
      },
      columns: columns,
      theme: metadata?.theme,
      pagination: {
        perPageCount: 20,
        currentPage: 1
      }
    };
  }

  private static buildVChartSpec(vizSeed: VizSeedDSL): VChartSpec {
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

  private static mapFieldTypeToColumnType(fieldType: string): 'text' | 'number' | 'date' {
    switch (fieldType) {
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      default:
        return 'text';
    }
  }

  private static mapChartType(type: ChartType, subType?: string): string {
    if (subType) {
      return `${type}_${subType}`;
    }
    return type;
  }

  private static buildAxes(chartConfig: any) {
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

  private static buildLegends(chartConfig: any) {
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