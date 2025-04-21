'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Prompt, Category, Tag } from '@/types/browse';
import BrowseHeader from './BrowseHeader';
import BrowseFilter from './BrowseFilter';
import BrowseControlBar from './BrowseControlBar';
import BrowseEmptyState from './BrowseEmptyState';
import BrowsePagination from './BrowsePagination';
import { fetchGet, ApiResponse } from '@/utils/apiUtils';
import PromptList from '../home/PromptList';

// API响应接口
interface CategoriesResponse {
  items: Category[];
}

interface TagsResponse {
  items: Tag[];
}

// 修改为匹配实际API返回格式
interface PromptsResponse {
  prompts: Prompt[];      // API返回的提示词数组
  total: number;          // 总条目数
  totalPages: number;     // 总页数
  page: number;           // 当前页码
  limit: number;          // 每页条目数
}

export default function BrowseContent() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 状态管理
  const [isLoading, setIsLoading] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [tags, setTags] = useState<Record<string, Tag>>({});
  const [isGridView, setIsGridView] = useState(true);
  // 修改为单选分类
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'latest' | 'popular'>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  // 错误状态
  const [apiError, setApiError] = useState<string | null>(null);

  // 从URL参数初始化状态
  useEffect(() => {
    const catParam = searchParams.get('category'); // 修改为单数形式
    const tagParam = searchParams.get('tags');
    const tagArrayParams = searchParams.getAll('tags[]'); // 添加对数组参数格式的支持
    const singleTagParams = searchParams.getAll('tag'); // 兼容旧格式单个标签参数
    const sortParam = searchParams.get('sort') as 'latest' | 'popular';
    const pageParam = searchParams.get('page');
    const viewParam = searchParams.get('view');
    
    if (catParam) setSelectedCategory(catParam);
    
    // 处理所有可能的标签参数格式
    const tagsFromComma = tagParam ? tagParam.split(',') : [];
    const allTags = [...tagsFromComma, ...tagArrayParams, ...singleTagParams];
    
    // 标签ID去重
    if (allTags.length > 0) {
      const uniqueTags = [...new Set(allTags)];
      setSelectedTags(uniqueTags);
    }
    
    if (sortParam && ['latest', 'popular'].includes(sortParam)) setSortOption(sortParam);
    if (pageParam && !isNaN(Number(pageParam))) setCurrentPage(Number(pageParam));
    if (viewParam) setIsGridView(viewParam === 'grid');
    
    fetchCategories();
    fetchTags();
  }, [searchParams, language]);

  // 当筛选条件变化时，获取提示词数据
  useEffect(() => {
    fetchPrompts();
  }, [selectedCategory, selectedTags, sortOption, currentPage, language]);
  
  // 获取分类数据
  const fetchCategories = async () => {
    try {
      const response = await fetchGet<Category[]>(`/api/categories?language=${language}`);
      
      if (response.success && response.data) {
        const categoriesObj: Record<string, Category> = {};
        response.data.forEach((cat: Category) => {
          categoriesObj[cat.id] = cat;
        });
        setCategories(categoriesObj);
      } else {
        console.warn('Categories API returned success=false or no data');
      }
    } catch (error) {
      console.error('获取分类失败:', error);
    }
  };
  
  // 获取标签数据
  const fetchTags = async () => {
    try {
      // 修改API请求，获取更多热门标签，参考首页标签获取方式
      const response = await fetchGet<Tag[]>(`/api/tags?popular=true&limit=50&language=${language}`);
    
      if (response.success && response.data) {
        const tagsObj: Record<string, Tag> = {};
        response.data.forEach((tag: Tag) => {
          tagsObj[tag.id] = tag;
        });
        setTags(tagsObj);
      } else {
        console.warn('Tags API returned success=false or no data');
      }
    } catch (error) {
      console.error('获取标签失败:', error);
    }
  };
  
  // 获取提示词数据
  const fetchPrompts = async () => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      
      // 修改为单选分类
      if (selectedCategory) {
        queryParams.append('category', selectedCategory);
      }
      
      // 标签使用多选，以或的关系查询
      // 将tag参数更改为tags[]，与服务端统一
      if (selectedTags.length > 0) {
        selectedTags.forEach(tagId => {
          queryParams.append('tags[]', tagId);
        });
      }
      
      queryParams.append('sort', sortOption);
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', '18'); // 每页18条数据
      
      // 添加语言参数
      queryParams.append('language', language);
      
      const apiUrl = `/api/prompts?${queryParams.toString()}`;
      
      // 使用fetchGet获取数据
      const response = await fetchGet<PromptsResponse>(apiUrl);
      
      if (response.success && response.data) {
        if (Array.isArray(response.data.prompts)) {
          setPrompts(response.data.prompts);
          
          const totalPagesValue = response.data.totalPages || 1;
          const totalItemsValue = response.data.total || response.data.prompts.length;
          
          setTotalPages(totalPagesValue);
          setTotalItems(totalItemsValue);
        } else {
          setApiError('API返回的数据格式不正确');
          setPrompts([]);
        }
      } else {
        setApiError('API返回失败或没有数据');
        setPrompts([]);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : '未知错误');
      setPrompts([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 更新URL参数
  const updateUrlParams = () => {
    const params = new URLSearchParams();
    
    // 修改为单选分类
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    
    // 修改URL参数中的标签参数格式与API请求一致
    if (selectedTags.length > 0) {
      // 在URL中使用逗号分隔的方式保持简洁
      params.append('tags', selectedTags.join(','));
    }
    
    if (sortOption) {
      params.append('sort', sortOption);
    }
    
    if (currentPage > 1) {
      params.append('page', currentPage.toString());
    }
    
    params.append('view', isGridView ? 'grid' : 'list');
    
    const newUrl = `/browse?${params.toString()}`;
    router.replace(newUrl);
  };
  
  // 当筛选条件变化时，更新URL
  useEffect(() => {
    updateUrlParams();
  }, [selectedCategory, selectedTags, sortOption, currentPage, isGridView]);
  
  // 处理分类变化 - 修改为单选
  const handleCategoryChange = (categoryId: string) => {
    setCurrentPage(1); // 重置页码
    // 如果点击已选中的分类，则取消选择；否则选择新分类
    setSelectedCategory(prev => prev === categoryId ? '' : categoryId);
  };
  
  // 处理标签变化
  const handleTagChange = (tagId: string) => {
    setCurrentPage(1); // 重置页码
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };
  
  // 处理排序变化
  const handleSortChange = (sort: 'latest' | 'popular') => {
    setCurrentPage(1); // 重置页码
    setSortOption(sort);
  };
  
  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 重置所有筛选条件
  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedTags([]);
    setSortOption('popular');
    setCurrentPage(1);
  };
  
  // 处理移除标签
  const handleRemoveTag = (id: string, type: 'category' | 'tag') => {
    if (type === 'category') {
      setSelectedCategory(''); // 清除分类选择
    } else {
      setSelectedTags(prev => prev.filter(tagId => tagId !== id));
    }
    setCurrentPage(1); // 重置页码
  };
  
  // 根据ID获取分类
  const getCategoryById = (id: string): Category | undefined => {
    return categories[id];
  };
  
  // 根据ID获取标签
  const getTagById = (id: string): Tag | undefined => {
    return tags[id];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BrowseHeader 
        totalItems={totalItems}
        isGridView={isGridView}
        onToggleView={setIsGridView}
      />
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧筛选栏 */}
        <BrowseFilter 
          categories={Object.values(categories)}
          tags={Object.values(tags).sort((a, b) => (b.count || 0) - (a.count || 0))}
          selectedCategories={selectedCategory ? [selectedCategory] : []}
          selectedTags={selectedTags}
          sortOption={sortOption}
          onCategoryChange={handleCategoryChange}
          onTagChange={handleTagChange}
          onSortChange={handleSortChange}
          onResetFilters={handleResetFilters}
        />
        
        {/* 右侧内容区 */}
        <div className="flex-1">
          {/* 控制栏 */}
          <BrowseControlBar 
            totalItems={totalItems}
            isGridView={isGridView}
            selectedCategories={selectedCategory ? [selectedCategory] : []}
            selectedTags={selectedTags}
            getCategoryById={getCategoryById}
            getTagById={getTagById}
            onToggleView={setIsGridView}
            onRemoveTag={handleRemoveTag}
            onClearAllTags={handleResetFilters}
          />
          
          {/* 内容区 */}
          {isLoading ? (
            <PromptList 
              prompts={[]}
              isGridView={isGridView}
              isLoading={true}
            />
          ) : prompts && prompts.length > 0 ? (
            <PromptList 
              prompts={prompts}
              isGridView={isGridView}
            />
          ) : (
            <div>
              <p className="text-red-500 mb-4">{apiError && `API错误: ${apiError}`}</p>
              <BrowseEmptyState onResetFilters={handleResetFilters} />
            </div>
          )}
          
          {/* 分页 */}
          {prompts && prompts.length > 0 && (
            <BrowsePagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              isLoading={isLoading}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
} 