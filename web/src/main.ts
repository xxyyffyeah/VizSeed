// 导入演示模块
import { initializeDemo } from './simple-demo';
import { initializeInteractiveDemo } from './interactive-demo';

// 主函数
function main() {
  console.log('🚀 开始加载VizSeed图表演示...');
  
  // 初始化静态演示
  initializeDemo();
  
  // 初始化交互式演示
  setTimeout(() => {
    initializeInteractiveDemo();
  }, 1000);
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}