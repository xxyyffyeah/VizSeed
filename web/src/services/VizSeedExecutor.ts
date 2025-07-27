/**
 * VizSeed代码执行器
 * 在Web端执行VizSeed DSL代码
 */

// 定义执行结果接口
export interface VizSeedExecutionResult {
  success: boolean;
  spec?: any;
  vizSeedDSL?: any;
  error?: string;
  timestamp: string;
}

// VizSeed代码执行器类
export class VizSeedExecutor {

  /**
   * 执行VizSeed DSL字符串
   */
  async executeCode(dslString: string): Promise<VizSeedExecutionResult> {
    const startTime = new Date().toISOString();
    
    try {
      // 1. 解析JSON格式的VizSeed DSL
      const vizSeedDSL = JSON.parse(dslString);
      
      // 2. 验证DSL必需字段
      if (!vizSeedDSL.chartType) {
        throw new Error('DSL中缺少chartType字段');
      }
      if (!vizSeedDSL.data || !Array.isArray(vizSeedDSL.data)) {
        throw new Error('DSL中缺少有效的data数组');
      }
      
      // 3. 加载VizSeedBuilder
      const module = await import('../../../src/builder/VizSeedBuilder');
      
      if (!module.VizSeedBuilder) {
        throw new Error('模块中未找到VizSeedBuilder导出');
      }
      
      // 4. 从DSL创建Builder并构建图表规范
      const builder = module.VizSeedBuilder.from(vizSeedDSL);
      const spec = await builder.buildSpec();
      
      return {
        success: true,
        spec,
        vizSeedDSL,
        timestamp: startTime
      };
      
    } catch (error) {
      let errorMessage = '执行失败';
      if (error instanceof SyntaxError) {
        errorMessage = `JSON解析错误: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        timestamp: startTime
      };
    }
  }
}

// 导出单例
export const vizSeedExecutor = new VizSeedExecutor();