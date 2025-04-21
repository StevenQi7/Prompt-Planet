'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  FaThLarge, 
  FaList, 
  FaBookmark, 
  FaEye, 
  FaSearch,
  FaFilter,
  FaChevronLeft, 
  FaChevronRight,
  FaExclamationTriangle,
  FaTimes
} from 'react-icons/fa';
import CopyButton from './CopyButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './UI/LoadingSpinner';
import FavoritePromptCard from './favorites/FavoritePromptCard';
import FavoritePromptList from './favorites/FavoritePromptList';
import Pagination from './common/Pagination';
import { fetchFavorites, unfavoritePrompt } from '@/utils/favoritesApiUtils';
import { fetchCategories } from '@/utils/apiUtils';
import { getSortApiValue } from '@/utils/displayUtils';

// 提示词类型定义
type Tag = {
  id: string;
  name: string;
  display_name?: string;
};

type Prompt = {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryName?: string;
  author: string;
  authorId?: string;
  views: number;
  favoriteDate: string;
  categoryColor: string;
  content: string;
  tags?: Tag[];
};

type Category = {
  id: string;
  name: string;
  displayName: string;
  color: string;
};

export default function Favorites() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [category, setCategory] = useState<string>("");  // 初始为空字符串，代表所有分类
  const [sortOrder, setSortOrder] = useState(t('favorites.sortByNewest'));
  const [activePrompts, setActivePrompts] = useState<Prompt[]>([]);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promptToRemove, setPromptToRemove] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPrompts, setTotalPrompts] = useState(0);
  const [pageSize, setPageSize] = useState(9);

  // 获取收藏列表
  const loadFavorites = async (page: number, size = pageSize) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await fetchFavorites(
        page, 
        size, 
        getSortApiValue(sortOrder, {
          sortByNewest: t('favorites.sortByNewest'),
          sortByOldest: t('favorites.sortByOldest'),
          sortByMostUsed: t('favorites.sortByMostUsed'),
          sortByName: t('favorites.sortByName')
        }), 
        category, 
        viewMode,
        t('favorites.fetchError')
      );
      
      setActivePrompts(data.prompts);
      setAllPrompts(data.prompts);  // 存储原始数据，用于计算总数
      setTotalPrompts(data.total);
      setTotalPages(Math.ceil(data.total / size));
    } catch (err) {
      setError(t('favorites.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  // 获取所有分类
  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const data = await fetchCategories(t('favorites.fetchCategoriesError'));
      setCategories(data);
    } catch (err) {
      setError(t('favorites.fetchCategoriesError'));
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    loadFavorites(1);
    loadCategories();
  }, []);  // 仅在组件挂载时加载一次

  // 监听分类和排序变化，自动获取数据
  useEffect(() => {
    // 使用防抖，避免频繁调用API
    const timer = setTimeout(() => {
      loadFavorites(1);
      setCurrentPage(1); // 重置为第一页
    }, 300);

    return () => clearTimeout(timer);
  }, [category, sortOrder, pageSize, viewMode, language]);

  // 处理搜索过滤
  const filteredPrompts = useMemo(() => {
    if (!searchTerm.trim()) return activePrompts;
    
    return activePrompts.filter(prompt => 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tags?.some(tag => 
        (tag.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tag.display_name && tag.display_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [activePrompts, searchTerm]);

  // 处理分类筛选变化
  const handleCategoryChange = (categoryId: string) => {
    if (category === categoryId) {
      setCategory('');
    } else {
      setCategory(categoryId);
    }
  };

  // 处理排序方式变化
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSortOrder(selected);
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadFavorites(page); // 获取指定页面的数据
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 平滑滚动到顶部
  };

  // 处理每页显示数量变化
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1); // 重置为第一页
    loadFavorites(1, newPageSize); // 使用新的pageSize重新获取数据
  };

  // 重置过滤条件
  const resetFilters = () => {
    setCategory('');
    setSortOrder(t('favorites.sortByNewest'));
    setSearchTerm('');
  };

  // 打开确认对话框
  const openConfirmDialog = (promptId: string) => {
    setPromptToRemove(promptId);
    setShowConfirmModal(true);
  };
  
  // 关闭确认对话框
  const closeConfirmDialog = () => {
    setPromptToRemove(null);
    setShowConfirmModal(false);
  };

  // 处理取消收藏
  const handleUnfavorite = async () => {
    if (!promptToRemove) return;
    
    const success = await unfavoritePrompt(
      promptToRemove,
      () => loadFavorites(currentPage),
      {
        removing: t('favorites.removing'),
        success: t('favorites.removeSuccess'),
        error: t('favorites.removeError')
      }
    );
    
    if (success) {
      closeConfirmDialog();
    }
  };

  // 切换视图模式
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  // 切换筛选面板显示
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  // 计算分页显示信息
  const paginationInfo = {
    currentPage,
    totalPages,
    totalItems: totalPrompts,
    itemsPerPage: pageSize
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主页面标题横幅 */}
      <div className="relative mb-6 md:mb-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium mb-3">
              <FaBookmark className="inline-block mr-1.5 text-yellow-300" /> {t('favorites.tagline')}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{t('favorites.title')}</h1>
            <p className="text-base md:text-xl text-gray-100 mb-4">{t('favorites.subtitle')}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-6">
        {/* 搜索和总计信息 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="p-4 flex flex-wrap gap-3 justify-between items-center">
            <div className="flex items-center">
              <span className="text-gray-700 mr-2 font-medium hidden md:inline-block">
                {t('favorites.totalCountPrefix')} <span className="text-indigo-600">{totalPrompts}</span> {t('favorites.totalCountSuffix')}
              </span>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('common.search')}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <button
                onClick={toggleFilters}
                className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 md:hidden"
              >
                <FaFilter />
              </button>
            </div>
          </div>
        </div>
            
        {/* 筛选和排序选项 - 桌面版固定显示，移动版可折叠 */}
        <div className={`bg-white rounded-xl shadow-sm overflow-hidden mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* 分类筛选 */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 flex-grow">
                <span className="text-gray-600 text-sm whitespace-nowrap">{t('favorites.filterByCategory')}:</span>
                <select 
                  className="w-full md:w-auto text-sm text-gray-700 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={isLoadingCategories}
                >
                  <option value="">{t('favorites.allCategories')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {language === 'zh' ? cat.displayName : cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 排序方式 */}
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="text-gray-600 text-sm whitespace-nowrap">{t('favorites.sortBy')}:</span>
                <select 
                  className="w-full md:w-auto text-sm text-gray-700 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                >
                  <option>{t('favorites.sortByNewest')}</option>
                  <option>{t('favorites.sortByOldest')}</option>
                  <option>{t('favorites.sortByMostUsed')}</option>
                  <option>{t('favorites.sortByName')}</option>
                </select>
              </div>
              
              {/* 每页显示数量 */}
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="text-gray-600 text-sm whitespace-nowrap">{t('favorites.pagination.perPage')}:</span>
                <select 
                  className="w-full md:w-auto text-sm text-gray-700 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  <option value="6">6</option>
                  <option value="9">9</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                </select>
              </div>
              
              {/* 视图模式 */}
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="text-gray-600 text-sm whitespace-nowrap">{t('favorites.viewMode')}:</span>
                <div className="flex gap-2">
                  <button 
                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'text-indigo-600 hover:text-indigo-800 bg-indigo-100' : 'text-gray-400 hover:text-indigo-600'}`}
                    onClick={() => setViewMode('grid')}
                    title={t('favorites.gridView')}
                  >
                    <FaThLarge />
                  </button>
                  <button 
                    className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'text-indigo-600 hover:text-indigo-800 bg-indigo-100' : 'text-gray-400 hover:text-indigo-600'}`}
                    onClick={() => setViewMode('list')}
                    title={t('favorites.listView')}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>
            
            {/* 重置筛选按钮 */}
            <button
              onClick={resetFilters}
              className="text-indigo-600 text-sm hover:text-indigo-800 underline mt-2 md:mt-0 w-full md:w-auto text-center"
            >
              {t('favorites.resetFilters')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-lg text-red-700 text-center">
            {error}
          </div>
        ) : (
          <>
            {filteredPrompts.length === 0 && activePrompts.length > 0 ? (
              <div className="bg-gray-50 p-8 rounded-xl text-center">
                <FaBookmark className="mx-auto text-gray-400 text-4xl mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">{t('favorites.noFilteredResultsTitle')}</h3>
                <p className="text-gray-600 mb-6">{t('favorites.noFilteredResultsDescription')}</p>
                <button 
                  onClick={resetFilters}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition duration-300"
                >
                  {t('favorites.resetFilters')}
                </button>
              </div>
            ) : activePrompts.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-xl text-center">
                <FaBookmark className="mx-auto text-gray-400 text-4xl mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">{t('favorites.noFavoritesTitle')}</h3>
                <p className="text-gray-600 mb-6">{t('favorites.noFavoritesDescription')}</p>
                <Link href="/browse" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition duration-300">
                  {t('favorites.browseTips')}
                </Link>
              </div>
            ) : (
              <>
                {/* 收藏提示词展示区 */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrompts.map(prompt => (
                      <FavoritePromptCard 
                        key={prompt.id} 
                        prompt={prompt} 
                        onRemoveFavorite={openConfirmDialog} 
                      />
                    ))}
                  </div>
                ) : (
                  <FavoritePromptList 
                    prompts={filteredPrompts} 
                    onRemoveFavorite={openConfirmDialog} 
                  />
                )}
                
                {/* 分页控件 */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={paginationInfo.currentPage}
                      totalPages={paginationInfo.totalPages}
                      onPageChange={handlePageChange}
                      totalItems={paginationInfo.totalItems}
                      itemsPerPage={paginationInfo.itemsPerPage}
                      className="mt-6"
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      
      {/* 确认删除对话框 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-auto animate-fade-in">
            <div className="flex items-center justify-center mb-4 text-yellow-400">
              <FaExclamationTriangle size={48} />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2 text-gray-800">{t('favorites.confirmRemoveTitle')}</h3>
            <p className="text-gray-600 text-center mb-6">{t('favorites.confirmRemoveMessage')}</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={closeConfirmDialog}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                {t('common.cancel')}
              </button>
              <button 
                onClick={handleUnfavorite}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                {t('favorites.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 