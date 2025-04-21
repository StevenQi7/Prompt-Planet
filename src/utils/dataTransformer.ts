/**
 * 数据转换器，用于处理从Supabase获取的数据字段映射
 */

/**
 * 处理分类对象，将display_name转换为displayName
 */
export function transformCategory(category: any) {
  if (!category) return null;
  
  return {
    id: category.id,
    name: category.name,
    displayName: category.display_name || category.displayName,
    slug: category.slug,
    icon: category.icon,
    color: category.color,
    count: category.count || 0
  };
}

/**
 * 处理标签对象，将display_name转换为displayName
 */
export function transformTag(tag: any) {
  if (!tag) return null;
  
  return {
    id: tag.id,
    name: tag.name,
    displayName: tag.display_name || tag.displayName,
    slug: tag.slug,
    color: tag.color
  };
}

/**
 * 处理提示词对象，递归处理分类和标签
 */
export function transformPrompt(prompt: any) {
  if (!prompt) return null;
  
  // 处理图片
  const images = prompt.images ? 
    (typeof prompt.images === 'string' ? JSON.parse(prompt.images) : prompt.images) 
    : [];
  
  // 转换分类
  const category = prompt.category ? transformCategory(prompt.category) : null;
  
  // 转换标签
  let tags = [];
  if (prompt.tags) {
    if (Array.isArray(prompt.tags)) {
      tags = prompt.tags.map((tagItem: any) => {
        // 处理不同格式的标签
        if (tagItem.tag) {
          return { tag: transformTag(tagItem.tag) };
        } else {
          return { tag: transformTag(tagItem) };
        }
      });
    }
  }
  
  // 确保数值类型字段是数字类型
  const view_count = typeof prompt.view_count === 'number' ? prompt.view_count : Number(prompt.view_count || 0);
  const favorite_count = typeof prompt.favorite_count === 'number' ? prompt.favorite_count : Number(prompt.favorite_count || 0);
  
  // 返回转换后的提示词
  return {
    ...prompt,
    images,
    category,
    tags,
    // 确保数值类型字段被正确处理，只保留下划线命名风格
    view_count: view_count,
    favorite_count: favorite_count,
    // 确保布尔类型字段被正确处理
    is_public: prompt.is_public || false,
    // 格式化日期字段
    created_at: prompt.created_at || new Date().toISOString(),
    updated_at: prompt.updated_at || new Date().toISOString(),
    // 处理作者信息
    author: prompt.author || {
      id: prompt.author_id,
      username: '',
      nickname: '',
      avatar: ''
    }
  };
}

/**
 * 处理提示词列表
 */
export function transformPromptList(prompts: any[]) {
  if (!prompts || !Array.isArray(prompts)) return [];
  return prompts.map(transformPrompt);
}

/**
 * 处理API响应中的提示词数据
 */
export function transformPromptResponse(response: any) {
  if (!response) return null;
  
  if (Array.isArray(response)) {
    return transformPromptList(response);
  }
  
  if (response.prompts) {
    return {
      ...response,
      prompts: transformPromptList(response.prompts)
    };
  }
  
  return transformPrompt(response);
} 