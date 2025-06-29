import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import path from 'path';

// 导入VizSeed
import { VizSeedBuilder } from '../src/builder/VizSeedBuilder';
import { DataSet } from '../src/types/data';
import { ChartLibrary } from '../src/types/specs';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// 解析JSON
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, '../dist-web')));

interface CodeExecutionRequest {
  type: 'execute_code';
  data: {
    dataSet: DataSet;
    chartType: string;
    subType?: string;
    dimensions: string[];
    measures: string[];
    title?: string;
    library: ChartLibrary;
  };
}

interface CodeExecutionResponse {
  type: 'execution_result';
  success: boolean;
  data?: any;
  error?: string;
  spec?: any;
  logs?: string[];
}

// WebSocket连接处理
wss.on('connection', (ws) => {
  console.log('🔗 新的WebSocket连接');
  
  // 发送欢迎消息
  ws.send(JSON.stringify({
    type: 'connection_established',
    message: 'VizSeed服务器连接成功！'
  }));

  ws.on('message', async (message) => {
    try {
      const request: CodeExecutionRequest = JSON.parse(message.toString());
      
      if (request.type === 'execute_code') {
        console.log('📊 执行图表生成请求:', request.data);
        
        const response = await executeVizSeedCode(request.data);
        ws.send(JSON.stringify(response));
      }
    } catch (error) {
      console.error('❌ WebSocket消息处理错误:', error);
      
      const errorResponse: CodeExecutionResponse = {
        type: 'execution_result',
        success: false,
        error: `消息处理错误: ${error}`
      };
      
      ws.send(JSON.stringify(errorResponse));
    }
  });

  ws.on('close', () => {
    console.log('📴 WebSocket连接关闭');
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket错误:', error);
  });
});

// 执行VizSeed代码
async function executeVizSeedCode(params: CodeExecutionRequest['data']): Promise<CodeExecutionResponse> {
  const logs: string[] = [];
  
  try {
    logs.push('🔄 开始执行VizSeed代码...');
    
    // 验证数据
    if (!params.dataSet || !params.dataSet.rows || params.dataSet.rows.length === 0) {
      throw new Error('数据集不能为空');
    }
    
    if (!params.chartType) {
      throw new Error('图表类型不能为空');
    }
    
    if (params.dimensions.length === 0 && params.measures.length === 0) {
      throw new Error('至少需要指定一个维度或度量');
    }
    
    logs.push(`📊 图表类型: ${params.chartType}${params.subType ? `(${params.subType})` : ''}`);
    logs.push(`📈 目标库: ${params.library}`);
    logs.push(`📋 数据行数: ${params.dataSet.rows.length}`);
    
    // 创建VizSeed构建器
    const builder = new VizSeedBuilder(params.dataSet);
    
    // 设置图表类型
    if (params.subType) {
      builder.setChartType(params.chartType as any, params.subType as any);
    } else {
      builder.setChartType(params.chartType as any);
    }
    
    // 添加维度
    params.dimensions.forEach(dim => {
      builder.addDimension(dim);
      logs.push(`📐 添加维度: ${dim}`);
    });
    
    // 添加度量
    params.measures.forEach(measure => {
      builder.addMeasure(measure);
      logs.push(`📏 添加度量: ${measure}`);
    });
    
    // 设置标题
    if (params.title) {
      builder.setTitle(params.title);
      logs.push(`🏷️ 设置标题: ${params.title}`);
    }
    
    // 生成规范
    logs.push('⚙️ 生成图表规范...');
    const spec = builder.buildSpec(params.library);
    
    logs.push('✅ VizSeed代码执行成功！');
    
    return {
      type: 'execution_result',
      success: true,
      data: {
        chartType: params.chartType,
        library: params.library,
        rowCount: params.dataSet.rows.length,
        dimensionCount: params.dimensions.length,
        measureCount: params.measures.length
      },
      spec,
      logs
    };
    
  } catch (error) {
    logs.push(`❌ 执行失败: ${error}`);
    
    return {
      type: 'execution_result',
      success: false,
      error: error instanceof Error ? error.message : String(error),
      logs
    };
  }
}

// REST API端点用于测试
app.post('/api/execute', async (req, res) => {
  try {
    const result = await executeVizSeedCode(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'VizSeed服务器运行正常',
    timestamp: new Date().toISOString()
  });
});

// 获取支持的图表库和类型
app.get('/api/capabilities', (req, res) => {
  res.json({
    libraries: ['vchart', 'echarts', 'vtable'],
    chartTypes: {
      vchart: ['bar', 'column', 'area', 'line', 'scatter', 'pie'],
      echarts: ['bar', 'column', 'area', 'line', 'scatter', 'pie'],
      vtable: ['table']
    },
    subTypes: {
      bar: ['grouped', 'stacked', 'percent'],
      column: ['grouped', 'stacked', 'percent'],
      area: ['stacked', 'percent'],
      line: [],
      scatter: ['linear', 'grouped'],
      pie: [],
      table: []
    }
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 VizSeed服务器启动成功`);
  console.log(`📡 WebSocket服务器: ws://localhost:${PORT}`);
  console.log(`🌐 HTTP服务器: http://localhost:${PORT}`);
  console.log(`💻 前端界面: http://localhost:3000`);
  console.log(`🔧 API端点: http://localhost:${PORT}/api/`);
});

export { server, wss };