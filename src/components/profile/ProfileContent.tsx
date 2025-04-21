'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import ProfilePromptItem from './ProfilePromptItem';
import ProfilePagination from './ProfilePagination';
import DeleteConfirmModal from './DeleteConfirmModal';
import { getCategoryDisplayName, getTagDisplayName, getCategoryStyles, getCategoryIconComponent } from '@/utils/displayUtils';
import { truncateText, formatCount, copyPromptContent, formatDate } from '@/utils/formatUtils';
import { Category, Tag } from '@/types/browse';

// 本地扩展Tag类型以支持嵌套结构
interface ExtendedTag extends Omit<Tag, 'count'> {
  tag?: ExtendedTag;
}

// 类型定义
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
  category: Omit<Category, 'count'>;
  tags: ExtendedTag[];
  isPublic: boolean;
  reviews?: {
    id: string;
    status: string;
    notes: string;
    createdAt: string;
    reviewer: {
      id: string;
      username: string;
      nickname?: string;
    }
  }[];
}

interface PromptCounts {
  prompts: number;
  publishedPrompts: number;
  reviewingPrompts: number;
  rejectedPrompts: number;
  privatePrompts: number;
  favorites: number;
}

export default function ProfileContent() {
  const { t, language } = useLanguage();
  const { user, loading: userLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // 状态管理
  const [activeTab, setActiveTab] = useState('all');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);
  const [promptCounts, setPromptCounts] = useState<PromptCounts>({
    prompts: 0,
    publishedPrompts: 0,
    reviewingPrompts: 0,
    rejectedPrompts: 0,
    privatePrompts: 0,
    favorites: 0
  });
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPrompts, setTotalPrompts] = useState(0);
  const promptsPerPage = 5;

  // 判断用户是否管理员
  const isAdmin = (user && 'role' in user) 
    ? (user as any).role === 'admin' 
    : user && 'user_metadata' in (user as any) 
      ? ((user as any).user_metadata?.role === 'admin')
      : false;

  // 用户未登录时重定向到登录页面
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.replace('/login?redirect=/profile');
      return;
    }

    // 如果用户已登录，则加载数据
    if (isAuthenticated && user) {
      refreshData();
    }
  }, [userLoading, isAuthenticated, user, router]);

  // 获取用户提示词
  const fetchUserPrompts = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`/api/user/prompts?page=${currentPage}&limit=${promptsPerPage}&status=${activeTab}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '获取提示词失败');
      }
      
      const data = await response.json();
      
      // 确保数值字段为数字类型
      const processedPrompts = data.prompts.map((prompt: any) => {
        return {
          ...prompt,
          viewCount: parseInt(prompt.viewCount || prompt.view_count || '0', 10),
          favoriteCount: parseInt(prompt.favoriteCount || prompt.favorite_count || '0', 10),
          isPublic: prompt.isPublic === true || prompt.is_public === true,
          createdAt: prompt.createdAt || prompt.created_at,
          tags: prompt.tags || []
        };
      });
      
      setPrompts(processedPrompts);
      setTotalPrompts(data.total);
      setTotalPages(Math.ceil(data.total / promptsPerPage));
    } catch (err) {
      setError('获取提示词失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取用户统计信息
  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '未授权');
      }
      
      const data = await response.json();
      setPromptCounts({
        prompts: data.prompts || 0,
        publishedPrompts: data.publishedPrompts || 0,
        reviewingPrompts: data.reviewingPrompts || 0,
        rejectedPrompts: data.rejectedPrompts || 0,
        privatePrompts: data.privatePrompts || 0,
        favorites: data.favorites || 0
      });
    } catch (err) {
      setError('获取统计信息失败，请稍后重试');
    }
  };

  // 刷新数据的函数
  const refreshData = async () => {
    if (user?.id) {
      await fetchUserPrompts();
      await fetchUserStats();
    }
  };

  // 删除提示词
  const deletePrompt = async () => {
    if (!promptToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/prompts/${promptToDelete}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '删除提示词失败');
      }
      
      toast.success(t('profile.promptDeleted') || '提示词已删除');
      setPromptToDelete(null);
      refreshData();
    } catch (err) {
      toast.error(t('profile.deleteError') || '删除提示词失败，请稍后重试');
    } finally {
      setIsDeleting(false);
    }
  };

  // 确认删除提示词
  const confirmDeletePrompt = (id: string) => {
    setPromptToDelete(id);
  };

  // 取消删除
  const cancelDelete = () => {
    setPromptToDelete(null);
  };

  // 处理分页
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // 上一页
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 下一页
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 获取本地化的分类显示名
  const getLocalizedCategoryDisplayName = (category: Omit<Category, 'count'>) => {
    return getCategoryDisplayName(category as any, language);
  };

  // 获取本地化的标签显示名
  const getLocalizedTagDisplayName = (tag: Omit<Tag, 'count'>) => {
    return getTagDisplayName(tag as any, language);
  };

  // 复制提示词内容并显示toast
  const handleCopyPromptContent = (content: string) => {
    copyPromptContent(content, () => {
      toast.success(t('profile.copied') || '已复制');
    });
  };

  // 初始加载 - 首次渲染时加载数据
  useEffect(() => {
    if (user) {
      fetchUserPrompts();
      fetchUserStats();
    }
  }, [user]);
  
  // 当页码或标签变化时触发刷新数据
  useEffect(() => {
    // 用户已登录时，根据页码和标签变化刷新数据
    if (user) {
      fetchUserPrompts();
    }
  }, [currentPage, activeTab]);

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 个人信息头部 */}
      <ProfileHeader 
        user={user} 
        promptCounts={promptCounts}
        refreshData={refreshData}
      />
      
      {/* 提示词列表 */}
      <div id="myPrompts" className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
        {/* 标签栏 */}
        <ProfileTabs 
          activeTab={activeTab}
          promptCounts={promptCounts}
          setActiveTab={setActiveTab}
          setCurrentPage={setCurrentPage}
        />

        {/* 加载状态 */}
        {isLoading && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
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
              <div className="mx-auto text-4xl mb-2 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-lg font-medium">{t('profile.noPrompts')}</p>
            </div>
            <a href="/create-prompt" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300">
              {t('profile.createFirstPrompt')}
            </a>
          </div>
        )}

        {/* 提示词列表 */}
        {!isLoading && !error && prompts.length > 0 && (
          <div className="space-y-4">
            {prompts.map(prompt => (
              <ProfilePromptItem 
                key={prompt.id}
                prompt={prompt}
                confirmDeletePrompt={confirmDeletePrompt}
                isAdmin={isAdmin}
                getCategoryStyles={getCategoryStyles}
                getCategoryDisplayName={getLocalizedCategoryDisplayName}
                getTagDisplayName={getLocalizedTagDisplayName}
                copyPromptContent={handleCopyPromptContent}
                formatDate={formatDate}
              />
            ))}
            
            {/* 分页控件 */}
            {totalPages > 1 && (
              <ProfilePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalPrompts={totalPrompts}
                promptsPerPage={promptsPerPage}
                goToPage={goToPage}
                goToPreviousPage={goToPreviousPage}
                goToNextPage={goToNextPage}
              />
            )}
          </div>
        )}
      </div>
      
      {/* 删除确认对话框 */}
      <DeleteConfirmModal
        isOpen={promptToDelete !== null}
        isDeleting={isDeleting}
        onCancel={cancelDelete}
        onConfirm={deletePrompt}
      />
    </div>
  );
} 