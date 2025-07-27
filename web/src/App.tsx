import React, { useState, useEffect } from 'react';
import { VizSeedEditor } from './components/VizSeedEditor';
import { ChartRenderer } from './components/ChartRenderer';
import { SpecEditor } from './components/SpecEditor';
import { vizSeedExecutor } from './services/VizSeedExecutor';
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
      setDefaultFallback();
    }
  };

  const generateVizSeedCode = (vizSeedDSL: any): string => {
    // 直接返回VizSeed DSL的JSON格式
    return JSON.stringify(vizSeedDSL, null, 2);
  };

  const setDefaultFallback = () => {
    const fallbackDSL = {
      "chartType": "pie",
      "data": [
        { "category": "水果", "sales": 120 },
        { "category": "蔬菜", "sales": 80 },
        { "category": "肉类", "sales": 200 },
        { "category": "乳制品", "sales": 150 }
      ],
      "fieldMap": {
        "category": {
          "id": "category",
          "type": "string",
          "alias": "category",
          "location": "dimension"
        },
        "sales": {
          "id": "sales",
          "type": "number",
          "alias": "sales",
          "location": "measure"
        }
      },
      "dimensions": ["category"],
      "measures": ["sales"],
      "theme": "light"
    };

    setVizSeedCode(JSON.stringify(fallbackDSL, null, 2));
    
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
      const result = await vizSeedExecutor.executeCode(code);
      
      if (result.success && result.spec) {
        setCurrentSpec(result.spec);
      } else {
        throw new Error(result.error || '代码执行失败');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '执行失败';
      setError(errorMessage);
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