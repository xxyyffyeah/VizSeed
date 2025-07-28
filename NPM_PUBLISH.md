# VizSeed npm发布指南

## 📦 发布前准备清单

### ✅ 已完成的准备工作

1. **package.json优化**
   - ✅ 设置files字段限制发布内容
   - ✅ 配置依赖关系（核心依赖vs可选依赖）
   - ✅ 添加关键词和元数据
   - ✅ 设置engines要求
   - ✅ 配置发布前脚本

2. **TypeScript配置优化**
   - ✅ 启用declarationMap
   - ✅ 确保输出完整类型定义

3. **导出结构优化**
   - ✅ 增加核心API导出
   - ✅ 添加版本信息导出
   - ✅ 设置默认导出

### 🔍 核心库依赖策略

#### dependencies（强制安装）
- `radash`: 函数式工具库（核心依赖）
- `zod`: 类型验证库（核心依赖）

#### peerDependencies（用户选择安装）
- `@visactor/vchart`: VChart图表库（可选）
- `@visactor/vtable`: VTable表格库（可选）

#### optionalDependencies（Web界面相关）
- React生态系统
- Web开发工具
- 服务器依赖

## 🚀 发布流程

### 1. 发布前验证

```bash
# 清理dist目录
rm -rf dist/

# 编译项目
npm run build

# 检查编译输出
ls -la dist/

# 运行示例确保功能正常
npm run example

# 检查包内容（模拟发布）
npm pack --dry-run
```

### 2. 版本管理

```bash
# 查看当前版本
npm version

# 更新版本（根据变更类型选择）
npm version patch   # 1.0.0 -> 1.0.1 (bug修复)
npm version minor   # 1.0.0 -> 1.1.0 (新功能)
npm version major   # 1.0.0 -> 2.0.0 (重大变更)
```

### 3. 发布到npm

```bash
# 首次发布
npm publish

# 指定标签发布（beta版本）
npm publish --tag beta

# 检查发布结果
npm info vizseed
```

## 📋 包内容清单

### 🎯 将被发布的文件
```
vizseed/
├── dist/                 # 编译后的代码
│   ├── *.js             # JavaScript文件
│   ├── *.d.ts           # TypeScript声明文件
│   ├── *.d.ts.map       # 声明文件源码映射
│   └── *.js.map         # JavaScript源码映射
├── README.md            # 项目文档
├── LICENSE              # 开源许可证
├── CHANGELOG.md         # 版本更新日志（需创建）
└── package.json         # 包配置
```

### 🚫 被排除的文件
- `node_modules/`：依赖包
- `src/`：TypeScript源码
- `examples/`：示例文件
- `web/`：Web界面
- `server/`：服务器代码
- `dist-web/`：Web构建输出
- 配置文件：`tsconfig.json`, `vite.config.ts`等

## 🎯 用户安装体验

### 基础使用（仅核心功能）
```bash
npm install vizseed

# 只安装核心功能，用户需要手动安装图表库
npm install @visactor/vchart  # 如果需要VChart
npm install @visactor/vtable  # 如果需要VTable
```

### 完整功能安装
```bash
npm install vizseed @visactor/vchart @visactor/vtable
```

## 📊 包大小分析

### 预估包大小
- **核心库**：~50KB（压缩后）
- **包含所有依赖**：~2MB（之前的版本）
- **优化效果**：减少95%的包体积

### 依赖分析
```bash
# 分析包大小
npm run build
du -sh dist/

# 分析依赖树
npm ls --depth=0
```

## ⚠️ 注意事项

### 1. 破坏性变更
- 用户需要手动安装图表库依赖
- Web界面功能需要额外安装

### 2. 兼容性
- Node.js >= 18.0.0
- npm >= 9.0.0
- TypeScript >= 5.0.0（开发时）

### 3. 类型安全
- 完整的TypeScript类型支持
- 可选依赖的类型检查

## 🔮 后续版本规划

### v1.1.0 计划
- [ ] 增加ECharts支持
- [ ] 完善错误处理
- [ ] 添加更多示例

### v1.2.0 计划
- [ ] Web界面单独包：`vizseed-web`
- [ ] 示例集合包：`vizseed-examples`
- [ ] 插件系统

## 📝 发布后任务

1. **更新文档**
   - README中的安装说明
   - 在线文档更新

2. **社区推广**
   - 发布博客文章
   - 提交到awesome-list

3. **监控反馈**
   - npm下载统计
   - GitHub issues跟踪
   - 用户反馈收集

## 🛠️ 故障排除

### 常见问题

1. **"peerDependencies warning"**
   - 正常现象，用户按需安装即可

2. **类型定义缺失**
   - 确保安装了对应的@types包

3. **版本冲突**
   - 检查peerDependencies版本范围

### 回滚策略

```bash
# 撤销发布（24小时内）
npm unpublish vizseed@1.0.0

# 废弃版本
npm deprecate vizseed@1.0.0 "有问题，请使用1.0.1"
```