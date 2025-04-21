/**
 * 提示词编辑页面工具函数
 */
import { toast } from 'react-hot-toast';

// 定义常量
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_TITLE_LENGTH = 50;

/**
 * 处理图片数据，确保是数组格式
 */
export const processImagesData = (images: any): string[] => {
  let imageArray: string[] = [];
  if (typeof images === 'string') {
    try {
      imageArray = JSON.parse(images);
    } catch (e) {
      imageArray = [];
    }
  } else if (Array.isArray(images)) {
    imageArray = images;
  }
  
  // 过滤无效的图片URL
  return imageArray.filter(img => img && typeof img === 'string');
};

/**
 * 上传图片
 */
export const uploadImage = async (file: File, t: Function): Promise<string> => {
  // 显示上传中状态
  toast(t('editPromptPage.uploading'), { icon: '⏳' });
  
  // 创建FormData
  const formData = new FormData();
  formData.append('file', file);
  
  // 发送上传请求
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include' // 确保发送认证cookie
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.details || t('editPromptPage.uploadFailed'));
  }
  
  // 解析响应
  const result = await response.json();
  toast(t('editPromptPage.uploadSuccess'), { icon: '✅' });
  
  return result.imageUrl;
};

/**
 * 处理标签数据，对于PromptTag提取对应的tagId
 */
export const processTagsData = (
  selectedTags: string[],
  promptTagsData: {id: string, tagId: string, tag?: {id: string, name: string, displayName?: string}}[]
): string[] => {
  return selectedTags.map(tagId => {
    const promptTagInfo = promptTagsData.find(pt => pt.id === tagId);
    // 如果找到PromptTag记录，返回对应的tagId，否则返回原始ID
    return promptTagInfo ? promptTagInfo.tagId : tagId;
  });
};

/**
 * 获取标签显示名称
 */
export const getTagDisplayName = (
  promptTagId: string,
  promptTagsData: {id: string, tagId: string, tag?: {id: string, name: string, displayName?: string, display_name?: string}}[],
  allTags: {id: string, name: string, displayName?: string, display_name?: string}[],
  language: string
): string => {
  // 先检查是否是已知的PromptTag
  const promptTagMapping = promptTagsData.find(pt => pt.id === promptTagId);
  
  // 如果是PromptTag对象，且有tag信息
  if (promptTagMapping && promptTagMapping.tag) {
    const tagInfo = promptTagMapping.tag;
    if (language === 'zh') {
      return tagInfo.displayName || tagInfo.display_name || tagInfo.name || promptTagId;
    }
    return tagInfo.name || promptTagId;
  }
  
  // 如果找不到映射，在allTags中查找
  const tag = allTags.find(t => t.id === promptTagId);
  if (tag) {
    if (language === 'zh') {
      return tag.displayName || tag.display_name || tag.name || promptTagId;
    }
    return tag.name || promptTagId;
  }
  
  return promptTagId; // 如果找不到，返回ID
};

/**
 * 定义初始化表单数据
 */
export const getInitialFormData = () => ({
  title: '',
  description: '',
  category: '',
  tags: [],
  language: 'zh',
  promptContent: '',
  usageGuide: '',
  isPublic: true
});

/**
 * 定义初始化表单验证状态
 */
export const getInitialFormValidation = () => ({
  title: { valid: true, message: '' },
  category: { valid: true, message: '' },
  description: { valid: true, message: '' },
  promptContent: { valid: true, message: '' }
});

/**
 * 验证表单数据
 */
export const validateFormData = (formData: any, t: Function) => {
  const validTitle = formData.title.trim().length > 0;
  const validCategory = formData.category.trim().length > 0;
  const validDescription = formData.description.trim().length > 0 && 
                          formData.description.length <= MAX_DESCRIPTION_LENGTH;
  const validContent = formData.promptContent.trim().length > 0;
  
  return {
    validation: {
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
        message: !formData.description.trim().length 
          ? t('editPromptPage.descriptionRequired') 
          : formData.description.length > MAX_DESCRIPTION_LENGTH 
            ? t('editPromptPage.descriptionTooLong', { max: MAX_DESCRIPTION_LENGTH }) 
            : '' 
      },
      promptContent: { 
        valid: validContent, 
        message: validContent ? '' : t('editPromptPage.contentRequired') 
      }
    },
    isValid: validTitle && validCategory && validDescription && validContent
  };
};

/**
 * 确定新的提示词状态
 */
export const determinePromptStatus = (isPublic: boolean): string => {
  // 规则：
  // 1. 如果更新为非公开状态，直接设为已发布（不需要审核）
  // 2. 如果更新为公开状态，设为审核中
  return isPublic ? 'reviewing' : 'published';
}; 