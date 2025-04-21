/**
 * 收藏相关的API工具函数
 */

import { toast } from 'react-hot-toast';

/**
 * 获取收藏列表的函数
 * @param page 页码
 * @param pageSize 每页显示数量
 * @param sortOrder 排序方式
 * @param category 分类过滤
 * @param viewMode 视图模式
 * @param errorMessage 错误提示消息
 * @returns 收藏列表数据
 */
export const fetchFavorites = async (
  page: number,
  pageSize: number,
  sortOrder: string,
  category: string,
  viewMode?: string,
  errorMessage?: string
) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    params.append('sort', sortOrder);
    
    if (category && category !== 'all') {
      params.append('category_id', category);
    }
    
    if (viewMode) {
      params.append('view', viewMode);
    }
    
    const response = await fetch(`/api/user/favorites?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }
    
    return await response.json();
  } catch (err) {
    if (errorMessage) {
      toast.error(errorMessage);
    }
    return { prompts: [], total: 0 };
  }
};

/**
 * 取消收藏提示词
 * @param promptId 提示词ID
 * @param onSuccess 成功回调函数
 * @param messages 国际化消息 { removing, success, error }
 * @returns 是否取消成功
 */
export const unfavoritePrompt = async (
  promptId: string,
  onSuccess?: () => void,
  messages?: { removing: string; success: string; error: string }
) => {
  try {
    // 使用 toast 显示正在处理的消息
    const toastId = messages?.removing 
      ? toast.loading(messages.removing)
      : null;
    
    const response = await fetch(`/api/user/favorites/${promptId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove favorite');
    }
    
    // 更新 toast 消息为成功
    if (toastId && messages?.success) {
      toast.success(messages.success, { id: toastId });
    }
    
    // 执行成功回调
    if (onSuccess) {
      onSuccess();
    }
    
    return true;
  } catch (err) {
    if (messages?.error) {
      toast.error(messages.error);
    }
    return false;
  }
}; 