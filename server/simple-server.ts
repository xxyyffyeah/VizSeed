// 简化版WebSocket服务器，避免ESM问题
const express = require('express');
const { WebSocketServer } = require('ws');
const { createServer } = require('http');
const path = require('path');

// 使用require导入以避免ESM问题
const { VizSeedBuilder } = require('../dist/builder/VizSeedBuilder');

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// 解析JSON
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, '../dist-web')));

// WebSocket连接处理
wss.on('connection', (ws: any) => {
  console.log('🔗 新的WebSocket连接');
  
  // 发送欢迎消息
  ws.send(JSON.stringify({
    type: 'connection_established',
    message: 'VizSeed服务器连接成功！'
  }));

  ws.on('message', async (message: Buffer) => {
    try {
      const request = JSON.parse(message.toString());
      
      if (request.type === 'execute_code') {
        console.log('📊 执行图表生成请求:', request.data);
        
        const response = await executeVizSeedCode(request.data);
        ws.send(JSON.stringify(response));
      }
    } catch (error) {
      console.error('❌ WebSocket消息处理错误:', error);
      
      const errorResponse = {
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

  ws.on('error', (error: any) => {
    console.error('❌ WebSocket错误:', error);
  });
});

// 执行VizSeed代码
async function executeVizSeedCode(params: any) {
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
      builder.setChartType(params.chartType, params.subType);
    } else {
      builder.setChartType(params.chartType);
    }
    
    // 添加维度
    params.dimensions.forEach((dim: string) => {
      builder.addDimension(dim);
      logs.push(`📐 添加维度: ${dim}`);
    });
    
    // 添加度量
    params.measures.forEach((measure: string) => {
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
    
  } catch (error: any) {
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
app.post('/api/execute', async (req: any, res: any) => {
  try {
    const result = await executeVizSeedCode(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// 健康检查
app.get('/api/health', (req: any, res: any) => {
  res.json({
    status: 'ok',
    message: 'VizSeed服务器运行正常',
    timestamp: new Date().toISOString()
  });
});

// 获取支持的图表库和类型
app.get('/api/capabilities', (req: any, res: any) => {
  res.json({
    libraries: ['vchart', 'echarts', 'vtable'],
    chartTypes: {
      vchart: ['bar', 'column', 'line', 'area', 'scatter', 'pie', 'donut'],
      echarts: ['bar', 'column', 'line', 'area', 'scatter', 'pie'],
      vtable: ['table']
    },
    subTypes: {
      bar: ['grouped', 'stacked', 'percent'],
      column: ['grouped', 'stacked', 'percent'],
      area: ['stacked', 'percent']
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