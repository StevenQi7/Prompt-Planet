import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import CopyButton from '@/components/CopyButton';
import { 
  FaEye, 
  FaStar, 
  FaEdit, 
  FaTrashAlt, 
  FaCalendarAlt,
  FaCheckCircle,
  FaTimes,
  FaClock,
  FaChevronRight
} from 'react-icons/fa';
import { formatCount } from '@/utils/formatUtils';

// 添加类型定义
interface Category {
  id: string;
  name: string;
  displayName?: string;
  color?: string;
  icon?: string;
}

interface Tag {
  tag: {
    id: string;
    name: string;
    color: string;
  }
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  usageGuide?: string;
  status?: string;
  viewCount: number;
  favoriteCount: number;
  images?: string[];
  createdAt: string;
  category: Category;
  tags?: Tag[];
  isPublic?: boolean;
}

interface PromptListProps {
  prompts: Prompt[];
  showStatus?: boolean;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  gridView?: boolean;
}

export default function PromptList({ 
  prompts, 
  showStatus = false, 
  showActions = false,
  onEdit,
  onDelete,
  gridView = true
}: PromptListProps) {
  const { t } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // 获取分类图标
  const getCategoryIcon = (category: Category | null | undefined) => {
    if (!category?.icon) return 'fa-file-alt';
    return category.icon.startsWith('fa-') ? category.icon : `fa-${category.icon}`;
  };
  
  // 根据颜色代码或名称获取对应的Tailwind类名
  const getCategoryColorClasses = (category: Category | null | undefined) => {
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
    let colorName = 'indigo';
    
    if (category.color) {
      // 如果是颜色名称
      if (typeof category.color === 'string' && !category.color.startsWith('#')) {
        colorName = category.color;
      }
      // 如果是颜色代码（这里简化处理）
      else {
        // 根据实际情况映射颜色代码到名称
        const colorMap: Record<string, string> = {
          '#3B82F6': 'blue',
          '#10B981': 'green',
          '#8B5CF6': 'purple',
          '#F59E0B': 'yellow',
          '#EF4444': 'red',
          '#14B8A6': 'teal',
          '#EC4899': 'pink',
          '#6366F1': 'indigo'
        };
        colorName = colorMap[category.color] || 'indigo';
      }
    }
    
    // 返回对应颜色的Tailwind类名
    const colorClasses = {
      bg: `bg-${colorName}-100`,
      text: `text-${colorName}-800`,
      border: `border-${colorName}-100`,
      iconBg: `bg-${colorName}-50`,
      iconColor: `text-${colorName}-600`
    };
    
    return colorClasses;
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 获取状态标签样式
  const getStatusLabel = (prompt: Prompt) => {
    if (!prompt.isPublic) {
      return {
        bg: 'bg-gray-100',
        textColor: 'text-gray-800',
        border: 'border-gray-200',
        icon: <FaEye className="mr-1.5 text-gray-600" />,
        label: t('profile.privateStatus') || '私密'
      };
    }
    
    switch (prompt.status) {
      case 'published':
        return {
          bg: 'bg-green-100',
          textColor: 'text-green-800',
          border: 'border-green-200',
          icon: <FaCheckCircle className="mr-1.5 text-green-600" />,
          label: t('profile.publishedStatus')
        };
      case 'rejected':
        return {
          bg: 'bg-red-100',
          textColor: 'text-red-800',
          border: 'border-red-200',
          icon: <FaTimes className="mr-1.5 text-red-600" />,
          label: t('profile.rejectedStatus') || '未通过'
        };
      case 'reviewing':
        return {
          bg: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          border: 'border-yellow-200',
          icon: <FaClock className="mr-1.5 text-yellow-600" />,
          label: t('profile.reviewingStatus')
        };
      default:
        return null;
    }
  };

  if (gridView) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map(prompt => {
          // 获取分类样式
          const categoryColors = getCategoryColorClasses(prompt.category);
          const statusLabel = showStatus ? getStatusLabel(prompt) : null;
          
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
                    {statusLabel && (
                      <span className={`${statusLabel.bg} ${statusLabel.textColor} text-xs font-medium ml-2 px-2.5 py-1 rounded-lg border ${statusLabel.border} flex items-center`}>
                        {statusLabel.icon}
                        {statusLabel.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <FaEye className="mr-1" />
                    <span>{formatCount(prompt.viewCount)}</span>
                  </div>
                </div>
                
                <Link href={`/prompt-detail/${prompt.id}`} className="block mt-1">
                  <h3 className="text-base font-semibold text-gray-800 mb-2 hover:text-indigo-600 transition-colors duration-300 line-clamp-2 h-[48px] overflow-hidden">{prompt.title}</h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-[40px] overflow-hidden">{prompt.description}</p>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <CopyButton
                      content={prompt.content}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                    />
                  </div>
                  <Link href={`/prompt-detail/${prompt.id}`} className="text-gray-500 hover:text-gray-700 text-sm group flex items-center">
                    {t('promptsAndTags.details')} <i className="fas fa-chevron-right ml-1 transform group-hover:translate-x-1 transition-transform duration-300 text-xs"></i>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 列表视图
  return (
    <div className="space-y-4">
      {prompts.map(prompt => {
        const statusLabel = showStatus ? getStatusLabel(prompt) : null;
        
        return (
          <div 
            key={prompt.id} 
            className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${
              !prompt.isPublic ? 'border-gray-500' :
              prompt.status === 'published' ? 'border-green-500' : 
              prompt.status === 'rejected' ? 'border-red-500' : 'border-yellow-500'
            } hover:shadow-md transition-transform transition-shadow duration-300 hover:translate-y-[-5px]`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {statusLabel && (
                    <span className={`${statusLabel.bg} ${statusLabel.textColor} text-xs font-medium px-2.5 py-1 rounded-lg border ${statusLabel.border} flex items-center`}>
                      {statusLabel.icon}
                      {statusLabel.label}
                    </span>
                  )}
                  <span className="bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-lg border border-blue-100">
                    {prompt.category.displayName}
                  </span>
                  <span className="bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                    <FaCalendarAlt className="mr-1.5 text-indigo-400" />{formatDate(prompt.createdAt)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{prompt.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{prompt.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <FaEye className="mr-1.5" /> {formatCount(prompt.viewCount)}
                  </span>
                  <span className="flex items-center">
                    <FaStar className="mr-1.5" /> {formatCount(prompt.favoriteCount)}
                  </span>
                </div>
              </div>
              {showActions && (
                <div className="flex space-x-1">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(prompt.id)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors duration-300 p-2 rounded-lg hover:bg-indigo-50"
                    >
                      <FaEdit />
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      className="text-gray-400 hover:text-red-600 transition-colors duration-300 p-2 rounded-lg hover:bg-red-50"
                      onClick={() => onDelete(prompt.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <div className="text-sm text-gray-600 truncate max-w-lg">
                {prompt.content.length > 100 ? `${prompt.content.substring(0, 100)}...` : prompt.content}
              </div>
              <Link href={`/prompt-detail/${prompt.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium group flex items-center px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all duration-300 border border-transparent hover:border-indigo-100">
                {t('profile.viewDetails')} <FaChevronRight className="ml-1.5 transform group-hover:translate-x-1 transition-transform duration-300 text-xs" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
} 