# Prompt Planet 文档

本文档提供了 Prompt Planet 项目的详细信息，包括架构设计、开发指南和API参考。

## 项目概述

Prompt Planet 是一个面向AI爱好者和专业人士的平台，允许用户创建、整理和分享高质量的AI提示词。该平台支持Markdown编辑、图片上传、用户认证和社区互动等功能。

## 文档导航

- [使用指南](./guide/README.md) - 项目使用说明
- [API文档](./api/README.md) - API接口说明
- [示例代码](./examples/README.md) - 代码示例

## 技术栈

- **前端框架**: [Next.js 15](https://nextjs.org/)
- **React版本**: React 18
- **CSS框架**: [Tailwind CSS 4](https://tailwindcss.com/)
- **数据库**: [Supabase](https://supabase.com/) (PostgreSQL)
- **身份验证**: Supabase Auth
- **文件存储**: [Cloudflare R2](https://www.cloudflare.com/products/r2/)
- **Markdown编辑**: react-markdown + react-markdown-editor-lite
- **UI组件**: 基于Tailwind构建的自定义组件
- **文件上传**: react-dropzone
- **通知系统**: react-hot-toast
- **国际化**: 自定义i18n实现

## 项目结构

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
├── .env.example        # 环境变量示例
└── README.md           # 项目文档
``` 