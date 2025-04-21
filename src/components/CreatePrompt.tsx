'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// 导入子组件
import {
  PromptStepsNav,
  PromptBasicInfoForm,
  PromptContentEditor,
  ImageUploader,
  PromptPublishSettings,
  PromptPreview
} from '@/components/prompt';
import ConfirmDialog from '@/components/common/ConfirmDialog';

// 导入工具函数
import {
  getInitialFormData,
  getInitialFormValidation,
  getConfirmDialogContent,
  handleFormSubmit,
  MAX_IMAGES
} from '@/utils/promptCreateUtils';

export default function CreatePrompt() {
  // 获取翻译函数和路由
  const { t, language } = useLanguage();
  const router = useRouter();
  
  // 当前步骤状态
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // 表单数据和验证状态
  const [formData, setFormData] = useState(getInitialFormData(language));
  const [formValidation, setFormValidation] = useState(getInitialFormValidation());
  const [isFormValid, setIsFormValid] = useState(true);
  
  // 标签相关状态
  const [categories, setCategories] = useState<{id: string, name: string, displayName: string, icon: string, color: string}[]>([]);
  const [allTags, setAllTags] = useState<{id: string, name: string, displayName?: string}[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // 图片和提交相关状态
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // 对话框状态
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewCategory, setPreviewCategory] = useState('');
  const [previewTags, setPreviewTags] = useState<Array<{id: string, name: string, displayName: string}>>([]);
  
  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(t('createPromptPage.fetchCategoriesFailed'));
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error(t('createPromptPage.fetchCategoriesError'));
      }
    };

    fetchCategories();
  }, [t]);

  // 获取热门标签
  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const response = await fetch('/api/tags?popular=true&limit=30');
        if (!response.ok) {
          throw new Error(t('createPromptPage.fetchTagsFailed'));
        }
        const data = await response.json();
        setAllTags(data);
      } catch (error) {
        toast.error(t('createPromptPage.fetchTagsError'));
      }
    };

    fetchPopularTags();
  }, [t]);

  // 表单验证
  useEffect(() => {
    const validTitle = formData.title.trim().length > 0;
    const validCategory = formData.category.trim().length > 0;
    const validDescription = formData.description.trim().length > 0;
    const validContent = formData.promptContent.trim().length > 0;
    
    setFormValidation({
      title: { 
        valid: validTitle, 
        message: validTitle ? '' : t('createPromptPage.titleRequired') 
      },
      category: { 
        valid: validCategory, 
        message: validCategory ? '' : t('createPromptPage.categoryRequired') 
      },
      description: { 
        valid: validDescription, 
        message: validDescription ? '' : t('createPromptPage.descriptionRequired') 
      },
      promptContent: { 
        valid: validContent, 
        message: validContent ? '' : t('createPromptPage.contentRequired') 
      }
    });
    
    setIsFormValid(validTitle && validCategory && validDescription && validContent);
  }, [formData.title, formData.category, formData.description, formData.promptContent, t]);
  
  // 在组件加载或语言变更时更新表单的语言设置
  useEffect(() => {
    if (formData.title === '' && formData.description === '' && formData.promptContent === '') {
      // 只有在表单还没有填写内容时才自动更新语言，避免覆盖用户选择
      setFormData(prev => ({
        ...prev,
        language: language
      }));
    }
  }, [language, formData.title, formData.description, formData.promptContent]);

  // 处理输入变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  // 标签选择或删除
  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      // 如果标签已经被选中，则移除
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      // 如果标签未被选中，且未达到最大标签数量，则添加
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tagId]);
      } else {
        toast.error(t('createPromptPage.maxTagsReached'));
      }
    }
  };
  
  // 导航到特定步骤
  const navigateToStep = (step: number) => {
    // 始终允许浏览之前的步骤
    if (step <= currentStep) {
    setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // 从第一步到第二步时特殊处理，不检查表单验证
    if (currentStep === 1 && step === 2) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // 其他情况检查表单有效性
    if (isFormValid) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast(t('createPromptPage.completeRequiredFields'), { icon: '⚠️' });
    }
  };
  
  // 下一步
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      navigateToStep(currentStep + 1);
    }
  };
  
  // 上一步
  const handlePrevStep = () => {
    if (currentStep > 1) {
      navigateToStep(currentStep - 1);
    }
  };
  
  // 打开确认对话框
  const handlePublishClick = () => {
    setShowConfirmDialog(true);
  };
  
  // 确认提交
  const confirmSubmit = () => {
    setShowConfirmDialog(false);
    
    // 调用封装的提交函数
    handleFormSubmit(
      formData,
      selectedTags,
      previewImages,
      t,
      navigateToStep,
      {
        setIsSubmitting,
        setSubmitError,
        onSuccess: (data) => {
          router.push(`/prompt-detail/${data.prompt.id}`);
        },
        onError: (error) => {
          console.error('创建提示词失败:', error);
        }
      }
    );
  };
  
  // 取消提交
  const cancelSubmit = () => {
    setShowConfirmDialog(false);
  };
  
  // 打开预览对话框
  const handlePreviewClick = () => {
    // 获取选中分类的名称
    let categoryName = '';
    const selectedCategory = categories.find(cat => cat.id === formData.category);
    if (selectedCategory) {
      categoryName = language === 'zh' ? (selectedCategory.displayName || selectedCategory.name) : selectedCategory.name;
    }
    
    // 获取选中标签的详细信息
    const tags = selectedTags.map(tagId => {
      const tagInfo = allTags.find(tag => tag.id === tagId);
      return {
        id: tagId,
        name: tagInfo?.name || '',
        displayName: tagInfo?.displayName || tagInfo?.name || ''
      };
    });
    
    setPreviewCategory(categoryName);
    setPreviewTags(tags as Array<{id: string, name: string, displayName: string}>);
    setShowPreviewDialog(true);
  };
  
  // 关闭预览对话框
  const closePreview = () => {
    setShowPreviewDialog(false);
  };
  
  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
  return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">{t('createPromptPage.step1')}</h2>
            <PromptBasicInfoForm
              formData={formData}
              formValidation={formValidation}
              categories={categories}
              selectedTags={selectedTags}
              allTags={allTags}
              onInputChange={handleInputChange}
              onTagSelect={handleTagSelect}
            />
                    </div>
        );
      case 2:
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">{t('createPromptPage.step2')}</h2>
            
            {/* 提示词编写技巧 */}
            <div className="mt-2 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-md font-medium text-yellow-800 mb-2">
                <i className="fas fa-lightbulb mr-2"></i>
                            {t('createPromptPage.writingTips')}
                          </h3>
              <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
                <li>{t('createPromptPage.tip1')}</li>
                <li>{t('createPromptPage.tip2')}</li>
                <li>{t('createPromptPage.tip3')}</li>
                <li>{t('createPromptPage.tip4')}</li>
                <li>{t('createPromptPage.tip5')}</li>
              </ul>
                      </div>
                      
            <PromptContentEditor
              content={formData.promptContent}
              usageGuide=""
              onContentChange={handleEditorChange}
              onUsageGuideChange={() => {}}
              contentValidation={formValidation.promptContent}
              hideUsageGuide={true}
                          />
                        </div>
        );
      case 3:
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">{t('createPromptPage.step3')}</h2>
            <div className="prose prose-sm max-w-none mb-4">
              <p>{t('createPromptPage.step3Desc')}</p>
                      </div>
                      <textarea 
                        id="usageGuide" 
                        name="usageGuide" 
                        rows={6} 
                        placeholder={t('createPromptPage.usageGuidePlaceholder')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.usageGuide}
                        onChange={handleInputChange}
            />
            <p className="mt-2 text-sm text-gray-500">{t('createPromptPage.usageGuideDesc')}</p>
                    </div>
        );
      case 4:
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">{t('createPromptPage.step4')}</h2>
            <ImageUploader
              previewImages={previewImages}
              setPreviewImages={setPreviewImages}
              maxImages={MAX_IMAGES}
            />
                  </div>
        );
      case 5:
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">{t('createPromptPage.step5')}</h2>
            <PromptPublishSettings
              isPublic={formData.isPublic}
              onChange={handleCheckboxChange}
            />
                </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <>
      {/* 主页面标题横幅 */}
      <div className="hero-bg relative mb-8">
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-3 py-1 bg-indigo-600 bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4 animate-pulse-slow shadow-md">
              <i className="fas fa-lightbulb text-yellow-300 mr-1"></i> {t('createPromptPage.tagline')}
                          </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('createPromptPage.title')}</h1>
            <p className="text-xl text-gray-100 mb-6">{t('createPromptPage.subtitle')}</p>
                        </div>
                      </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
                        </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* 步骤导航 */}
          <PromptStepsNav
            currentStep={currentStep}
            totalSteps={totalSteps}
            navigateToStep={navigateToStep}
          />
          
          {/* 步骤内容 */}
          {renderStepContent()}
          
          {/* 导航按钮 */}
          <div className="flex justify-between mt-6">
                  <button 
                    type="button" 
              className={`px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                  >
              {t('createPromptPage.prevStep')}
                  </button>
            
            <div className="flex space-x-3">
                  <button 
                    type="button" 
                className="px-4 py-2 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50"
                onClick={handlePreviewClick}
                  >
                <i className="fas fa-eye mr-1"></i> {t('createPromptPage.preview')}
                  </button>
                
              {currentStep < totalSteps ? (
                  <button 
                    type="button" 
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleNextStep}
                  >
                  {t('createPromptPage.nextStep')}
                  </button>
              ) : (
                  <button 
                    type="button" 
                  className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 ${
                    isSubmitting || !isFormValid ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    onClick={handlePublishClick}
                  disabled={isSubmitting || !isFormValid}
                >
                  {isSubmitting ? t('createPromptPage.submitting') : t('createPromptPage.publish')}
                  </button>
              )}
                </div>
              </div>
              
              {/* 提交错误提示 */}
              {submitError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}
        </div>
      </div>
      
      {/* 确认对话框 */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title={t('createPromptPage.confirmPublish')}
        message={getConfirmDialogContent(formData.isPublic, t)}
        confirmText={t('createPromptPage.confirm')}
        cancelText={t('createPromptPage.cancel')}
        onConfirm={confirmSubmit}
        onCancel={cancelSubmit}
      />
      
      {/* 预览对话框 */}
      {showPreviewDialog && (
        <PromptPreview
          formData={formData}
          categoryName={previewCategory}
          tags={previewTags}
          previewImages={previewImages}
          onClose={closePreview}
        />
      )}
    </>
  );
} 