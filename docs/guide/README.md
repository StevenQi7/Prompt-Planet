# Prompt Planet 使用指南

本文档提供了 Prompt Planet 平台的详细使用说明，帮助开发者和用户快速上手项目。

## 目录

- [安装部署](./installation.md)
- [开发环境配置](./development.md)
- [项目架构](./architecture.md)
- [组件使用](./components.md)
- [国际化支持](./i18n.md)
- [样式指南](./styling.md)

## 快速开始

### 本地开发

1. 克隆代码仓库
   ```bash
   git clone <repository-url>
   cd prompt-planet
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 配置环境变量
   - 复制`.env.example`文件并重命名为`.env.local`
   - 填入必要的环境变量值

4. 启动开发服务器
   ```bash
   npm run dev
   ```

5. 访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 环境配置

项目需要以下环境变量才能正常运行：

#### 应用配置
- `SITE_URL`: 站点URL（用于服务端）
- `NEXT_PUBLIC_SITE_URL`: 站点URL（用于客户端）

#### Supabase配置
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase项目URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase匿名密钥
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase服务角色密钥
- `DATABASE_URL`: PostgreSQL数据库连接URL

#### Cloudflare R2配置
- `R2_ACCESS_KEY_ID`: R2访问密钥ID
- `R2_SECRET_ACCESS_KEY`: R2访问密钥
- `R2_BUCKET_NAME`: R2存储桶名称
- `R2_ENDPOINT`: R2端点URL
- `R2_PUBLIC_URL`: R2公共访问URL

## 开发规范

### 代码组织

- 遵循功能模块化的组织方式
- 将相关功能组件放在同一目录下
- 使用index.ts文件导出组件，方便引用

### 组件开发规范

- 组件使用TypeScript编写，确保类型安全
- 遵循React函数组件的最佳实践
- 使用自定义钩子封装逻辑
- 组件样式使用Tailwind CSS实现

### 国际化规范

- 所有用户可见的文本应使用国际化系统
- 翻译键名应遵循层级结构，如`pageName.sectionName.elementName`
- 支持中英文切换 