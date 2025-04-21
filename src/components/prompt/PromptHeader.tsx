import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegStar, FaStar, FaShareAlt } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'react-hot-toast';
import CopyButton from '@/components/CopyButton';

// 类型定义
interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
}

interface Author {
  id: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    preferred_username?: string;
  };
}

interface PromptHeaderProps {
  title: string;
  category: Category;
  author: Author;
  createdAt: string;
  viewCount: number;
  content: string;
  isFavorite: boolean;
  loadingFavorite: boolean;
  toggleFavorite: () => void;
  formatDate: (date: string) => string;
  formatCount: (count: number) => string;
  getCategoryStyles: (colorName: string) => { bgColor: string; textColor: string; borderColor: string };
  getCategoryDisplayName: (category: Category) => string;
}

export default function PromptHeader({
  title,
  category,
  author,
  createdAt,
  viewCount,
  content,
  isFavorite,
  loadingFavorite,
  toggleFavorite,
  formatDate,
  formatCount,
  getCategoryStyles,
  getCategoryDisplayName
}: PromptHeaderProps) {
  const { t } = useLanguage();

  // 处理分享逻辑
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href,
      }).then(() => {
        toast.success(t('promptDetail.shareSuccess' as any));
      }).catch((error) => {
        console.error('分享失败:', error);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('promptDetail.linkCopied' as any));
    }
  };

  return (
    <div className="bg-indigo-50 p-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-8 h-8 ${getCategoryStyles(category.color).bgColor} rounded-lg flex items-center justify-center`}>
              <i className={`fas ${category.icon} ${getCategoryStyles(category.color).textColor} text-base`}></i>
            </div>
            <span className={`${getCategoryStyles(category.color).bgColor} ${getCategoryStyles(category.color).textColor} text-xs font-medium px-2.5 py-0.5 rounded`}>
              {getCategoryDisplayName(category)}
            </span>
            <span className="text-gray-600 text-xs">{t('promptDetail.usageCount' as any)}: {formatCount(viewCount || 0)}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2 break-normal">{title}</h1>
          <p className="text-gray-600 mb-4">{t('promptDetail.createdAt' as any)} {formatDate(createdAt)}</p>
          
          <div className="flex items-center space-x-2">
            {author.avatar ? (
              <Image 
                src={author.avatar} 
                alt={author.nickname || author.username || t('promptDetail.user' as any)}
                width={32}
                height={32}
                className="rounded-full"
                unoptimized={true}
              />
            ) : (
              <div className="rounded-full bg-blue-500 text-white w-8 h-8 flex items-center justify-center text-sm">
                {((author.nickname || author.username || '?').charAt(0).toUpperCase())}
              </div>
            )}
            <span className="text-gray-600">
              {t('promptDetail.createdBy' as any)} &nbsp;
              <span className="text-indigo-600">
                {author.nickname || author.username || author.id}
              </span>
            </span>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0 flex flex-col space-y-2">
          <CopyButton
            textToCopy={content}
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium whitespace-nowrap"
          />
          
          <button 
            onClick={toggleFavorite}
            disabled={loadingFavorite}
            className={`flex items-center justify-center border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition text-sm font-medium whitespace-nowrap ${loadingFavorite ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isFavorite ? <FaStar className="mr-2 text-yellow-500 text-base" /> : <FaRegStar className="mr-2 text-base" />}
            <span>{loadingFavorite ? t('promptDetail.processing' as any) : (isFavorite ? t('promptDetail.removeFromFavorites') : t('promptDetail.addToFavorites'))}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md transition-colors duration-300"
          >
            <FaShareAlt className="mr-1" /> {t('promptDetail.sharePrompt')}
          </button>
        </div>
      </div>
    </div>
  );
} 