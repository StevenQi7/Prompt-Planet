# 认证 API

本文档描述了 Prompt Planet 认证相关的 API 接口。

## 接口概览

| 方法   | 路径                        | 描述                     | 认证要求 |
|--------|----------------------------|--------------------------|---------|
| POST   | /api/auth/register         | 用户注册                 | 否      |
| POST   | /api/auth/login            | 用户登录                 | 否      |
| POST   | /api/auth/logout           | 用户登出                 | 是      |
| GET    | /api/auth/session          | 获取当前会话信息         | 否      |
| POST   | /api/auth/reset-password   | 请求密码重置             | 否      |
| POST   | /api/auth/verify-email     | 验证电子邮箱             | 否      |
| POST   | /api/auth/refresh-token    | 刷新访问令牌             | 是      |

## 接口详情

### 用户注册

创建一个新用户账户。

**请求**

```
POST /api/auth/register
```

**请求体**

```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "nickname": "新用户"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "username": "newuser",
      "nickname": "新用户",
      "email": "user@example.com",
      "createdAt": "2023-07-15T09:30:00Z"
    },
    "message": "注册成功，请查收验证邮件"
  }
}
```

**错误响应**

当用户名或邮箱已存在时：

```json
{
  "success": false,
  "error": {
    "code": "AUTH_DUPLICATE_USER",
    "message": "用户名或邮箱已被使用"
  }
}
```

### 用户登录

使用用户名/邮箱和密码登录。

**请求**

```
POST /api/auth/login
```

**请求体**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "username": "creativeuser",
      "nickname": "创意用户",
      "email": "user@example.com",
      "role": "user",
      "avatar": "https://example.com/avatar.jpg"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应**

当认证失败时：

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "邮箱或密码错误"
  }
}
```

### 用户登出

登出当前用户并失效相关令牌。

**请求**

```
POST /api/auth/logout
```

**响应**

```json
{
  "success": true,
  "data": {
    "message": "已成功登出"
  }
}
```

### 获取当前会话信息

获取当前用户的会话信息。

**请求**

```
GET /api/auth/session
```

**响应**

如果已登录：

```json
{
  "success": true,
  "data": {
    "authenticated": true,
    "user": {
      "id": "user-123",
      "username": "creativeuser",
      "nickname": "创意用户",
      "email": "user@example.com",
      "role": "user",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

如果未登录：

```json
{
  "success": true,
  "data": {
    "authenticated": false
  }
}
```

### 请求密码重置

发送密码重置邮件。

**请求**

```
POST /api/auth/reset-password
```

**请求体**

```json
{
  "email": "user@example.com"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "message": "如果该邮箱存在，我们将发送密码重置邮件"
  }
}
```

### 验证电子邮箱

验证用户的电子邮箱。

**请求**

```
POST /api/auth/verify-email
```

**请求体**

```json
{
  "token": "verification-token"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "message": "邮箱验证成功"
  }
}
```

**错误响应**

当验证令牌无效时：

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_TOKEN",
    "message": "验证令牌无效或已过期"
  }
}
```

### 刷新访问令牌

使用刷新令牌获取新的访问令牌。

**请求**

```
POST /api/auth/refresh-token
```

**请求体**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应**

当刷新令牌无效时：

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_REFRESH_TOKEN",
    "message": "刷新令牌无效或已过期"
  }
}
``` 