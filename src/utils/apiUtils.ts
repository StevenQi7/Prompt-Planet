/**
 * API请求相关工具函数
 */

/**
 * 标准API响应格式
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 标准化API响应处理
 * @param response API响应
 * @returns 格式化后的API响应
 */
export const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    console.log(`API响应状态: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error(`服务器错误: ${response.status} ${response.statusText}`);
      try {
        // 尝试解析错误响应中的内容
        const errorData = await response.text();
        console.error('错误响应内容:', errorData);
      } catch (e) {
        console.error('无法解析错误响应内容');
      }
      
      return {
        success: false,
        error: `服务器错误: ${response.status} ${response.statusText}`,
      };
    }

    const contentType = response.headers.get('content-type');
    console.log('响应内容类型:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('响应不是JSON格式');
      const textData = await response.text();
      console.log('非JSON响应内容:', textData);
      throw new Error('响应不是JSON格式');
    }
    
    const data = await response.json();
    console.log('API响应数据:', data);
    
    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    console.error('处理API响应时出错:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
};

/**
 * 创建带错误处理的获取数据函数
 * @param url API地址
 * @param options 请求选项
 * @returns 格式化后的API响应
 */
export const fetchData = async <T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> => {
  try {
    console.log(`请求: ${options?.method || 'GET'} ${url}`);
    console.log('请求选项:', { ...options, headers: options?.headers });
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    
    return handleApiResponse<T>(response);
  } catch (error) {
    console.error('网络请求失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '网络请求失败',
    };
  }
};

/**
 * GET请求
 */
export const fetchGet = <T>(url: string, options?: RequestInit) => 
  fetchData<T>(url, { ...options, method: 'GET' });

/**
 * POST请求
 */
export const fetchPost = <T>(url: string, data: any, options?: RequestInit) => 
  fetchData<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * PUT请求
 */
export const fetchPut = <T>(url: string, data: any, options?: RequestInit) => 
  fetchData<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });

/**
 * DELETE请求
 */
export const fetchDelete = <T>(url: string, options?: RequestInit) => 
  fetchData<T>(url, { ...options, method: 'DELETE' });

/**
 * API相关的工具函数
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
 * 获取所有分类的函数
 * @param errorMessage 错误提示消息
 * @returns 分类列表数据
 */
export const fetchCategories = async (errorMessage?: string) => {
  try {
    const response = await fetch('/api/categories');
    const data = await response.json();
    return data;
  } catch (err) {
    if (errorMessage) {
      toast.error(errorMessage);
    }
    return [];
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