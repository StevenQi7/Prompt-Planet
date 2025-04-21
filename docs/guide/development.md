# 开发环境配置

本文档详细介绍了 Prompt Planet 项目的开发环境配置和开发工作流程。

## 开发工具推荐

为了获得最佳的开发体验，我们推荐以下开发工具：

- **编辑器**: [Visual Studio Code](https://code.visualstudio.com/)
- **浏览器**: [Chrome](https://www.google.com/chrome/) 或 [Firefox](https://www.mozilla.org/firefox/)
- **终端**: [Windows Terminal](https://aka.ms/terminal) (Windows), [iTerm2](https://iterm2.com/) (macOS), 或任何现代化的终端

## VSCode 插件推荐

以下 VSCode 插件可以提高开发效率：

- **ESLint**: JavaScript 代码规范检查
- **Prettier**: 代码格式化
- **Tailwind CSS IntelliSense**: Tailwind CSS 智能提示
- **ES7+ React/Redux/React-Native snippets**: React 代码片段
- **PostgreSQL**: SQL语法高亮和格式化

## 项目结构详解

Prompt Planet 项目采用模块化结构组织代码：

```
/
├── public/             # 静态资源
├── src/
│   ├── app/            # Next.js App Router页面
│   │   ├── api/        # API路由
│   │   ├── prompt/     # 提示词相关页面
│   │   ├── auth/       # 认证相关页面
│   │   └── ...         # 其他页面
│   ├── components/     # 可复用组件
│   │   ├── common/     # 通用组件
│   │   ├── prompt/     # 提示词相关组件
│   │   ├── search/     # 搜索相关组件
│   │   └── ...         # 其他功能组件
│   ├── contexts/       # React上下文
│   ├── hooks/          # 自定义React钩子
│   ├── lib/            # 通用库函数
│   ├── locales/        # 国际化资源
│   ├── services/       # API服务
│   │   ├── promptService.ts # 提示词相关服务
│   │   └── ...         # 其他服务
│   ├── styles/         # 全局样式
│   ├── types/          # TypeScript类型定义
│   └── utils/          # 工具函数
│       ├── styleUtils.ts     # 样式相关工具
│       ├── formatUtils.ts    # 格式化工具
│       └── ...         # 其他工具
├── supabase/           # Supabase配置
└── ...                 # 其他配置文件
```

## 开发工作流程

### 1. 分支管理

项目采用以下分支策略：

- `main`: 主分支，包含生产环境代码
- `develop`: 开发分支，包含最新特性
- `feature/*`: 特性分支，用于开发新功能
- `bugfix/*`: 修复分支，用于修复bug
- `release/*`: 发布分支，用于准备新版本发布

### 2. 开发流程

1. 从 `develop` 分支创建新的特性分支
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   ```

2. 进行开发，提交更改
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   > 注意：提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范

3. 完成开发后，推送分支并创建合并请求
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. 代码审查通过后，合并到 `develop` 分支

### 3. 提交规范

提交信息格式：

```
<类型>[可选作用域]: <描述>

[可选正文]

[可选脚注]
```

类型包括：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档变更
- `style`: 代码格式变更（不影响代码运行）
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变更

示例：
```
feat(prompt): 添加提示词收藏功能

添加用户收藏提示词的功能，包括：
- 添加/删除收藏API接口
- 收藏按钮组件
- 收藏状态管理

关联 #123
```

## 调试技巧

### 前端调试

1. 使用 React Developer Tools 插件
2. 使用浏览器开发者工具的 Console 和 Network 面板
3. 在代码中使用 `console.log()` 或 `debugger` 语句

### API调试

1. 使用 [Postman](https://www.postman.com/) 或 [Insomnia](https://insomnia.rest/) 测试API
2. 在API路由中使用 `console.log()` 打印请求和响应信息
3. 检查Network面板中的请求和响应

### 数据库调试

1. 使用Supabase仪表板查看数据库结构和数据
2. 使用SQL查询工具执行查询
3. 检查API日志以查看数据库操作

## 性能优化

开发过程中注意以下性能优化点：

1. 使用 Next.js 的 `<Image>` 组件优化图片加载
2. 使用 React.memo、useMemo 和 useCallback 减少不必要的渲染
3. 尽量减少页面的初始加载大小
4. 避免不必要的API请求
5. 使用适当的缓存策略

## 测试

### 单元测试

使用 Jest 和 React Testing Library 进行单元测试：

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- components/Button.test.tsx

# 监视模式
npm test -- --watch
```

### 端到端测试

使用 Cypress 进行端到端测试：

```bash
# 打开Cypress测试运行器
npm run cypress:open

# 运行所有端到端测试
npm run cypress:run
```

## 编码规范

### JavaScript/TypeScript

- 使用ES6+语法
- 使用TypeScript类型定义
- 避免使用`any`类型
- 使用异步/等待语法代替Promise链
- 遵循ESLint配置的代码规范

### React

- 使用函数组件和React Hooks
- 使用命名导出而非默认导出
- 组件名称使用PascalCase
- 使用解构赋值获取props
- 使用自定义钩子抽取和重用逻辑

### CSS

- 使用Tailwind CSS工具类
- 遵循移动优先的响应式设计原则
- 使用主题变量而非硬编码的颜色和尺寸
- 避免使用!important

## 常见问题解决

### 热更新不工作

如果热更新不正常工作，可以尝试：

1. 重启开发服务器
2. 清除浏览器缓存
3. 检查文件监视设置

### 类型错误

如果遇到TypeScript类型错误：

1. 确保导入了正确的类型定义
2. 检查属性名称和类型是否匹配
3. 使用适当的类型断言

### 环境变量问题

如果环境变量无法访问：

1. 确保在`.env.local`文件中正确设置了变量
2. 确保客户端环境变量以`NEXT_PUBLIC_`开头
3. 重启开发服务器使变更生效 