# 用户 API

本文档描述了 Prompt Planet 用户相关的 API 接口。

## 接口概览

| 方法   | 路径                        | 描述                     | 认证要求 |
|--------|----------------------------|--------------------------|---------|
| GET    | /api/users/me              | 获取当前用户信息         | 是      |
| GET    | /api/users/[id]            | 获取用户详情             | 否      |
| PUT    | /api/users/me              | 更新当前用户信息         | 是      |
| PUT    | /api/users/me/password     | 修改密码                 | 是      |
| GET    | /api/users/me/favorites    | 获取当前用户收藏的提示词 | 是      |
| GET    | /api/users/me/prompts      | 获取当前用户创建的提示词 | 是      |
| GET    | /api/users/[id]/prompts    | 获取指定用户的公开提示词 | 否      |

## 接口详情

### 获取当前用户信息

获取当前登录用户的详细信息。

**请求**

```
GET /api/users/me
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "username": "creativeuser",
    "nickname": "创意用户",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "热爱AI创作和分享",
    "createdAt": "2023-03-15T08:30:00Z",
    "updatedAt": "2023-06-20T14:25:00Z",
    "role": "user",
    "promptCount": 15,
    "favoriteCount": 27
  }
}
```

### 获取用户详情

获取指定用户的公开信息。

**请求**

```
GET /api/users/[id]
```

**路径参数**

| 参数 | 类型     | 描述    |
|------|----------|---------|
| id   | string   | 用户ID  |

**响应**

```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "username": "creativeuser",
    "nickname": "创意用户",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "热爱AI创作和分享",
    "createdAt": "2023-03-15T08:30:00Z",
    "promptCount": 15
  }
}
```

### 更新当前用户信息

更新当前登录用户的个人信息。

**请求**

```
PUT /api/users/me
```

**请求体**

```json
{
  "nickname": "AI创意大师",
  "bio": "专注于AI提示词创作与优化",
  "avatar": "avatar-url"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "username": "creativeuser",
    "nickname": "AI创意大师",
    "email": "user@example.com",
    "avatar": "avatar-url",
    "bio": "专注于AI提示词创作与优化",
    "updatedAt": "2023-07-25T10:15:00Z"
  }
}
```

### 修改密码

修改当前登录用户的密码。

**请求**

```
PUT /api/users/me/password
```

**请求体**

```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password",
  "confirmPassword": "new-password"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "message": "密码已成功更新"
  }
}
```

### 获取当前用户收藏的提示词

获取当前登录用户收藏的提示词列表。

**请求**

```
GET /api/users/me/favorites
```

**查询参数**

| 参数   | 类型     | 必填  | 描述                   |
|--------|----------|------|------------------------|
| page   | number   | 否    | 页码，默认为 1         |
| limit  | number   | 否    | 每页条数，默认为 10    |

**响应**

```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "favorite-123",
        "createdAt": "2023-06-10T08:30:00Z",
        "prompt": {
          "id": "prompt-456",
          "title": "高效写作助手",
          "description": "帮助你快速编写高质量文章的AI提示词",
          "category": {
            "id": "cat-001",
            "name": "writing",
            "displayName": "写作助手"
          },
          "author": {
            "id": "user-789",
            "username": "contentcreator",
            "nickname": "内容创作者"
          }
        }
      }
    ],
    "total": 27,
    "totalPages": 3
  }
}
```

### 获取当前用户创建的提示词

获取当前登录用户创建的所有提示词列表，包括草稿和已发布的。

**请求**

```
GET /api/users/me/prompts
```

**查询参数**

| 参数    | 类型     | 必填  | 描述                                      |
|---------|----------|------|-------------------------------------------|
| page    | number   | 否    | 页码，默认为 1                            |
| limit   | number   | 否    | 每页条数，默认为 10                       |
| status  | string   | 否    | 状态筛选：'published'、'draft'、'pending'  |

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
        "status": "published",
        "isPublic": true,
        "createdAt": "2023-05-15T08:30:00Z",
        "updatedAt": "2023-06-20T14:25:00Z",
        "category": {
          "id": "cat-001",
          "name": "writing",
          "displayName": "写作助手"
        },
        "viewCount": 1245,
        "favoriteCount": 382
      }
    ],
    "total": 15,
    "totalPages": 2
  }
}
```

### 获取指定用户的公开提示词

获取指定用户创建的公开提示词列表。

**请求**

```
GET /api/users/[id]/prompts
```

**路径参数**

| 参数 | 类型     | 描述    |
|------|----------|---------|
| id   | string   | 用户ID  |

**查询参数**

| 参数   | 类型     | 必填  | 描述                   |
|--------|----------|------|------------------------|
| page   | number   | 否    | 页码，默认为 1         |
| limit  | number   | 否    | 每页条数，默认为 10    |
| sort   | string   | 否    | 排序方式：'latest'、'popular' |

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
        "category": {
          "id": "cat-001",
          "name": "writing",
          "displayName": "写作助手"
        },
        "viewCount": 1245,
        "favoriteCount": 382
      }
    ],
    "total": 12,
    "totalPages": 2,
    "user": {
      "id": "user-123",
      "username": "creativeuser",
      "nickname": "创意用户",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
``` 