'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

// 导入子组件
import {
  SearchHeader,
  SearchFilters,
  SearchResultsList,
  RelatedTags
} from './search';
import Pagination from './common/Pagination';

// 导入工具函数
import { getColorClasses } from '@/utils/styleUtils';
import { getTimeAgo } from '@/utils/formatUtils';

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
  language?: string;
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
  displayName: string;
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

interface SearchResultsProps {
  query: string;
  initialParams?: {
    q?: string;
    category?: string;
    tag?: string;
    lang?: string;
    sort?: string;
    page?: string;
    'tags[]'?: string[];
  };
}

export default function SearchResults({ query, initialParams }: SearchResultsProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 初始化查询与筛选状态
  const q = searchParams ? searchParams.get('q') || '' : '';
  const categoryParam = searchParams ? searchParams.get('category') || '' : '';
  const sortParam = searchParams ? searchParams.get('sort') || 'relevance' : initialParams?.sort || 'relevance';
  const page = parseInt(searchParams ? searchParams.get('page') || '1' : '1', 10);
  const tagIds = searchParams ? searchParams.getAll('tags[]') || [] : [];
  
  // 搜索和筛选状态
  const [searchKeyword, setSearchKeyword] = useState(q || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedSort, setSelectedSort] = useState<'relevance' | 'latest' | 'popular'>(sortParam as 'relevance' | 'latest' | 'popular');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  
  // 数据状态
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<Prompt[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  
  // 分类和标签数据
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedTags, setRelatedTags] = useState<Tag[]>([]);

  // 初始化时获取URL参数
  useEffect(() => {
    if (!searchParams && !initialParams) return;
    
    // 优先使用URL参数，如果没有则使用初始参数
    const newQuery = searchParams ? searchParams.get('q') || '' : initialParams?.q || '';
    const categoryId = searchParams ? searchParams.get('category') || '' : initialParams?.category || '';
    const sort = searchParams ? searchParams.get('sort') || 'relevance' : initialParams?.sort || 'relevance';
    const page = parseInt(
      searchParams ? searchParams.get('page') || '1' : initialParams?.page || '1', 
      10
    );
    
    // 设置当前页面
    setCurrentPage(page);
    
    // 保存搜索条件
    setSearchKeyword(newQuery);
    setSelectedCategory(categoryId);
    setSelectedSort(sort as 'relevance' | 'latest' | 'popular');
    
    // 加载所有分类
    fetchCategories();
    
    // 加载相关标签
    if (newQuery) {
      fetchRelatedTags(newQuery);
    }
    
    // 获取搜索结果 - 不再传递用户选择的语言
    fetchSearchResults(newQuery, categoryId, language, sort as 'relevance' | 'latest' | 'popular', page);
  }, [searchParams, initialParams, language]);
  
  // 获取所有分类
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('获取分类失败');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      // 分类获取失败，不显示错误
    }
  };
  
  // 获取相关标签
  const fetchRelatedTags = async (query: string) => {
    try {
      const response = await fetch(`/api/tags?popular=true&limit=10`);
      if (!response.ok) {
        throw new Error('获取相关标签失败');
      }
      const data = await response.json();
      setRelatedTags(data);
    } catch (error) {
      // 标签获取失败，不显示错误
    }
  };
  
  // 获取搜索结果
  const fetchSearchResults = async (
    query: string, 
    categoryId: string, 
    lang: string, 
    sort: 'relevance' | 'latest' | 'popular', 
    page: number
  ) => {
    // 始终显示加载状态，无论哪一页
    setIsLoading(true);
    setError('');
    
    try {
      const queryParams = new URLSearchParams();
      
      if (query) queryParams.append('q', query);
      if (categoryId) queryParams.append('category', categoryId);
      
      // 自动使用当前国际化语言，不再使用用户选择的语言
      queryParams.append('lang', language);
      
      // 转换排序参数为API接受的格式
      const apiSort = sort === 'relevance' ? 'relevance' : (sort === 'latest' ? 'latest' : 'popular');
      queryParams.append('sort', apiSort);
      
      queryParams.append('page', page.toString());
      queryParams.append('limit', '9'); // 设置每页显示9条结果
      queryParams.append('status', 'published');
      
      const apiUrl = `/api/prompts?${queryParams.toString()}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('搜索失败');
      }
      
      const data = await response.json();
      
      // 处理搜索结果 - 始终替换现有结果，无论页码
      setSearchResults(data.prompts || []);
      setTotalResults(data.total || 0);
      setTotalPages(data.totalPages || 1);
      
    } catch (error) {
      setError('搜索失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理分类变更
  const handleCategoryChange = (categoryId: string) => {
    const newParams = new URLSearchParams(searchParams?.toString() || '');
    
    if (categoryId && categoryId !== t('searchResults.allCategories')) {
      newParams.set('category', categoryId);
    } else {
      newParams.delete('category');
    }
    
    // 重置页码
    newParams.set('page', '1');
    
    router.push(`/search-results?${newParams.toString()}`);
  };
  
  // 处理排序变更
  const handleSortChange = (sort: string) => {
    const newParams = new URLSearchParams(searchParams?.toString() || '');
    
    // 直接使用选项值
    newParams.set('sort', sort);
    
    // 重置页码
    newParams.set('page', '1');
    
    // 更新本地状态
    setSelectedSort(sort as 'relevance' | 'latest' | 'popular');
    
    router.push(`/search-results?${newParams.toString()}`);
  };
  
  // 移除标签筛选
  const removeTagFilter = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId));
    
    const newParams = new URLSearchParams(searchParams?.toString() || '');
    const tags = newParams.getAll('tags[]').filter(id => id !== tagId);
    
    newParams.delete('tags[]');
    tags.forEach(id => newParams.append('tags[]', id));
    newParams.set('page', '1');
    
    router.push(`/search-results?${newParams.toString()}`);
  };
  
  // 清除所有筛选
  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedCategory('');
    
    // 保留搜索词和排序方式
    const newParams = new URLSearchParams();
    if (searchKeyword) newParams.set('q', searchKeyword);
    if (selectedSort) newParams.set('sort', selectedSort);
    newParams.set('page', '1');
    
    router.push(`/search-results?${newParams.toString()}`);
  };
  
  // 处理页码点击
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber === currentPage) return;
    
    const newParams = new URLSearchParams(searchParams?.toString() || '');
    newParams.set('page', pageNumber.toString());
    
    // 更新URL并重定向到新页面
    router.push(`/search-results?${newParams.toString()}`);
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 格式化日期函数
  const formatDate = (dateString: string): string => {
    return getTimeAgo(dateString, language);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-5">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-5 border border-gray-100 hover:shadow-md transition-all duration-300">
        {/* 搜索结果头部 */}
        <SearchHeader 
          searchKeyword={searchKeyword} 
          totalResults={totalResults} 
        />
        
        {/* 筛选组件 */}
        <SearchFilters 
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
          selectedTags={selectedTags}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onTagRemove={removeTagFilter}
          onClearFilters={clearAllFilters}
          getCategoryColorClasses={getColorClasses}
        />
        
        {/* 搜索结果列表 */}
        <div className="p-3">
          <SearchResultsList 
            searchResults={searchResults}
            isLoading={isLoading}
            error={error}
            getTimeAgo={formatDate}
          />
          
          {/* 分页 */}
          {searchResults.length > 0 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalResults}
              itemsPerPage={10}
              onPageChange={handlePageChange}
            />
          )}
          
          {/* 相关标签 */}
          <RelatedTags 
            relatedTags={relatedTags}
            getCategoryColorClasses={getColorClasses}
          />
        </div>
      </div>
    </div>
  );
} 