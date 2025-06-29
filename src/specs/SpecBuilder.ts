import { VizSeedDSL, LegacyChartType } from '../types';
import { VTableSpec, VChartSpec, VChartBarSpec, VChartLineSpec, VChartPieSpec, EChartsSpec, ChartSpec } from '../types/specs';

export class SpecBuilder {
  public static build(vizSeed: VizSeedDSL): ChartSpec {
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
      cellType: 'text' as const // VTable的列类型比较复杂，先使用text
    }));

    return {
      type: 'table',
      records: data.rows, // 使用records而不是data.values
      columns: columns,
      // theme: metadata?.theme, // VTable的主题配置比较复杂，暂时移除
      pagination: {
        perPageCount: 20,
        currentPage: 1
      },
      _vizSeedMeta: {
        originalDataFields: data.fields.map(f => f.name),
        transformations: ['basic-table']
      }
    };
  }

  private static buildVChartSpec(vizSeed: VizSeedDSL): VChartSpec {
    const { chartConfig, data, metadata } = vizSeed;
    
    // 根据图表类型创建相应的spec
    const chartType = this.mapChartTypeToVChart(chartConfig.type);
    
    const baseSpec = {
      type: chartType,
      data: {
        values: data.rows
      },
      theme: metadata?.theme,
      width: metadata?.width,
      height: metadata?.height,
      _vizSeedMeta: {
        originalDataFields: data.fields.map(f => f.name),
        transformations: [`${chartType}-chart`]
      }
    };

    // 根据图表类型返回具体的spec
    switch (chartType) {
      case 'bar':
        return this.buildBarChartSpec(baseSpec, chartConfig, metadata) as VChartBarSpec;
      case 'line':
        return this.buildLineChartSpec(baseSpec, chartConfig, metadata) as VChartLineSpec;
      case 'pie':
        return this.buildPieChartSpec(baseSpec, chartConfig, metadata) as VChartPieSpec;
      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
    }
  }

  private static buildBarChartSpec(baseSpec: any, chartConfig: any, metadata: any): VChartBarSpec {
    const spec: VChartBarSpec = {
      ...baseSpec,
      xField: chartConfig.dimensions[0] || 'category',
      yField: chartConfig.measures[0] || 'value'
    };

    if (chartConfig.color) {
      spec.seriesField = chartConfig.color;
    }

    return spec;
  }

  private static buildLineChartSpec(baseSpec: any, chartConfig: any, metadata: any): VChartLineSpec {
    const spec: VChartLineSpec = {
      ...baseSpec,
      xField: chartConfig.dimensions[0] || 'category',
      yField: chartConfig.measures[0] || 'value'
    };

    if (chartConfig.color) {
      spec.seriesField = chartConfig.color;
    }

    return spec;
  }

  private static buildPieChartSpec(baseSpec: any, chartConfig: any, metadata: any): VChartPieSpec {
    const spec: VChartPieSpec = {
      ...baseSpec,
      categoryField: chartConfig.dimensions[0] || 'category',
      valueField: chartConfig.measures[0] || 'value'
    };

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

  private static mapChartTypeToVChart(type: LegacyChartType): 'bar' | 'line' | 'pie' {
    switch (type) {
      case 'bar':
      case 'column':
        return 'bar';
      case 'line':
      case 'area':
        return 'line';
      case 'pie':
      case 'donut':
        return 'pie';
      default:
        return 'bar'; // 默认使用柱状图
    }
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