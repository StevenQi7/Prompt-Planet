/**
 * 样式相关的工具函数集合
 */

/**
 * 将十六进制颜色转换为Tailwind颜色名称
 * @param hexColor 十六进制颜色值
 * @returns Tailwind颜色名称
 */
export const hexToTailwindColor = (hexColor: string): string => {
  // 如果没有十六进制颜色，返回默认颜色
  if (!hexColor || !hexColor.startsWith('#')) {
    return 'indigo';
  }
  
  // 转换十六进制颜色为小写，便于匹配
  const lowerHexColor = hexColor.toLowerCase();
  
  // 颜色映射表
  const colorMap: Record<string, string> = {
    '#3b82f6': 'blue',      // 写作助手
    '#ec4899': 'pink',      // 营销文案
    '#10b981': 'green',     // 编程开发
    '#6366f1': 'indigo',    // 翻译工具
    '#f59e0b': 'yellow',    // 学习辅助
    '#8b5cf6': 'purple',    // 紫色
    '#ef4444': 'red',       // 红色
    '#14b8a6': 'teal',      // 青色
    '#6b7280': 'gray',      // 灰色
    '#f97316': 'orange',    // 橙色
    '#06b6d4': 'cyan',      // 青色
  };
  
  // 返回对应的颜色名称，如果找不到则返回默认值
  return colorMap[lowerHexColor] || 'indigo';
};

/**
 * 获取分类的颜色样式类名
 * @param colorName 颜色名称或十六进制颜色
 * @returns 包含各种样式类名的对象
 */
export const getColorClasses = (colorName: string) => {
  // 确保颜色名称存在
  let safeColorName = colorName || 'indigo';
  
  // 如果是十六进制颜色格式，转换为Tailwind颜色名称
  if (safeColorName.startsWith('#')) {
    safeColorName = hexToTailwindColor(safeColorName);
  }
  
  const colorMap: Record<string, {
    border: string,
    text: string,
    hover: string,
    hoverBorder: string,
    iconColor: string,
    iconHover: string,
    bg: string,
  }> = {
    'indigo': {
      border: 'border-indigo-100',
      text: 'text-indigo-800',
      hover: 'hover:bg-indigo-50',
      hoverBorder: 'hover:border-indigo-200',
      iconColor: 'text-indigo-400',
      iconHover: 'group-hover:text-indigo-600',
      bg: 'bg-indigo-50',
    },
    'green': {
      border: 'border-green-100',
      text: 'text-green-800',
      hover: 'hover:bg-green-50',
      hoverBorder: 'hover:border-green-200',
      iconColor: 'text-green-400',
      iconHover: 'group-hover:text-green-600',
      bg: 'bg-green-50',
    },
    'purple': {
      border: 'border-purple-100',
      text: 'text-purple-800',
      hover: 'hover:bg-purple-50',
      hoverBorder: 'hover:border-purple-200',
      iconColor: 'text-purple-400',
      iconHover: 'group-hover:text-purple-600',
      bg: 'bg-purple-50',
    },
    'yellow': {
      border: 'border-yellow-100',
      text: 'text-yellow-800',
      hover: 'hover:bg-yellow-50',
      hoverBorder: 'hover:border-yellow-200',
      iconColor: 'text-yellow-400',
      iconHover: 'group-hover:text-yellow-600',
      bg: 'bg-yellow-50',
    },
    'red': {
      border: 'border-red-100',
      text: 'text-red-800',
      hover: 'hover:bg-red-50',
      hoverBorder: 'hover:border-red-200',
      iconColor: 'text-red-400',
      iconHover: 'group-hover:text-red-600',
      bg: 'bg-red-50',
    },
    'blue': {
      border: 'border-blue-100',
      text: 'text-blue-800',
      hover: 'hover:bg-blue-50',
      hoverBorder: 'hover:border-blue-200',
      iconColor: 'text-blue-400',
      iconHover: 'group-hover:text-blue-600',
      bg: 'bg-blue-50',
    },
    'teal': {
      border: 'border-teal-100',
      text: 'text-teal-800',
      hover: 'hover:bg-teal-50',
      hoverBorder: 'hover:border-teal-200',
      iconColor: 'text-teal-400',
      iconHover: 'group-hover:text-teal-600',
      bg: 'bg-teal-50',
    },
    'orange': {
      border: 'border-orange-100',
      text: 'text-orange-800',
      hover: 'hover:bg-orange-50',
      hoverBorder: 'hover:border-orange-200',
      iconColor: 'text-orange-400',
      iconHover: 'group-hover:text-orange-600',
      bg: 'bg-orange-50',
    },
    'pink': {
      border: 'border-pink-100',
      text: 'text-pink-800',
      hover: 'hover:bg-pink-50',
      hoverBorder: 'hover:border-pink-200',
      iconColor: 'text-pink-400',
      iconHover: 'group-hover:text-pink-600',
      bg: 'bg-pink-50',
    },
    'cyan': {
      border: 'border-cyan-100',
      text: 'text-cyan-800',
      hover: 'hover:bg-cyan-50',
      hoverBorder: 'hover:border-cyan-200',
      iconColor: 'text-cyan-400',
      iconHover: 'group-hover:text-cyan-600',
      bg: 'bg-cyan-50',
    }
  };
  
  return colorMap[safeColorName] || colorMap.indigo;
};

/**
 * 格式化图标名称
 * @param iconName 图标名称
 * @returns 格式化后的图标类名
 */
export const formatIconName = (iconName: string): string => {
  if (!iconName) return 'fas fa-tag'; // 默认图标
  
  // 首先处理已经包含'fas'、'far'或'fab'前缀的情况
  if (iconName.startsWith('fas ') || iconName.startsWith('far ') || iconName.startsWith('fab ')) {
    return iconName; // 已经是完整的图标类名
  }
  
  // 处理只有'fa-xxx'格式的情况
  if (iconName.startsWith('fa-')) {
    return `fas ${iconName}`; // 添加'fas '前缀
  }
  
  // 处理没有任何前缀的情况
  return `fas fa-${iconName}`;
}; 