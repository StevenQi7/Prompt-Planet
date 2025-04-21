/**
 * 显示相关的工具函数，处理UI显示的逻辑
 */

export type Tag = {
  id: string;
  name: string;
  displayName?: string;
  display_name?: string;
  count?: number;
};

export type Category = {
  id: string;
  name: string;
  displayName?: string;
  display_name?: string;
  count?: number;
  color?: string;
  icon?: string;
};

/**
 * 获取标签的国际化显示名称
 * @param tag 标签对象
 * @param language 当前语言
 * @returns 标签的显示名称
 */
export const getTagDisplayName = (tag: Tag | string, language: string): string => {
  // 处理字符串情况
  if (typeof tag === 'string') {
    return tag;
  }

  // 处理对象情况
  if (language === 'zh') {
    return tag.displayName || tag.display_name || tag.name;
  }
  return tag.name;
};

/**
 * 获取分类的国际化显示名称
 * 支持多种类型的分类对象
 * @param category 分类对象或名称
 * @param categoryName 可选的分类名称（用于国际化）
 * @param language 当前语言
 * @returns 分类的显示名称
 */
export const getCategoryDisplayName = (category: Category | string, categoryName?: string, language: string = 'en'): string => {
  // 处理字符串情况
  if (typeof category === 'string') {
    return language === 'zh' ? category : (categoryName || category);
  }

  // 处理对象情况
  if (language === 'zh') {
    return category.displayName || category.display_name || category.name;
  }
  return category.name;
};

/**
 * 获取分类颜色对应的CSS类名
 * @param color 颜色标识
 * @returns 背景色和文本色的CSS类名
 */
export const getCategoryColorClasses = (color: string): { bg: string; text: string } => {
  const colorMap: Record<string, {bg: string, text: string}> = {
    'blue': {bg: 'bg-blue-100', text: 'text-blue-800'},
    'green': {bg: 'bg-green-100', text: 'text-green-800'},
    'purple': {bg: 'bg-purple-100', text: 'text-purple-800'},
    'red': {bg: 'bg-red-100', text: 'text-red-800'},
    'yellow': {bg: 'bg-yellow-100', text: 'text-yellow-800'},
    'indigo': {bg: 'bg-indigo-100', text: 'text-indigo-800'}
  };
  
  return colorMap[color] || {bg: 'bg-gray-100', text: 'text-gray-800'};
};

/**
 * 获取分类样式
 * @param colorName 颜色名称
 * @returns 样式对象
 */
export const getCategoryStyles = (colorName: string): { bgColor: string; textColor: string; borderColor: string; } => {
  const colorMap: Record<string, { bgColor: string; textColor: string; borderColor: string; }> = {
    red: { bgColor: '#fef2f2', textColor: '#b91c1c', borderColor: '#fecaca' },
    orange: { bgColor: '#fff7ed', textColor: '#c2410c', borderColor: '#fed7aa' },
    amber: { bgColor: '#fffbeb', textColor: '#b45309', borderColor: '#fde68a' },
    yellow: { bgColor: '#fefce8', textColor: '#a16207', borderColor: '#fef08a' },
    lime: { bgColor: '#f7fee7', textColor: '#4d7c0f', borderColor: '#bef264' },
    green: { bgColor: '#f0fdf4', textColor: '#15803d', borderColor: '#86efac' },
    emerald: { bgColor: '#ecfdf5', textColor: '#047857', borderColor: '#6ee7b7' },
    teal: { bgColor: '#f0fdfa', textColor: '#0f766e', borderColor: '#5eead4' },
    cyan: { bgColor: '#ecfeff', textColor: '#0e7490', borderColor: '#67e8f9' },
    sky: { bgColor: '#f0f9ff', textColor: '#0369a1', borderColor: '#7dd3fc' },
    blue: { bgColor: '#eff6ff', textColor: '#1d4ed8', borderColor: '#93c5fd' },
    indigo: { bgColor: '#eef2ff', textColor: '#4338ca', borderColor: '#a5b4fc' },
    violet: { bgColor: '#f5f3ff', textColor: '#5b21b6', borderColor: '#c4b5fd' },
    purple: { bgColor: '#faf5ff', textColor: '#7e22ce', borderColor: '#d8b4fe' },
    fuchsia: { bgColor: '#fdf4ff', textColor: '#a21caf', borderColor: '#e879f9' },
    pink: { bgColor: '#fdf2f8', textColor: '#be185d', borderColor: '#f9a8d4' },
    rose: { bgColor: '#fff1f2', textColor: '#be123c', borderColor: '#fda4af' },
    gray: { bgColor: '#f9fafb', textColor: '#4b5563', borderColor: '#d1d5db' }
  };
  
  return colorMap[colorName] || colorMap.gray;
};

/**
 * 获取分类图标
 * @param iconName 图标名称
 * @returns 图标类名
 */
export const getCategoryIcon = (iconName: string): string => {
  // 处理没有图标的情况
  if (!iconName) return 'fa-file-alt';
  
  // 如果已经有fa-前缀，则直接返回
  if (iconName.startsWith('fa-')) {
    return iconName;
  }
  
  // 否则添加前缀
  return `fa-${iconName}`;
};

/**
 * 获取分类图标组件
 * @param iconName 图标名称
 * @param additionalClass 额外的类名
 * @returns 图标元素的类名
 */
export const getCategoryIconComponent = (iconName: string, additionalClass: string = ''): string => {
  const icon = getCategoryIcon(iconName);
  return `fas ${icon} ${additionalClass}`;
};

/**
 * 获取分页显示信息
 * @param currentPage 当前页码
 * @param pageSize 每页显示数量
 * @param totalItems 总条目数量
 * @returns 分页信息对象
 */
export const getPaginationInfo = (currentPage: number, pageSize: number, totalItems: number) => {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  
  return { start, end, total: totalItems };
};

/**
 * 根据UI显示值获取排序的API参数值
 * @param sortDisplay 显示在UI上的排序名称
 * @param translations 国际化翻译函数
 * @returns 对应的API参数值
 */
export const getSortApiValue = (sortDisplay: string, translations: Record<string, string>): string => {
  if (sortDisplay === translations['sortByNewest']) return 'newest';
  if (sortDisplay === translations['sortByOldest']) return 'oldest';
  if (sortDisplay === translations['sortByMostUsed']) return 'mostUsed';
  if (sortDisplay === translations['sortByName']) return 'name';
  return 'newest'; // 默认值
}; 