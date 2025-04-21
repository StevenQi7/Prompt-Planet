// 为没有类型定义的模块提供声明
declare module 'bcrypt';

// Prisma PromptTag 类型定义
interface PromptTagType {
  id: string;
  promptId: string;
  tagId: string;
}

// Favorite 类型定义
interface FavoriteType {
  id: string;
  userId: string;
  promptId: string;
  prompt: any;
  createdAt: Date;
} 