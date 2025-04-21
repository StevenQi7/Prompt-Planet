# 分类 API

本文档描述了 Prompt Planet 分类相关的 API 接口。

## 接口概览

| 方法   | 路径                        | 描述                     | 认证要求 |
|--------|----------------------------|--------------------------|---------|
| GET    | /api/categories            | 获取所有分类列表         | 否      |
| GET    | /api/categories/[id]       | 获取分类详情             | 否      |
| GET    | /api/categories/[id]/prompts | 获取分类下的提示词     | 否      |
| POST   | /api/categories            | 创建新分类               | 是(管理员) |
| PUT    | /api/categories/[id]       | 更新分类                 | 是(管理员) |
| DELETE | /api/categories/[id]       | 删除分类                 | 是(管理员) |

## 接口详情

### 获取所有分类列表

获取所有可用的分类列表。

**请求**

```
GET /api/categories
```

**查询参数**

| 参数     | 类型     | 必填  | 描述                   |
|----------|----------|------|------------------------|
| lang     | string   | 否    | 语言筛选：'zh'、'en'    |

**响应**

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat-001",
        "name": "writing",
        "displayName": "写作助手",
        "description": "提高写作效率和质量的提示词",
        "icon": "fa-pen",
        "color": "#3b82f6",
        "promptCount": 189,
        "sortOrder": 1
      },
      {
        "id": "cat-002",
        "name": "coding",
        "displayName": "编程助手",
        "description": "帮助编写和优化代码的提示词",
        "icon": "fa-code",
        "color": "#10b981",
        "promptCount": 142,
        "sortOrder": 2
      }
    ]
  }
}
```

### 获取分类详情

获取单个分类的详细信息。

**请求**

```
GET /api/categories/[id]
```

**路径参数**

| 参数 | 类型     | 描述    |
|------|----------|---------|
| id   | string   | 分类ID  |

**响应**

```json
{
  "success": true,
  "data": {
    "id": "cat-001",
    "name": "writing",
    "displayName": "写作助手",
    "description": "提高写作效率和质量的提示词",
    "icon": "fa-pen",
    "color": "#3b82f6",
    "promptCount": 189,
    "createdAt": "2023-01-15T08:30:00Z",
    "updatedAt": "2023-06-20T14:25:00Z",
    "popularTags": [
      {
        "id": "tag-001",
        "name": "content",
        "displayName": "内容创作",
        "promptCount": 78
      },
      {
        "id": "tag-002",
        "name": "seo",
        "displayName": "SEO优化",
        "promptCount": 45
      }
    ]
  }
}
```

### 获取分类下的提示词

获取指定分类下的提示词列表。

**请求**

```
GET /api/categories/[id]/prompts
```

**路径参数**

| 参数 | 类型     | 描述    |
|------|----------|---------|
| id   | string   | 分类ID  |

**查询参数**

| 参数   | 类型     | 必填  | 描述                                      |
|--------|----------|------|-------------------------------------------|
| page   | number   | 否    | 页码，默认为 1                            |
| limit  | number   | 否    | 每页条数，默认为 10                       |
| sort   | string   | 否    | 排序方式：'latest'、'popular'、'relevance' |
| tag    | string   | 否    | 按标签ID筛选                              |

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
        "tags": [
          {
            "tag": {
              "id": "tag-001",
              "name": "content",
              "displayName": "内容创作"
            }
          }
        ]
      }
    ],
    "total": 189,
    "totalPages": 19,
    "category": {
      "id": "cat-001",
      "name": "writing",
      "displayName": "写作助手",
      "description": "提高写作效率和质量的提示词"
    }
  }
}
```

### 创建新分类 (管理员)

创建一个新的提示词分类。

**请求**

```
POST /api/categories
```

**请求体**

```json
{
  "name": "education",
  "displayName": "教育助手",
  "description": "适用于教育和学习场景的提示词",
  "icon": "fa-graduation-cap",
  "color": "#8b5cf6",
  "sortOrder": 3
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "cat-003",
    "name": "education",
    "displayName": "教育助手",
    "description": "适用于教育和学习场景的提示词",
    "icon": "fa-graduation-cap",
    "color": "#8b5cf6",
    "promptCount": 0,
    "sortOrder": 3,
    "createdAt": "2023-07-15T09:30:00Z",
    "updatedAt": "2023-07-15T09:30:00Z"
  }
}
```

### 更新分类 (管理员)

更新现有分类的信息。

**请求**

```
PUT /api/categories/[id]
```

**路径参数**

| 参数 | 类型     | 描述    |
|------|----------|---------|
| id   | string   | 分类ID  |

**请求体**

```json
{
  "displayName": "教育与学习助手",
  "description": "适用于各类教育、学习和知识获取场景的提示词",
  "icon": "fa-graduation-cap",
  "color": "#8b5cf6",
  "sortOrder": 3
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "cat-003",
    "name": "education",
    "displayName": "教育与学习助手",
    "description": "适用于各类教育、学习和知识获取场景的提示词",
    "icon": "fa-graduation-cap",
    "color": "#8b5cf6",
    "sortOrder": 3,
    "updatedAt": "2023-07-20T11:45:00Z"
  }
}
```

### 删除分类 (管理员)

删除一个分类。注意：只有当分类下没有提示词时才能删除。

**请求**

```
DELETE /api/categories/[id]
```

**路径参数**

| 参数 | 类型     | 描述    |
|------|----------|---------|
| id   | string   | 分类ID  |

**响应**

```json
{
  "success": true,
  "data": {
    "message": "分类已成功删除"
  }
}
```

**错误响应**

当分类下仍有提示词时：

```json
{
  "success": false,
  "error": {
    "code": "CATEGORY_NOT_EMPTY",
    "message": "无法删除非空分类，请先移除或重新分类该分类下的所有提示词"
  }
}
``` 