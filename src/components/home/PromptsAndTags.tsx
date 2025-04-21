'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchGet } from '@/utils/apiUtils';
import PromptList, { Prompt } from './PromptList';
import TagList, { Tag } from './TagList';
import Link from 'next/link';

/**
 * 首页提示词和标签展示组件
 */
export default function PromptsAndTags() {
  // 组件状态
  const [activeTab, setActiveTab] = useState('hot'); // 热门/最新选项卡状态
  const [isGridView, setIsGridView] = useState(true); // 网格/列表视图切换状态
  const { t, language } = useLanguage();
  
  // 数据状态
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // 是否有更多数据可加载

  // 获取提示词数据
  useEffect(() => {
    const fetchPrompts = async () => {
      setIsLoading(true);
      setError('');
      setCurrentPage(1); // 重置页码
      setHasMore(true); // 重置是否有更多数据
      
      try {
        // 根据当前选项卡决定API参数，并添加language参数
        const apiUrl = activeTab === 'hot' 
          ? `/api/prompts?featured=true&limit=18&page=1&status=published&lang=${language}` 
          : `/api/prompts?latest=true&limit=18&page=1&status=published&lang=${language}`;
        
        const response = await fetchGet<any>(apiUrl);
        
        if (!response.success) {
          throw new Error(response.error || '获取提示词失败');
        }
        
        const data = response.data;
        
        // 提取提示词数据
        let promptData: Prompt[] = [];
        let totalPages = 1;
        
        if (Array.isArray(data)) {
          // 如果直接返回数组
          promptData = data;
          setHasMore(promptData.length >= 18);
        } else if (typeof data === 'object') {
          // 如果返回对象
          if (data.prompts && Array.isArray(data.prompts)) {
            promptData = data.prompts;
          }
          
          if (typeof data.totalPages === 'number') {
            totalPages = data.totalPages;
            setHasMore(1 < totalPages);
          } else if (typeof data.total === 'number' && typeof data.limit === 'number') {
            totalPages = Math.ceil(data.total / data.limit);
            setHasMore(1 < totalPages);
          } else {
            setHasMore(promptData.length >= 18);
          }
        }
        
        // 设置提示词数据
        setPrompts(promptData);
      } catch (err) {
        setError('获取提示词失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrompts();
  }, [activeTab, language]);
  
  // 获取热门标签
  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const response = await fetchGet<Tag[]>('/api/tags?popular=true&limit=15');
        if (response.success && response.data) {
          setPopularTags(response.data);
        }
      } catch (err) {
        // 标签加载失败不显示错误提示
      }
    };
    
    fetchPopularTags();
  }, []);
  
  // 处理加载更多
  const handleLoadMore = async () => {
    if (loadingMore) return;
    
    const nextPage = currentPage + 1;
    
    setLoadingMore(true);
    try {
      // 根据当前选项卡决定API参数，并添加language参数
      const apiUrl = activeTab === 'hot' 
        ? `/api/prompts?featured=true&limit=18&page=${nextPage}&status=published&lang=${language}` 
        : `/api/prompts?latest=true&limit=18&page=${nextPage}&status=published&lang=${language}`;
      
      const response = await fetchGet<any>(apiUrl);
      
      if (!response.success) {
        throw new Error(response.error || '获取更多提示词失败');
      }
      
      const data = response.data;
      
      // 提取新的提示词数据
      let newItems: Prompt[] = [];
      let totalPages = 1;
      
      if (Array.isArray(data)) {
        // 如果直接返回数组
        newItems = data;
        setHasMore(newItems.length >= 18);
      } else if (typeof data === 'object') {
        // 如果返回对象
        if (data.prompts && Array.isArray(data.prompts)) {
          newItems = data.prompts;
        }
        
        if (typeof data.totalPages === 'number') {
          totalPages = data.totalPages;
          setHasMore(nextPage < totalPages);
        } else if (typeof data.total === 'number' && typeof data.limit === 'number') {
          totalPages = Math.ceil(data.total / data.limit);
          setHasMore(nextPage < totalPages);
        } else {
          setHasMore(newItems.length >= 18);
        }
      }
      
      if (newItems.length > 0) {
        // 更新提示词列表（追加新数据）
        setPrompts(prevPrompts => [...prevPrompts, ...newItems]);
        
        // 更新当前页码
        setCurrentPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      // 加载更多失败处理
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 提示词部分 */}
        <div className="lg:col-span-3">
          {/* 特色提示词标题 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-2">
                <i className="fas fa-fire text-red-600 text-sm"></i>
              </span>
              {t('promptsAndTags.featuredPrompts')}
            </h2>
            <Link 
              href="/browse?featured=true" 
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              {t('promptsAndTags.viewAll')} <i className="fas fa-chevron-right ml-1 text-xs"></i>
            </Link>
          </div>
          
          {/* 控制栏 */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex space-x-2 mb-2 sm:mb-0">
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'hot'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab('hot')}
                >
                  <i className="fas fa-fire-alt mr-2"></i> {t('popular')}
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'new'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveTab('new')}
                >
                  <i className="fas fa-clock mr-2"></i> {t('latest')}
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    isGridView
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setIsGridView(true)}
                  aria-label={t('browse.view')}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    !isGridView
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setIsGridView(false)}
                  aria-label={t('browse.view')}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
          
          {/* 提示词列表 */}
          <PromptList
            prompts={prompts}
            isGridView={isGridView}
            isLoading={isLoading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </div>
        
        {/* 标签云和相关内容 */}
        <div className="space-y-6">
          {/* 热门标签 */}
          <TagList
            tags={popularTags}
            title={t('browse.tags')}
            isLoading={isLoading}
          />
          
          {/* 其他内容部分，如统计数据、广告等 */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-5 border border-indigo-200">
            <h3 className="font-medium text-indigo-900 mb-2">{t('homePage.createYourPrompt')}</h3>
            <p className="text-indigo-800 text-sm mb-4">
              {t('homePage.shareCreativity')}
            </p>
            <a 
              href="/create-prompt" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <i className="fas fa-plus-circle mr-1.5"></i> {t('homePage.createBtnText')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 