import React, { useState, useEffect } from 'react';
import { VizSeedEditor } from './components/VizSeedEditor';
import { ChartRenderer } from './components/ChartRenderer';
import { SpecEditor } from './components/SpecEditor';
import './App.css';

function App() {
  const [vizSeedCode, setVizSeedCode] = useState<string>('');
  const [currentSpec, setCurrentSpec] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLatestSpec();
  }, []);

  const loadLatestSpec = async () => {
    try {
      const response = await fetch('./latest-spec.json');
      if (response.ok) {
        const specData = await response.json();
        
        // 从latest-spec.json加载spec作为默认内容
        setCurrentSpec(specData.spec);
        
        // 从vizSeedDSL构建默认的VizSeed代码示例
        const vizSeedDSL = specData.vizSeedDSL;
        const defaultCode = generateVizSeedCode(vizSeedDSL);
        setVizSeedCode(defaultCode);
      } else {
        // 如果无法加载，使用fallback示例
        setDefaultFallback();
      }
    } catch (error) {
      console.warn('无法加载latest-spec.json，使用默认示例');
      setDefaultFallback();
    }
  };

  const generateVizSeedCode = (vizSeedDSL: any): string => {
    // 从vizSeedDSL生成VizSeed代码示例
    const data = vizSeedDSL.data || [];
    const chartType = vizSeedDSL.chartType || 'bar';
    const dimensions = vizSeedDSL.dimensions || [];
    const measures = vizSeedDSL.measures || [];
    
    // 提取原始数据结构示例
    const sampleData = data.slice(0, 3).map((item: any) => {
      const filtered: any = {};
      Object.keys(item).forEach(key => {
        if (!key.startsWith('__Measure')) {
          filtered[key] = item[key];
        }
      });
      return filtered;
    });

    return `// VizSeed DSL 示例 - 从latest-spec.json加载
import { VizSeedBuilder } from 'vizseed';

const data = ${JSON.stringify(sampleData, null, 2)};

const builder = new VizSeedBuilder(data)
  .setChartType('${chartType}')${dimensions.length > 0 ? `
  .setDimensions(${JSON.stringify(dimensions)})` : ''}${measures.length > 0 ? `
  .setMeasures(${JSON.stringify(measures)})` : ''};

// 构建VizSeed DSL
const vizSeedDSL = await builder.build();

// 生成图表规范
const spec = await builder.buildSpec('vchart');
console.log(spec);`;
  };

  const setDefaultFallback = () => {
    const fallbackCode = `// VizSeed DSL 示例
import { VizSeedBuilder } from 'vizseed';

const data = [
  { category: '水果', sales: 120 },
  { category: '蔬菜', sales: 80 },
  { category: '肉类', sales: 200 },
  { category: '乳制品', sales: 150 }
];

const builder = new VizSeedBuilder(data)
  .setChartType('pie')
  .addDimension('category')
  .addMeasure('sales');

const spec = builder.buildSpec('vchart');
console.log(spec);`;

    setVizSeedCode(fallbackCode);
    
    const fallbackSpec = {
      type: 'pie',
      data: [
        { value: 120, category: '水果' },
        { value: 80, category: '蔬菜' },
        { value: 200, category: '肉类' },
        { value: 150, category: '乳制品' }
      ],
      valueField: 'value',
      categoryField: 'category'
    };
    
    setCurrentSpec(fallbackSpec);
  };

  const executeVizSeedCode = async (code: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 这里应该调用后端API来执行VizSeed代码
      // 暂时使用模拟的执行结果
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: 实际实现需要调用后端API
      console.log('执行VizSeed代码:', code);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '执行失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>🚀 VizSeed Interactive Chart Editor</h1>
        <p className="subtitle">实时编辑VizSeed DSL，生成图表规范</p>
      </div>
      
      <div className="main-content">
        <div className="chart-row">
          <ChartRenderer 
            spec={currentSpec}
            error={error}
            isLoading={isLoading}
          />
        </div>
        
        <div className="editors-row">
          <VizSeedEditor
            code={vizSeedCode}
            onChange={setVizSeedCode}
            onExecute={executeVizSeedCode}
            isLoading={isLoading}
          />
          
          <SpecEditor 
            spec={currentSpec}
            onChange={setCurrentSpec}
          />
        </div>
      </div>
    </div>
  );
}

export default App;