import { VizSeedDSL } from '../core/VizSeedDSL';
import { EChartsSpec, ChartLibrary } from '../types/specs';
import { ChartType } from '../types/charts';
import { SpecGenerationStrategy } from './SpecGenerationStrategy';
import { CHART_TYPE_LIMITS } from '../config/chartLimits';

export class EChartsStrategy implements SpecGenerationStrategy {
  getLibraryName(): ChartLibrary {
    return 'echarts';
  }

  getSupportedChartTypes(): ChartType[] {
    return CHART_TYPE_LIMITS.echarts;
  }

  generateSpec(vizSeed: VizSeedDSL): EChartsSpec {
    const { chartConfig, data, metadata } = vizSeed;
    
    const spec: EChartsSpec = {
      series: []
    };

    // 设置标题
    if (metadata?.title) {
      spec.title = {
        text: metadata.title,
        left: 'center',
        top: 10
      };
    }

    // 设置tooltip
    spec.tooltip = {
      trigger: this.getTooltipTrigger(chartConfig.type)
    };

    // 根据图表类型生成不同的配置
    switch (chartConfig.type) {
      case 'bar':
      case 'column':
        this.buildBarChart(spec, vizSeed);
        break;
      case 'line':
        this.buildLineChart(spec, vizSeed);
        break;
      case 'pie':
        this.buildPieChart(spec, vizSeed);
        break;
      case 'scatter':
        this.buildScatterChart(spec, vizSeed);
        break;
      default:
        this.buildBarChart(spec, vizSeed);
    }

    return spec;
  }

  private getTooltipTrigger(chartType: ChartType): 'item' | 'axis' {
    return chartType === 'pie' ? 'item' : 'axis';
  }

  private buildBarChart(spec: EChartsSpec, vizSeed: VizSeedDSL) {
    const { chartConfig, data } = vizSeed;
    
    if (chartConfig.dimensions.length === 0 || chartConfig.measures.length === 0) {
      return;
    }

    const xField = chartConfig.dimensions[0];
    const yField = chartConfig.measures[0];
    
    // 提取x轴数据
    const xAxisData = Array.from(new Set(data.rows.map(row => row[xField])));
    
    spec.xAxis = {
      type: 'category',
      data: xAxisData,
      name: xField
    };
    
    spec.yAxis = {
      type: 'value',
      name: yField
    };

    // 如果有颜色字段或第二个维度，需要分组处理
    if (chartConfig.color || chartConfig.dimensions.length > 1) {
      const groupField = chartConfig.color || chartConfig.dimensions[1];
      const groups = Array.from(new Set(data.rows.map(row => row[groupField])));
      
      spec.legend = {
        data: groups,
        left: 'center',
        top: 40
      };

      spec.series = groups.map(group => ({
        name: group,
        type: 'bar',
        data: xAxisData.map(xValue => {
          const row = data.rows.find(r => r[xField] === xValue && r[groupField] === group);
          return row ? row[yField] : 0;
        }),
        stack: chartConfig.subType === 'stacked' ? 'total' : undefined
      }));
    } else {
      spec.series = [{
        name: yField,
        type: 'bar',
        data: xAxisData.map(xValue => {
          const row = data.rows.find(r => r[xField] === xValue);
          return row ? row[yField] : 0;
        })
      }];
    }
  }

  private buildLineChart(spec: EChartsSpec, vizSeed: VizSeedDSL) {
    const { chartConfig, data } = vizSeed;
    
    if (chartConfig.dimensions.length === 0 || chartConfig.measures.length === 0) {
      return;
    }

    const xField = chartConfig.dimensions[0];
    const yField = chartConfig.measures[0];
    
    const xAxisData = Array.from(new Set(data.rows.map(row => row[xField]))).sort();
    
    spec.xAxis = {
      type: 'category',
      data: xAxisData,
      name: xField
    };
    
    spec.yAxis = {
      type: 'value',
      name: yField
    };

    if (chartConfig.color || chartConfig.dimensions.length > 1) {
      const groupField = chartConfig.color || chartConfig.dimensions[1];
      const groups = Array.from(new Set(data.rows.map(row => row[groupField])));
      
      spec.legend = {
        data: groups,
        left: 'center',
        top: 40
      };

      spec.series = groups.map(group => ({
        name: group,
        type: 'line',
        data: xAxisData.map(xValue => {
          const row = data.rows.find(r => r[xField] === xValue && r[groupField] === group);
          return row ? row[yField] : null;
        })
      }));
    } else {
      spec.series = [{
        name: yField,
        type: 'line',
        data: xAxisData.map(xValue => {
          const row = data.rows.find(r => r[xField] === xValue);
          return row ? row[yField] : null;
        })
      }];
    }
  }

  private buildPieChart(spec: EChartsSpec, vizSeed: VizSeedDSL) {
    const { chartConfig, data } = vizSeed;
    
    if (chartConfig.dimensions.length === 0 || chartConfig.measures.length === 0) {
      return;
    }

    const nameField = chartConfig.dimensions[0];
    const valueField = chartConfig.measures[0];
    
    const pieData = data.rows.map(row => ({
      name: row[nameField],
      value: row[valueField]
    }));

    spec.legend = {
      data: pieData.map(item => item.name),
      left: 'center',
      top: '40px'
    };

    spec.series = [{
      name: valueField,
      type: 'pie',
      data: pieData,
      label: {
        show: true,
        position: 'outside'
      }
    }];
  }

  private buildScatterChart(spec: EChartsSpec, vizSeed: VizSeedDSL) {
    const { chartConfig, data } = vizSeed;
    
    if (chartConfig.dimensions.length === 0 || chartConfig.measures.length === 0) {
      return;
    }

    const xField = chartConfig.dimensions[0];
    const yField = chartConfig.measures[0];
    
    spec.xAxis = {
      type: 'value',
      name: xField
    };
    
    spec.yAxis = {
      type: 'value',
      name: yField
    };

    const scatterData = data.rows.map(row => [row[xField], row[yField]]);

    spec.series = [{
      name: `${xField} vs ${yField}`,
      type: 'scatter',
      data: scatterData
    }];
  }
}