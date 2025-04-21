'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FaStar, FaRegStar, FaShareAlt } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import CopyButton from '@/components/CopyButton';
import ImageModal from '@/components/ImageModal';

// 导入重构的组件
import { 
  PromptHeader, 
  PromptContent, 
  PromptImageGallery, 
  PromptSidebar 
} from '@/components/prompt';

// 导入提示词工具函数和类型
import { 
  processImages, 
  processAuthorData,
  Category,
  Author,
  PromptTag,
  RelatedPrompt
} from '@/utils/promptUtils';

// 导入显示相关工具函数
import { getCategoryDisplayName, getCategoryStyles } from '@/utils/displayUtils';
import { formatCount, formatDate } from '@/utils/formatUtils';

interface PromptDetailProps {
  promptId?: string;
}

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
  updatedAt: string;
  category: Category;
  tags: PromptTag[];
  author: Author;
}

export default function PromptDetail({ promptId }: PromptDetailProps) {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  // 状态
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [relatedPrompts, setRelatedPrompts] = useState<RelatedPrompt[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copyMainText, setCopyMainText] = useState(t('promptDetail.copyPrompt'));
  const [copyContentText, setCopyContentText] = useState(t('homePage.copyButton'));
  const [mainCopyAnimation, setMainCopyAnimation] = useState(false);
  const [contentCopyAnimation, setContentCopyAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [error, setError] = useState('');
  
  // 图片模态框状态
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // 打开图片模态框
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
    // 阻止滚动
    document.body.style.overflow = 'hidden';
  };
  
  // 关闭图片模态框
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    // 恢复滚动
    document.body.style.overflow = 'auto';
  };

  // 加载提示词详情
  useEffect(() => {
    if (!promptId) {
      setError(t('promptDetail.invalidPromptId', {}));
      setLoading(false);
      return;
    }

    let isMounted = true;
    let requestAbortController: AbortController | null = null;

    const fetchPromptDetail = async () => {
      // 如果已经有请求在进行中，取消它
      if (requestAbortController) {
        requestAbortController.abort();
      }

      // 创建新的 AbortController
      requestAbortController = new AbortController();
      const signal = requestAbortController.signal;

      try {
        setLoading(true);
        setError('');
        
        // 获取提示词详情
        const response = await fetch(`/api/prompts/${promptId}`, { signal });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || t('promptDetail.fetchFailed', {}));
        }
        
        const promptData = await response.json();
        
        // 如果组件已经卸载，不更新状态
        if (!isMounted) return;
        
        // 处理图片数据
        const validImages = processImages(promptData.images);
        
        // 处理作者数据
        const authorData = processAuthorData(promptData.author);
        
        // 处理提示词数据
        const processedPromptData = {
          ...promptData,
          images: validImages,
          author: authorData
        };
        
        setPrompt(processedPromptData);
        
        // 如果用户已登录，检查收藏状态
        if (isAuthenticated) {
          try {
            setLoadingFavorite(true);
            const favoriteResponse = await fetch(`/api/prompts/${promptId}/favorite`, { signal });
            
            if (favoriteResponse.ok) {
              const favoriteData = await favoriteResponse.json();
              if (isMounted) {
                setIsFavorite(favoriteData.favorited);
              }
            }
          } catch (error: any) {
            if (error.name !== 'AbortError') {
              console.error('检查收藏状态失败', error);
            }
          } finally {
            if (isMounted) {
              setLoadingFavorite(false);
            }
          }
        }
        
        // 获取相关提示词 (同类别的其他提示词)
        const relatedResponse = await fetch(`/api/prompts?category=${promptData.category.id}&limit=10&exclude=${promptId}&lang=${language}`, { signal });
        
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          
          // 确保数据结构正确且过滤掉当前提示词
          if (relatedData && relatedData.prompts && Array.isArray(relatedData.prompts)) {
            const filteredPrompts = relatedData.prompts
              .filter((p: any) => p && p.id && p.title)
              .slice(0, 3);
            
            if (isMounted) {
              setRelatedPrompts(filteredPrompts);
            }
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('获取提示词详情失败', err);
          if (isMounted) {
            setError(err.message || t('promptDetail.fetchDetailError', {}));
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPromptDetail();

    // 清理函数
    return () => {
      isMounted = false;
      if (requestAbortController) {
        requestAbortController.abort();
      }
    };
  }, [promptId, isAuthenticated, t, language]);

  // 切换收藏状态
  const toggleFavorite = async () => {
    // 收藏前检查是否登录
    if (!isAuthenticated) {
      toast(t('promptDetail.loginRequired', {}), { icon: '⚠️' });
      return;
    }

    // 检查提示词 ID 是否有效
    if (!promptId) {
      toast(t('promptDetail.invalidPromptId', {}), { icon: '❌' });
      return;
    }

    setLoadingFavorite(true);
    try {
      // 根据当前状态决定是添加收藏还是取消收藏
      const method = isFavorite ? 'DELETE' : 'POST';
      
      const response = await fetch(`/api/prompts/${promptId}/favorite`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('promptDetail.operationFailed', {}));
      }

      // 切换收藏状态
      setIsFavorite(!isFavorite);

      // 更新提示词收藏数量
      if (prompt) {
        setPrompt({
          ...prompt,
          favoriteCount: isFavorite ? Math.max(0, prompt.favoriteCount - 1) : prompt.favoriteCount + 1
        });
      }

      // 根据操作显示不同的提示
      if (!isFavorite) {
        toast(t('promptDetail.addedToFavorites', {}), { icon: '✅' });
      } else {
        toast(t('promptDetail.removedFromFavorites', {}), { icon: '✅' });
      }
    } catch (error) {
      console.error('收藏操作失败', error);
      toast(error instanceof Error ? error.message : t('promptDetail.favoriteOperationFailed', {}), { icon: '❌' });
    } finally {
      setLoadingFavorite(false);
    }
  };

  // 渲染 Loading 状态
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // 渲染错误信息
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-red-500 mb-4">{t('promptDetail.errorOccurred', {})}</h2>
          <p className="text-gray-700">{error}</p>
          <Link href="/" className="inline-block mt-4 text-blue-600 hover:text-blue-800">
            {t('promptDetail.returnToHome', {})}
          </Link>
        </div>
      </div>
    );
  }

  // 如果没有提示词数据
  if (!prompt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{t('promptDetail.notFound', {})}</h2>
          <p className="text-gray-700">{t('promptDetail.promptNotExist', {})}</p>
          <Link href="/" className="inline-block mt-4 text-blue-600 hover:text-blue-800">
            {t('promptDetail.returnToHome', {})}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 面包屑导航 */}
      <div className="text-sm text-gray-600 mb-6 flex items-center">
        <Link href="/" className="hover:text-indigo-600">{t('footer.home')}</Link>
        <span className="mx-2">/</span>
        <Link href="/browse" className="hover:text-indigo-600">{t('browse.title')}</Link>
        <span className="mx-2">/</span>
        <Link 
          href={`/browse?category=${prompt.category.id}`} 
          className="hover:text-indigo-600"
        >
          {getCategoryDisplayName(prompt.category, language)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 truncate max-w-[200px]" title={prompt.title}>{prompt.title}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 提示词头部 */}
        <PromptHeader 
          title={prompt.title}
          category={prompt.category}
          author={prompt.author}
          createdAt={prompt.createdAt}
          viewCount={prompt.viewCount}
          content={prompt.content}
          isFavorite={isFavorite}
          loadingFavorite={loadingFavorite}
          toggleFavorite={toggleFavorite}
          formatDate={formatDate}
          formatCount={formatCount}
          getCategoryStyles={getCategoryStyles}
          getCategoryDisplayName={(category) => getCategoryDisplayName(category, language)}
        />
        
        {/* 内容区域 */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左侧内容 */}
            <div className="lg:w-2/3">
              {/* 提示词内容 */}
              <PromptContent 
                content={prompt.content}
                usageGuide={prompt.usageGuide}
              />
              
              {/* 图片展示 */}
              {prompt.images && prompt.images.length > 0 && (
                <PromptImageGallery 
                  images={prompt.images}
                  title={prompt.title}
                  onImageClick={openImageModal}
                />
              )}
            </div>
            
            {/* 右侧边栏 */}
            <div className="lg:w-1/3">
              <PromptSidebar 
                relatedPrompts={relatedPrompts}
                tags={prompt.tags}
                createdAt={prompt.createdAt}
                updatedAt={prompt.updatedAt}
                viewCount={prompt.viewCount}
                favoriteCount={prompt.favoriteCount}
                categoryId={prompt.category.id}
                formatCount={formatCount}
                formatDate={formatDate}
                getCategoryStyles={getCategoryStyles}
                getCategoryDisplayName={(category) => getCategoryDisplayName(category, language)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 图片模态框 */}
      {prompt && prompt.images && prompt.images.length > 0 && (
        <ImageModal
          images={prompt.images}
          initialIndex={selectedImageIndex}
          isOpen={isImageModalOpen}
          onClose={closeImageModal}
        />
      )}
    </div>
  );
} 