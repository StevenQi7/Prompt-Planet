'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import CopyButton from '@/components/CopyButton';
import { formatCount } from '@/utils/formatUtils';

// 定义提示词类型接口
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

// 定义标签类型接口
interface Tag {
  id: string;
  name: string;
  displayName?: string;
  display_name?: string; // 添加snake_case版本的属性
  color: string;
  count: number;
}

// 定义分类类型接口
interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  count: number;
}

function BrowseContent() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 视图状态
  const [isGridView, setIsGridView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 数据状态
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 分页和排序
  const [sortOption, setSortOption] = useState<'latest' | 'popular'>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  // 复制状态
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 初始化状态 - 从URL参数获取初始筛选条件
  useEffect(() => {
    if (!searchParams) return;
    
    const categoryParam = searchParams.get('category');
    const tagParam = searchParams.get('tag');
    const searchParam = searchParams.get('q');
    const sortParam = searchParams.get('sort') as 'latest' | 'popular';
    const pageParam = searchParams.get('page');
    
    // 获取多个分类参数
    const categoryParams = searchParams.getAll('categories[]');
    // 获取多个标签参数
    const tagParams = searchParams.getAll('tags[]');
    
    // 设置初始筛选条件 - 兼容旧的单一参数和新的多参数模式
    if (categoryParams.length > 0) {
      setSelectedCategories(categoryParams);
    } else if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
    
    if (tagParams.length > 0) {
      setSelectedTags(tagParams);
    } else if (tagParam) {
      setSelectedTags([tagParam]);
    }
    
    if (searchParam) setSearchKeyword(searchParam);
    if (sortParam) setSortOption(sortParam);
    if (pageParam) setCurrentPage(parseInt(pageParam, 10));
    
    // 加载初始数据
    setIsLoading(true);
    
    Promise.all([
      fetchCategoriesData(),
      fetchTagsData()
    ]).then(() => {
      setIsLoading(false);
    }).catch(err => {
      setError('加载数据失败，请稍后重试');
      setIsLoading(false);
    });
  }, [searchParams, language]);

  // 监听筛选条件变化，加载提示词数据
  useEffect(() => {
    fetchPrompts(1);
  }, [selectedCategories, selectedTags, sortOption, searchKeyword, language]);

  // 获取分类列表
  const fetchCategoriesData = async () => {
    try {
      const response = await fetch('/api/categories?includeCount=true');
      if (!response.ok) {
        throw new Error('获取分类失败');
      }
      const data = await response.json();
      setCategories(data);
      return data;
    } catch (err) {
      // 使用静态数据作为备用
      const backupCategories = [
        { id: 'creative_writing', name: 'creative_writing', displayName: '创意写作', icon: 'fa-paint-brush', color: 'indigo', count: 0 },
        { id: 'coding', name: 'coding', displayName: '代码开发', icon: 'fa-code', color: 'green', count: 0 },
        { id: 'image_generation', name: 'image_generation', displayName: '图像生成', icon: 'fa-image', color: 'purple', count: 0 },
        { id: 'education', name: 'education', displayName: '教育学习', icon: 'fa-graduation-cap', color: 'yellow', count: 0 },
        { id: 'marketing', name: 'marketing', displayName: '市场营销', icon: 'fa-chart-line', color: 'red', count: 0 },
        { id: 'ai_assistant', name: 'ai_assistant', displayName: 'AI助手', icon: 'fa-robot', color: 'blue', count: 0 },
        { id: 'productivity', name: 'productivity', displayName: '生产力工具', icon: 'fa-tasks', color: 'teal', count: 0 },
        { id: 'thinking', name: 'thinking', displayName: '思维方式', icon: 'fa-brain', color: 'cyan', count: 0 },
        { id: 'translation', name: 'translation', displayName: '语言翻译', icon: 'fa-language', color: 'orange', count: 0 },
        { id: 'document', name: 'document', displayName: '文档处理', icon: 'fa-file-alt', color: 'pink', count: 0 },
      ];
      setCategories(backupCategories);
      return backupCategories;
    }
  };

  // 获取标签列表
  const fetchTagsData = async () => {
    try {
      const response = await fetch('/api/tags?popular=true&limit=30');
      if (!response.ok) {
        throw new Error('获取标签失败');
      }
      const data = await response.json();
      setTags(data);
      return data;
    } catch (err) {
      // 标签加载失败不显示错误提示
      return [];
    }
  };

  // 获取提示词数据
  const fetchPrompts = async (page: number) => {
    setIsLoading(true);
    setPrompts([]);
    setError('');
    
    try {
      // 构建查询参数
      let queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', '18');
      queryParams.append('sort', sortOption);
      
      if (searchKeyword) queryParams.append('q', searchKeyword);
      
      // 支持多个分类筛选
      if (selectedCategories.length > 0) {
        selectedCategories.forEach(catId => {
          queryParams.append('categories[]', catId);
        });
      }
      
      // 支持多个标签筛选
      if (selectedTags.length > 0) {
        selectedTags.forEach(tagId => {
          queryParams.append('tags[]', tagId);
        });
      }
      
      // 根据当前国际化设置自动添加语言参数
      queryParams.append('lang', language);
      
      // 确保只查询已发布的提示词
      queryParams.append('status', 'published');
      
      const apiUrl = `/api/prompts?${queryParams.toString()}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('获取提示词失败');
      }
      
      const data = await response.json();
      
      // 处理分页数据
      setPrompts(data.prompts || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.total || 0);
      setHasMore(page < (data.totalPages || 1));
      setCurrentPage(page);
    } catch (err) {
      setError('获取提示词失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理分类选择变化
  const handleCategoryChange = (categoryId: string) => {
    // 检查是否已选择
    if (selectedCategories.includes(categoryId)) {
      // 移除分类
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      // 添加分类
      setSelectedCategories([...selectedCategories, categoryId]);
    }
    
    // 更新URL参数（会触发页面刷新）
    if (searchParams) {
      // 清除旧的分类参数
      const newParams = new URLSearchParams(searchParams.toString());
      
      // 检查是否有单个分类参数
      if (newParams.has('category')) {
        newParams.delete('category');
      }
      
      // 移除现有的分类数组参数
      Array.from(newParams.keys()).forEach(key => {
        if (key === 'categories[]') {
          newParams.delete(key);
        }
      });
      
      // 添加新的分类数组参数
      const newCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId];
      
      newCategories.forEach(catId => {
        newParams.append('categories[]', catId);
      });
      
      // 重置到第一页
      newParams.set('page', '1');
      
      router.push(`/browse?${newParams.toString()}`);
    }
  };

  // 处理标签选择变化
  const handleTagChange = (tagId: string) => {
    // 检查是否已选择
    if (selectedTags.includes(tagId)) {
      // 移除标签
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      // 添加标签
      setSelectedTags([...selectedTags, tagId]);
    }
    
    // 更新URL参数（会触发页面刷新）
    if (searchParams) {
      // 清除旧的标签参数
      const newParams = new URLSearchParams(searchParams.toString());
      
      // 检查是否有单个标签参数
      if (newParams.has('tag')) {
        newParams.delete('tag');
      }
      
      // 移除现有的标签数组参数
      Array.from(newParams.keys()).forEach(key => {
        if (key === 'tags[]') {
          newParams.delete(key);
        }
      });
      
      // 添加新的标签数组参数
      const newTags = selectedTags.includes(tagId)
        ? selectedTags.filter(id => id !== tagId)
        : [...selectedTags, tagId];
      
      newTags.forEach(tagId => {
        newParams.append('tags[]', tagId);
      });
      
      // 重置到第一页
      newParams.set('page', '1');
      
      router.push(`/browse?${newParams.toString()}`);
    }
  };

  // 处理排序方式变化
  const handleSortChange = (sort: 'latest' | 'popular') => {
    setSortOption(sort);
    updateURLParams('sort', sort);
  };

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURLParams('q', searchKeyword || null);
  };

  // 更新URL参数
  const updateURLParams = (key: string, value: string | null) => {
    if (!searchParams) return;
    
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (value === null) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    // 如果是筛选条件变化，需要重置到第一页
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    
    router.push(`/browse?${newParams.toString()}`);
  };

  // 重置所有筛选
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSearchKeyword('');
    setSortOption('popular');
    setCurrentPage(1);
    
    // 更新URL参数
    if (searchParams) {
      const newParams = new URLSearchParams();
      router.push('/browse');
    }
  };

  // 移除单个筛选标签
  const removeTag = (tag: string, type: 'category' | 'tag') => {
    if (type === 'category') {
      setSelectedCategories(selectedCategories.filter(id => id !== tag));
      
      // 更新URL参数
      if (searchParams) {
        const params = new URLSearchParams(searchParams.toString());
        
        // 清除旧的分类参数
        if (params.has('category')) {
          params.delete('category');
        }
        
        // 移除现有的分类数组参数
        Array.from(params.keys()).forEach(key => {
          if (key === 'categories[]') {
            params.delete(key);
          }
        });
        
        // 添加剩余分类
        selectedCategories.filter(id => id !== tag).forEach(catId => {
          params.append('categories[]', catId);
        });
        
        // 重置到第一页
        params.set('page', '1');
        
        router.push(`/browse?${params.toString()}`);
      }
    } else if (type === 'tag') {
      setSelectedTags(selectedTags.filter(id => id !== tag));
      
      // 更新URL参数
      if (searchParams) {
        const params = new URLSearchParams(searchParams.toString());
        
        // 清除旧的标签参数
        if (params.has('tag')) {
          params.delete('tag');
        }
        
        // 移除现有的标签数组参数
        Array.from(params.keys()).forEach(key => {
          if (key === 'tags[]') {
            params.delete(key);
          }
        });
        
        // 添加剩余标签
        selectedTags.filter(id => id !== tag).forEach(tagId => {
          params.append('tags[]', tagId);
        });
        
        // 重置到第一页
        params.set('page', '1');
        
        router.push(`/browse?${params.toString()}`);
      }
    }
  };

  // 清除所有选择的标签
  const clearAllTags = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    
    // 更新URL参数 - 保留搜索关键词和排序方式
    if (searchParams) {
      const newParams = new URLSearchParams();
      
      // 保留关键词和排序方式
      if (searchKeyword) {
        newParams.set('q', searchKeyword);
      }
      
      if (sortOption !== 'popular') {
        newParams.set('sort', sortOption);
      }
      
      // 重置到第一页
      newParams.set('page', '1');
      
      router.push(`/browse?${newParams.toString()}`);
    }
  };

  // 根据分类ID获取分类信息
  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id) || null;
  };

  // 根据标签ID获取标签信息
  const getTagById = (id: string) => {
    return tags.find(tag => tag.id === id) || null;
  };

  // 切换UI语言
  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  // 获取分类图标
  const getCategoryIcon = (category: any) => {
    // 如果图标以fa-开头，直接返回，否则添加fa-前缀
    if (!category?.icon) return 'fa-file-alt';
    return category.icon.startsWith('fa-') ? category.icon : `fa-${category.icon}`;
  };
  
  // 颜色代码转换为Tailwind颜色类名
  const getColorClassFromHex = (colorCode: string) => {
    // 常见的颜色代码映射到Tailwind颜色
    const colorMap: Record<string, string> = {
      '#3B82F6': 'blue', // 蓝色
      '#10B981': 'green', // 绿色
      '#8B5CF6': 'purple', // 紫色
      '#F59E0B': 'yellow', // 黄色
      '#EF4444': 'red', // 红色
      '#14B8A6': 'teal', // 青色
      '#EC4899': 'pink', // 粉色
      '#6366F1': 'indigo', // 靛蓝色
      '#6B7280': 'gray', // 灰色
      '#F97316': 'orange', // 橙色
      '#06B6D4': 'cyan', // 青色
    };
    
    // 如果能找到匹配的颜色名称，返回它
    if (colorCode && colorMap[colorCode]) {
      return colorMap[colorCode];
    }
    
    // 默认返回靛蓝色
    return 'indigo';
  };

  // 安全的颜色映射，用于标签颜色
  const getSafeColorClass = (colorName: string) => {
    if (!colorName) return 'bg-indigo-400';
    
    // 如果是十六进制颜色，转换为Tailwind颜色名称
    if (colorName.startsWith('#')) {
      colorName = getColorClassFromHex(colorName);
    }
    
    const safeColors: Record<string, string> = {
      'indigo': 'bg-indigo-400',
      'green': 'bg-green-400',
      'blue': 'bg-blue-400', 
      'red': 'bg-red-400',
      'yellow': 'bg-yellow-400',
      'purple': 'bg-purple-400',
      'pink': 'bg-pink-400',
      'orange': 'bg-orange-400',
      'teal': 'bg-teal-400',
      'gray': 'bg-gray-400'
    };
    
    return safeColors[colorName] || 'bg-indigo-400';
  };

  // 设置颜色和样式
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
    let colorName = 'indigo';
    
    if (category.color) {
      // 如果是颜色代码（以#开头）
      if (typeof category.color === 'string' && category.color.startsWith('#')) {
        colorName = getColorClassFromHex(category.color);
      } 
      // 如果直接是颜色名称
      else if (typeof category.color === 'string') {
        colorName = category.color;
      }
    }
    
    const colorMap: Record<string, { bg: string, text: string, border: string, iconBg: string, iconColor: string }> = {
      'blue': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-100',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      'green': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-100',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      },
      'purple': {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-100',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      'yellow': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-100',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      },
      'red': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-100',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600'
      },
      'teal': {
        bg: 'bg-teal-100',
        text: 'text-teal-800',
        border: 'border-teal-100',
        iconBg: 'bg-teal-100',
        iconColor: 'text-teal-600'
      },
      'pink': {
        bg: 'bg-pink-100',
        text: 'text-pink-800',
        border: 'border-pink-100',
        iconBg: 'bg-pink-100',
        iconColor: 'text-pink-600'
      },
      'indigo': {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-100',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600'
      },
      'gray': {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-100',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600'
      },
      'orange': {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-100',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600'
      },
      'cyan': {
        bg: 'bg-cyan-100',
        text: 'text-cyan-800',
        border: 'border-cyan-100',
        iconBg: 'bg-cyan-100',
        iconColor: 'text-cyan-600'
      },
    };
    
    return colorMap[colorName] || colorMap.indigo;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 浏览标题部分 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <i className="fas fa-th-large text-indigo-600"></i>
          </div>
          {t('browse.title')}
        </h1>
        <p className="text-gray-600 ml-13 pl-1">{t('browse.subtitle')}</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 筛选侧边栏 */}
        <div className="lg:w-64 flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-100 h-fit">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('filters')}</h2>
            
            {/* 分类筛选 */}
            <div className="text-sm font-medium mb-3">{t('category')}</div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4">
              {Object.values(categories).map(category => (
                <div 
                  key={category.id} 
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label 
                    htmlFor={`category-${category.id}`} 
                    className="flex-1 cursor-pointer"
                  >
                    <div className="ml-2 flex items-center">
                      <i className={`fas ${getCategoryIcon(category)} text-${category.color} mr-1.5`}></i>
                      <span className="text-gray-700 whitespace-nowrap">{language === 'zh' ? (category.displayName || category.name) : category.name}</span>
                      <span className="text-gray-400 text-xs ml-1.5">({category.count})</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            
            {/* 标签筛选 */}
            <div className="text-sm font-medium mb-3">{t('browse.tags')}</div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4">
              {Object.values(tags).map(tag => (
                <div 
                  key={tag.id} 
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label 
                    htmlFor={`tag-${tag.id}`} 
                    className="flex-1 cursor-pointer"
                  >
                    <div className="ml-2 flex items-center">
                      <span className={`w-2 h-2 rounded-full ${getSafeColorClass(tag.color)} mr-1.5`}></span>
                      <span className="text-gray-700 whitespace-nowrap">{language === 'zh' ? (tag.displayName || tag.display_name || tag.name) : tag.name}</span>
                      <span className="text-gray-400 text-xs ml-1.5">({tag.count})</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            
            {/* 排序选项 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <i className="fas fa-sort text-purple-400 mr-2"></i>{t('sort')}
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="sortOption" 
                    className="text-indigo-600 focus:ring-indigo-500" 
                    checked={sortOption === 'popular'}
                    onChange={() => handleSortChange('popular')}
                  />
                  <span className="ml-2 text-gray-700">{t('popular')}</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="sortOption" 
                    className="text-indigo-600 focus:ring-indigo-500" 
                    checked={sortOption === 'latest'}
                    onChange={() => handleSortChange('latest')}
                  />
                  <span className="ml-2 text-gray-700">{t('latest')}</span>
                </label>
              </div>
            </div>
            
            {/* 重置按钮 */}
            <button 
              onClick={resetFilters}
              className="w-full py-2 px-4 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('resetFilters')}
            </button>
          </div>
        </div>
        
        {/* 主内容区 */}
        <div className="flex-1">
          {/* 搜索和视图切换 */}
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden border border-gray-100">
            <div className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">{t('browse.view')}:</span>
                <div className="flex items-center space-x-2">
                  <button 
                    className={`p-2 rounded-lg transition-all duration-300 ${isGridView ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-indigo-600'}`}
                    onClick={() => setIsGridView(true)}
                  >
                    <i className="fas fa-th-large"></i>
                  </button>
                  <button 
                    className={`p-2 rounded-lg transition-all duration-300 ${!isGridView ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-indigo-600'}`}
                    onClick={() => setIsGridView(false)}
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                  {t('browse.totalPrompts')}: {totalItems > 0 ? totalItems : 0}
                </span>
              </div>
            </div>
            
            {/* 已选择的标签 */}
            {(selectedCategories.length > 0 || selectedTags.length > 0) && (
              <div className="border-t border-gray-100 px-4 py-2.5 flex flex-wrap items-center">
                <span className="text-sm text-gray-500 mr-2">{t('browse.filterActive')}:</span>
                
                {selectedCategories.map(catId => {
                  const category = getCategoryById(catId);
                  const categoryColors = category ? getCategoryColorClasses(category) : { 
                    bg: 'bg-indigo-50', 
                    text: 'text-indigo-600', 
                    iconColor: 'text-indigo-500',
                    border: 'border-indigo-100'
                  };
                  return (
                    <span key={catId} className={`inline-flex items-center m-1 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors.bg} ${categoryColors.text} border ${categoryColors.border}`}>
                      {category && (
                        <i className={`fas ${getCategoryIcon(category)} ${categoryColors.iconColor} mr-1.5`}></i>
                      )}
                      <span className="whitespace-nowrap">{category ? (language === 'zh' ? (category.displayName || category.name) : category.name) : catId}</span>
                      <button 
                        onClick={() => removeTag(catId, 'category')}
                        className={`ml-1 ${categoryColors.iconColor} hover:text-indigo-800 focus:outline-none`}
                      >
                        <i className="fas fa-times-circle"></i>
                      </button>
                    </span>
                  );
                })}
                
                {selectedTags.map(tagId => {
                  const tag = getTagById(tagId);
                  const tagColorClass = tag?.color ? `bg-${tag.color}-50 text-${tag.color}-600 border-${tag.color}-100` : 'bg-green-50 text-green-600 border-green-100';
                  const tagTextColor = tag?.color ? `text-${tag.color}-600` : 'text-green-600';
                  return (
                    <span key={tagId} className={`inline-flex items-center m-1 px-2.5 py-1 rounded-full text-xs font-medium ${tagColorClass}`}>
                      {tag && tag.color && (
                        <span className={`w-2 h-2 rounded-full bg-${tag.color}-400 mr-1.5`}></span>
                      )}
                      <span className="text-gray-700 whitespace-nowrap">{tag ? (language === 'zh' ? (tag.displayName || tag.display_name || tag.name) : tag.name) : tagId}</span>
                      <span className="text-gray-400 text-xs ml-1.5">({tag?.count || 0})</span>
                      <button 
                        onClick={() => removeTag(tagId, 'tag')}
                        className={`ml-1 ${tagTextColor} hover:text-indigo-800 focus:outline-none`}
                      >
                        <i className="fas fa-times-circle"></i>
                      </button>
                    </span>
                  );
                })}
                
                <button 
                  onClick={clearAllTags}
                  className="ml-auto text-xs text-gray-500 hover:text-indigo-600 transition-colors duration-300"
                >
                  {t('clearAll')}
                </button>
              </div>
            )}
          </div>
          
          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 border border-red-100">
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {/* 加载状态 */}
          {isLoading && (
            <div className="bg-white rounded-xl p-8 shadow-sm flex justify-center items-center border border-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}
          
          {/* 结果计数 */}
          {!isLoading && !error && (
            <div className="mb-5">
              <p className="text-gray-600">
                {t('browse.resultsFound').replace('{count}', String(totalItems))}
                {totalItems > 0 && (
                  <span className="ml-2 text-sm text-indigo-500">
                    ({t('currentlyShowing').replace('{count}', String(prompts.length))})
                  </span>
                )}
              </p>
            </div>
          )}
          
          {/* 显示提示词 - 网格视图 */}
          {!isLoading && !error && isGridView && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map(prompt => {
                // 从已加载的分类数据中找到对应的分类
                const category = categories.find(cat => cat.id === prompt.category.id) || prompt.category;
                const categoryColors = getCategoryColorClasses(category);
                
                return (
                  <div key={prompt.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 card-hover">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 ${categoryColors.iconBg} rounded-lg flex items-center justify-center`}>
                            <i className={`fas ${getCategoryIcon(category)} ${categoryColors.iconColor} text-xs`}></i>
                          </div>
                          <span className={`${categoryColors.bg} ${categoryColors.text} text-xs font-medium ml-2 px-2 py-0.5 rounded`}>
                            {language === 'zh' ? (category.displayName || category.name) : category.name}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                          <i className="fas fa-eye mr-1 text-indigo-500"></i>
                          <span>{formatCount(prompt.viewCount)}</span>
                        </div>
                      </div>
                      
                      <Link href={`/prompt-detail/${prompt.id}`} className="block mt-1">
                        <h3 className="text-base font-semibold text-gray-800 mb-2 hover:text-indigo-600 transition-colors duration-300 line-clamp-2 h-[48px] overflow-hidden">{prompt.title}</h3>
                      </Link>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-[40px] overflow-hidden">{prompt.description}</p>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <CopyButton
                          content={prompt.content}
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
          )}
          
          {/* 显示提示词 - 列表视图 */}
          {!isLoading && !error && !isGridView && (
            <div className="flex flex-col gap-3">
              {prompts.map(prompt => {
                // 从已加载的分类数据中找到对应的分类
                const category = categories.find(cat => cat.id === prompt.category.id) || prompt.category;
                const categoryColors = getCategoryColorClasses(category);
                
                return (
                  <div key={prompt.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 card-hover">
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-start">
                          <div className={`w-10 h-10 ${categoryColors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <i className={`fas ${getCategoryIcon(category)} ${categoryColors.iconColor}`}></i>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{prompt.title}</h3>
                            <span className={`${categoryColors.bg} ${categoryColors.text} text-xs font-medium px-2 py-0.5 rounded`}>
                              {language === 'zh' ? (category.displayName || category.name) : category.name}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-[40px] overflow-hidden">{prompt.description}</p>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center text-xs text-gray-500">
                                <i className="fas fa-eye mr-1"></i>
                                <span>{formatCount(prompt.viewCount)}</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(prompt.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <CopyButton
                                content={prompt.content}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                              />
                              <Link href={`/prompt-detail/${prompt.id}`} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1 rounded-md text-sm font-medium transition-all duration-300">
                                {t('promptsAndTags.details')}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* 分页控件 */}
          {!isLoading && !error && prompts.length > 0 && (
            <div className="mt-8 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              {/* 显示条目信息 */}
              <div className="text-sm text-gray-600 mb-4 md:mb-0">
                {t('browse.pagination.showing')
                  .replace('{start}', String((currentPage - 1) * 18 + 1))
                  .replace('{end}', String(Math.min(currentPage * 18, (currentPage - 1) * 18 + prompts.length)))
                  .replace('{total}', String(totalItems))}
              </div>
              
              {/* 分页按钮 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchPrompts(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  } transition-colors duration-300`}
                >
                  <i className="fas fa-chevron-left mr-1 text-xs"></i> {t('browse.pagination.prev')}
                </button>
                
                {/* 页码显示 */}
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // 只显示当前页及其前后各一页（如果可能）
                    if (
                      pageNumber === 1 || 
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => fetchPrompts(pageNumber)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                            currentPage === pageNumber
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                          } transition-colors duration-300`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      // 显示省略号
                      return <span key={pageNumber} className="text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => fetchPrompts(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages || isLoading}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${
                    currentPage >= totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  } transition-colors duration-300`}
                >
                  {t('browse.pagination.next')} <i className="fas fa-chevron-right ml-1 text-xs"></i>
                </button>
              </div>
            </div>
          )}
          
          {/* 没有结果显示 */}
          {!isLoading && !error && prompts.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <div className="text-gray-400 text-5xl mb-4">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('browse.noResults')}</h3>
              <p className="text-gray-600 mb-6">{t('searchResults.tryAgain')}</p>
              <button
                onClick={resetFilters}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300"
              >
                {t('browse.allCategories')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Browse() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowseContent />
    </Suspense>
  );
} 