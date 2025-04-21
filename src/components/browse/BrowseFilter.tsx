'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category, Tag } from '@/types/browse';
import { formatIconName, getColorClasses } from '@/utils/styleUtils';

// 定义颜色映射
const colorMap: Record<string, {bg: string, border: string, text: string, dot: string}> = {
  red: {
    bg: '#fef2f2', 
    border: '#fecaca', 
    text: '#b91c1c',
    dot: '#ef4444'
  },
  orange: {
    bg: '#fff7ed', 
    border: '#fed7aa', 
    text: '#c2410c',
    dot: '#f97316'
  },
  amber: {
    bg: '#fffbeb', 
    border: '#fde68a', 
    text: '#b45309',
    dot: '#f59e0b'
  },
  yellow: {
    bg: '#fefce8', 
    border: '#fef08a', 
    text: '#a16207',
    dot: '#eab308'
  },
  lime: {
    bg: '#f7fee7', 
    border: '#bef264', 
    text: '#4d7c0f',
    dot: '#84cc16'
  },
  green: {
    bg: '#f0fdf4', 
    border: '#86efac', 
    text: '#15803d',
    dot: '#22c55e'
  },
  emerald: {
    bg: '#ecfdf5', 
    border: '#6ee7b7', 
    text: '#047857',
    dot: '#10b981'
  },
  teal: {
    bg: '#f0fdfa', 
    border: '#5eead4', 
    text: '#0f766e',
    dot: '#14b8a6'
  },
  cyan: {
    bg: '#ecfeff', 
    border: '#67e8f9', 
    text: '#0e7490',
    dot: '#06b6d4'
  },
  sky: {
    bg: '#f0f9ff', 
    border: '#7dd3fc', 
    text: '#0369a1',
    dot: '#0ea5e9'
  },
  blue: {
    bg: '#eff6ff', 
    border: '#93c5fd', 
    text: '#1d4ed8',
    dot: '#3b82f6'
  },
  indigo: {
    bg: '#eef2ff', 
    border: '#a5b4fc', 
    text: '#4338ca',
    dot: '#6366f1'
  },
  violet: {
    bg: '#f5f3ff', 
    border: '#c4b5fd', 
    text: '#5b21b6',
    dot: '#8b5cf6'
  },
  purple: {
    bg: '#faf5ff', 
    border: '#d8b4fe', 
    text: '#7e22ce',
    dot: '#a855f7'
  },
  fuchsia: {
    bg: '#fdf4ff', 
    border: '#e879f9', 
    text: '#a21caf',
    dot: '#d946ef'
  },
  pink: {
    bg: '#fdf2f8', 
    border: '#f9a8d4', 
    text: '#be185d',
    dot: '#ec4899'
  },
  rose: {
    bg: '#fff1f2', 
    border: '#fda4af', 
    text: '#be123c',
    dot: '#f43f5e'
  },
  gray: {
    bg: '#f9fafb', 
    border: '#d1d5db', 
    text: '#4b5563',
    dot: '#6b7280'
  }
};

// 获取颜色值
const getTagColor = (color: string | undefined) => {
  const safeColor = (color && colorMap[color]) ? color : 'indigo';
  return colorMap[safeColor];
};

// 获取分类颜色值 - 与标签使用相同的颜色系统
const getCategoryColor = (color: string | undefined) => {
  return getTagColor(color);
};

interface BrowseFilterProps {
  categories: Category[];
  tags: Tag[];
  selectedCategories: string[];
  selectedTags: string[];
  sortOption: 'latest' | 'popular';
  onCategoryChange: (categoryId: string) => void;
  onTagChange: (tagId: string) => void;
  onSortChange: (sort: 'latest' | 'popular') => void;
  onResetFilters: () => void;
}

export default function BrowseFilter({
  categories,
  tags,
  selectedCategories,
  selectedTags,
  sortOption,
  onCategoryChange,
  onTagChange,
  onSortChange,
  onResetFilters
}: BrowseFilterProps) {
  const { t, language } = useLanguage();
  
  // 添加标签搜索状态
  const [tagSearchText, setTagSearchText] = useState('');
  
  // 过滤标签
  const filteredTags = tagSearchText 
    ? tags.filter(tag => {
        const displayName = language === 'zh' ? (tag.displayName || tag.display_name || tag.name) : tag.name;
        return displayName.toLowerCase().includes(tagSearchText.toLowerCase());
      })
    : tags;

  return (
    <div className="lg:w-64 flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-100 h-fit">
      <div className="p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          <i className="fas fa-filter text-indigo-500 mr-2"></i>
          {t('filters')}
        </h2>
        
        {/* 分类筛选 */}
        <div className="text-sm font-medium mb-3">
          <i className="fas fa-th-large text-blue-500 mr-2"></i>
          {t('category')}
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4">
          {Object.values(categories).map(category => {
            // 获取分类颜色
            const categoryColor = getCategoryColor(category.color);
            const iconStyle = {
              color: categoryColor.dot,
              marginRight: '0.375rem'
            };
            
            return (
              <div 
                key={category.id} 
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => onCategoryChange(category.id)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label 
                  htmlFor={`category-${category.id}`} 
                  className="flex-1 cursor-pointer"
                >
                  <div className="ml-2 flex items-center">
                    <i 
                      className={`fas ${formatIconName(category.icon || 'tag')}`} 
                      style={iconStyle}
                    ></i>
                    <span 
                      className="whitespace-nowrap"
                      style={{ color: categoryColor.text }}
                    >
                      {language === 'zh' ? (category.displayName || category.name) : category.name}
                    </span>
                    <span className="text-gray-400 text-xs ml-1.5">({category.count})</span>
                  </div>
                </label>
                <span 
                  className={`ml-auto flex items-center justify-center h-6 w-6 rounded-full ${
                    selectedCategories.includes(category.id) 
                      ? 'bg-indigo-600 text-white' 
                      : `${getColorClasses(category.color || 'indigo').bg} text-white`
                  }`}
                >
                </span>
              </div>
            );
          })}
        </div>
        
        {/* 标签筛选 - 改用更友好的UI方式展示 */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-3">
            <i className="fas fa-tags text-green-500 mr-2"></i>
            {t('browse.tags')}
          </div>
          
          {/* 添加标签搜索 */}
          <div className="mb-3">
            <input
              type="text"
              value={tagSearchText}
              onChange={(e) => setTagSearchText(e.target.value)}
              placeholder={t('browse.search') + '...'}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            <div className="flex flex-wrap gap-1">
              {filteredTags.map(tag => {
                const isSelected = selectedTags.includes(tag.id);
                const displayName = language === 'zh' ? (tag.displayName || tag.display_name || tag.name) : tag.name;
                
                // 获取颜色
                const tagColor = getTagColor(tag.color);
                
                // 基础样式
                const baseClass = 'px-2.5 py-1.5 text-xs rounded-full border transition-colors duration-200 flex items-center';
                
                // 选中状态样式加强
                const selectedClass = isSelected ? 'font-medium shadow-sm' : 'hover:bg-gray-50';
                
                // 特殊处理颜色，使用内联样式
                const tagStyle = {
                  backgroundColor: isSelected ? tagColor.bg : 'white',
                  borderColor: isSelected ? tagColor.border : '#e5e7eb',
                };
                
                // 文字颜色单独设置
                const textStyle = {
                  color: isSelected ? tagColor.text : '#374151',
                };
                
                return (
                  <button
                    key={tag.id}
                    onClick={() => onTagChange(tag.id)}
                    className={`${baseClass} ${selectedClass}`}
                    style={tagStyle}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full mr-1.5 inline-block" 
                      style={{ backgroundColor: tagColor.dot }}
                    ></span>
                    <span style={textStyle}>{displayName}</span>
                    {tag.count > 0 && (
                      <span className="ml-1 text-gray-500 text-xs">({tag.count})</span>
                    )}
                    {isSelected && (
                      <i className="fas fa-check text-xs ml-1.5 text-green-600"></i>
                    )}
                  </button>
                );
              })}
              
              {/* 无搜索结果提示 */}
              {tagSearchText && filteredTags.length === 0 && (
                <div className="w-full p-3 text-center text-gray-500 text-sm">
                  {t('browse.noResults')}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 排序选项 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <i className="fas fa-sort text-purple-400 mr-2"></i>{t('sort')}
          </h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="sortOption" 
                className="text-indigo-600 focus:ring-indigo-500" 
                checked={sortOption === 'popular'}
                onChange={() => onSortChange('popular')}
              />
              <span className="ml-2 text-gray-700">{t('popular')}</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="sortOption" 
                className="text-indigo-600 focus:ring-indigo-500" 
                checked={sortOption === 'latest'}
                onChange={() => onSortChange('latest')}
              />
              <span className="ml-2 text-gray-700">{t('latest')}</span>
            </label>
          </div>
        </div>
        
        {/* 重置按钮 */}
        <button 
          onClick={onResetFilters}
          className="w-full py-2 px-4 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t('resetFilters')}
        </button>
      </div>
    </div>
  );
} 