'use client';

import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import React from 'react';
import Link from 'next/link';

// 导入子组件
import {
  PromptEditForm,
  PromptContentEditor,
  ImageUploader
} from '@/components/prompt';

// 导入工具函数
import {
  processImagesData,
  processTagsData,
  getTagDisplayName as getTagDisplayNameUtil,
  getInitialFormData,
  getInitialFormValidation,
  determinePromptStatus
} from '@/utils/promptEditUtils';

// 修改类型定义，添加display_name字段
type Tag = {
  id: string;
  name: string;
  displayName?: string;
  display_name?: string;
};

// 修改PromptTag类型定义
type PromptTag = {
  id: string;
  tagId: string;
  tag?: Tag;
};

export default function EditPrompt({ promptId }: { promptId: string }) {
  // 获取翻译函数和路由
  const { t, language } = useLanguage();
  const router = useRouter();
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);
  
  // 保存原始提示词状态和公开状态
  const [originalStatus, setOriginalStatus] = useState('');
  const [originalIsPublic, setOriginalIsPublic] = useState(true);
  
  // 表单数据状态
  const [formData, setFormData] = useState(getInitialFormData());
  
  // 表单验证状态
  const [formValidation, setFormValidation] = useState(getInitialFormValidation());
  const [isFormValid, setIsFormValid] = useState(false);
  
  // 标签和分类相关状态
  const [categories, setCategories] = useState<{id: string, name: string, displayName: string, icon: string, color: string}[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // 保存PromptTag对象的状态，用于辅助显示
  const [promptTagsData, setPromptTagsData] = useState<PromptTag[]>([]);
  
  // 图片和提交相关状态
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // 用于标签缓存和页面刷新的引用
  const fetchedTagsRef = useRef<Set<string>>(new Set());
  const forceUpdateTimeoutRef = useRef<number | null>(null);
  
  // 辅助函数：获取标签的显示名称
  const getTagDisplayName = (promptTagId: string) => {
    // 检查是否是已知的PromptTag
    const promptTagEntry = promptTagsData.find(pt => pt.id === promptTagId);
    
    if (promptTagEntry) {
      // 获取标签信息
      const tagInfo = promptTagEntry.tag;
      if (tagInfo) {
        return language === 'zh' 
          ? (tagInfo.displayName || tagInfo.display_name || tagInfo.name) 
          : tagInfo.name;
      }
      // 如果没有tag信息，检查allTags
    }
    
    // 如果不是PromptTag，在allTags中查找
    const tag = allTags.find(t => t.id === promptTagId);
    if (tag) {
      return language === 'zh' 
        ? (tag.displayName || tag.display_name || tag.name) 
        : tag.name;
    }
    
    // 如果都找不到，返回ID
    return promptTagId;
  };

  // 加载提示词数据
  useEffect(() => {
    const fetchPromptData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/prompts/${promptId}`);
        if (!response.ok) {
          throw new Error('获取提示词数据失败');
        }
        
        const prompt = await response.json();
        
        // 保存原始状态，以便在提交时进行比较
        setOriginalStatus(prompt.status || '');
        setOriginalIsPublic(prompt.is_public);
        
        // 设置表单数据
        setFormData({
          title: prompt.title || '',
          category: prompt.category?.id || '',
          description: prompt.description || '',
          tags: Array.isArray(prompt.tags) 
            ? prompt.tags.map((tagItem: any) => tagItem.tag?.id || '') 
            : [],
          language: prompt.language || 'zh',
          promptContent: prompt.content || '',
          usageGuide: prompt.usage_guide || '',
          isPublic: prompt.is_public
        });
        
        // 设置选中的标签
        if (Array.isArray(prompt.tags)) {
          const tagIds = prompt.tags.map((tagItem: any) => tagItem.tag?.id || '');
          setSelectedTags(tagIds);
        }
        
        // 设置图片和标签数据
        setPreviewImages(processImagesData(prompt.images));
        setPromptTagsData(Array.isArray(prompt.tags) 
          ? prompt.tags.map((tagItem: any) => ({
              id: tagItem.tag?.id || '',
              tagId: tagItem.tag?.id || '',
              tag: tagItem.tag
            })) 
          : []);
      } catch (error) {
        toast(t('editPromptPage.fetchError'), { icon: '❌' });
        console.error('获取提示词数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPromptData();
  }, [promptId, t]);
  
  // 加载分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('获取分类数据失败');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast(t('editPromptPage.fetchCategoriesError'), { icon: '❌' });
        console.error('获取分类数据失败:', error);
      }
    };
    
    fetchCategories();
  }, [t]);
  
  // 加载热门标签数据
  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const response = await fetch('/api/tags?popular=true&limit=10');
        if (!response.ok) {
          throw new Error('获取热门标签失败');
        }
        const data = await response.json();
        setAllTags(data);
      } catch (error) {
        // 错误已处理，不显示错误消息
        console.error('获取热门标签失败:', error);
      }
    };
    
    fetchPopularTags();
  }, []);
  
  // 表单验证
  useEffect(() => {
    const validTitle = formData.title.trim().length > 0;
    const validCategory = formData.category.trim().length > 0;
    const validDescription = formData.description.trim().length > 0;
    const validContent = formData.promptContent.trim().length > 0;
    
    setFormValidation({
      title: { 
        valid: validTitle, 
        message: validTitle ? '' : t('editPromptPage.titleRequired') 
      },
      category: { 
        valid: validCategory, 
        message: validCategory ? '' : t('editPromptPage.categoryRequired') 
      },
      description: { 
        valid: validDescription, 
        message: validDescription ? '' : t('editPromptPage.descriptionRequired') 
      },
      promptContent: { 
        valid: validContent, 
        message: validContent ? '' : t('editPromptPage.contentRequired') 
      }
    });
    
    setIsFormValid(validTitle && validCategory && validDescription && validContent);
  }, [formData.title, formData.category, formData.description, formData.promptContent, t]);
  
  // 标签选择或删除
  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tagId]);
      } else {
        toast(t('editPromptPage.maxTagsReached'), { icon: '❌' });
      }
    }
  };
  
  // 处理输入变更
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Markdown编辑器变更
  const handleEditorChange = ({ text }: { text: string }) => {
    setFormData({
      ...formData,
      promptContent: text
    });
  };
  
  // 复选框变更处理
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  // 修改提交处理函数
  const handleSubmit = async () => {
    // 表单验证
    if (!isFormValid) {
      if (!formData.title.trim()) {
        toast(t('editPromptPage.titleRequired'), { icon: '❌' });
      } else if (!formData.category) {
        toast(t('editPromptPage.categoryRequired'), { icon: '❌' });
      } else if (!formData.promptContent.trim()) {
        toast(t('editPromptPage.contentRequired'), { icon: '❌' });
      } else if (!formData.description.trim()) {
        toast(t('editPromptPage.descriptionRequired'), { icon: '❌' });
      }
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // 处理标签数据
      const processedTags = processTagsData(selectedTags, promptTagsData);
      
      // 确定新的状态
      const newStatus = determinePromptStatus(formData.isPublic);
      
      const response = await fetch(`/api/prompts/${promptId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          content: formData.promptContent,
          usage_guide: formData.usageGuide,
          categoryId: formData.category,
          tags: processedTags,
          images: previewImages,
          isPublic: formData.isPublic,
          status: newStatus
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('editPromptPage.updateFailed'));
      }
      
      // 更新成功后跳转到提示词详情页
      toast(t('editPromptPage.updateSuccess'), { icon: '✅' });
      router.push(`/prompt-detail/${promptId}`);
    } catch (error) {
      console.error('更新提示词失败:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : t('editPromptPage.updateErrorTryAgain');
      
      setSubmitError(errorMessage);
      toast(errorMessage, { icon: '❌' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-32 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="text-center mt-6 text-gray-500">{t('editPromptPage.loading')}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('editPromptPage.title')}</h1>
        
        {/* 基本信息表单 */}
        <PromptEditForm
          formData={formData}
          formValidation={formValidation}
          categories={categories}
          selectedTags={selectedTags}
          promptTagsData={promptTagsData}
          allTags={allTags}
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
          onTagSelect={handleTagSelect}
          getTagDisplayName={getTagDisplayName}
        />
        
        {/* 提示词内容 */}
        <PromptContentEditor
          content={formData.promptContent}
          usageGuide={formData.usageGuide}
          onContentChange={handleEditorChange}
          onUsageGuideChange={handleInputChange}
          contentValidation={formValidation.promptContent}
        />
        
        {/* 图片上传部分 */}
        <ImageUploader
          previewImages={previewImages}
          setPreviewImages={setPreviewImages}
        />
        
        {/* 提交按钮 */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => router.back()}
          >
            {t('editPromptPage.cancel')}
          </button>
          <button
            type="button"
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting || !isFormValid ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? t('editPromptPage.updating') : t('editPromptPage.update')}
          </button>
        </div>
        
        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}
      </div>
    </div>
  );
} 