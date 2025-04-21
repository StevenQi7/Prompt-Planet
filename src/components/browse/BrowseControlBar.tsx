'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import BrowseActiveTags from './BrowseActiveTags';
import { Category, Tag } from '@/types/browse';

interface BrowseControlBarProps {
  totalItems: number;
  isGridView: boolean;
  selectedCategories: string[];
  selectedTags: string[];
  getCategoryById: (id: string) => Category | undefined;
  getTagById: (id: string) => Tag | undefined;
  onToggleView: (isGrid: boolean) => void;
  onRemoveTag: (tag: string, type: 'category' | 'tag') => void;
  onClearAllTags: () => void;
}

export default function BrowseControlBar({
  totalItems,
  isGridView,
  selectedCategories,
  selectedTags,
  getCategoryById,
  getTagById,
  onToggleView,
  onRemoveTag,
  onClearAllTags
}: BrowseControlBarProps) {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden border border-gray-100">
      <div className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          <span className="text-gray-700 mr-2">{t('browse.view')}:</span>
          <div className="flex items-center space-x-2">
            <button 
              className={`p-2 rounded-lg transition-all duration-300 ${isGridView ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-indigo-600'}`}
              onClick={() => onToggleView(true)}
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button 
              className={`p-2 rounded-lg transition-all duration-300 ${!isGridView ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-indigo-600'}`}
              onClick={() => onToggleView(false)}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
        
        <div>
          <span className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
            {t('browse.totalPrompts')}: {totalItems > 0 ? totalItems : 0}
          </span>
        </div>
      </div>
      
      {/* 已选择的标签组件 */}
      {(selectedCategories.length > 0 || selectedTags.length > 0) && (
        <BrowseActiveTags
          selectedCategories={selectedCategories}
          selectedTags={selectedTags}
          getCategoryById={getCategoryById}
          getTagById={getTagById}
          onRemoveTag={onRemoveTag}
          onClearAll={onClearAllTags}
        />
      )}
    </div>
  );
} 