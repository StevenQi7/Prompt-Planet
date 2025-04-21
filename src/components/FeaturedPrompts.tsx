import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import CopyButton from './CopyButton';
import { formatCount } from '@/utils/formatUtils';

// 定义FeaturedPrompts组件
interface FeaturedPromptsProps {
  featuredPrompts: any[];
}

export default function FeaturedPrompts({ featuredPrompts }: FeaturedPromptsProps) {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const handleCopy = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  // 获取分类的颜色和图标样式
  const getCategoryColorClasses = (category: any) => {
    if (!category) {
      return {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-100',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600'
      };
    }
    
    // 处理颜色代码或者颜色名称
    let colorName = category.color || 'indigo';
    
    // 如果是颜色代码（以#开头），使用默认颜色
    if (typeof colorName === 'string' && colorName.startsWith('#')) {
      colorName = 'indigo'; // 使用默认颜色
    }
    
    const colorMap: Record<string, { bg: string, text: string, border: string, iconBg: string, iconColor: string }> = {
      'blue': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-100',
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600'
      },
      'green': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-100',
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600'
      },
      // ... 其他颜色定义 ...
      'indigo': {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-100',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600'
      },
    };
    
    return colorMap[colorName] || colorMap.indigo;
  };
  
  // 获取分类图标
  const getCategoryIcon = (category: any) => {
    if (!category?.icon) return 'fa-file-alt';
    return category.icon.startsWith('fa-') ? category.icon : `fa-${category.icon}`;
  };
  
  return (
    <section className="container mx-auto px-4 py-8">
      {/* 标题部分保持不变 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
            <i className="fas fa-star text-indigo-600 text-sm"></i>
          </span>
          {t('promptsAndTags.featuredPrompts')}
        </h2>
        <Link href="/browse" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300 flex items-center">
          {t('promptsAndTags.viewAll')} <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </Link>
      </div>
      
      {/* 修改卡片样式 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPrompts.map(prompt => {
          const categoryColors = getCategoryColorClasses(prompt.category);
          
          return (
            <div key={prompt.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 card-hover">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 ${categoryColors.iconBg} rounded-lg flex items-center justify-center`}>
                      <i className={`fas ${getCategoryIcon(prompt.category)} ${categoryColors.iconColor} text-xs`}></i>
                    </div>
                    <span className={`${categoryColors.bg} ${categoryColors.text} text-xs font-medium ml-2 px-2 py-0.5 rounded`}>
                      {prompt.category.displayName}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <i className="fas fa-eye mr-1"></i>
                    <span>{formatCount(prompt.viewCount)}</span>
                  </div>
                </div>
                
                <Link href={`/prompt-detail/${prompt.id}`} className="block mt-1">
                  <h3 className="text-base font-semibold text-gray-800 mb-2 hover:text-indigo-600 transition-colors duration-300 line-clamp-2 h-[48px] overflow-hidden">{prompt.title}</h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-[40px] overflow-hidden">{prompt.description}</p>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <CopyButton
                    id={prompt.id}
                    content={prompt.content}
                    copiedId={copiedId}
                    handleCopy={handleCopy}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                  />
                  <Link href={`/prompt-detail/${prompt.id}`} className="text-gray-500 hover:text-gray-700 text-sm group flex items-center">
                    {t('promptsAndTags.details')} <i className="fas fa-chevron-right ml-1 transform group-hover:translate-x-1 transition-transform duration-300 text-xs"></i>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
} 