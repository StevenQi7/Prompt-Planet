/**
 * 提示词相关的工具函数
 */

// 类型定义
export interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
}

export interface Author {
  id: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    preferred_username?: string;
  };
}

export interface Tag {
  id: string;
  name: string;
  displayName?: string;
  color?: string;
  slug?: string;
}

export interface PromptTag {
  id: string;
  promptId: string;
  tagId: string;
  tag: Tag;
}

export interface RelatedPrompt {
  id: string;
  title: string;
  category: Category;
  viewCount: number;
  description: string;
}

/**
 * 处理图片数据
 * @param images 图片原始数据
 * @returns 处理后的图片数组
 */
export const processImages = (images: any): string[] => {
  if (!images) return [];

  // 处理数组
  if (Array.isArray(images)) {
    return images.filter((img): img is string => typeof img === 'string' && !!img);
  }

  // 处理对象
  if (typeof images === 'object') {
    return Object.values(images)
      .filter((img): img is string => typeof img === 'string' && !!img);
  }

  // 处理字符串
  if (typeof images === 'string') {
    try {
      // 尝试解析JSON
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.filter((img): img is string => typeof img === 'string' && !!img);
      }
      return Object.values(parsed)
        .filter((img): img is string => typeof img === 'string' && !!img);
    } catch (e) {
      // 如果不是JSON，可能是单个URL
      return [images];
    }
  }

  return [];
};

/**
 * 处理作者数据
 * @param author 作者原始数据
 * @returns 处理后的作者对象
 */
export const processAuthorData = (author: any): Author => {
  if (!author) return { id: '' };

  return {
    id: author.id || '',
    username: author.username || author.name || '',
    nickname: author.nickname || author.display_name || author.name || '',
    avatar: author.avatar || author.avatar_url || '',
    email: author.email || '',
    user_metadata: author.user_metadata || {}
  };
}; 