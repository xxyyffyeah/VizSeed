// 导入演示模块
import { initializeInteractiveDemo } from './interactive-demo';

// 主函数
function main() {
  console.log('🚀 开始加载VizSeed交互式演示...');
  
  // 初始化交互式演示
  initializeInteractiveDemo();
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}