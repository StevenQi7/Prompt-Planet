import React, { useState } from 'react';
import Link from 'next/link';
import { FaEye, FaStar, FaUser } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import CopyButton from '@/components/CopyButton';
import { formatCount } from '@/utils/formatUtils';
import Image from 'next/image';
import { formatIconName, getColorClasses } from '@/utils/styleUtils';

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  viewCount: number;
  category: {
    id: string;
    name: string;
    displayName?: string;
    color?: string;
    icon?: string;
  };
}

interface PromptCardProps {
  prompt: Prompt;
}

const PromptCard = ({ prompt }: PromptCardProps) => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  
  // 获取分类颜色和图标
  const categoryColors = getColorClasses(prompt.category.color || 'indigo');
  const categoryIcon = formatIconName(prompt.category.icon || 'file-alt');
  
  // 获取显示名称
  const categoryDisplayName = language === 'zh' ? prompt.category.displayName : prompt.category.name;
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* 使用分类自己的颜色作为卡片顶部装饰 */}
      <div className={`h-2 w-full ${categoryColors.bg}`}></div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {/* 使用分类自己的图标和颜色 */}
            <div className={`w-8 h-8 rounded-lg ${categoryColors.bg} flex items-center justify-center mr-2`}>
              <i className={`fas ${categoryIcon} ${categoryColors.iconColor || 'text-indigo-500'}`}></i>
            </div>
            <span className={`${categoryColors.bg} ${categoryColors.text} text-base font-medium ml-2 px-2 py-0.5 rounded`}>
              {categoryDisplayName}
            </span>
          </div>
          <div className="flex items-center text-base text-gray-500">
            <i className="fas fa-eye mr-1"></i>
            <span>{formatCount(prompt.viewCount)}</span>
          </div>
        </div>
        
        {/* 其他卡片内容 */}
        <Link href={`/prompt-detail/${prompt.id}`} className="block mt-1">
          <h3 className="text-base font-semibold text-gray-800 mb-2 hover:text-indigo-600 transition-colors duration-300 line-clamp-2 h-[48px] overflow-hidden">
            {prompt.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-[40px] overflow-hidden">{prompt.description}</p>
        
        {/* 卡片底部 */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <CopyButton
              content={prompt.content}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            />
          </div>
          
          <Link href={`/prompt-detail/${prompt.id}`} className="text-gray-500 hover:text-gray-700 text-sm group flex items-center">
            {t('promptsAndTags.details')} 
            <i className="fas fa-chevron-right ml-1 transform group-hover:translate-x-1 transition-transform duration-300 text-xs"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromptCard; 