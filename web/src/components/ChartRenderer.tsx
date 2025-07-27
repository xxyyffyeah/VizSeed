import React, { useEffect, useRef } from 'react';

interface ChartRendererProps {
  spec: any;
  error: string | null;
  isLoading: boolean;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ spec, error, isLoading }) => {
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
        chartInstanceRef.current.release();
        chartInstanceRef.current = null;
      }

      chartRef.current.innerHTML = '';

      // 等待VChart库加载
      if (typeof window === 'undefined' || !(window as any).VChart) {
        throw new Error('VChart 库未加载');
      }

      // 添加图表尺寸和标题
      const vchartSpec = {
        ...spec,
        width: 800,
        height: 400,
        title: {
          text: "VizSeed 实时生成图表",
          fontSize: 16,
          fontWeight: "bold"
        }
      };

      // 使用VChart渲染
      const VChart = (window as any).VChart.VChart;
      chartInstanceRef.current = new VChart(vchartSpec, { dom: chartRef.current });
      
      await chartInstanceRef.current.renderAsync();
      console.log('✅ VChart渲染成功！');
      
    } catch (err) {
      console.error('❌ VChart渲染失败:', err);
      if (chartRef.current) {
        chartRef.current.innerHTML = `
          <div style="color: red; text-align: center; padding: 50px; font-size: 14px;">
            <h3>渲染失败</h3>
            <p>${err instanceof Error ? err.message : '未知错误'}</p>
          </div>`;
      }
    }
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
          类型: {spec.type?.toUpperCase() || 'Unknown'}
        </div>
      </div>
      <div className="chart-wrapper">
        <div ref={chartRef} className="chart"></div>
      </div>
    </div>
  );
};