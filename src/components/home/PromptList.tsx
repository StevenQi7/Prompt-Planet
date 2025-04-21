'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCount } from '@/utils/formatUtils';
import { formatIconName, getColorClasses } from '@/utils/styleUtils';
import Link from 'next/link';
import CopyButton from '../CopyButton';

// 提示词接口
export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  usageGuide?: string;
  status: string;
  viewCount: number;
  favoriteCount: number;
  images: string[];
  createdAt: string;
  category: {
    id: string;
    name: string;
    displayName: string;
    icon: string;
    color: string;
  };
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

// 提示词卡片组件
const PromptCard = ({ prompt, isGridView }: { prompt: Prompt, isGridView: boolean }) => {
  const { language, t } = useLanguage();
  const colorClasses = getColorClasses(prompt.category?.color || 'blue');
  const iconName = formatIconName(prompt.category?.icon || 'file-alt');
  
  if (isGridView) {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col overflow-hidden card-hover">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className={`w-8 h-8 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
                <i className={`${iconName} ${colorClasses.iconColor} text-xs`}></i>
              </div>
              <span className={`${colorClasses.bg} ${colorClasses.text} text-sm font-medium ml-2 px-2 py-0.5 rounded`}>
                {language === 'zh' ? (prompt.category.displayName || prompt.category.name) : prompt.category.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                <i className="fas fa-eye mr-1 text-indigo-500"></i>
                <span>{formatCount(prompt.viewCount)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                <i className="fas fa-star mr-1 text-amber-400"></i>
                <span>{formatCount(prompt.favoriteCount)}</span>
              </div>
            </div>
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-2 h-[48px] line-clamp-2 overflow-hidden">{prompt.title}</h3>
          <p className="text-gray-600 text-sm mb-3 h-[40px] line-clamp-2 overflow-hidden">{prompt.description}</p>
          <div className="flex justify-between items-center">
            <CopyButton 
              content={prompt.content} 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center shine-effect"
            />
            <Link 
              href={`/prompt-detail/${prompt.id}`} 
              className="text-gray-500 hover:text-gray-700 text-sm group flex items-center"
            >
              {t('promptsAndTags.details')} <i className="fas fa-chevron-right ml-1 transform group-hover:translate-x-1 transition-transform duration-300 text-xs"></i>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // 列表视图
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4">
      <div className="flex flex-wrap md:flex-nowrap">
        <div className="w-full md:flex-grow">
          <div className="flex items-center mb-2">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${colorClasses.bg}`}>
              <i className={`${iconName} ${colorClasses.iconColor}`}></i>
            </span>
            <Link 
              href={`/prompt-detail/${prompt.id}`}
              className="font-medium text-gray-800 hover:text-indigo-600 transition-colors line-clamp-1"
            >
              {prompt.title}
            </Link>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 pl-10">{prompt.description}</p>
          <div className="flex flex-wrap items-center pl-10">
            <Link
              href={`/user/${prompt.author.id}`}
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors flex items-center mr-4"
            >
              {prompt.author.avatar ? (
                <img 
                  src={prompt.author.avatar} 
                  alt={prompt.author.nickname || prompt.author.username} 
                  className="w-5 h-5 rounded-full mr-1"
                />
              ) : (
                <i className="fas fa-user-circle text-gray-400 mr-1"></i>
              )}
              <span>{prompt.author.nickname || prompt.author.username}</span>
            </Link>
            <span className="flex items-center text-xs text-gray-500 mr-3">
              <i className="fas fa-eye mr-1"></i> {formatCount(prompt.viewCount)}
            </span>
            <span className="flex items-center text-xs text-gray-500">
              <i className="fas fa-star mr-1 text-amber-400"></i> {formatCount(prompt.favoriteCount)}
            </span>
          </div>
        </div>
        <div className="mt-3 md:mt-0 md:ml-4 md:pl-4 md:border-l border-gray-100 flex items-center">
          <CopyButton 
            content={prompt.content} 
            className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center shine-effect" 
          />
        </div>
      </div>
    </div>
  );
};

// 提示词列表组件
export default function PromptList({ 
  prompts,
  isGridView,
  isLoading,
  loadingMore,
  hasMore,
  onLoadMore
}: { 
  prompts: Prompt[],
  isGridView: boolean,
  isLoading?: boolean,
  loadingMore?: boolean,
  hasMore?: boolean,
  onLoadMore?: () => void
}) {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg mr-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            <div className="mt-4 flex justify-between">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-5 bg-gray-200 rounded w-1/5"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (prompts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3 text-gray-300">
          <i className="fas fa-file-alt"></i>
        </div>
        <p className="text-gray-500">{t('browse.noResults')}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className={isGridView 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        : "space-y-4"
      }>
        {prompts.map(prompt => (
          <PromptCard key={prompt.id} prompt={prompt} isGridView={isGridView} />
        ))}
      </div>
      
      {hasMore && onLoadMore && (
        <div className="text-center mt-8">
          <button
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center mx-auto"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                {t('promptsAndTags.loading')}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <i className="fas fa-plus-circle mr-2"></i> {t('homePage.loadMore')}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
} 