'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Category, Tag } from '@/types/browse';
import { getColorClasses, formatIconName } from '@/utils/styleUtils';

interface BrowseActiveTagsProps {
  selectedCategories: string[];
  selectedTags: string[];
  getCategoryById: (id: string) => Category | undefined;
  getTagById: (id: string) => Tag | undefined;
  onRemoveTag: (tag: string, type: 'category' | 'tag') => void;
  onClearAll: () => void;
}

export default function BrowseActiveTags({
  selectedCategories,
  selectedTags,
  getCategoryById,
  getTagById,
  onRemoveTag,
  onClearAll
}: BrowseActiveTagsProps) {
  const { t, language } = useLanguage();

  // 如果没有选中的分类和标签，则不显示此组件
  if (selectedCategories.length === 0 && selectedTags.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-100 px-4 py-2.5 flex flex-wrap items-center">
      <span className="text-sm text-gray-500 mr-2">{t('browse.filterActive')}:</span>
      
      {selectedCategories.map(catId => {
        const category = getCategoryById(catId);
        const categoryColors = category ? getColorClasses(category.color || 'indigo') : { 
          bg: 'bg-indigo-50', 
          text: 'text-indigo-600', 
          iconColor: 'text-indigo-500',
          border: 'border-indigo-100'
        };
        return (
          <span key={catId} className={`inline-flex items-center m-1 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors.bg} ${categoryColors.text} border ${categoryColors.border}`}>
            {category && (
              <i className={`${formatIconName(category.icon || 'tag')} ${categoryColors.iconColor} mr-1.5`}></i>
            )}
            <span className="whitespace-nowrap">
              {category 
                ? (language === 'zh' ? (category.displayName || category.name) : category.name) 
                : catId}
            </span>
            <button 
              onClick={() => onRemoveTag(catId, 'category')}
              className={`ml-1 ${categoryColors.iconColor} hover:text-indigo-800 focus:outline-none`}
            >
              <i className="fas fa-times-circle"></i>
            </button>
          </span>
        );
      })}
      
      {selectedTags.map(tagId => {
        const tag = getTagById(tagId);
        const bgColor = tag?.color ? `bg-${tag.color}-50` : 'bg-green-50';
        const textColor = tag?.color ? `text-${tag.color}-600` : 'text-green-600';
        const borderColor = tag?.color ? `border-${tag.color}-100` : 'border-green-100';
        
        return (
          <span key={tagId} className={`inline-flex items-center m-1 px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border ${borderColor}`}>
            {tag && tag.color && (
              <span className={`w-2 h-2 rounded-full bg-${tag.color}-400 mr-1.5`}></span>
            )}
            <span className="text-gray-700 whitespace-nowrap">
              {tag 
                ? (language === 'zh' ? (tag.displayName || tag.display_name || tag.name) : tag.name) 
                : tagId}
            </span>
            <span className="text-gray-400 text-xs ml-1.5">({tag?.count || 0})</span>
            <button 
              onClick={() => onRemoveTag(tagId, 'tag')}
              className={`ml-1 ${textColor} hover:text-indigo-800 focus:outline-none`}
            >
              <i className="fas fa-times-circle"></i>
            </button>
          </span>
        );
      })}
      
      <button 
        onClick={onClearAll}
        className="ml-auto text-xs text-gray-500 hover:text-indigo-600 transition-colors duration-300"
      >
        {t('clearAll')}
      </button>
    </div>
  );
} 