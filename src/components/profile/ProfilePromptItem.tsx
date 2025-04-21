'use client';

import React from 'react';
import Link from 'next/link';
import { FaEye, FaCheckCircle, FaTimes, FaClock, FaEdit, FaTrashAlt, FaChevronRight, FaCopy, FaHeart } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTimeAgo, truncateText, formatCount } from '@/utils/formatUtils';
import { getCategoryIconComponent } from '@/utils/displayUtils';
import { Category, Tag } from '@/types/browse';

// 本地扩展Tag类型以支持嵌套结构
interface ExtendedTag extends Omit<Tag, 'count'> {
  tag?: ExtendedTag;
}

interface Prompt {
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
  category: Omit<Category, 'count'>;
  tags: ExtendedTag[];
  isPublic: boolean;
  reviews?: {
    id: string;
    status: string;
    notes: string;
    createdAt: string;
    reviewer: {
      id: string;
      username: string;
      nickname?: string;
    }
  }[];
}

interface ProfilePromptItemProps {
  prompt: Prompt;
  confirmDeletePrompt: (id: string) => void;
  isAdmin: boolean;
  getCategoryStyles: (colorName: string) => { bgColor: string; textColor: string; borderColor: string; };
  getCategoryDisplayName: (category: Omit<Category, 'count'>) => string;
  getTagDisplayName: (tag: Omit<Tag, 'count'>) => string;
  copyPromptContent: (content: string) => void;
  formatDate: (date: string) => string;
}

export default function ProfilePromptItem({
  prompt,
  confirmDeletePrompt,
  isAdmin,
  getCategoryStyles,
  getCategoryDisplayName,
  getTagDisplayName,
  copyPromptContent,
  formatDate
}: ProfilePromptItemProps) {
  const { t, language } = useLanguage();

  // 获取状态显示信息
  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'published':
        return {
          icon: <FaCheckCircle className="mr-1.5 text-green-600" />,
          text: t('profile.publishedStatus')
        };
      case 'rejected':
        return {
          icon: <FaTimes className="mr-1.5 text-red-600" />,
          text: t('profile.rejectedStatus') || '未通过'
        };
      case 'reviewing':
        return {
          icon: <FaClock className="mr-1.5 text-yellow-600" />,
          text: t('profile.reviewingStatus')
        };
      default:
        return {
          icon: <FaEye className="mr-1.5 text-gray-600" />,
          text: t('profile.privateStatus') || '私密'
        };
    }
  };

  const statusDisplay = getStatusDisplay(prompt.status);
  
  // 获取分类样式
  const categoryStyle = getCategoryStyles(prompt.category?.color || 'gray');
  
  return (
    <div key={prompt.id} className="p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span 
              className="inline-flex items-center mr-3 px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: categoryStyle.bgColor,
                color: categoryStyle.textColor,
                borderWidth: '1px',
                borderColor: categoryStyle.borderColor
              }}
            >
              <i className={getCategoryIconComponent(prompt.category?.icon || 'file-alt', 'mr-1.5')}></i>
              {getCategoryDisplayName(prompt.category)}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              {statusDisplay.icon}
              {statusDisplay.text}
            </div>
            <div className="ml-3 flex items-center text-sm text-gray-500">
              <FaEye className="mr-1 text-gray-400" />
              <span className="text-xs">{formatCount(prompt.viewCount || 0)}</span>
              <FaHeart className="ml-3 mr-1 text-gray-400" />
              <span className="text-xs">{formatCount(prompt.favoriteCount || 0)}</span>
            </div>
            <div className="text-xs text-gray-400 ml-auto md:ml-3">
              {getTimeAgo(prompt.createdAt, language)}
            </div>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-1.5">{prompt.title}</h2>
          
          <p className="text-sm text-gray-500 mb-3">
            {truncateText(prompt.description, 120)}
          </p>
          
          {/* 标签 */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {prompt.tags.map(tagItem => {
                // 获取实际的标签对象
                const tag = tagItem.tag || tagItem;
                // 获取标签颜色样式
                const tagColor = tag.color || 'gray';
                const tagStyle = getCategoryStyles(tagColor);
                
                return (
                  <span 
                    key={tag.id}
                    className="inline-block px-2 py-0.5 rounded-full text-xs"
                    style={{
                      backgroundColor: tagStyle.bgColor,
                      color: tagStyle.textColor,
                      borderWidth: '1px',
                      borderColor: tagStyle.borderColor
                    }}
                  >
                    {getTagDisplayName(tag as Omit<Tag, 'count'>)}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        
        {/* 操作按钮 */}
        <div className="flex items-start space-x-2 mt-3 md:mt-0">
          <button
            onClick={() => copyPromptContent(prompt.content)}
            title={t('profile.copyPrompt')}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-300"
          >
            <FaCopy />
          </button>
          <Link 
            href={`/prompt/edit/${prompt.id}`} 
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
          >
            <FaEdit />
          </Link>
          <button 
            onClick={() => confirmDeletePrompt(prompt.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
      
      {/* 查看详情链接 */}
      <div className="mt-4 flex justify-end">
        <Link
          href={`/prompt-detail/${prompt.id}`}
          className="text-indigo-600 text-sm hover:text-indigo-800 group flex items-center"
        >
          {t('profile.viewDetails')} <FaChevronRight className="ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300 text-xs" />
        </Link>
      </div>
    </div>
  );
} 