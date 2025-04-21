/**
 * 提示词创建页面工具函数
 */
import { toast } from 'react-hot-toast';
import { 
  uploadImage, 
  MAX_DESCRIPTION_LENGTH, 
  MAX_TITLE_LENGTH,
  getInitialFormData as getEditInitialFormData,
  getInitialFormValidation as getEditInitialFormValidation
} from './promptEditUtils';

// 常量
export const MAX_IMAGES = 4;

// 添加类型定义
interface Tag {
  id: string;
  name: string;
  displayName?: string;
  display_name?: string;
}

/**
 * 获取初始表单数据，根据当前语言设置
 */
export const getInitialFormData = (currentLanguage: string) => ({
  ...getEditInitialFormData(),
  language: currentLanguage
});

/**
 * 获取初始表单验证状态
 */
export const getInitialFormValidation = getEditInitialFormValidation;

/**
 * 自定义表单验证函数
 */
export const validateForm = (formData: any, t: Function, callback: (step: number) => void) => {
  if (!formData.title.trim()) {
    toast(t('createPromptPage.titleRequired'), { icon: '❌' });
    callback(1);
    return false;
  }
  
  if (!formData.category) {
    toast(t('createPromptPage.categoryRequired'), { icon: '❌' });
    callback(1);
    return false;
  }
  
  if (!formData.description.trim()) {
    toast(t('createPromptPage.descriptionRequired'), { icon: '❌' });
    callback(1);
    return false;
  }
  
  if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
    toast(t('createPromptPage.descriptionTooLong', { max: MAX_DESCRIPTION_LENGTH }), { icon: '❌' });
    callback(1);
    return false;
  }
  
  if (!formData.promptContent.trim()) {
    toast(t('createPromptPage.contentRequired'), { icon: '❌' });
    callback(2);
    return false;
  }
  
  return true;
};

/**
 * 准备提交数据
 */
export const prepareSubmitData = (formData: any, selectedTags: string[], previewImages: string[]) => ({
  title: formData.title,
  description: formData.description,
  content: formData.promptContent,
  usageGuide: formData.usageGuide,
  categoryId: formData.category,
  tags: selectedTags,
  images: previewImages,
  language: formData.language,
  isPublic: formData.isPublic,
  status: formData.isPublic ? 'reviewing' : 'published'
});

/**
 * 处理表单提交
 */
export const handleFormSubmit = async (
  formData: any, 
  selectedTags: string[], 
  previewImages: string[],
  t: Function,
  navigateToStep: (step: number) => void,
  callbacks: {
    setIsSubmitting: (value: boolean) => void,
    setSubmitError: (value: string) => void,
    onSuccess: (data: any) => void,
    onError: (error: Error) => void
  }
) => {
  if (!validateForm(formData, t, navigateToStep)) {
    return;
  }
  
  callbacks.setIsSubmitting(true);
  callbacks.setSubmitError('');
  
  try {
    const response = await fetch('/api/prompts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prepareSubmitData(formData, selectedTags, previewImages)),
    });
    
    if (response.status === 401) {
      // 未登录情况处理
      window.location.href = '/login';
      return;
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || t('createPromptPage.createFailed'));
    }
    
    const data = await response.json();
    
    toast(formData.isPublic ? t('createPromptPage.createSuccessReviewing') : t('createPromptPage.createSuccess'), { icon: '✅' });
    callbacks.onSuccess(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : t('createPromptPage.createErrorTryAgain');
    callbacks.setSubmitError(errorMessage);
    toast(errorMessage, { icon: '❌' });
    callbacks.onError(error instanceof Error ? error : new Error(errorMessage));
  } finally {
    callbacks.setIsSubmitting(false);
  }
};

/**
 * 获取确认对话框内容
 */
export const getConfirmDialogContent = (isPublic: boolean, t: Function) => {
  return isPublic 
    ? t('createPromptPage.publicSubmitConfirm')
    : t('createPromptPage.privateSubmitConfirm');
}; 