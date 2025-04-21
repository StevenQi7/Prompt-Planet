/**
 * 浏览页面所需的接口定义
 */

/**
 * 提示词类型接口
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
  category: {
    id: string;
    name: string;
    displayName: string;
    icon: string;
    color: string;
  };
  author: {
    id: string;
    username: string;
    nickname?: string;
    avatar?: string;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
      displayName: string;
      color: string;
    }
  }>;
}

/**
 * 标签类型接口
 */
export interface Tag {
  id: string;
  name: string;
  displayName?: string;
  display_name?: string; // 添加snake_case版本的属性支持
  color: string;
  count: number;
}

/**
 * 分类类型接口
 */
export interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  count: number;
  slug?: string;
} 