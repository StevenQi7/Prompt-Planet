# Prompt Planet API 文档

本文档提供了 Prompt Planet 项目的API接口说明，包括RESTful API和服务函数。

## 目录

- [API概述](./overview.md)
- [提示词API](./prompts.md)
- [用户API](./users.md)
- [分类API](./categories.md)
- [标签API](./tags.md)
- [认证API](./auth.md)
- [上传API](./upload.md)
- [服务函数](./services.md)

## API路由结构

API接口使用Next.js的API路由功能实现，位于`src/app/api/`目录下：

```
src/app/api/
├── auth/
│   ├── login/
│   └── register/
├── prompts/
│   ├── [id]/
│   ├── popular/
│   ├── recent/
│   ├── search/
│   └── user/
├── categories/
├── tags/
├── users/
└── upload/
```

## 服务模块

内部服务功能位于`src/services/`目录，提供与数据库交互的功能：

```
src/services/
├── promptService.ts
├── userService.ts
├── authService.ts
├── categoryService.ts
└── tagService.ts
```

## 认证与授权

API接口使用基于Supabase的认证系统，支持以下认证方式：

- 基于会话的身份验证
- JWT认证
- 社交登录集成（如有）

## API返回格式

所有API返回统一的JSON格式：

```json
{
  "success": true|false,
  "data": {...}|[...],  // 请求成功时返回的数据
  "error": {            // 请求失败时返回的错误信息
    "code": "ERROR_CODE",
    "message": "错误描述"
  },
  "meta": {             // 元数据，如分页信息
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 错误处理

API错误遵循HTTP状态码标准，常见错误包括：

- 400 Bad Request - 请求参数错误
- 401 Unauthorized - 未授权访问
- 403 Forbidden - 禁止访问（权限不足）
- 404 Not Found - 资源未找到
- 500 Internal Server Error - 服务器内部错误

## 请求限流

为防止滥用，API实现了请求限流机制：

- 匿名用户: 60请求/分钟
- 登录用户: 120请求/分钟
- 管理员: 300请求/分钟

## 跨域支持

API默认支持跨域请求，通过设置适当的CORS头实现：

```typescript
// middleware.ts中的CORS配置
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
``` 