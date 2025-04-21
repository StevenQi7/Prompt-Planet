# 上传 API

本文档描述了 Prompt Planet 文件上传相关的 API 接口。

## 接口概览

| 方法   | 路径                        | 描述                     | 认证要求 |
|--------|----------------------------|--------------------------|---------|
| POST   | /api/upload/image          | 上传图片                 | 是      |
| POST   | /api/upload/avatar         | 上传用户头像             | 是      |
| DELETE | /api/upload/image/[id]     | 删除已上传的图片         | 是      |

## 接口详情

### 上传图片

上传图片文件，用于提示词的图片展示。

**请求**

```
POST /api/upload/image
```

**请求格式**

使用 `multipart/form-data` 格式：

- `file`: 图片文件，支持 JPG、PNG、GIF、WEBP 格式
- `promptId`(可选): 关联的提示词ID
- `type`(可选): 图片类型，如"example"，"thumbnail"等

**响应**

```json
{
  "success": true,
  "data": {
    "id": "img-123",
    "url": "https://example.com/storage/images/prompt-123-image.jpg",
    "filename": "prompt-123-image.jpg",
    "size": 256789,
    "type": "image/jpeg",
    "width": 1200,
    "height": 800,
    "createdAt": "2023-07-15T09:30:00Z",
    "promptId": "prompt-123"
  }
}
```

**错误响应**

当文件类型不支持时：

```json
{
  "success": false,
  "error": {
    "code": "UPLOAD_INVALID_TYPE",
    "message": "不支持的文件类型，仅支持JPG、PNG、GIF、WEBP格式"
  }
}
```

当文件大小超限时：

```json
{
  "success": false,
  "error": {
    "code": "UPLOAD_FILE_TOO_LARGE",
    "message": "文件大小超过限制，最大支持5MB"
  }
}
```

### 上传用户头像

上传用户头像图片。

**请求**

```
POST /api/upload/avatar
```

**请求格式**

使用 `multipart/form-data` 格式：

- `file`: 头像图片文件，支持 JPG、PNG、GIF、WEBP 格式

**响应**

```json
{
  "success": true,
  "data": {
    "id": "avatar-123",
    "url": "https://example.com/storage/avatars/user-123-avatar.jpg",
    "filename": "user-123-avatar.jpg",
    "size": 128456,
    "type": "image/jpeg",
    "width": 400,
    "height": 400,
    "createdAt": "2023-07-15T09:30:00Z"
  }
}
```

**错误响应**

当文件类型不支持时：

```json
{
  "success": false,
  "error": {
    "code": "UPLOAD_INVALID_TYPE",
    "message": "不支持的文件类型，仅支持JPG、PNG、GIF、WEBP格式"
  }
}
```

当文件大小超限时：

```json
{
  "success": false,
  "error": {
    "code": "UPLOAD_FILE_TOO_LARGE",
    "message": "文件大小超过限制，最大支持2MB"
  }
}
```

### 删除已上传的图片

删除用户之前上传的图片。

**请求**

```
DELETE /api/upload/image/[id]
```

**路径参数**

| 参数 | 类型     | 描述    |
|------|----------|---------|
| id   | string   | 图片ID  |

**响应**

```json
{
  "success": true,
  "data": {
    "message": "图片已成功删除"
  }
}
```

**错误响应**

当图片不存在时：

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "图片不存在或已被删除"
  }
}
```

当无权删除时：

```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "您没有权限删除此图片"
  }
}
```

## 上传限制

- 支持的文件类型：JPG、PNG、GIF、WEBP
- 图片最大尺寸：5MB（提示词图片）/ 2MB（头像）
- 图片最大分辨率：2000x2000像素
- 每个提示词最多5张图片
- 上传频率限制：普通用户每小时最多50次上传 