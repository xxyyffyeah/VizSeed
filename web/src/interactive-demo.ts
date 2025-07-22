// 交互式VizSeed演示
import VChart from '@visactor/vchart';
import { ListTable } from '@visactor/vtable';

class VizSeedIDE {
  private ws: WebSocket | null = null;
  private connected = false;
  private currentChart: any | null = null; // 支持VChart和VTable

  constructor() {
    this.initializeUI();
    this.connectToServer();
  }

  private initializeUI() {
    // 添加连接状态指示器
    this.addConnectionIndicator();
    
    // 添加代码编辑器区域
    this.addCodeEditor();
    
    // 添加实时日志
    this.addLogPanel();
    
    // 绑定事件
    this.bindEvents();
  }

  private addConnectionIndicator() {
    const header = document.querySelector('.header');
    if (header) {
      const indicator = document.createElement('div');
      indicator.id = 'connection-status';
      indicator.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 8px 16px;
        border-radius: 20px;
        color: white;
        font-size: 12px;
        font-weight: bold;
      `;
      this.updateConnectionStatus(false);
      header.appendChild(indicator);
    }
  }

  private addCodeEditor() {
    const container = document.querySelector('.container');
    if (container) {
      const editorSection = document.createElement('div');
      editorSection.className = 'chart-section';
      editorSection.innerHTML = `
        <h2>💻 VizSeed 交互式编辑器</h2>
        <div class="editor-container">
          <div class="editor-panels">
            <div class="data-panel">
              <h3>📊 数据配置</h3>
              <textarea id="data-input" placeholder="输入JSON格式的数据...">${this.getDefaultData()}</textarea>
            </div>
            <div class="chart-config-panel">
              <h3>⚙️ 图表配置</h3>
              <div class="config-grid">
                <div class="config-item">
                  <label>图表库:</label>
                  <select id="library-select">
                    <option value="vchart">VChart</option>
                    <option value="vtable">VTable</option>
                  </select>
                </div>
                <div class="config-item">
                  <label>图表类型:</label>
                  <select id="chart-type-select">
                    <option value="bar">柱状图</option>
                    <option value="column">条形图</option>
                    <option value="area">面积图</option>
                    <option value="line">折线图</option>
                    <option value="scatter">散点图</option>
                    <option value="pie">饼图</option>
                    <option value="table">表格</option>
                  </select>
                </div>
                <div class="config-item">
                  <label>子类型:</label>
                  <select id="subtype-select">
                    <option value="">默认</option>
                    <option value="grouped">分组</option>
                    <option value="stacked">堆叠</option>
                    <option value="percent">百分比</option>
                  </select>
                </div>
                <div class="config-item">
                  <label>维度字段:</label>
                  <input type="text" id="dimensions-input" placeholder="category,date" value="category">
                </div>
                <div class="config-item">
                  <label>度量字段:</label>
                  <input type="text" id="measures-input" placeholder="sales,profit" value="sales">
                </div>
                <div class="config-item">
                  <label>标题:</label>
                  <input type="text" id="title-input" placeholder="图表标题" value="实时数据分析">
                </div>
              </div>
              <div class="actions">
                <button id="execute-btn" class="execute-btn">🚀 生成图表</button>
                <button id="clear-btn" class="clear-btn">🗑️ 清空</button>
              </div>
            </div>
          </div>
          <div class="result-panel">
            <div class="chart-result">
              <h3>📈 图表预览</h3>
              <div id="interactive-chart" class="chart-container">
                <div class="placeholder">点击"生成图表"开始使用</div>
              </div>
            </div>
            <div class="spec-result">
              <h3>🔧 生成的规范</h3>
              <pre id="generated-spec"></pre>
            </div>
          </div>
        </div>
      `;
      
      // 插入到stats后面
      const stats = document.querySelector('.stats');
      if (stats && stats.nextSibling) {
        container.insertBefore(editorSection, stats.nextSibling);
      } else {
        container.appendChild(editorSection);
      }

      // 添加CSS样式
      this.addEditorStyles();
    }
  }

  private addLogPanel() {
    const container = document.querySelector('.container');
    if (container) {
      const logSection = document.createElement('div');
      logSection.className = 'chart-section';
      logSection.innerHTML = `
        <h2>📋 执行日志</h2>
        <div id="log-output" class="log-output">
          <div class="log-item info">🚀 VizSeed IDE 已启动，等待连接...</div>
        </div>
        <button id="clear-logs" class="clear-btn">清空日志</button>
      `;
      container.appendChild(logSection);
    }
  }

  private addEditorStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .editor-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 20px;
      }
      
      .editor-panels {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      
      .data-panel, .chart-config-panel {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        border-left: 4px solid #3498db;
      }
      
      .data-panel h3, .chart-config-panel h3 {
        margin: 0 0 15px 0;
        color: #2c3e50;
        font-size: 1.1em;
      }
      
      #data-input {
        width: 100%;
        height: 200px;
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 10px;
        font-family: Monaco, Consolas, monospace;
        font-size: 12px;
        resize: vertical;
      }
      
      .config-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 20px;
      }
      
      .config-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      
      .config-item label {
        font-weight: bold;
        color: #34495e;
        font-size: 0.9em;
      }
      
      .config-item input, .config-item select {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
      
      .actions {
        display: flex;
        gap: 10px;
      }
      
      .execute-btn {
        background: #27ae60;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        flex: 1;
      }
      
      .execute-btn:hover {
        background: #229954;
      }
      
      .execute-btn:disabled {
        background: #95a5a6;
        cursor: not-allowed;
      }
      
      .clear-btn {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
      }
      
      .clear-btn:hover {
        background: #c0392b;
      }
      
      .result-panel {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      
      .chart-result, .spec-result {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        border-left: 4px solid #e74c3c;
      }
      
      .chart-result h3, .spec-result h3 {
        margin: 0 0 15px 0;
        color: #2c3e50;
        font-size: 1.1em;
      }
      
      .chart-container {
        overflow: hidden !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      
      .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 300px;
        color: #7f8c8d;
        font-style: italic;
        border: 2px dashed #bdc3c7;
        border-radius: 6px;
      }
      
      #generated-spec {
        background: #2c3e50;
        color: #ecf0f1;
        padding: 15px;
        border-radius: 6px;
        max-height: 300px;
        overflow-y: auto;
        font-size: 12px;
        margin: 0;
      }
      
      .log-output {
        background: #1e1e1e;
        color: #ffffff;
        padding: 15px;
        border-radius: 6px;
        height: 200px;
        overflow-y: auto;
        font-family: Monaco, Consolas, monospace;
        font-size: 12px;
        margin-bottom: 10px;
      }
      
      .log-item {
        margin-bottom: 8px;
        padding: 4px 0;
      }
      
      .log-item.error {
        color: #ff6b6b;
      }
      
      .log-item.success {
        color: #51cf66;
      }
      
      .log-item.info {
        color: #74c0fc;
      }
      
      .log-item.warning {
        color: #ffd43b;
      }
      
      @media (max-width: 1200px) {
        .editor-container {
          grid-template-columns: 1fr;
        }
        
        .config-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  private getDefaultData() {
    return JSON.stringify({
      fields: [
        {
          name: "category",
          type: "string",
          role: "dimension",
          values: ["水果", "蔬菜", "肉类", "乳制品"]
        },
        {
          name: "sales",
          type: "number", 
          role: "measure",
          values: [120, 80, 200, 150]
        },
        {
          name: "profit",
          type: "number",
          role: "measure", 
          values: [25, 15, 40, 30]
        }
      ],
      rows: [
        { category: "水果", sales: 120, profit: 25 },
        { category: "蔬菜", sales: 80, profit: 15 },
        { category: "肉类", sales: 200, profit: 40 },
        { category: "乳制品", sales: 150, profit: 30 }
      ]
    }, null, 2);
  }

  private bindEvents() {
    const executeBtn = document.getElementById('execute-btn') as HTMLButtonElement;
    const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;
    const clearLogsBtn = document.getElementById('clear-logs') as HTMLButtonElement;
    const chartTypeSelect = document.getElementById('chart-type-select') as HTMLSelectElement;
    const librarySelect = document.getElementById('library-select') as HTMLSelectElement;

    executeBtn?.addEventListener('click', () => this.executeCode());
    clearBtn?.addEventListener('click', () => this.clearAll());
    clearLogsBtn?.addEventListener('click', () => this.clearLogs());
    chartTypeSelect?.addEventListener('change', () => this.updateSubTypeOptions());
    librarySelect?.addEventListener('change', () => this.updateChartTypeOptions());
    
    // 初始化选项
    this.updateChartTypeOptions();
    this.updateSubTypeOptions();
  }

  private connectToServer() {
    this.log('🔄 连接到VizSeed服务器...', 'info');
    
    try {
      this.ws = new WebSocket('ws://localhost:8080');
      
      this.ws.onopen = () => {
        this.connected = true;
        this.updateConnectionStatus(true);
        this.log('✅ 服务器连接成功！', 'success');
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleServerMessage(data);
        } catch (error) {
          this.log(`❌ 消息解析错误: ${error}`, 'error');
        }
      };
      
      this.ws.onerror = (error) => {
        this.log(`❌ WebSocket错误: ${error}`, 'error');
        this.updateConnectionStatus(false);
      };
      
      this.ws.onclose = () => {
        this.connected = false;
        this.updateConnectionStatus(false);
        this.log('📴 与服务器的连接已断开', 'warning');
      };
      
    } catch (error) {
      this.log(`❌ 连接失败: ${error}`, 'error');
      this.updateConnectionStatus(false);
    }
  }

  private updateChartTypeOptions() {
    const librarySelect = document.getElementById('library-select') as HTMLSelectElement;
    const chartTypeSelect = document.getElementById('chart-type-select') as HTMLSelectElement;
    
    if (!librarySelect || !chartTypeSelect) return;
    
    const library = librarySelect.value;
    
    // 定义每个图表库支持的图表类型
    const chartTypeOptions: Record<string, { value: string; label: string }[]> = {
      vchart: [
        { value: 'bar', label: '柱状图' },
        { value: 'column', label: '条形图' },
        { value: 'area', label: '面积图' },
        { value: 'line', label: '折线图' },
        { value: 'scatter', label: '散点图' },
        { value: 'pie', label: '饼图' }
      ],
      vtable: [
        { value: 'table', label: '表格' }
      ]
    };
    
    // 清空现有选项
    chartTypeSelect.innerHTML = '';
    
    // 添加新选项
    const options = chartTypeOptions[library] || chartTypeOptions.vchart;
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      chartTypeSelect.appendChild(optionElement);
    });
    
    // 触发子类型更新
    this.updateSubTypeOptions();
  }

  private updateSubTypeOptions() {
    const chartTypeSelect = document.getElementById('chart-type-select') as HTMLSelectElement;
    const subtypeSelect = document.getElementById('subtype-select') as HTMLSelectElement;
    
    if (!chartTypeSelect || !subtypeSelect) return;
    
    const chartType = chartTypeSelect.value;
    
    // 定义每种图表类型支持的子类型（与后端 chartLimits.ts 保持一致）
    const subtypeOptions: Record<string, { value: string; label: string }[]> = {
      bar: [
        { value: '', label: '默认' },
        { value: 'grouped', label: '分组' },
        { value: 'stacked', label: '堆叠' },
        { value: 'percent', label: '百分比' }
      ],
      column: [
        { value: '', label: '默认' },
        { value: 'grouped', label: '分组' },
        { value: 'stacked', label: '堆叠' },
        { value: 'percent', label: '百分比' }
      ],
      area: [
        { value: '', label: '默认' },
        { value: 'stacked', label: '堆叠' },
        { value: 'percent', label: '百分比' }
      ],
      line: [
        { value: '', label: '默认' }
      ],
      scatter: [
        { value: '', label: '默认' },
        { value: 'linear', label: '线性' },
        { value: 'grouped', label: '分组' }
      ],
      pie: [
        { value: '', label: '默认' }
      ],
      table: [
        { value: '', label: '默认' }
      ]
    };
    
    // 清空现有选项
    subtypeSelect.innerHTML = '';
    
    // 添加新选项
    const options = subtypeOptions[chartType] || [{ value: '', label: '默认' }];
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      subtypeSelect.appendChild(optionElement);
    });
  }

  private updateConnectionStatus(connected: boolean) {
    const indicator = document.getElementById('connection-status');
    if (indicator) {
      if (connected) {
        indicator.style.background = '#27ae60';
        indicator.textContent = '🟢 已连接';
      } else {
        indicator.style.background = '#e74c3c';
        indicator.textContent = '🔴 未连接';
      }
    }
    
    const executeBtn = document.getElementById('execute-btn') as HTMLButtonElement;
    if (executeBtn) {
      executeBtn.disabled = !connected;
    }
  }

  private handleServerMessage(data: any) {
    switch (data.type) {
      case 'connection_established':
        this.log(data.message, 'success');
        break;
        
      case 'execution_result':
        this.handleExecutionResult(data);
        break;
        
      default:
        this.log(`📨 收到消息: ${JSON.stringify(data)}`, 'info');
    }
  }

  private handleExecutionResult(result: any) {
    // 显示日志
    if (result.logs) {
      result.logs.forEach((log: string) => {
        const type = log.includes('❌') ? 'error' : 
                    log.includes('✅') ? 'success' : 'info';
        this.log(log, type);
      });
    }
    
    if (result.success) {
      // 显示规范
      const specElement = document.getElementById('generated-spec');
      if (specElement && result.spec) {
        specElement.textContent = JSON.stringify(result.spec, null, 2);
      }
      
      // 渲染图表
      this.renderChart(result.spec, result.data.library);
      
    } else {
      this.log(`❌ 执行失败: ${result.error}`, 'error');
    }
  }

  private renderChart(spec: any, library: string) {
    const container = document.getElementById('interactive-chart');
    if (!container) return;
    
    try {
      // 清理现有图表
      if (this.currentChart) {
        if (this.currentChart.dispose) {
          this.currentChart.dispose();
        } else if (this.currentChart.release) {
          this.currentChart.release();
        }
        this.currentChart = null;
      }
      
      container.innerHTML = '';
      container.style.height = '400px';
      
      switch (library) {
        case 'vchart':
          // 获取容器尺寸并设置给VChart
          const containerRect = container.getBoundingClientRect();
          const vchartSpec = {
            ...spec,
            width: containerRect.width || 600,
            height: containerRect.height || 400
          };
          this.currentChart = new VChart(vchartSpec, { dom: container });
          this.currentChart.renderAsync();
          this.log('🎉 VChart图表渲染成功！', 'success');
          break;
          
        case 'vtable':
          // VTable需要特殊处理，因为它是表格不是图表
          container.style.height = 'auto';
          this.currentChart = new ListTable(container, spec);
          this.log('🎉 VTable表格渲染成功！', 'success');
          break;
          
        default:
          container.innerHTML = `<div class="placeholder">不支持的图表库: ${library}</div>`;
          this.log(`❌ 不支持的图表库: ${library}`, 'error');
          return;
      }
      
      // 响应式处理
      window.addEventListener('resize', () => {
        if (this.currentChart) {
          if (this.currentChart.resize) {
            this.currentChart.resize();
          } else if (this.currentChart.updateOption) {
            // VChart的响应式方法
            this.currentChart.updateOption({ width: container.clientWidth });
          }
        }
      });
      
    } catch (error) {
      this.log(`❌ 图表渲染失败: ${error}`, 'error');
      container.innerHTML = `<div class="error">渲染失败: ${error}</div>`;
    }
  }

  private executeCode() {
    if (!this.connected || !this.ws) {
      this.log('❌ 未连接到服务器', 'error');
      return;
    }
    
    try {
      // 获取配置
      const dataInput = document.getElementById('data-input') as HTMLTextAreaElement;
      const librarySelect = document.getElementById('library-select') as HTMLSelectElement;
      const chartTypeSelect = document.getElementById('chart-type-select') as HTMLSelectElement;
      const subtypeSelect = document.getElementById('subtype-select') as HTMLSelectElement;
      const dimensionsInput = document.getElementById('dimensions-input') as HTMLInputElement;
      const measuresInput = document.getElementById('measures-input') as HTMLInputElement;
      const titleInput = document.getElementById('title-input') as HTMLInputElement;
      
      const dataSet = JSON.parse(dataInput.value);
      const dimensions = dimensionsInput.value.split(',').map(s => s.trim()).filter(Boolean);
      const measures = measuresInput.value.split(',').map(s => s.trim()).filter(Boolean);
      
      const request = {
        type: 'execute_code',
        data: {
          dataSet,
          chartType: chartTypeSelect.value,
          subType: subtypeSelect.value || undefined,
          dimensions,
          measures,
          title: titleInput.value || undefined,
          library: librarySelect.value as any
        }
      };
      
      this.log('🚀 发送执行请求...', 'info');
      this.ws.send(JSON.stringify(request));
      
    } catch (error) {
      this.log(`❌ 配置解析错误: ${error}`, 'error');
    }
  }

  private clearAll() {
    const inputs = [
      'data-input', 'dimensions-input', 'measures-input', 'title-input'
    ];
    
    inputs.forEach(id => {
      const element = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
      if (element) {
        if (id === 'data-input') {
          element.value = this.getDefaultData();
        } else {
          element.value = '';
        }
      }
    });
    
    const specElement = document.getElementById('generated-spec');
    if (specElement) {
      specElement.textContent = '';
    }
    
    const chartContainer = document.getElementById('interactive-chart');
    if (chartContainer) {
      chartContainer.innerHTML = '<div class="placeholder">点击"生成图表"开始使用</div>';
    }
    
    if (this.currentChart) {
      this.currentChart.dispose();
      this.currentChart = null;
    }
    
    this.log('🧹 已清空所有内容', 'info');
  }

  private clearLogs() {
    const logOutput = document.getElementById('log-output');
    if (logOutput) {
      logOutput.innerHTML = '';
    }
  }

  private log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
    const logOutput = document.getElementById('log-output');
    if (logOutput) {
      const logItem = document.createElement('div');
      logItem.className = `log-item ${type}`;
      logItem.textContent = `${new Date().toLocaleTimeString()} ${message}`;
      logOutput.appendChild(logItem);
      logOutput.scrollTop = logOutput.scrollHeight;
    }
    
    // 同时输出到控制台
    console.log(message);
  }
}

// 导出初始化函数
export function initializeInteractiveDemo() {
  console.log('🎮 初始化交互式VizSeed IDE...');
  new VizSeedIDE();
}