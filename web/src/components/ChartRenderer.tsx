import React, { useEffect, useRef } from 'react';

interface ChartRendererProps {
  spec: any;
  specData: any; // 完整的JSON数据，包含chartType
  error: string | null;
  isLoading: boolean;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ spec, specData, error, isLoading }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (spec && chartRef.current) {
      renderChart();
    }
    
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.release();
        chartInstanceRef.current = null;
      }
    };
  }, [spec]);

  const renderChart = async () => {
    if (!chartRef.current || !spec) return;

    try {
      // 清理现有图表
      if (chartInstanceRef.current) {
        if (chartInstanceRef.current.release) {
          chartInstanceRef.current.release();
        } else if (chartInstanceRef.current.destroy) {
          chartInstanceRef.current.destroy();
        }
        chartInstanceRef.current = null;
      }

      chartRef.current.innerHTML = '';

      // 使用chartType判断渲染器类型
      const chartType = specData?.chartType || spec?.type;
      if (chartType === 'table') {
        await renderVTable();
      } else {
        await renderVChart();
      }
      
    } catch (err) {
      console.error('❌ 图表渲染失败:', err);
      if (chartRef.current) {
        chartRef.current.innerHTML = `
          <div style="color: red; text-align: center; padding: 50px; font-size: 14px;">
            <h3>渲染失败</h3>
            <p>${err instanceof Error ? err.message : '未知错误'}</p>
          </div>`;
      }
    }
  };

  const renderVTable = async () => {
    // 检查VTable库是否加载
    console.log('检查VTable库:', typeof (window as any).VTable);
    console.log('VTable对象:', (window as any).VTable);
    
    if (typeof window === 'undefined' || !(window as any).VTable) {
      throw new Error('VTable 库未加载');
    }

    // 配置VTable规范
    const vtableSpec = {
      ...spec,
      container: chartRef.current,
      autoWidth: true,
      autoHeight: true,
      theme: 'DEFAULT'
    };

    console.log('VTable规范:', vtableSpec);

    // 使用VTable渲染
    const { ListTable } = (window as any).VTable;
    if (!ListTable) {
      throw new Error('VTable.ListTable 未找到');
    }
    
    chartInstanceRef.current = new ListTable(vtableSpec);
    
    console.log('✅ VTable渲染成功！', chartInstanceRef.current);
  };

  const renderVChart = async () => {
    // 等待VChart库加载
    if (typeof window === 'undefined' || !(window as any).VChart) {
      throw new Error('VChart 库未加载');
    }

    // 添加图表尺寸和标题
    const vchartSpec = {
      ...spec,
      width: 800,
      height: 400
    };

    // 使用VChart渲染
    const VChart = (window as any).VChart.VChart;
    chartInstanceRef.current = new VChart(vchartSpec, { dom: chartRef.current });
    
    await chartInstanceRef.current.renderAsync();
    console.log('✅ VChart渲染成功！');
  };

  if (isLoading) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>📈 图表预览</h3>
        </div>
        <div className="chart-loading">
          <div className="spinner"></div>
          <p>正在生成图表...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>📈 图表预览</h3>
        </div>
        <div className="chart-error">
          <h3>⚠️ 渲染错误</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>📈 图表预览</h3>
        </div>
        <div className="chart-placeholder">
          <h3>📋 等待数据</h3>
          <p>请执行VizSeed代码生成图表</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>📈 图表预览</h3>
        <div className="chart-info">
          类型: {(specData?.chartType || spec?.type || 'Unknown').toUpperCase()}
        </div>
      </div>
      <div className="chart-wrapper">
        <div ref={chartRef} className="chart"></div>
      </div>
    </div>
  );
};