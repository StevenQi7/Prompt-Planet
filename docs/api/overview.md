# API概述

本文档提供了 Prompt Planet 项目的API概述，介绍了API的设计原则、使用方式和通用规范。

## API设计原则

Prompt Planet API遵循以下设计原则：

1. **RESTful设计**: 使用标准的HTTP方法操作资源
2. **简单一致**: 接口设计保持一致，易于理解和使用
3. **功能完备**: 提供完整的功能支持
4. **安全可靠**: 实现适当的认证和授权机制
5. **性能优化**: 保持良好的响应速度和效率

## API基础URL

所有API请求使用以下基础URL：

```
https://[your-domain]/api
```

在本地开发环境中，使用：

```
http://localhost:3000/api
```

## API路由结构

API接口按照资源类型组织，位于`src/app/api/`目录下：

```
src/app/api/
├── auth/                # 认证相关接口
│   ├── login/          # 登录
│   └── register/       # 注册
├── prompts/            # 提示词相关接口
│   ├── [id]/           # 单个提示词操作
│   ├── popular/        # 热门提示词
│   ├── recent/         # 最新提示词
│   ├── search/         # 搜索提示词
│   └── user/           # 用户提示词
├── categories/         # 分类相关接口
├── tags/               # 标签相关接口
├── users/              # 用户相关接口
└── upload/             # 文件上传接口
```

## 认证方式

大部分API需要认证才能访问。系统支持以下认证方式：

### 基于会话的认证

系统使用Supabase Auth提供的会话认证机制，认证过程如下：

1. 用户通过`/api/auth/login`接口登录
2. 登录成功后，服务器返回认证令牌
3. 客户端将令牌存储在本地
4. 后续请求在Authorization头中携带令牌

示例：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 请求格式

### GET请求

GET请求使用URL查询参数传递数据：

```
GET /api/prompts?limit=10&page=1
```

### POST/PUT/DELETE请求

POST、PUT和DELETE请求使用JSON格式的请求体：

```
POST /api/prompts
Content-Type: application/json

{
  "title": "提示词标题",
  "content": "提示词内容",
  "categoryId": "123"
}
```

## 响应格式

所有API返回统一的JSON格式：

```json
{
  "success": true|false,
  "data": {...}|[...],  // 请求成功时返回的数据
  "error": {            // 请求失败时返回的错误信息
    "code": "ERROR_CODE",
    "message": "错误描述信息"
  },
  "meta": {             // 元数据，如分页信息
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "id": "prompt-123",
    "title": "高效写作助手",
    "content": "你是一位专业写作助手...",
    "createdAt": "2023-05-15T08:30:00Z"
  }
}
```

### 错误响应示例

```json
{
  "success": false,
  "error": {
    "code": "PROMPT_NOT_FOUND",
    "message": "提示词未找到"
  }
}
```

### 分页响应示例

```json
{
  "success": true,
  "data": [
    {
      "id": "prompt-123",
      "title": "高效写作助手"
    },
    {
      "id": "prompt-124",
      "title": "代码生成器"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

## HTTP状态码

API使用标准的HTTP状态码表示请求状态：

| 状态码 | 描述                 | 场景                           |
|--------|---------------------|--------------------------------|
| 200    | OK                  | 请求成功                       |
| 201    | Created             | 资源创建成功                   |
| 400    | Bad Request         | 请求参数错误                   |
| 401    | Unauthorized        | 未认证或认证失败               |
| 403    | Forbidden           | 无权限访问                     |
| 404    | Not Found           | 资源未找到                     |
| 429    | Too Many Requests   | 请求频率超过限制               |
| 500    | Internal Server Error| 服务器内部错误                 |

## 错误处理

系统定义了一系列错误代码，用于明确表示错误类型：

| 错误代码                | 描述                           |
|------------------------|--------------------------------|
| VALIDATION_ERROR       | 请求参数验证失败               |
| AUTHENTICATION_ERROR   | 认证失败                       |
| AUTHORIZATION_ERROR    | 授权失败                       |
| RESOURCE_NOT_FOUND     | 资源未找到                     |
| PROMPT_NOT_FOUND       | 提示词未找到                   |
| USER_NOT_FOUND         | 用户未找到                     |
| DUPLICATE_RESOURCE     | 资源已存在                     |
| RATE_LIMIT_EXCEEDED    | 请求频率超限                   |
| SERVER_ERROR           | 服务器内部错误                 |

## 请求限流

为了防止API滥用，系统实施了请求限流策略：

- 匿名用户: 60请求/分钟
- 登录用户: 120请求/分钟
- 管理员: 300请求/分钟

超过限制的请求将收到429状态码响应。

## 通用查询参数

许多GET请求支持以下通用查询参数：

| 参数     | 类型     | 描述                                    |
|----------|---------|----------------------------------------|
| page     | number  | 页码，默认为1                           |
| limit    | number  | 每页条数，默认为10，最大值为50          |
| sort     | string  | 排序字段，前缀-表示降序，如"-createdAt" |
| fields   | string  | 返回字段筛选，逗号分隔，如"id,title"     |
| q        | string  | 搜索关键词                             |

## 跨域资源共享(CORS)

API支持跨域请求，设置了适当的CORS头：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## API版本控制

当API需要重大更改时，将使用URL路径指定版本：

```
/api/v1/prompts
/api/v2/prompts
```

当前API版本为v1，未在URL中显式指定版本的请求使用v1版本。

## 缓存策略

为了提高性能，某些GET请求的响应会被缓存：

- `/api/categories`: 缓存12小时
- `/api/prompts/popular`: 缓存1小时
- `/api/prompts/[id]`: 缓存10分钟

缓存可以通过请求头`Cache-Control: no-cache`禁用。

## API文档

详细的API文档请参考以下章节：

- [提示词API](./prompts.md)
- [用户API](./users.md)
- [分类API](./categories.md)
- [标签API](./tags.md)
- [认证API](./auth.md)
- [上传API](./upload.md)

## API客户端使用示例

### 使用fetch

```javascript
// 获取提示词列表
async function getPrompts() {
  try {
    const response = await fetch('https://your-domain/api/prompts?limit=10');
    if (!response.ok) {
      throw new Error('API请求失败');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('获取提示词失败:', error);
    return [];
  }
}

// 创建提示词
async function createPrompt(promptData) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('https://your-domain/api/prompts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(promptData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'API请求失败');
    }
    return await response.json();
  } catch (error) {
    console.error('创建提示词失败:', error);
    throw error;
  }
}
``` 