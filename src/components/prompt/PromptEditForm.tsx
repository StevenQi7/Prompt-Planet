import React, { ChangeEvent, useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Category {
  id: string;
  name: string;
  displayName?: string;
  icon: string;
  color: string;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
}

interface FormValidation {
  title: { valid: boolean; message: string };
  category: { valid: boolean; message: string };
  description: { valid: boolean; message: string };
}

interface Tag {
  id: string;
  name: string;
  displayName?: string;
  display_name?: string;
}

interface PromptEditFormProps {
  formData: FormData;
  formValidation: FormValidation;
  categories: Category[];
  selectedTags: string[];
  promptTagsData: {id: string, tagId: string, tag?: {id: string, name: string, displayName?: string}}[];
  allTags: {id: string, name: string, displayName?: string}[];
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTagSelect: (tagId: string) => void;
  getTagDisplayName: (tagId: string) => string;
}

const MAX_DESCRIPTION_LENGTH = 500;

const PromptEditForm: React.FC<PromptEditFormProps> = ({
  formData,
  formValidation,
  categories,
  selectedTags,
  promptTagsData,
  allTags,
  onInputChange,
  onCheckboxChange,
  onTagSelect,
  getTagDisplayName
}) => {
  const { t, language } = useLanguage();
  
  const [tagSearchText, setTagSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Tag[]>([]);
  const [showTagResults, setShowTagResults] = useState(false);
  const [remainingChars, setRemainingChars] = useState(MAX_DESCRIPTION_LENGTH - (formData.description?.length || 0));

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

  // 更新描述字符计数
  useEffect(() => {
    setRemainingChars(MAX_DESCRIPTION_LENGTH - (formData.description?.length || 0));
  }, [formData.description]);

  const handleTagClick = (tagId: string) => {
    onTagSelect(tagId);
    setTagSearchText('');
    setShowTagResults(false);
  };

  // 处理描述输入，限制最大字符数
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      onInputChange(e);
    }
  };

  // 获取标签显示名称的辅助函数
  const getTagDisplayNameFromTag = (tag: Tag): string => {
    if (language === 'zh') {
      return tag.displayName || tag.display_name || tag.name;
    }
    return tag.name;
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('editPromptPage.basicInfo')}</h2>
      
      <div className="space-y-4">
        {/* 标题 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            {t('editPromptPage.promptTitle')} <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            placeholder={t('editPromptPage.promptTitlePlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.title}
            onChange={onInputChange}
          />
          {!formValidation.title.valid && (
            <p className="mt-1 text-sm text-red-600">{formValidation.title.message}</p>
          )}
        </div>
        
        {/* 分类 */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            {t('editPromptPage.category')} <span className="text-red-500">*</span>
          </label>
          <select 
            id="category" 
            name="category" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.category}
            onChange={onInputChange}
          >
            <option value="">{t('editPromptPage.selectCategory')}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {language === 'zh' ? (category.displayName || category.name) : category.name}
              </option>
            ))}
          </select>
          {!formValidation.category.valid && (
            <p className="mt-1 text-sm text-red-600">{formValidation.category.message}</p>
          )}
        </div>
        
        {/* 描述 */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              {t('editPromptPage.description')} <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs ${remainingChars <= 50 ? 'text-red-500' : 'text-gray-500'}`}>
              {t('editPromptPage.charactersRemaining').replace('{count}', remainingChars.toString())}
            </span>
          </div>
          <textarea 
            id="description" 
            name="description" 
            rows={3}
            placeholder={t('editPromptPage.descriptionPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.description}
            onChange={handleDescriptionChange}
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
          {!formValidation.description.valid && (
            <p className="mt-1 text-sm text-red-600">{formValidation.description.message}</p>
          )}
        </div>
        
        {/* 标签选择 */}
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
                    {getTagDisplayNameFromTag(tag)}
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
                  {getTagDisplayNameFromTag(tag)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* 公开性设置 */}
        <div className="pt-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={onCheckboxChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
              {t('editPromptPage.isPublic')}
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">{t('editPromptPage.isPublicDesc')}</p>
        </div>
      </div>
    </div>
  );
};

export default PromptEditForm; 