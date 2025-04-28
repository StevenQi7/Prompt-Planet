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
      className={`group flex flex-col items-center p-4 rounded-xl transition-all duration-300 border ${colorClasses.hover} ${colorClasses.border} 
        hover:shadow-md bg-white hover:-translate-y-1 h-full`}
    >
      <span className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 ${colorClasses.bg} 
        group-hover:scale-110 transition-transform duration-300`}>
        <i className={`${iconName} ${colorClasses.iconColor} text-xl transition-colors ${colorClasses.iconHover}`}></i>
      </span>
      <div className="text-center">
        <h3 className={`font-medium ${colorClasses.text} text-base mb-1`}>{displayText}</h3>
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
        className="flex items-center p-2.5 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 ${colorClasses.bg}`}>
          <i className={`${iconName} ${colorClasses.iconColor} text-sm`}></i>
        </span>
        <div className="flex-grow">
          <span className="text-gray-800 font-medium">{displayText}</span>
        </div>
        <span className={`text-sm ${colorClasses.text} font-medium bg-gray-50 py-1 px-2 rounded-full`}>
          {category.count}
        </span>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="animate-pulse p-4 border border-gray-200 rounded-xl bg-white">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-gray-200 rounded-xl mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-3 md:mb-0">
          {/* 使用第一个分类的颜色，如果没有分类则使用默认indigo颜色 */}
          {topCategories.length > 0 ? (
            (() => {
              const colorClasses = getColorClasses(topCategories[0].color || 'indigo');
              return (
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${colorClasses.bg}`}>
                  <i className={`fas fa-th-large ${colorClasses.iconColor} text-lg`}></i>
                </span>
              );
            })()
          ) : (
            <span className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-3">
              <i className="fas fa-th-large text-indigo-600 text-lg"></i>
            </span>
          )}
          {t('categoryNav.title')}
        </h2>
        <div className="relative">
          <button 
            onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
            className={`font-medium py-2.5 px-5 rounded-lg transition-all duration-300 flex items-center shadow-sm ${
              topCategories.length > 0 ? (() => {
                const colorClasses = getColorClasses(topCategories[0].color || 'indigo');
                return `${colorClasses.hover.replace('hover:', '')} ${colorClasses.text} ${colorClasses.border}`;
              })() : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100"
            }`}
          >
            {t('categoryNav.allCategories')} <i className={`fas fa-chevron-${categoryMenuOpen ? 'up' : 'down'} ml-2 text-xs transition-transform duration-300`}></i>
          </button>
          {categoryMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl z-10 py-3 border border-gray-100 overflow-hidden max-h-[60vh] overflow-y-auto">
              <div className="space-y-1 px-2">
                {categories.map(renderCategoryMenuItem)}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {topCategories.map(category => (
          <TopCategoryItem key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
} 