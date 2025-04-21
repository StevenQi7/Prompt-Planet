# 项目架构

本文档描述了 Prompt Planet 项目的总体架构设计，帮助开发者理解系统的各个组成部分及其交互方式。

## 架构概览

Prompt Planet 采用现代化的前端架构，基于 Next.js 构建，使用 Supabase 作为后端服务。系统采用分层架构，清晰分离关注点，便于开发和维护。

![架构图](../assets/architecture-diagram.png)

## 核心技术栈

- **前端框架**: Next.js 15
- **UI库**: React 18
- **样式方案**: Tailwind CSS 4
- **状态管理**: React Context + Hooks
- **数据获取**: React Query / SWR
- **后端服务**: Supabase (PostgreSQL + Auth)
- **存储服务**: Cloudflare R2
- **部署平台**: Vercel

## 系统分层

系统分为以下几个主要层次：

### 1. 表示层

包含页面和组件，负责UI渲染和用户交互。

- **页面(Pages)**: 位于 `src/app` 目录，使用 Next.js App Router
- **组件(Components)**: 位于 `src/components` 目录，分为通用组件和特定功能组件
- **样式(Styles)**: 使用 Tailwind CSS 工具类和全局样式

### 2. 应用层

包含业务逻辑和状态管理。

- **上下文(Contexts)**: 位于 `src/contexts` 目录，提供全局状态管理
- **钩子(Hooks)**: 位于 `src/hooks` 目录，封装可复用的逻辑
- **服务(Services)**: 位于 `src/services` 目录，处理业务逻辑和API调用

### 3. 数据层

负责数据获取、处理和持久化。

- **API Routes**: 位于 `src/app/api` 目录，提供后端API
- **数据库**: 使用 Supabase 提供的 PostgreSQL 数据库
- **存储**: 使用 Cloudflare R2 进行文件存储

## 数据流

系统采用单向数据流模式：

1. 用户在UI上进行操作
2. 组件触发事件处理函数
3. 事件处理函数调用服务函数或更新上下文状态
4. 服务函数执行业务逻辑并与API交互
5. API与数据库或存储服务交互
6. 数据返回到服务函数
7. 服务函数更新上下文状态
8. UI基于新状态重新渲染

## 核心模块

### 提示词模块

提示词是系统的核心内容，包括创建、编辑、浏览和搜索功能。

- **组件**: `src/components/prompt/*`
- **页面**: `src/app/prompt/*`, `src/app/create-prompt/*`
- **服务**: `src/services/promptService.ts`
- **API**: `src/app/api/prompts/*`
- **数据模型**:
  ```
  Prompt {
    id: string
    title: string
    description: string
    content: string
    usageGuide?: string
    status: string
    isPublic: boolean
    viewCount: number
    favoriteCount: number
    images: string[]
    createdAt: string
    updatedAt: string
    language: string
    userId: string
    categoryId: string
  }
  ```

### 用户模块

处理用户认证、授权和个人资料管理。

- **组件**: `src/components/Auth/*`, `src/components/Settings/*`
- **页面**: `src/app/login/*`, `src/app/register/*`, `src/app/settings/*`
- **服务**: `src/services/authService.ts`, `src/services/userService.ts`
- **API**: `src/app/api/auth/*`, `src/app/api/users/*`
- **数据模型**:
  ```
  User {
    id: string
    username: string
    email: string
    nickname?: string
    avatar?: string
    bio?: string
    createdAt: string
    updatedAt: string
  }
  ```

### 搜索模块

提供内容搜索和筛选功能。

- **组件**: `src/components/search/*`
- **页面**: `src/app/search-results/*`
- **服务**: `src/services/searchService.ts`
- **API**: `src/app/api/prompts/search`

### 分类和标签模块

管理内容分类和标签系统。

- **服务**: `src/services/categoryService.ts`, `src/services/tagService.ts`
- **API**: `src/app/api/categories/*`, `src/app/api/tags/*`
- **数据模型**:
  ```
  Category {
    id: string
    name: string
    displayName: string
    icon: string
    color: string
  }
  
  Tag {
    id: string
    name: string
    displayName: string
    color: string
  }
  ```

## 国际化架构

系统支持多语言，使用自定义的国际化实现。

- **语言文件**: `src/locales/*.ts`
- **上下文**: `src/contexts/LanguageContext.tsx`
- **钩子**: `useLanguage()`

## 认证与授权

系统使用Supabase Auth进行用户认证和授权。

- **认证流程**:
  1. 用户登录/注册
  2. 获取JWT令牌
  3. 将令牌存储在客户端
  4. 随后的请求携带令牌

- **授权策略**:
  - 公开内容: 无需认证
  - 个人内容: 需要用户认证
  - 管理操作: 需要管理员权限

## 缓存策略

系统实现了多级缓存策略，提高性能和响应速度。

- **客户端缓存**: 使用 SWR 的缓存机制
- **服务器缓存**: 使用 Next.js 的静态生成和增量静态再生成
- **CDN缓存**: 通过 Vercel Edge Network 缓存静态资源

## 错误处理

系统实现了全面的错误处理机制。

- **前端错误处理**: 
  - 使用 try-catch 捕获异步操作错误
  - 错误状态在上下文中维护
  - 向用户显示友好的错误消息

- **API错误处理**:
  - 统一的错误响应格式
  - HTTP状态码对应不同错误类型
  - 详细的错误消息和错误代码

## 扩展性考虑

系统设计时考虑了未来的扩展性。

- **模块化设计**: 便于添加新功能
- **可配置的设置**: 使用环境变量控制系统行为
- **可插拔的服务**: 服务层可以替换为不同的实现

## 性能优化

系统实施了多种性能优化措施。

- **代码分割**: 减小初始加载大小
- **懒加载**: 按需加载组件和资源
- **图片优化**: 使用 Next.js Image 组件
- **静态页面生成**: 预渲染静态内容
- **增量静态再生成**: 定期更新静态内容

## 安全措施

系统实施了多种安全措施。

- **认证**: 使用 Supabase Auth 和 JWT
- **数据验证**: 在前端和API层验证用户输入
- **CSRF保护**: 使用令牌验证跨站请求
- **内容策略**: 限制上传文件类型和大小
- **请求限流**: 防止滥用API 