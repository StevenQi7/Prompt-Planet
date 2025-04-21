'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchGet } from '@/utils/apiUtils';
import { formatIconName, getColorClasses } from '@/utils/styleUtils';
import Link from 'next/link';

// 定义分类接口
interface Category {
  id: string;
  name: string;
  displayName: string;
  slug: string;
  icon: string;
  color: string;
  count: number;
}

// 获取顶部分类组件
const TopCategoryItem = ({ category }: { category: Category }) => {
  const colorClasses = getColorClasses(category.color);
  const iconName = formatIconName(category.icon);
  const { t, language } = useLanguage();
  
  // 根据当前语言选择显示的名称
  const displayText = language === 'zh' ? category.displayName : category.name;
  
  return (
    <Link 
      href={`/browse?category=${category.id}`}
      className={`group flex items-center p-3 rounded-lg transition-all duration-300 ${colorClasses.hover} ${colorClasses.border} border`}
    >
      <span className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${colorClasses.bg}`}>
        <i className={`${iconName} ${colorClasses.iconColor} transition-colors ${colorClasses.iconHover}`}></i>
      </span>
      <div>
        <h3 className={`font-medium ${colorClasses.text}`}>{displayText}</h3>
        <p className="text-gray-500 text-sm">{t('categoryNav.promptCount', { count: category.count })}</p>
      </div>
    </Link>
  );
};

// 分类导航组件
export default function CategoryNav() {
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetchGet<Category[]>('/api/categories');
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          // 移除静态备用数据，直接返回空数组
          setCategories([]);
        }
      } catch (err) {
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // 获取前6个分类用于展示
  const topCategories = categories.slice(0, 12);

  // 绘制分类菜单项
  const renderCategoryMenuItem = (category: Category) => {
    const colorClasses = getColorClasses(category.color);
    const iconName = formatIconName(category.icon);
    
    // 根据当前语言选择显示的名称
    const displayText = language === 'zh' ? category.displayName : category.name;
    
    return (
      <Link 
        key={category.id}
        href={`/browse?category=${category.id}`}
        className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors"
      >
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${colorClasses.bg}`}>
          <i className={`${iconName} ${colorClasses.iconColor} text-sm`}></i>
        </span>
        <div className="flex-grow">
          <span className="text-gray-800">{displayText}</span>
        </div>
        <span className="text-gray-400 text-sm">{category.count}</span>
      </Link>
    );
  };

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="animate-pulse h-8 w-48 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          {/* 使用第一个分类的颜色，如果没有分类则使用默认indigo颜色 */}
          {topCategories.length > 0 ? (
            (() => {
              const colorClasses = getColorClasses(topCategories[0].color || 'indigo');
              return (
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${colorClasses.border}`}>
                  <i className={`fas fa-th-large ${colorClasses.iconColor} text-sm`}></i>
                </span>
              );
            })()
          ) : (
            <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
              <i className="fas fa-th-large text-indigo-600 text-sm"></i>
            </span>
          )}
          {t('categoryNav.title')}
        </h2>
        <div className="relative">
          <button 
            onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
            className={`font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center ${
              topCategories.length > 0 ? (() => {
                const colorClasses = getColorClasses(topCategories[0].color || 'indigo');
                return `${colorClasses.hover.replace('hover:', '')} ${colorClasses.text} ${colorClasses.border}`;
              })() : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100"
            }`}
          >
            {t('categoryNav.allCategories')} <i className="fas fa-chevron-down ml-2 text-xs"></i>
          </button>
          {categoryMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-10 py-2 border border-gray-100 overflow-hidden">
              {categories.map(renderCategoryMenuItem)}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {topCategories.map(category => (
          <TopCategoryItem key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
} 