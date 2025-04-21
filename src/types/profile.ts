import { Category, Tag } from './browse';

/**
 * 提示词接口定义
 */
export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  usageGuide?: string;
  status: string;
  viewCount: number;
  favoriteCount: number;
  images: string[];
  createdAt: string;
  category: Category;
  tags: Tag[];
  isPublic: boolean;
  reviews?: {
    id: string;
    status: string;
    notes: string;
    createdAt: string;
    reviewer: {
      id: string;
      username: string;
      nickname?: string;
    }
  }[];
}

/**
 * 提示词统计接口定义
 */
export interface PromptCounts {
  prompts: number;
  publishedPrompts: number;
  reviewingPrompts: number;
  rejectedPrompts: number;
  privatePrompts: number;
  favorites: number;
} 