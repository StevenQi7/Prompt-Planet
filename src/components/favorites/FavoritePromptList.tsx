import React from 'react';
import Link from 'next/link';
import { FaEye, FaBookmark } from 'react-icons/fa';
import CopyButton from '../CopyButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { FavoritePrompt } from './FavoritePromptCard';
import { formatCount } from '@/utils/formatUtils';
import { getCategoryColorClasses, getCategoryDisplayName } from '@/utils/displayUtils';

interface FavoritePromptListProps {
  prompts: FavoritePrompt[];
  onRemoveFavorite: (promptId: string) => void;
}

const FavoritePromptList: React.FC<FavoritePromptListProps> = ({ prompts, onRemoveFavorite }) => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {prompts.map((prompt, index) => (
        <div key={prompt.id} className={`p-4 ${index !== prompts.length - 1 ? 'border-b border-gray-200' : ''}`}>
          <div className="flex flex-row items-center justify-between">
            <div className="flex-grow min-w-0 mr-4">
              <div className="flex items-start gap-3 flex-wrap">
                <h5 className="text-lg font-semibold tracking-tight text-gray-900">{prompt.title}</h5>
                <span className={`${getCategoryColorClasses(prompt.categoryColor).bg} ${getCategoryColorClasses(prompt.categoryColor).text} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                  {getCategoryDisplayName(prompt.category, prompt.categoryName, language)}
                </span>
              </div>
              <p className="font-normal text-gray-700 mt-1 line-clamp-1 truncate">{prompt.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                <span>{prompt.author}</span>
                <div className="flex items-center">
                  <FaEye className="mr-1" />
                  <span>{formatCount(prompt.views)}</span>
                </div>
                <span className="text-xs text-gray-500">{prompt.favoriteDate} {t('favorites.favoritedOn')}</span>
              </div>
            </div>
            <div className="flex space-x-3 flex-shrink-0">
              <Link 
                href={`/prompt-detail/${prompt.id}`} 
                className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50" 
                title={t('favorites.viewDetails')}
              >
                <FaEye className="text-base" />
              </Link>
              <CopyButton 
                textToCopy={prompt.content}
                className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50"
              />
              <button 
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50" 
                title={t('favorites.removeFromFavorites')}
                onClick={() => onRemoveFavorite(prompt.id)}
              >
                <FaBookmark className="text-base" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoritePromptList; 