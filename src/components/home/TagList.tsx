'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { getColorClasses } from '@/utils/styleUtils';

// 标签接口
export interface Tag {
  id: string;
  name: string;
  displayName?: string;
  display_name?: string; // 添加snake_case支持
  color: string;
  count: number;
}

// 单个标签组件
const TagItem = ({ tag }: { tag: Tag }) => {
  const { language } = useLanguage();
  
  // 根据语言环境选择标签名称
  const tagName = language === 'zh' 
    ? (tag.displayName || tag.display_name || tag.name) 
    : tag.name;
    
  const colorClasses = getColorClasses(tag.color || 'indigo');
  
  return (
    <Link 
      href={`/browse?tags=${tag.id}`}
      className={`inline-flex items-center py-1 px-3 rounded-full text-sm ${colorClasses.text} ${colorClasses.border} ${colorClasses.hover} border transition-colors duration-200 whitespace-nowrap mb-2 mr-2`}
    >
      <span className="flex items-center">
        <i className="fas fa-tag text-xs mr-1.5"></i>
        {tagName}
        {tag.count > 0 && (
          <span className="ml-1.5 text-xs text-gray-500">{tag.count}</span>
        )}
      </span>
    </Link>
  );
};

// 标签列表组件
export default function TagList({ 
  tags,
  title,
  isLoading,
  emptyMessage
}: { 
  tags: Tag[],
  title?: string,
  isLoading?: boolean,
  emptyMessage?: string
}) {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="animate-pulse h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex flex-wrap">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="animate-pulse h-8 bg-gray-200 rounded-full mr-2 mb-2 w-20"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (tags.length === 0) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-medium text-lg mb-4 text-gray-800">{title || t('browse.tags')}</h3>
        <p className="text-gray-500 text-sm">
          {emptyMessage || t('browse.noResults')}
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="font-medium text-lg mb-4 text-gray-800">{title || t('browse.tags')}</h3>
      <div className="flex flex-wrap">
        {tags.map(tag => (
          <TagItem key={tag.id} tag={tag} />
        ))}
      </div>
    </div>
  );
} 