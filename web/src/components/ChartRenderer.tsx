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
      if (chartType === 'table' || chartType === 'pivottable' || chartType === 'pivotchart') {
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

    // VTable构造函数需要DOM容器作为第一个参数，配置作为第二个参数（不是合并到配置中）
    const vtableSpec = {
      ...spec,
      // 移除container属性，因为它需要作为构造函数的第一个参数
    };
    
    // 确保移除container属性避免冲突
    delete vtableSpec.container;

    console.log('VTable规范:', vtableSpec);
    console.log('容器元素:', chartRef.current);
    
    const chartType = specData?.chartType || spec?.type;

    // 根据图表类型选择VTable组件
    if (chartType === 'pivottable' || spec?.type === 'pivot-table') {
      // 使用透视表组件
      const { PivotTable } = (window as any).VTable;
      if (!PivotTable) {
        throw new Error('VTable.PivotTable 未找到');
      }
      // VTable构造函数: new VTable.ComponentType(container, options)
      chartInstanceRef.current = new PivotTable(chartRef.current, vtableSpec);
      console.log('✅ VTable透视表渲染成功！', chartInstanceRef.current);
    } else if (chartType === 'pivotchart' || spec?.type === 'pivot-chart') {
      // 使用透视图组件（带图表的透视表）
      const VTable = (window as any).VTable;
      const VChart = (window as any).VChart;
      
      // 强制检查和注册图表模块
      if (!VTable) {
        throw new Error('VTable 库未加载');
      }
      if (!VChart) {
        throw new Error('VChart 库未加载，PivotChart需要VChart支持');
      }
      
      // 检查图表模块注册状态并强制注册
      console.log('检查VTable.register:', VTable.register);
      if (VTable.register && VTable.register.chartModule) {
        try {
          // 强制重新注册图表模块
          VTable.register.chartModule('vchart', VChart);
          console.log('✅ VChart图表模块强制注册成功');
        } catch (registerError) {
          console.error('❌ VChart图表模块注册失败:', registerError);
          throw new Error(`图表模块注册失败: ${registerError.message}`);
        }
      } else {
        console.error('❌ VTable.register.chartModule 方法不存在');
        console.log('可用的VTable.register方法:', Object.keys(VTable.register || {}));
        throw new Error('VTable图表注册API不可用');
      }
      
      // 获取PivotChart构造函数
      const { PivotChart } = VTable;
      if (!PivotChart) {
        throw new Error('VTable.PivotChart 构造函数未找到');
      }
      
      console.log('PivotChart构造函数:', PivotChart);
      console.log('PivotChart.prototype:', PivotChart.prototype);
      
      // 添加容器元素检查
      if (!chartRef.current) {
        throw new Error('图表容器未找到');
      }
      
      console.log('即将创建PivotChart，容器:', chartRef.current, '规范:', vtableSpec);
      
      try {
        console.log('vtableSpec:', vtableSpec);
        // VTable构造函数: new VTable.PivotChart(container, options)
        chartInstanceRef.current = new PivotChart(chartRef.current, vtableSpec);
        console.log('✅ VTable透视图创建成功！', chartInstanceRef.current);
      } catch (constructorError) {
        console.error('❌ PivotChart构造函数调用失败:', constructorError);
        console.log('错误详情:', {
          name: constructorError.name,
          message: constructorError.message,
          stack: constructorError.stack
        });
        throw new Error(`PivotChart构造失败: ${constructorError.message}`);
      }
    } else {
      // 使用标准表格组件
      const { ListTable } = (window as any).VTable;
      if (!ListTable) {
        throw new Error('VTable.ListTable 未找到');
      }
      // VTable构造函数: new VTable.ListTable(container, options)
      chartInstanceRef.current = new ListTable(chartRef.current, vtableSpec);
      console.log('✅ VTable标准表格渲染成功！', chartInstanceRef.current);
    }
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