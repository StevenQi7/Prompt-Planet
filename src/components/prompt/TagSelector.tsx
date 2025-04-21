import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Tag {
  id: string;
  name: string;
  displayName?: string;
}

interface TagSelectorProps {
  selectedTags: string[];
  allTags: Tag[];
  onTagSelect: (tagId: string) => void;
  getTagDisplayName: (tagId: string) => string;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  allTags,
  onTagSelect,
  getTagDisplayName
}) => {
  const { t, language } = useLanguage();
  const [tagSearchText, setTagSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Tag[]>([]);
  const [showTagResults, setShowTagResults] = useState(false);

  // 搜索标签
  const searchTagsFunction = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/tags?q=${encodeURIComponent(query)}&limit=10`);
      if (!response.ok) {
        throw new Error(t('editPromptPage.searchTagsFailed'));
      }
      const data = await response.json();
      setSearchResults(data);
      setShowTagResults(true);
    } catch (error) {
      console.error('搜索标签失败:', error);
      setSearchResults([]);
    }
  };

  // 使用防抖处理标签搜索
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (tagSearchText) {
        searchTagsFunction(tagSearchText);
      } else {
        setSearchResults([]);
        setShowTagResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [tagSearchText]);

  const handleTagClick = (tagId: string) => {
    onTagSelect(tagId);
    setTagSearchText('');
    setShowTagResults(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t('editPromptPage.tags')} ({selectedTags.length}/5)
      </label>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tagId => (
          <div key={tagId} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md flex items-center">
            <span>{getTagDisplayName(tagId)}</span>
            <button 
              type="button"
              className="ml-1 text-indigo-600 hover:text-indigo-800"
              onClick={() => handleTagClick(tagId)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      
      <div className="relative">
        <input
          type="text"
          placeholder={t('editPromptPage.searchTags')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={tagSearchText}
          onChange={(e) => setTagSearchText(e.target.value)}
          onFocus={() => setShowTagResults(true)}
        />
        
        {showTagResults && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map(tag => (
              <div
                key={tag.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                onClick={() => handleTagClick(tag.id)}
              >
                {language === 'zh' ? (tag.displayName || tag.name) : tag.name}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <p className="text-sm text-gray-500">{t('editPromptPage.popularTags')}:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {allTags.slice(0, 10).map(tag => (
            <button
              key={tag.id}
              type="button"
              className={`text-xs px-2 py-1 rounded-md ${
                selectedTags.includes(tag.id)
                  ? 'bg-indigo-200 text-indigo-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTagClick(tag.id)}
            >
              {language === 'zh' ? (tag.displayName || tag.name) : tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagSelector; 