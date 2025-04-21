import { useLanguage } from '@/contexts/LanguageContext';

// 分类类型接口
interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  count: number;
}

// 标签类型接口
interface Tag {
  id: string;
  name: string;
  displayName: string;
  color: string;
  count: number;
}

interface SearchFiltersProps {
  categories: Category[];
  selectedCategory: string;
  selectedSort: 'relevance' | 'latest' | 'popular';
  selectedTags: Tag[];
  onCategoryChange: (categoryId: string) => void;
  onSortChange: (sort: string) => void;
  onTagRemove: (tagId: string) => void;
  onClearFilters: () => void;
  getCategoryColorClasses: (color: string) => any;
}

export default function SearchFilters({
  categories,
  selectedCategory,
  selectedSort,
  selectedTags,
  onCategoryChange,
  onSortChange,
  onTagRemove,
  onClearFilters,
  getCategoryColorClasses
}: SearchFiltersProps) {
  const { t, language } = useLanguage();
  
  return (
    <>
      {/* 筛选栏 */}
      <div className="p-3 border-b border-gray-100 flex justify-between items-center flex-wrap gap-3 bg-gray-50">
        <div className="flex items-center flex-wrap gap-3">
          <span className="text-gray-600 text-sm font-medium flex items-center">
            <i className="fas fa-filter text-indigo-500 mr-2"></i>{t('searchResults.filterBy')}:
          </span>
          <select 
            className="text-sm border border-gray-300 rounded-lg py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 shadow-sm"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">{t('searchResults.allCategories')}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {language === 'zh' ? category.displayName : category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-sm font-medium flex items-center">
            <i className="fas fa-sort-amount-down text-indigo-500 mr-2"></i>{t('searchResults.sortBy')}:
          </span>
          <select 
            className="text-sm border border-gray-300 rounded-lg py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 shadow-sm"
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="relevance">{t('searchResults.relevance') || '相关性'}</option>
            <option value="latest">{t('searchResults.newest') || '最新添加'}</option>
            <option value="popular">{t('searchResults.mostPopular') || '使用次数'}</option>
          </select>
        </div>
      </div>
      
      {/* 标签过滤条 - 只在有选中标签时显示 */}
      {selectedTags.length > 0 && (
        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 bg-white">
          {selectedTags.map((tag) => {
            const colorClasses = getCategoryColorClasses(tag.color || 'indigo');
            return (
              <span 
                key={tag.id} 
                className={`${colorClasses.bg} ${colorClasses.text} text-sm font-medium px-3 py-1.5 rounded-lg flex items-center shadow-sm border ${colorClasses.border}`}
              >
                {tag.displayName || tag.name}
                <button 
                  onClick={() => onTagRemove(tag.id)}
                  className={`ml-2 ${colorClasses.text.replace('800', '600')} hover:${colorClasses.text.replace('800', '800')} transition-colors duration-300`}
                >
                  <i className="fas fa-times-circle"></i>
                </button>
              </span>
            );
          })}
          <button 
            onClick={onClearFilters}
            className="text-gray-500 hover:text-indigo-800 text-sm font-medium px-3 py-1.5 transition-colors duration-300 flex items-center ml-2"
          >
            {t('clearAll') || '清除所有'} <i className="fas fa-trash-alt ml-2 text-indigo-500"></i>
          </button>
        </div>
      )}
      
      {/* 搜索建议 */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-800">
          <p className="flex items-start">
            <i className="fas fa-lightbulb text-amber-500 mr-2 mt-0.5"></i>
            <span>
              {t('searchResults.searchTip') || '想要找到更精准的提示词？尝试在搜索中使用更具体的关键词，如"SEO优化博客文章写作"、"学术论文写作助手"或"营销内容创作"，以获得更符合您需求的结果。'}
            </span>
          </p>
        </div>
      </div>
    </>
  );
} 