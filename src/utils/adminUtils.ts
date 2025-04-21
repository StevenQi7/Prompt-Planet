/**
 * 管理员功能相关工具函数
 */

import { toast } from 'react-hot-toast';
import { TFunction } from '@/types/i18n';

// 类型定义
export interface Tag {
  tag: {
    id: string;
    name: string;
    displayName?: string;
    color?: string;
  }
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
  icon?: string;
  color?: string;
}

export interface Author {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
}

export interface Review {
  id: string;
  status: string;
  notes: string;
  createdAt: string;
  reviewer: {
    id: string;
    username: string;
    nickname?: string;
  }
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  status: string;
  isPublic: boolean;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
  images: string[];
  author: Author;
  category: Category;
  tags: Tag[];
  reviews?: Review[];
}

export interface AdminStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface FetchPromptsOptions {
  status: string;
  page: number;
  limit: number;
  categoryId?: string;
  timeFilter?: string;
}

/**
 * 获取管理员统计数据
 */
export const fetchAdminStats = async (
  signal?: AbortSignal
): Promise<AdminStats> => {
  try {
    const response = await fetch('/api/admin/stats', { signal });
    
    if (!response.ok) {
      throw new Error('获取统计数据失败');
    }
    
    const data = await response.json();
    
    return {
      pending: data.stats.reviewing || 0,
      approved: data.stats.published || 0,
      rejected: data.stats.rejected || 0,
      total: data.stats.total || 0
    };
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error('获取统计数据失败:', error);
    }
    throw error;
  }
};

/**
 * 获取提示词列表
 */
export const fetchPrompts = async (
  options: FetchPromptsOptions,
  signal?: AbortSignal
): Promise<{ prompts: Prompt[], total: number }> => {
  try {
    let apiUrl = `/api/admin/prompts?status=${options.status}&page=${options.page}&limit=${options.limit}`;
    
    if (options.categoryId) {
      apiUrl += `&categoryId=${options.categoryId}`;
    }
    
    if (options.timeFilter && options.timeFilter !== 'all') {
      apiUrl += `&timeFilter=${options.timeFilter}`;
    }
    
    const response = await fetch(apiUrl, { signal });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '获取提示词失败');
    }
    
    const data = await response.json();
    return {
      prompts: data.prompts || [],
      total: data.total || 0
    };
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error('获取提示词失败:', error);
    }
    throw error;
  }
};

/**
 * 获取所有分类
 */
export const fetchCategories = async (
  signal?: AbortSignal
): Promise<Category[]> => {
  try {
    const response = await fetch('/api/categories', { signal });
    
    if (!response.ok) {
      throw new Error('获取分类失败');
    }
    
    return await response.json();
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error('获取分类失败:', error);
    }
    throw error;
  }
};

/**
 * 审核提示词
 */
export const reviewPrompt = async (
  promptId: string,
  status: 'published' | 'rejected',
  notes: string,
  t: TFunction
): Promise<void> => {
  try {
    // 显示加载提示
    toast.loading(t('admin.processing'));
    
    // 调用审核API
    const response = await fetch(`/api/admin/prompts/${promptId}/review`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status,
        notes
      })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || '审核失败');
    }
    
    // 清除加载提示
    toast.dismiss();
    
    // 显示成功提示
    if (status === 'published') {
      toast.success(t('admin.approveSuccess'));
    } else {
      toast.success(t('admin.rejectSuccess'));
    }
  } catch (error) {
    // 清除加载提示
    toast.dismiss();
    
    // 显示错误提示
    if (status === 'published') {
      toast.error(t('admin.approveError'));
    } else {
      toast.error(t('admin.rejectError'));
    }
    
    throw error;
  }
}; 