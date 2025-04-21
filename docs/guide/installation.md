# 安装部署指南

本文档提供了 Prompt Planet 项目的安装和部署说明，帮助开发者快速搭建开发和生产环境。

## 系统要求

- Node.js 18.0 或更高版本
- npm 8.0 或更高版本
- PostgreSQL 14.0 或更高版本（如果本地开发）
- Supabase 账号（用于数据库和身份验证）
- Cloudflare R2 账号（用于文件存储）

## 本地开发环境搭建

### 1. 克隆代码仓库

```bash
git clone <repository-url>
cd prompt-planet
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量示例文件并填入相应的值：

```bash
cp .env.example .env.local
```

必须配置的环境变量包括：

```
# 应用配置
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
DATABASE_URL=<your-postgresql-url>

# Cloudflare R2配置
R2_ACCESS_KEY_ID=<your-r2-access-key-id>
R2_SECRET_ACCESS_KEY=<your-r2-secret-access-key>
R2_BUCKET_NAME=<your-r2-bucket-name>
R2_ENDPOINT=<your-r2-endpoint>
R2_PUBLIC_URL=<your-r2-public-url>
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 5. 使用TurboRepo加速开发（可选）

如果您想使用 TurboRepo 加速开发过程，可以运行：

```bash
npm run dev:turbo
```

## 数据库设置

### Supabase设置

1. 在 [Supabase](https://supabase.com/) 创建新项目
2. 在项目设置中找到 API URL 和密钥信息
3. 将相关信息添加到 `.env.local` 文件中
4. 导入初始数据结构（如果有）

```bash
# 安装Supabase CLI
npm install -g supabase

# 初始化Supabase本地开发
supabase init

# 启动本地Supabase服务
supabase start

# 应用迁移
supabase db push
```

## 生产环境部署

### Vercel部署

Prompt Planet 项目优化了在Vercel平台上的部署流程：

1. 在 [Vercel](https://vercel.com/) 创建新项目
2. 连接到项目的Git仓库
3. 配置环境变量（与 `.env.local` 相同）
4. 部署项目

```bash
# 使用Vercel CLI部署
npm install -g vercel
vercel login
vercel
```

### 自定义服务器部署

如果你需要在自己的服务器上部署：

1. 构建生产版本

```bash
npm run build:prod
```

2. 启动服务

```bash
npm start
```

## 常见问题解决

### 1. 依赖安装失败

如果遇到依赖安装问题，尝试：

```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### 2. Supabase连接问题

检查环境变量是否正确设置，并确保Supabase项目是活跃状态。

### 3. 文件上传失败

确保R2存储桶配置正确，权限设置允许上传。

## 更新与维护

### 更新依赖

定期更新项目依赖以保持安全：

```bash
npm update
```

### 数据备份

定期备份Supabase数据：

```bash
supabase db dump -f backup.sql
``` 