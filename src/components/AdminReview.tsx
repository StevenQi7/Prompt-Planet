'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaClipboardCheck, FaCheckCircle, FaTimesCircle, FaFilter, FaSyncAlt, FaAlignLeft, FaTags, FaImage, FaCommentAlt, FaCheck, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './UI/LoadingSpinner';
import Pagination from './common/Pagination';
import StatsSection from './admin/StatsSection';
import ReviewNav from './admin/ReviewNav';
import ReviewFilter from './admin/ReviewFilter';
import PromptCard from './admin/PromptCard';
import { 
  AdminStats, 
  Category, 
  fetchAdminStats, 
  fetchPrompts, 
  fetchCategories, 
  reviewPrompt,
  FetchPromptsOptions,
  Prompt as AdminPrompt,
} from '@/utils/adminUtils';
import { TFunction } from '@/types/i18n';

// 提示词类型定义
interface Tag {
  tag: {
    id: string;
    name: string;
    displayName?: string;
    color?: string;
  }
}

interface Author {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
}

interface Review {
  id: string;
  status: string;
  notes: string;
  createdAt: string;
  reviewer: {
    id: string;
    username: string;
    nickname?: string;
  }
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  status: string;
  isPublic: boolean;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
  images: string[];
  author: Author;
  category: Category;
  tags: Tag[];
  reviews?: Review[];
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export default function AdminReview() {
  const { t } = useLanguage();
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  
  // 常用翻译键的默认文本
  const translations = {
    'admin.reviewTitle': t('admin.reviewTitle') || '提示词审核',
    'admin.filter': t('admin.filter') || '筛选',
    'admin.refresh': t('admin.refresh') || '刷新',
    'admin.category': t('admin.category') || '分类',
    'admin.submissionTime': t('admin.submissionTime') || '提交时间',
    'admin.allTime': t('admin.allTime') || '所有时间',
    'admin.today': t('admin.today') || '今天',
    'admin.thisWeek': t('admin.thisWeek') || '本周',
    'admin.thisMonth': t('admin.thisMonth') || '本月',
    'admin.applyFilter': t('admin.applyFilter') || '应用筛选',
    'admin.pending': t('admin.pending') || '待审核',
    'admin.all': t('admin.all') || '全部',
    'admin.approved': t('admin.approved') || '已通过',
    'admin.rejected': t('admin.rejected') || '已拒绝',
    'admin.noPromptsToReview': t('admin.noPromptsToReview') || '没有待审核的提示词',
    'admin.approve': t('admin.approve') || '通过',
    'admin.reject': t('admin.reject') || '拒绝',
    'admin.promptContent': t('admin.promptContent') || '提示词内容',
    'admin.tags': t('admin.tags') || '标签',
    'admin.previewImages': t('admin.previewImages') || '预览图片',
    'admin.reviewNotes': t('admin.reviewNotes') || '审核备注',
    'admin.reviewNotesPlaceholder': t('admin.reviewNotesPlaceholder') || '输入审核备注...',
    'admin.processing': t('admin.processing') || '处理中...',
    'admin.approveSuccess': t('admin.approveSuccess') || '审核通过成功',
    'admin.approveError': t('admin.approveError') || '审核通过失败',
    'admin.rejectSuccess': t('admin.rejectSuccess') || '审核拒绝成功',
    'admin.rejectError': t('admin.rejectError') || '审核拒绝失败',
    'admin.reviewedBy': t('admin.reviewedBy') || '审核人',
    'admin.submittedAt': t('admin.submittedAt') || '提交于',
    'admin.previous': t('admin.previous') || '上一页',
    'admin.next': t('admin.next') || '下一页',
    'browse.allCategories': t('browse.allCategories') || '所有分类',
    'admin.unknownReviewer': t('admin.unknownReviewer') || '未知审核人'
  };
  
  // 使用t函数，如果翻译不存在则使用默认文本
  const getT = (key: string) => {
    // @ts-ignore
    return translations[key] || key;
  };
  
  // 状态管理
  const [activeTab, setActiveTab] = useState<string>('reviewing');
  const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(false);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [prompts, setPrompts] = useState<AdminPrompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState<AdminStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  
  // 认证状态
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPrompts, setTotalPrompts] = useState<number>(0);
  const promptsPerPage = 5;
  
  // 筛选相关状态
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [timeFilter, setTimeFilter] = useState<string>('all');
  
  // 使用 useRef 跟踪是否已经加载过数据
  const dataInitialized = useRef<boolean>(false);
  const categoriesLoaded = useRef<boolean>(false);
  const statsLoaded = useRef<boolean>(false);
  const initialPromptsFetched = useRef<boolean>(false);
  
  // 使用 useRef 跟踪网络请求，避免重复请求
  const pendingRequests = useRef<{[key: string]: AbortController}>({});
  
  // 创建一个包装过的t函数，使其类型为TFunction
  const tFunction: TFunction = (key: any, params?: any) => t(key, params);
  
  // 用户未登录或不是管理员时重定向
  useEffect(() => {
    // 如果用户认证状态尚未加载完成，不执行任何操作
    if (isAuthenticated === null) {
      return;
    }
    
    // 将认证检查状态设为已完成
    setAuthChecked(true);
    
    // 只有在明确知道用户未登录或不是管理员时才重定向
    if (isAuthenticated === false || (isAuthenticated === true && isAdmin === false)) {
      router.push('/login');
    }
  }, [isAdmin, isAuthenticated, router]);
  
  // 加载分类数据 - 只在通过认证检查且是管理员后执行
  useEffect(() => {
    // 只有当认证检查完成且用户已登录且是管理员时才加载数据
    if (authChecked && isAuthenticated === true && isAdmin === true && !categoriesLoaded.current) {
      const controller = new AbortController();
      pendingRequests.current.categories = controller;
      
      fetchCategories(controller.signal)
        .then(data => {
          setCategories(data);
          categoriesLoaded.current = true;
        })
        .catch(error => {
          if (error.name !== 'AbortError') {
            console.error('获取分类失败:', error);
          }
        })
        .finally(() => {
          delete pendingRequests.current.categories;
        });
        
      return () => {
        controller.abort();
      };
    }
  }, [authChecked, isAuthenticated, isAdmin]);
  
  // 加载统计数据 - 只在通过认证检查且是管理员后执行
  useEffect(() => {
    // 只有当认证检查完成且用户已登录且是管理员时才加载数据
    if (authChecked && isAuthenticated === true && isAdmin === true && !statsLoaded.current) {
      const controller = new AbortController();
      pendingRequests.current.stats = controller;
      
      fetchAdminStats(controller.signal)
        .then(data => {
          setStats(data);
          statsLoaded.current = true;
        })
        .catch(error => {
          if (error.name !== 'AbortError') {
            console.error('获取统计数据失败:', error);
          }
        })
        .finally(() => {
          delete pendingRequests.current.stats;
        });
        
      return () => {
        controller.abort();
      };
    }
  }, [authChecked, isAuthenticated, isAdmin]);
  
  // 初始获取提示词数据 - 只在通过认证检查且是管理员后执行
  useEffect(() => {
    // 只有当认证检查完成且用户已登录且是管理员时才加载数据
    if (authChecked && isAuthenticated === true && isAdmin === true && !initialPromptsFetched.current) {
      setIsLoading(true);
      
      const controller = new AbortController();
      pendingRequests.current.initialPrompts = controller;
      
      const options: FetchPromptsOptions = {
        status: 'reviewing',
        page: 1,
        limit: promptsPerPage
      };
      
      fetchPrompts(options, controller.signal)
        .then(data => {
          setPrompts(data.prompts);
          setTotalPrompts(data.total);
          setTotalPages(Math.ceil(data.total / promptsPerPage));
          initialPromptsFetched.current = true;
          dataInitialized.current = true;
        })
        .catch(error => {
          if (error.name !== 'AbortError') {
            console.error('获取提示词失败:', error);
            setError('获取提示词失败，请稍后重试');
          }
        })
        .finally(() => {
          setIsLoading(false);
          delete pendingRequests.current.initialPrompts;
        });
      
      return () => {
        controller.abort();
      };
    }
  }, [authChecked, isAuthenticated, isAdmin, promptsPerPage]);
  
  // 监听筛选条件变化加载提示词数据
  useEffect(() => {
    // 只有在认证检查完成、明确知道用户已登录且是管理员、初始化完成后才加载
    if (authChecked && isAuthenticated === true && isAdmin === true && dataInitialized.current && 
        (activeTab !== 'reviewing' || currentPage !== 1 || categoryId !== undefined || timeFilter !== 'all')) {
      
      const options: FetchPromptsOptions = {
        status: activeTab,
        page: currentPage,
        limit: promptsPerPage,
        categoryId,
        timeFilter
      };
      
      loadPrompts(options);
    }
  }, [authChecked, isAuthenticated, isAdmin, activeTab, currentPage, categoryId, timeFilter]);
  
  // 加载提示词数据
  const loadPrompts = async (options: FetchPromptsOptions) => {
    try {
      // 如果已经有相同的请求在进行中，取消它
      if (pendingRequests.current.prompts) {
        pendingRequests.current.prompts.abort();
      }
      
      setIsLoading(true);
      setError('');
      
      const controller = new AbortController();
      pendingRequests.current.prompts = controller;
      
      const data = await fetchPrompts(options, controller.signal);
      
      // 更新提示词列表
      setPrompts(data.prompts);
      setTotalPrompts(data.total);
      setTotalPages(Math.ceil(data.total / promptsPerPage));
    } catch (error: any) {
      // 忽略中止的请求错误
      if (error.name !== 'AbortError') {
        console.error('获取提示词失败:', error);
        setError('获取提示词失败，请稍后重试');
      }
    } finally {
      setIsLoading(false);
      delete pendingRequests.current.prompts;
    }
  };
  
  // 处理审核备注更改
  const handleNotesChange = (promptId: string, notes: string) => {
    setReviewNotes(prev => ({
      ...prev,
      [promptId]: notes
    }));
  };
  
  // 审核通过
  const handleApprove = async (promptId: string) => {
    try {
      await reviewPrompt(promptId, 'published', reviewNotes[promptId] || '', tFunction);
      await refreshAfterReview();
    } catch (error) {
      console.error('审核失败:', error);
    }
  };
  
  // 审核拒绝
  const handleReject = async (promptId: string) => {
    try {
      await reviewPrompt(promptId, 'rejected', reviewNotes[promptId] || '', tFunction);
      await refreshAfterReview();
    } catch (error) {
      console.error('审核失败:', error);
    }
  };
  
  // 页面变更
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // 分类变更
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategoryId(value === getT('browse.allCategories') ? undefined : value);
  };
  
  // 时间筛选变更
  const handleTimeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFilter(e.target.value);
  };
  
  // 应用筛选
  const applyFilters = () => {
    setCurrentPage(1);
    setFilterMenuOpen(false);
    
    const options: FetchPromptsOptions = {
      status: activeTab,
      page: 1,
      limit: promptsPerPage,
      categoryId,
      timeFilter
    };
    
    loadPrompts(options);
  };
  
  // 刷新
  const handleRefresh = () => {
    // 并行获取提示词和统计数据
    Promise.all([
      loadPrompts({
        status: activeTab,
        page: currentPage,
        limit: promptsPerPage,
        categoryId,
        timeFilter
      }),
      refreshStats()
    ]).catch(error => {
      console.error('刷新数据失败:', error);
    });
  };
  
  // 刷新统计数据
  const refreshStats = async () => {
    try {
      // 如果已经有相同的请求在进行中，取消它
      if (pendingRequests.current.stats) {
        pendingRequests.current.stats.abort();
      }
      
      const controller = new AbortController();
      pendingRequests.current.stats = controller;
      
      const data = await fetchAdminStats(controller.signal);
      setStats(data);
    } catch (error: any) {
      // 忽略中止的请求错误
      if (error.name !== 'AbortError') {
        console.error('获取统计数据失败:', error);
      }
    } finally {
      delete pendingRequests.current.stats;
    }
  };
  
  // 审核操作后刷新
  const refreshAfterReview = async () => {
    try {
      // 并行获取提示词和统计数据
      await Promise.all([
        loadPrompts({
          status: activeTab,
          page: currentPage,
          limit: promptsPerPage,
          categoryId,
          timeFilter
        }),
        refreshStats()
      ]);
    } catch (error) {
      console.error('刷新数据失败:', error);
    }
  };

  // 显示认证检查中的加载状态
  if (isAuthenticated === null || (isAuthenticated === true && isAdmin === null)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
          <p className="ml-4 text-lg text-gray-600">正在验证身份...</p>
        </div>
      </div>
    );
  }

  // 如果用户未登录或不是管理员，显示权限错误信息（这是一个备用显示，通常会被重定向逻辑处理）
  if (isAuthenticated === false || (isAuthenticated === true && isAdmin === false)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100 text-center">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-medium">权限不足</p>
            <p className="mt-2">您需要管理员权限才能访问此页面。</p>
          </div>
          <button 
            onClick={() => router.push('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
          >
            返回登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 标题和操作区 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <FaClipboardCheck className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{getT('admin.reviewTitle')}</h1>
        </div>
        <div className="flex space-x-3">
          {/* 筛选器 */}
          <ReviewFilter 
            isOpen={filterMenuOpen}
            onToggle={() => setFilterMenuOpen(!filterMenuOpen)}
            categories={categories}
            selectedCategoryId={categoryId}
            timeFilter={timeFilter}
            onCategoryChange={handleCategoryChange}
            onTimeFilterChange={handleTimeFilterChange}
            onApplyFilter={applyFilters}
            getT={getT}
          />
          
          {/* 刷新按钮 */}
          <button 
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
            onClick={handleRefresh}
          >
            <FaSyncAlt className="mr-2 inline" />{getT('admin.refresh')}
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <StatsSection stats={stats} getT={getT} />

      {/* 审核导航 */}
      <ReviewNav activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} getT={getT} />

      {/* 加载状态 */}
      {isLoading && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex justify-center">
          <LoadingSpinner size="md" />
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100 text-red-600 mb-4">
          {error}
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && !error && prompts.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-gray-400 mb-4">
            <FaClipboardCheck className="mx-auto text-4xl mb-2" />
            <p className="text-lg font-medium">{getT('admin.noPromptsToReview')}</p>
          </div>
        </div>
      )}

      {/* 提示词列表 */}
      {!isLoading && !error && prompts.length > 0 && (
        <div className="space-y-4">
          {prompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              reviewNotes={reviewNotes[prompt.id] || ''}
              onNotesChange={(notes) => handleNotesChange(prompt.id, notes)}
              onApprove={() => handleApprove(prompt.id)}
              onReject={() => handleReject(prompt.id)}
              getT={getT}
            />
          ))}
        </div>
      )}

      {/* 分页 */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalPrompts}
            itemsPerPage={promptsPerPage}
          />
        </div>
      )}
    </div>
  );
} 