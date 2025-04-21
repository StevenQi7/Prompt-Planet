import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

// 类型定义
interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
}

interface RelatedPrompt {
  id: string;
  title: string;
  category: Category;
  viewCount: number;
  description: string;
}

interface Tag {
  id: string;
  name: string;
  displayName?: string;
  color?: string;
  slug?: string;
}

interface PromptTag {
  id: string;
  promptId: string;
  tagId: string;
  tag: Tag;
}

interface PromptSidebarProps {
  relatedPrompts: RelatedPrompt[];
  tags: PromptTag[] | Tag[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  favoriteCount: number;
  categoryId: string;
  formatCount: (count: number) => string;
  formatDate: (date: string) => string;
  getCategoryStyles: (colorName: string) => { bgColor: string; textColor: string; borderColor: string };
  getCategoryDisplayName: (category: Category) => string;
}

export default function PromptSidebar({
  relatedPrompts,
  tags,
  createdAt,
  updatedAt,
  viewCount,
  favoriteCount,
  categoryId,
  formatCount,
  formatDate,
  getCategoryStyles,
  getCategoryDisplayName
}: PromptSidebarProps) {
  const { t, language } = useLanguage();

  // 获取无相关提示词的文本
  const noRelatedPromptsText = t('promptDetail.noRelatedPrompts');

  return (
    <div className="space-y-6">
      {/* 相关提示词 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">{t('promptDetail.relatedPrompts')}</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {relatedPrompts.length > 0 ? (
              relatedPrompts.map(relatedPrompt => (
                <Link 
                  href={`/prompt-detail/${relatedPrompt.id}`}
                  key={relatedPrompt.id} 
                  className="block hover:bg-gray-50 p-2 rounded transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`${relatedPrompt.category && getCategoryStyles(relatedPrompt.category.color).bgColor} ${relatedPrompt.category && getCategoryStyles(relatedPrompt.category.color).textColor} text-xs font-medium px-2.5 py-0.5 rounded`}>
                      {relatedPrompt.category && getCategoryDisplayName(relatedPrompt.category)}
                    </span>
                    <span className="text-xs text-gray-600">
                      {t('promptDetail.usageCount' as any)}: {formatCount(relatedPrompt.viewCount || 0)}
                    </span>
                  </div>
                  <h4 className="text-gray-800 font-medium mb-1">{relatedPrompt.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2">{relatedPrompt.description || ''}</p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-2">
                {noRelatedPromptsText}
              </p>
            )}
            
            <div className="text-center pt-2">
              <Link 
                href={`/browse?category=${categoryId}`} 
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center justify-center"
              >
                {t('promptDetail.viewMore' as any)} <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 标签 */}
      {tags && tags.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">{t('browse.tags')}</h3>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tagItem: any, index: number) => {
                let tagName = '';
                let tagId = '';
                
                if (tagItem.tag) {
                  // 处理PromptTag结构
                  tagId = tagItem.tag.id;
                  tagName = language === 'zh' 
                    ? (tagItem.tag.displayName || tagItem.tag.name) 
                    : (tagItem.tag.name || tagItem.tag.displayName);
                } else {
                  // 处理直接的Tag结构
                  tagId = tagItem.id;
                  tagName = language === 'zh' 
                    ? (tagItem.displayName || tagItem.name) 
                    : (tagItem.name || tagItem.displayName);
                }
                
                if (!tagName) {
                  tagName = t('promptDetail.unnamedTag' as any);
                }
                
                return (
                  <Link 
                    href={`/browse?tag=${tagId}`}
                    key={tagItem.id || index} 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full transition"
                  >
                    {tagName}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* 统计信息 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">{t('promptDetail.statistics' as any)}</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('promptDetail.usageCount' as any)}</span>
              <span className="font-medium text-gray-800">{formatCount(viewCount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('promptDetail.favoriteCount' as any)}</span>
              <span className="font-medium text-gray-800">{formatCount(favoriteCount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('promptDetail.creationDate' as any)}</span>
              <span className="font-medium text-gray-800">{formatDate(createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('promptDetail.lastUpdated' as any)}</span>
              <span className="font-medium text-gray-800">{formatDate(updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 