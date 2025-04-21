# 标签 API

本文档描述了 Prompt Planet 标签相关的 API 接口。

## 接口概览

| 方法   | 路径                        | 描述                     | 认证要求 |
|--------|----------------------------|--------------------------|---------|
| GET    | /api/tags                  | 获取标签列表             | 否      |
| GET    | /api/tags/popular          | 获取热门标签             | 否      |
| GET    | /api/tags/[id]             | 获取标签详情             | 否      |
| GET    | /api/tags/[id]/prompts     | 获取标签下的提示词       | 否      |
| POST   | /api/tags                  | 创建新标签               | 是(管理员) |
| PUT    | /api/tags/[id]             | 更新标签                 | 是(管理员) |
| DELETE | /api/tags/[id]             | 删除标签                 | 是(管理员) |
| GET    | /api/tags/search           | 搜索标签                 | 否      |

## 接口详情

### 获取标签列表

获取分页的标签列表。

**请求**

```
GET /api/tags
```

**查询参数**

| 参数     | 类型     | 必填  | 描述                                      |
|----------|----------|------|-------------------------------------------|
| page     | number   | 否    | 页码，默认为 1                            |
| limit    | number   | 否    | 每页条数，默认为 20                       |
| sort     | string   | 否    | 排序方式：'name'、'popularity'、'recent'   |
| lang     | string   | 否    | 语言筛选：'zh'、'en'                      |

**响应**

```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "tag-001",
        "name": "content",
        "displayName": "内容创作",
        "description": "用于内容创作和生成的提示词",
        "color": "#3b82f6",
        "promptCount": 78,
        "createdAt": "2023-01-20T11:30:00Z"
      },
      {
        "id": "tag-002",
        "name": "seo",
        "displayName": "SEO优化",
        "description": "用于搜索引擎优化的提示词",
        "color": "#10b981",
        "promptCount": 45,
        "createdAt": "2023-01-25T14:15:00Z"
      }
    ],
    "total": 87,
    "totalPages": 5
  }
}
```

### 获取热门标签

获取使用频率最高的标签列表。

**请求**

```
GET /api/tags/popular
```

**查询参数**

| 参数     | 类型     | 必填  | 描述                   |
|----------|----------|------|------------------------|
| limit    | number   | 否    | 返回数量，默认为 20    |
| category | string   | 否    | 按分类ID筛选           |
| lang     | string   | 否    | 语言筛选：'zh'、'en'    |

**响应**

```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "tag-001",
        "name": "content",
        "displayName": "内容创作",
        "color": "#3b82f6",
        "promptCount": 78
      },
      {
        "id": "tag-002",
        "name": "seo",
        "displayName": "SEO优化",
        "color": "#10b981",
        "promptCount": 45
      }
    ]
  }
}
```

### 获取标签详情

获取单个标签的详细信息。

**请求**

```
GET /api/tags/[id]
```

**路径参数**

| 参数 | 类型     | 描述    |
|------|----------|---------|
| id   | string   | 标签ID  |

**响应**

```json
{
  "success": true,
  "data": {
    "id": "tag-001",
    "name": "content",
    "displayName": "内容创作",
    "description": "用于内容创作和生成的提示词",
    "color": "#3b82f6",
    "promptCount": 78,
    "createdAt": "2023-01-20T11:30:00Z",
    "updatedAt": "2023-06-15T09:45:00Z",
    "relatedTags": [
      {
        "id": "tag-005",
        "name": "article",
        "displayName": "文章",
        "promptCount": 42
      },
      {
        "id": "tag-007",
        "name": "blog",
        "displayName": "博客",
        "promptCount": 36
      }
    ]
  }
}
```

### 获取标签下的提示词

获取带有指定标签的提示词列表。

**请求**

```
GET /api/tags/[id]/prompts
```

**路径参数**

| 参数 | 类型     | 描述    |
|------|----------|---------|
| id   | string   | 标签ID  |

**查询参数**

| 参数       | 类型     | 必填  | 描述                                      |
|------------|----------|------|-------------------------------------------|
| page       | number   | 否    | 页码，默认为 1                            |
| limit      | number   | 否    | 每页条数，默认为 10                       |
| sort       | string   | 否    | 排序方式：'latest'、'popular'、'relevance' |
| category   | string   | 否    | 按分类ID筛选                              |

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
        "createdAt": "2023-05-15T08:30:00Z",
        "viewCount": 1245,
        "favoriteCount": 382,
        "author": {
          "id": "user-456",
          "username": "creativewriter",
          "nickname": "创意写手"
        },
        "category": {
          "id": "cat-001",
          "name": "writing",
          "displayName": "写作助手"
        }
      }
    ],
    "total": 78,
    "totalPages": 8,
    "tag": {
      "id": "tag-001",
      "name": "content",
      "displayName": "内容创作",
      "description": "用于内容创作和生成的提示词"
    }
  }
}
```

### 创建新标签 (管理员)

创建一个新的标签。

**请求**

```
POST /api/tags
```

**请求体**

```json
{
  "name": "summarization",
  "displayName": "内容摘要",
  "description": "用于总结和提取要点的提示词",
  "color": "#f59e0b"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "tag-025",
    "name": "summarization",
    "displayName": "内容摘要",
    "description": "用于总结和提取要点的提示词",
    "color": "#f59e0b",
    "promptCount": 0,
    "createdAt": "2023-07-15T09:30:00Z",
    "updatedAt": "2023-07-15T09:30:00Z"
  }
}
```

### 更新标签 (管理员)

更新现有标签的信息。

**请求**

```
PUT /api/tags/[id]
```

**路径参数**

| 参数 | 类型     | 描述    |
|------|----------|---------|
| id   | string   | 标签ID  |

**请求体**

```json
{
  "displayName": "内容摘要与提炼",
  "description": "用于总结、提炼和归纳内容要点的提示词",
  "color": "#f59e0b"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "tag-025",
    "name": "summarization",
    "displayName": "内容摘要与提炼",
    "description": "用于总结、提炼和归纳内容要点的提示词",
    "color": "#f59e0b",
    "updatedAt": "2023-07-20T11:45:00Z"
  }
}
```

### 删除标签 (管理员)

删除一个标签。

**请求**

```
DELETE /api/tags/[id]
```

**路径参数**

| 参数 | 类型     | 描述    |
|------|----------|---------|
| id   | string   | 标签ID  |

**响应**

```json
{
  "success": true,
  "data": {
    "message": "标签已成功删除"
  }
}
```

### 搜索标签

根据关键词搜索标签。

**请求**

```
GET /api/tags/search
```

**查询参数**

| 参数  | 类型     | 必填  | 描述                   |
|-------|----------|------|------------------------|
| q     | string   | 是    | 搜索关键词             |
| limit | number   | 否    | 返回数量，默认为 10    |
| lang  | string   | 否    | 语言筛选：'zh'、'en'    |

**响应**

```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "tag-001",
        "name": "content",
        "displayName": "内容创作",
        "color": "#3b82f6",
        "promptCount": 78
      },
      {
        "id": "tag-025",
        "name": "summarization",
        "displayName": "内容摘要与提炼",
        "color": "#f59e0b",
        "promptCount": 12
      }
    ]
  }
}
``` 