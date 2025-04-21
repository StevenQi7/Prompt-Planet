import React from 'react';
import Link from 'next/link';
import { FaEye, FaBookmark } from 'react-icons/fa';
import CopyButton from '../CopyButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryColorClasses, getTagDisplayName, getCategoryDisplayName } from '@/utils/displayUtils';
import { formatCount } from '@/utils/formatUtils';

// 类型定义
export type Tag = {
  id: string;
  name: string;
  display_name?: string;
};

export type FavoritePrompt = {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryName?: string;
  author: string;
  authorId?: string;
  views: number;
  favoriteDate: string;
  categoryColor: string;
  content: string;
  tags?: Tag[];
};

interface FavoritePromptCardProps {
  prompt: FavoritePrompt;
  onRemoveFavorite: (promptId: string) => void;
}

const FavoritePromptCard: React.FC<FavoritePromptCardProps> = ({ prompt, onRemoveFavorite }) => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] group">
      <div className="p-4 flex flex-col h-[200px]">
        {/* 标题和分类 */}
        <div className="flex justify-between items-start mb-2">
          <h5 className="text-lg font-semibold tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 pr-2">{prompt.title}</h5>
          <span className={`${getCategoryColorClasses(prompt.categoryColor).bg} ${getCategoryColorClasses(prompt.categoryColor).text} text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap`}>
            {getCategoryDisplayName(prompt.category, prompt.categoryName, language)}
          </span>
        </div>
        
        {/* 描述 */}
        <p className="font-normal text-gray-600 mb-2 line-clamp-1 text-sm leading-relaxed flex-1">{prompt.description}</p>
        
        {/* 标签 */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {prompt.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {getTagDisplayName(tag, language)}
              </span>
            ))}
          </div>
        )}
        
        {/* 底部操作栏 */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 h-8">
          {/* 统计信息 */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-xs text-gray-500">
              <FaEye className="mr-1.5 text-indigo-500" />
              <span>{formatCount(prompt.views)}</span>
            </div>
            <div className="text-xs text-gray-500">
              {prompt.favoriteDate} {t('favorites.favoritedOn')}
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-1 flex-shrink-0">
            <Link 
              href={`/prompt-detail/${prompt.id}`} 
              className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center" 
              title={t('favorites.viewDetails')}
            >
              <FaEye className="text-sm" />
            </Link>
            <CopyButton 
              textToCopy={prompt.content}
              className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center text-sm"
            />
            <button 
              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center" 
              title={t('favorites.removeFromFavorites')}
              onClick={() => onRemoveFavorite(prompt.id)}
            >
              <FaBookmark className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritePromptCard; 