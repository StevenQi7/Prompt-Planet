import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import CopyButton from '@/components/CopyButton';
import { formatCount } from '@/utils/formatUtils';
import { getColorClasses, formatIconName } from '@/utils/styleUtils';

// 定义分类类型
interface Category {
  id: string;
  name: string;
  displayName?: string;
  color?: string;
  icon?: string;
}

// 定义提示词类型接口
interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  status: string;
  viewCount: number;
  favoriteCount: number;
  images: string[];
  createdAt: string;
  language?: string;
  category: Category;
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

interface SearchResultsListProps {
  searchResults: Prompt[];
  isLoading: boolean;
  error: string;
  getTimeAgo: (dateString: string) => string;
}

export default function SearchResultsList({ 
  searchResults, 
  isLoading, 
  error, 
  getTimeAgo 
}: SearchResultsListProps) {
  const { t, language } = useLanguage();

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">
          <i className="fas fa-exclamation-circle text-3xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{error}</h3>
        <p className="text-gray-600">请稍后重试或修改搜索条件</p>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400 mb-4">
          <i className="fas fa-search text-4xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {t('searchResults.noResults') || '没有找到相关提示词'}
        </h3>
        <p className="text-gray-600 mb-4">
          {t('searchResults.tryAnotherSearch') || '请尝试使用其他关键词或减少筛选条件'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {searchResults.map((prompt) => {
        const colorClasses = getColorClasses(prompt.category.color || 'indigo');
        const iconName = formatIconName(prompt.category.icon || 'fas fa-question');
        const iconClass = `fas ${iconName}`;
        
        return (
          <div 
            key={prompt.id}
            className="bg-white rounded-md border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 card-hover p-3 hover:border-indigo-200 flex flex-col h-full"
          >
            {/* 卡片顶部信息区域 */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-8 h-8 ${colorClasses.bg} rounded-lg flex items-center justify-center shadow-sm`}>
                    <i className={`${iconClass} ${colorClasses.iconColor || 'text-indigo-500'}`}></i>
                  </div>
                  <span className={`${colorClasses.bg} ${colorClasses.text} text-xs font-medium ml-2 px-2 py-0.5 rounded`}>
                    {language === 'zh' ? prompt.category.displayName : prompt.category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                    <i className="fas fa-eye mr-1 text-indigo-500"></i>
                    <span>{formatCount(prompt.viewCount)}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                    <i className="fas fa-star mr-1 text-amber-400"></i>
                    <span>{formatCount(prompt.favoriteCount)}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 flex items-center">
                <i className="far fa-clock mr-1"></i>{getTimeAgo(prompt.createdAt)}
              </div>
            </div>
            
            {/* 卡片内容区域 - 使用flex-grow让内容区域自适应高度 */}
            <div className="flex-grow">
              <Link href={`/prompt-detail/${prompt.id}`} className="block">
                <h3 className="text-base font-semibold text-gray-800 mb-1 hover:text-indigo-600 transition-colors duration-300 line-clamp-1 overflow-hidden">
                  {prompt.title}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2 h-[38px] overflow-hidden">{prompt.description}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {prompt.tags.slice(0, 3).map(({ tag }) => {
                  const tagColorClasses = getColorClasses(tag.color || 'indigo');
                  return (
                    <Link 
                      href={`/search-results?q=${encodeURIComponent(language === 'zh' ? (tag.displayName || tag.name) : tag.name)}&page=1`} 
                      key={tag.id} 
                      className={`${tagColorClasses.bg} ${tagColorClasses.text} text-xs font-medium px-1.5 py-0.5 rounded hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300 border ${tagColorClasses.border} hover:border-indigo-100`}
                    >
                      #{language === 'zh' ? (tag.displayName || tag.name) : tag.name}
                    </Link>
                  );
                })}
                {prompt.tags.length > 3 && (
                  <span className="text-xs text-gray-400">+{prompt.tags.length - 3}</span>
                )}
              </div>
            </div>
            
            {/* 卡片底部按钮区域 - 固定高度 */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-auto h-[32px]">
              <div className="flex items-center">
                {prompt.viewCount > 5000 && (
                  <span className="bg-red-50 text-red-800 text-xs font-semibold mr-2 px-1.5 py-0.5 rounded border border-red-100 flex items-center">
                    <i className="fas fa-fire mr-1 text-red-500 text-xs"></i>{t('promptsAndTags.hot')}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <CopyButton
                  content={prompt.content}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                />
                <Link 
                  href={`/prompt-detail/${prompt.id}`} 
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center group"
                >
                  {t('promptsAndTags.details')} <i className="ml-1 fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform duration-300"></i>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 