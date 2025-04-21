# 提示词 API

本文档描述了 Prompt Planet 提示词相关的 API 接口。

## 接口概览

| 方法   | 路径                        | 描述                     | 认证要求 |
|--------|----------------------------|--------------------------|---------|
| GET    | /api/prompts               | 获取提示词列表           | 否      |
| GET    | /api/prompts/[id]          | 获取单个提示词详情       | 否      |
| POST   | /api/prompts               | 创建新提示词             | 是      |
| PUT    | /api/prompts/[id]          | 更新提示词               | 是      |
| DELETE | /api/prompts/[id]          | 删除提示词               | 是      |
| GET    | /api/prompts/popular       | 获取热门提示词           | 否      |
| GET    | /api/prompts/recent        | 获取最新提示词           | 否      |
| GET    | /api/prompts/search        | 搜索提示词               | 否      |
| GET    | /api/prompts/user          | 获取当前用户的提示词     | 是      |
| POST   | /api/prompts/[id]/favorite | 收藏/取消收藏提示词      | 是      |

## 接口详情

### 获取提示词列表

获取分页的提示词列表。

**请求**

```
GET /api/prompts
```

**查询参数**

| 参数       | 类型     | 必填  | 描述                                      |
|-----------|----------|------|-------------------------------------------|
| page      | number   | 否    | 页码，默认为 1                            |
| limit     | number   | 否    | 每页条数，默认为 10，最大 50              |
| category  | string   | 否    | 按分类ID筛选                              |
| tag       | string   | 否    | 按标签ID筛选                              |
| sort      | string   | 否    | 排序方式：'latest'、'popular'、'relevance' |
| status    | string   | 否    | 状态筛选：'published'、'draft'、'pending'  |
| q         | string   | 否    | 搜索关键词                                |
| lang      | string   | 否    | 语言筛选：'zh'、'en'                      |

**响应**

```json
{
  "success": true,
  "data": {
    "prompts": [
      {
        "id": "prompt-123",
        "title": "高效写作助手",
        "description": "帮助你快速编写高质量文章的AI提示词",
        "content": "你是一位专业写作助手...",
        "usageGuide": "使用方法：1. 提供主题...",
        "status": "published",
        "viewCount": 1245,
        "favoriteCount": 382,
        "images": ["https://example.com/image1.jpg"],
        "createdAt": "2023-05-15T08:30:00Z",
        "category": {
          "id": "cat-001",
          "name": "writing",
          "displayName": "写作助手",
          "icon": "fa-pen",
          "color": "#3b82f6"
        },
        "author": {
          "id": "user-456",
          "username": "creativewriter",
          "nickname": "创意写手",
          "avatar": "https://example.com/avatar.jpg"
        },
        "tags": [
          {
            "tag": {
              "id": "tag-001",
              "name": "writing",
              "displayName": "写作",
              "color": "#3b82f6"
            }
          }
        ]
      }
    ],
    "total": 235,
    "totalPages": 24
  }
}
```

### 获取单个提示词详情

获取单个提示词的详细信息。

**请求**

```
GET /api/prompts/[id]
```

**路径参数**

| 参数 | 类型     | 描述      |
|------|----------|-----------|
| id   | string   | 提示词ID  |

**响应**

```json
{
  "success": true,
  "data": {
    "id": "prompt-123",
    "title": "高效写作助手",
    "description": "帮助你快速编写高质量文章的AI提示词",
    "content": "你是一位专业写作助手...",
    "usageGuide": "使用方法：1. 提供主题...",
    "status": "published",
    "isPublic": true,
    "viewCount": 1245,
    "favoriteCount": 382,
    "isFavorited": false,
    "images": ["https://example.com/image1.jpg"],
    "createdAt": "2023-05-15T08:30:00Z",
    "updatedAt": "2023-06-20T14:25:00Z",
    "language": "zh",
    "category": {
      "id": "cat-001",
      "name": "writing",
      "displayName": "写作助手",
      "icon": "fa-pen",
      "color": "#3b82f6"
    },
    "author": {
      "id": "user-456",
      "username": "creativewriter",
      "nickname": "创意写手",
      "avatar": "https://example.com/avatar.jpg"
    },
    "tags": [
      {
        "tag": {
          "id": "tag-001",
          "name": "writing",
          "displayName": "写作",
          "color": "#3b82f6"
        }
      }
    ],
    "relatedPrompts": [
      {
        "id": "prompt-124",
        "title": "SEO内容优化器",
        "description": "优化你的内容以提高搜索引擎排名",
        "category": {
          "id": "cat-001",
          "name": "writing",
          "displayName": "写作助手",
          "icon": "fa-pen",
          "color": "#3b82f6"
        },
        "author": {
          "username": "seomaster"
        }
      }
    ]
  }
}
```

### 创建新提示词

创建一个新的提示词。

**请求**

```
POST /api/prompts
```

**请求体**

```json
{
  "title": "高效写作助手",
  "description": "帮助你快速编写高质量文章的AI提示词",
  "content": "你是一位专业写作助手...",
  "usageGuide": "使用方法：1. 提供主题...",
  "categoryId": "cat-001",
  "isPublic": true,
  "language": "zh",
  "tags": ["tag-001", "tag-002"],
  "images": ["image-url-1", "image-url-2"]
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "prompt-123",
    "title": "高效写作助手",
    "description": "帮助你快速编写高质量文章的AI提示词",
    "content": "你是一位专业写作助手...",
    "usageGuide": "使用方法：1. 提供主题...",
    "status": "pending",
    "isPublic": true,
    "createdAt": "2023-07-15T09:30:00Z",
    "updatedAt": "2023-07-15T09:30:00Z",
    "language": "zh",
    "categoryId": "cat-001",
    "tags": ["tag-001", "tag-002"],
    "images": ["image-url-1", "image-url-2"]
  }
}
```

### 更新提示词

更新现有提示词。

**请求**

```
PUT /api/prompts/[id]
```

**路径参数**

| 参数 | 类型     | 描述      |
|------|----------|-----------|
| id   | string   | 提示词ID  |

**请求体**

```json
{
  "title": "高效写作助手 2.0",
  "description": "更新版：帮助你快速编写高质量文章的AI提示词",
  "content": "你是一位高级专业写作助手...",
  "usageGuide": "使用方法：1. 提供主题...",
  "categoryId": "cat-001",
  "isPublic": true,
  "language": "zh",
  "tags": ["tag-001", "tag-002", "tag-003"],
  "images": ["image-url-1", "image-url-3"]
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "prompt-123",
    "title": "高效写作助手 2.0",
    "status": "pending",
    "updatedAt": "2023-07-20T14:45:00Z"
  }
}
```

### 删除提示词

删除一个提示词。

**请求**

```
DELETE /api/prompts/[id]
```

**路径参数**

| 参数 | 类型     | 描述      |
|------|----------|-----------|
| id   | string   | 提示词ID  |

**响应**

```json
{
  "success": true,
  "data": {
    "id": "prompt-123",
    "deleted": true
  }
}
```

### 获取热门提示词

获取热门提示词列表。

**请求**

```
GET /api/prompts/popular
```

**查询参数**

| 参数      | 类型     | 必填  | 描述                     |
|-----------|----------|------|--------------------------|
| limit     | number   | 否    | 返回数量，默认为 5       |
| category  | string   | 否    | 按分类ID筛选             |
| lang      | string   | 否    | 语言筛选：'zh'、'en'     |

**响应**

```json
{
  "success": true,
  "data": [
    {
      "id": "prompt-123",
      "title": "高效写作助手",
      "description": "帮助你快速编写高质量文章的AI提示词",
      "viewCount": 1245,
      "favoriteCount": 382,
      "createdAt": "2023-05-15T08:30:00Z",
      "category": {
        "id": "cat-001",
        "name": "writing",
        "displayName": "写作助手",
        "icon": "fa-pen",
        "color": "#3b82f6"
      },
      "author": {
        "username": "creativewriter",
        "nickname": "创意写手"
      }
    }
  ]
}
```

### 收藏/取消收藏提示词

收藏或取消收藏一个提示词。

**请求**

```
POST /api/prompts/[id]/favorite
```

**路径参数**

| 参数 | 类型     | 描述      |
|------|----------|-----------|
| id   | string   | 提示词ID  |

**请求体**

```json
{
  "action": "add" // 或 "remove"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "prompt-123",
    "favorited": true, // 或 false
    "favoriteCount": 383
  }
}
```

## 错误响应

所有API在发生错误时返回标准格式：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述信息"
  }
}
```

### 常见错误代码

| 错误代码               | HTTP状态码 | 描述                           |
|------------------------|------------|--------------------------------|
| PROMPT_NOT_FOUND       | 404        | 提示词未找到                   |
| UNAUTHORIZED           | 401        | 未授权操作                     |
| FORBIDDEN              | 403        | 无权限执行该操作               |
| VALIDATION_ERROR       | 400        | 请求参数验证失败               |
| SERVER_ERROR           | 500        | 服务器内部错误                 |
| RATE_LIMIT_EXCEEDED    | 429        | 请求频率超限                   |

## 服务函数

`promptService.ts` 中提供了与提示词相关的核心服务函数：

```typescript
// 获取精选提示词
export const getFeaturedPrompts = async (limit = 5) => {
  // ...
};

// 获取最新提示词
export const getLatestPrompts = async (limit = 5) => {
  // ...
};

// 获取提示词详情
export const getPromptById = async (id: string, userId?: string) => {
  // ...
};

// 创建提示词
export const createPrompt = async (data: CreatePromptData, userId: string) => {
  // ...
};

// 更新提示词
export const updatePrompt = async (id: string, data: UpdatePromptData, userId: string) => {
  // ...
};

// 收藏提示词
export const favoritePrompt = async (promptId: string, userId: string) => {
  // ...
};

// 取消收藏
export const unfavoritePrompt = async (promptId: string, userId: string) => {
  // ...
};
``` 