# 服务函数

本文档描述了 Prompt Planet 项目中的主要服务函数，这些函数用于在服务器端处理各种业务逻辑。

## 提示词服务 (promptService)

提示词服务提供与提示词相关的各种功能。

### 主要函数

| 函数名                   | 描述                                 | 文件路径                          |
|--------------------------|--------------------------------------|-----------------------------------|
| `createPrompt`           | 创建新的提示词                       | src/services/promptService.ts    |
| `getPromptById`          | 根据ID获取提示词详情                 | src/services/promptService.ts    |
| `updatePrompt`           | 更新提示词信息                       | src/services/promptService.ts    |
| `deletePrompt`           | 删除提示词                           | src/services/promptService.ts    |
| `getPrompts`             | 获取提示词列表，支持分页和筛选       | src/services/promptService.ts    |
| `searchPrompts`          | 搜索提示词                           | src/services/promptService.ts    |
| `getPopularPrompts`      | 获取热门提示词                       | src/services/promptService.ts    |
| `getLatestPrompts`       | 获取最新提示词                       | src/services/promptService.ts    |
| `getUserPrompts`         | 获取用户创建的提示词                 | src/services/promptService.ts    |
| `getUserFavorites`       | 获取用户收藏的提示词                 | src/services/promptService.ts    |
| `toggleFavorite`         | 收藏/取消收藏提示词                  | src/services/promptService.ts    |
| `incrementViewCount`     | 增加提示词的查看次数                 | src/services/promptService.ts    |
| `getPromptsByCategory`   | 获取特定分类下的提示词               | src/services/promptService.ts    |
| `getPromptsByTag`        | 获取具有特定标签的提示词             | src/services/promptService.ts    |
| `getRelatedPrompts`      | 获取与特定提示词相关的其他提示词     | src/services/promptService.ts    |

### 示例用法

```typescript
// 创建新提示词
import { createPrompt } from '@/services/promptService';

const newPrompt = await createPrompt({
  title: '高效写作助手',
  content: '你是一位专业写作助手...',
  description: '帮助你快速编写高质量文章的AI提示词',
  categoryId: 'cat-001',
  userId: 'user-123',
  isPublic: true,
  tags: ['tag-001', 'tag-002']
});

// 搜索提示词
import { searchPrompts } from '@/services/promptService';

const searchResults = await searchPrompts({
  query: '写作',
  page: 1,
  limit: 10,
  sort: 'relevance'
});
```

## 用户服务 (userService)

用户服务提供与用户账户相关的各种功能。

### 主要函数

| 函数名                   | 描述                                 | 文件路径                          |
|--------------------------|--------------------------------------|-----------------------------------|
| `getUserById`            | 根据ID获取用户信息                   | src/services/userService.ts      |
| `getUserByUsername`      | 根据用户名获取用户信息               | src/services/userService.ts      |
| `updateUserProfile`      | 更新用户个人资料                     | src/services/userService.ts      |
| `updateUserPassword`     | 更新用户密码                         | src/services/userService.ts      |
| `getUserStats`           | 获取用户统计信息                     | src/services/userService.ts      |
| `deleteUserAccount`      | 删除用户账户                         | src/services/userService.ts      |
| `getPublicUserProfile`   | 获取用户的公开个人资料               | src/services/userService.ts      |

### 示例用法

```typescript
// 更新用户个人资料
import { updateUserProfile } from '@/services/userService';

const updatedUser = await updateUserProfile('user-123', {
  nickname: 'AI创意大师',
  bio: '专注于AI提示词创作与优化',
  avatar: 'avatar-url'
});

// 获取用户公开个人资料
import { getPublicUserProfile } from '@/services/userService';

const publicProfile = await getPublicUserProfile('user-123');
```

## 认证服务 (authService)

认证服务提供与用户认证相关的各种功能。

### 主要函数

| 函数名                   | 描述                                 | 文件路径                          |
|--------------------------|--------------------------------------|-----------------------------------|
| `registerUser`           | 注册新用户                           | src/services/authService.ts      |
| `loginUser`              | 用户登录                             | src/services/authService.ts      |
| `logoutUser`             | 用户登出                             | src/services/authService.ts      |
| `refreshToken`           | 刷新访问令牌                         | src/services/authService.ts      |
| `resetPassword`          | 重置用户密码                         | src/services/authService.ts      |
| `verifyEmail`            | 验证用户电子邮箱                     | src/services/authService.ts      |
| `getCurrentUser`         | 获取当前登录用户                     | src/services/authService.ts      |
| `isAuthenticated`        | 检查用户是否已认证                   | src/services/authService.ts      |

### 示例用法

```typescript
// 用户注册
import { registerUser } from '@/services/authService';

const newUser = await registerUser({
  username: 'newuser',
  email: 'user@example.com',
  password: 'securepassword',
  nickname: '新用户'
});

// 用户登录
import { loginUser } from '@/services/authService';

const authResult = await loginUser({
  email: 'user@example.com',
  password: 'securepassword'
});
```

## 分类服务 (categoryService)

分类服务提供与提示词分类相关的各种功能。

### 主要函数

| 函数名                   | 描述                                 | 文件路径                          |
|--------------------------|--------------------------------------|-----------------------------------|
| `getAllCategories`       | 获取所有分类                         | src/services/categoryService.ts  |
| `getCategoryById`        | 根据ID获取分类详情                   | src/services/categoryService.ts  |
| `createCategory`         | 创建新分类                           | src/services/categoryService.ts  |
| `updateCategory`         | 更新分类信息                         | src/services/categoryService.ts  |
| `deleteCategory`         | 删除分类                             | src/services/categoryService.ts  |
| `getCategoryStats`       | 获取分类统计信息                     | src/services/categoryService.ts  |

### 示例用法

```typescript
// 获取所有分类
import { getAllCategories } from '@/services/categoryService';

const categories = await getAllCategories();

// 创建新分类
import { createCategory } from '@/services/categoryService';

const newCategory = await createCategory({
  name: 'education',
  displayName: '教育助手',
  description: '适用于教育和学习场景的提示词',
  icon: 'fa-graduation-cap',
  color: '#8b5cf6'
});
```

## 标签服务 (tagService)

标签服务提供与提示词标签相关的各种功能。

### 主要函数

| 函数名                   | 描述                                 | 文件路径                          |
|--------------------------|--------------------------------------|-----------------------------------|
| `getAllTags`             | 获取所有标签                         | src/services/tagService.ts       |
| `getTagById`             | 根据ID获取标签详情                   | src/services/tagService.ts       |
| `createTag`              | 创建新标签                           | src/services/tagService.ts       |
| `updateTag`              | 更新标签信息                         | src/services/tagService.ts       |
| `deleteTag`              | 删除标签                             | src/services/tagService.ts       |
| `searchTags`             | 搜索标签                             | src/services/tagService.ts       |
| `getPopularTags`         | 获取热门标签                         | src/services/tagService.ts       |
| `getTagsByCategory`      | 获取特定分类下的标签                 | src/services/tagService.ts       |

### 示例用法

```typescript
// 搜索标签
import { searchTags } from '@/services/tagService';

const tags = await searchTags('内容');

// 获取热门标签
import { getPopularTags } from '@/services/tagService';

const popularTags = await getPopularTags({ limit: 10 });
```

## 上传服务 (uploadService)

上传服务提供与文件上传相关的各种功能。

### 主要函数

| 函数名                   | 描述                                 | 文件路径                          |
|--------------------------|--------------------------------------|-----------------------------------|
| `uploadImage`            | 上传图片                             | src/services/uploadService.ts    |
| `uploadAvatar`           | 上传用户头像                         | src/services/uploadService.ts    |
| `deleteImage`            | 删除已上传的图片                     | src/services/uploadService.ts    |
| `getImageById`           | 根据ID获取图片信息                   | src/services/uploadService.ts    |
| `processImage`           | 处理图片（调整大小、压缩等）         | src/services/uploadService.ts    |

### 示例用法

```typescript
// 上传图片
import { uploadImage } from '@/services/uploadService';

const image = await uploadImage({
  file, // 文件对象
  promptId: 'prompt-123'
});

// 删除图片
import { deleteImage } from '@/services/uploadService';

await deleteImage('img-123', 'user-456');
```

## 注意事项

- 所有服务函数都使用 TypeScript 编写，提供良好的类型支持
- 服务函数通常是异步的，返回 Promise
- 错误处理通常使用抛出异常的方式，调用函数时应使用 try/catch 捕获异常
- 许多服务函数需要用户认证，应确保在调用前用户已登录
- 部分服务函数仅限管理员使用 