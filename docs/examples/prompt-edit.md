# 提示词创建与编辑

本文档演示了如何在 Prompt Planet 项目中实现提示词的创建和编辑功能。

## 创建新提示词

以下是创建新提示词的示例代码：

```typescript
import { useState } from 'react';
import { createPrompt } from '@/services/promptService';
import { getAllCategories } from '@/services/categoryService';
import { searchTags } from '@/services/tagService';
import { uploadImage } from '@/services/uploadService';
import { useLanguage } from '@/hooks/useLanguage';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

function CreatePromptForm() {
  const { t } = useLanguage();
  const router = useRouter();
  
  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    categoryId: '',
    usageGuide: '',
    isPublic: true,
    tags: []
  });
  
  // 上传图片状态
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchedTags, setSearchedTags] = useState([]);
  
  // 表单验证
  const [errors, setErrors] = useState({});
  
  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getAllCategories();
        setCategories(result.categories);
      } catch (err) {
        console.error('获取分类失败:', err);
        toast.error(t('createPromptPage.fetchCategoriesError'));
      }
    };
    
    fetchCategories();
  }, [t]);
  
  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // 清除对应的错误信息
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // 搜索标签
  const handleSearchTags = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchedTags([]);
      return;
    }
    
    try {
      const result = await searchTags(query);
      setSearchedTags(result.tags);
    } catch (err) {
      console.error('搜索标签失败:', err);
      toast.error(t('createPromptPage.searchTagsFailed'));
    }
  };
  
  // 添加标签
  const handleAddTag = (tag) => {
    if (selectedTags.length >= 5) {
      toast.error(t('createPromptPage.maxTagsReached'));
      return;
    }
    
    if (!selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
      setFormData({
        ...formData,
        tags: [...formData.tags, tag.id]
      });
    }
    
    setSearchedTags([]);
  };
  
  // 移除标签
  const handleRemoveTag = (tagId) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
    setFormData({
      ...formData,
      tags: formData.tags.filter(id => id !== tagId)
    });
  };
  
  // 处理图片上传
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      toast.error(t('createPromptPage.maxImagesReached', { count: 5 }));
      return;
    }
    
    setUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadImage({ file });
        return result;
      });
      
      const uploadedImages = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedImages]);
      
      toast.success(t('createPromptPage.uploadSuccess'));
    } catch (err) {
      console.error('上传图片失败:', err);
      toast.error(t('createPromptPage.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };
  
  // 移除已上传图片
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  // 验证表单
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = t('createPromptPage.titleRequired');
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = t('createPromptPage.categoryRequired');
    }
    
    if (!formData.content.trim()) {
      newErrors.content = t('createPromptPage.contentRequired');
    }
    
    if (!formData.description.trim()) {
      newErrors.description = t('createPromptPage.descriptionRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(t('common.formErrors'));
      return;
    }
    
    setLoading(true);
    
    try {
      // 准备图片数据
      const imageUrls = images.map(img => img.url);
      
      // 创建提示词
      const result = await createPrompt({
        ...formData,
        images: imageUrls
      });
      
      toast.success(t('createPromptPage.createSuccess'));
      
      // 创建成功后跳转
      router.push(`/prompts/${result.id}`);
    } catch (err) {
      console.error('创建提示词失败:', err);
      toast.error(t('createPromptPage.createFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="create-prompt-form">
      <h1>{t('createPromptPage.title')}</h1>
      <p className="subtitle">{t('createPromptPage.subtitle')}</p>
      
      {/* 标题 */}
      <div className="form-group">
        <label htmlFor="title">
          {t('createPromptPage.promptTitle')} <span className="required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          maxLength={50}
          placeholder={t('createPromptPage.promptTitlePlaceholder')}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <div className="error-message">{errors.title}</div>}
      </div>
      
      {/* 分类 */}
      <div className="form-group">
        <label htmlFor="categoryId">
          {t('createPromptPage.category')} <span className="required">*</span>
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          className={errors.categoryId ? 'error' : ''}
        >
          <option value="">{t('createPromptPage.selectCategory')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.displayName}
            </option>
          ))}
        </select>
        {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
      </div>
      
      {/* 内容 */}
      <div className="form-group">
        <label htmlFor="content">
          {t('createPromptPage.promptContent')} <span className="required">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          rows={8}
          placeholder={t('createPromptPage.contentPlaceholder')}
          className={errors.content ? 'error' : ''}
        />
        {errors.content && <div className="error-message">{errors.content}</div>}
      </div>
      
      {/* 描述 */}
      <div className="form-group">
        <label htmlFor="description">
          {t('createPromptPage.description')} <span className="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          maxLength={500}
          placeholder={t('createPromptPage.descriptionPlaceholder')}
          className={errors.description ? 'error' : ''}
        />
        <div className="char-counter">
          {500 - formData.description.length} {t('createPromptPage.charactersRemaining')}
        </div>
        {errors.description && <div className="error-message">{errors.description}</div>}
      </div>
      
      {/* 标签 */}
      <div className="form-group">
        <label>{t('createPromptPage.tags')}</label>
        <div className="tags-input-container">
          <input
            type="text"
            placeholder={t('createPromptPage.searchTags')}
            onChange={(e) => handleSearchTags(e.target.value)}
          />
          {searchedTags.length > 0 && (
            <ul className="tags-dropdown">
              {searchedTags.map((tag) => (
                <li
                  key={tag.id}
                  onClick={() => handleAddTag(tag)}
                  className="tag-item"
                >
                  {tag.displayName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="selected-tags">
          {selectedTags.map((tag) => (
            <span key={tag.id} className="tag">
              {tag.displayName}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="remove-tag"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      
      {/* 使用指南 */}
      <div className="form-group">
        <label htmlFor="usageGuide">{t('createPromptPage.usageGuide')}</label>
        <textarea
          id="usageGuide"
          name="usageGuide"
          value={formData.usageGuide}
          onChange={handleInputChange}
          rows={5}
          placeholder={t('createPromptPage.usageGuidePlaceholder')}
        />
      </div>
      
      {/* 图片上传 */}
      <div className="form-group">
        <label>{t('createPromptPage.images')}</label>
        <div className="image-upload-container">
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            onChange={handleImageUpload}
            disabled={uploading || images.length >= 5}
          />
          <p className="upload-note">
            {t('createPromptPage.maxImagesReached', { count: 5 })}
          </p>
        </div>
        {uploading && <div className="loading">{t('createPromptPage.uploading')}</div>}
        <div className="image-preview-container">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image.url} alt={`预览图 ${index + 1}`} />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="remove-image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* 公开设置 */}
      <div className="form-group checkbox-group">
        <input
          id="isPublic"
          name="isPublic"
          type="checkbox"
          checked={formData.isPublic}
          onChange={handleInputChange}
        />
        <label htmlFor="isPublic" className="checkbox-label">
          {t('createPromptPage.isPublic')}
        </label>
        <p className="checkbox-description">
          {t('createPromptPage.isPublicDesc')}
        </p>
      </div>
      
      {/* 提交按钮 */}
      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => router.back()}
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? t('createPromptPage.creating') : t('createPromptPage.create')}
        </button>
      </div>
    </form>
  );
}
```

## 编辑现有提示词

以下代码展示如何实现提示词编辑功能：

```typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getPromptById, updatePrompt } from '@/services/promptService';
import { getAllCategories } from '@/services/categoryService';
import { searchTags } from '@/services/tagService';
import { uploadImage, deleteImage } from '@/services/uploadService';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'react-hot-toast';

function EditPromptForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const { id } = router.query;
  
  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    categoryId: '',
    usageGuide: '',
    isPublic: true,
    tags: []
  });
  
  // 提示词数据
  const [prompt, setPrompt] = useState(null);
  const [originalStatus, setOriginalStatus] = useState('');
  
  // 图片状态
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchedTags, setSearchedTags] = useState([]);
  
  // 表单验证
  const [errors, setErrors] = useState({});
  
  // 获取提示词数据
  useEffect(() => {
    const fetchPromptData = async () => {
      if (!id) return;
      
      try {
        const promptData = await getPromptById(id);
        setPrompt(promptData);
        setOriginalStatus(promptData.status);
        
        // 设置表单数据
        setFormData({
          title: promptData.title,
          content: promptData.content,
          description: promptData.description,
          categoryId: promptData.category.id,
          usageGuide: promptData.usageGuide || '',
          isPublic: promptData.isPublic,
          tags: promptData.tags.map(t => t.tag.id)
        });
        
        // 设置已选择的标签
        setSelectedTags(promptData.tags.map(t => t.tag));
        
        // 设置图片
        if (promptData.images && promptData.images.length > 0) {
          setImages(promptData.images.map(url => ({ url })));
        }
      } catch (err) {
        console.error('获取提示词数据失败:', err);
        toast.error(t('editPromptPage.fetchError'));
        router.push('/dashboard/prompts');
      }
    };
    
    const fetchCategories = async () => {
      try {
        const result = await getAllCategories();
        setCategories(result.categories);
      } catch (err) {
        console.error('获取分类失败:', err);
        toast.error(t('editPromptPage.fetchCategoriesError'));
      }
    };
    
    Promise.all([fetchPromptData(), fetchCategories()])
      .finally(() => setInitialLoading(false));
  }, [id, router, t]);
  
  // 处理输入变化与表单验证（同创建提示词）
  
  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(t('common.formErrors'));
      return;
    }
    
    setLoading(true);
    
    try {
      // 准备图片数据
      const imageUrls = images.map(img => img.url);
      
      // 更新提示词
      await updatePrompt(id, {
        ...formData,
        images: imageUrls
      });
      
      toast.success(t('editPromptPage.updateSuccess'));
      
      // 更新成功后跳转
      router.push(`/prompts/${id}`);
    } catch (err) {
      console.error('更新提示词失败:', err);
      toast.error(t('editPromptPage.updateErrorTryAgain'));
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return <div className="loading-container">{t('editPromptPage.loading')}</div>;
  }
  
  return (
    <form onSubmit={handleSubmit} className="edit-prompt-form">
      <h1>{t('editPromptPage.title')}</h1>
      <p className="subtitle">{t('editPromptPage.subtitle')}</p>
      
      {originalStatus === 'rejected' && (
        <div className="rejection-note">
          <h3>{t('editPromptPage.rejectionReason')}</h3>
          <p>{prompt.rejectionReason || t('editPromptPage.noSpecificReason')}</p>
        </div>
      )}
      
      {/* 表单内容同创建提示词，只是一些文本变化 */}
      
      {/* 状态提示 */}
      {originalStatus === 'published' && formData.isPublic && (
        <div className="status-note">
          <p>{t('editPromptPage.isPublicDesc')}</p>
        </div>
      )}
      
      {/* 提交按钮 */}
      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => router.back()}
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? t('editPromptPage.updating') : t('editPromptPage.update')}
        </button>
      </div>
    </form>
  );
}
```

## 提示词预览组件

以下是提示词预览组件的示例代码：

```typescript
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Markdown from 'react-markdown';
import CopyButton from '@/components/common/CopyButton';

function PromptPreview({ title, content, usageGuide }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('content');
  
  return (
    <div className="prompt-preview">
      <h3>{t('common.preview')}</h3>
      
      <div className="preview-container">
        <h2 className="prompt-title">{title || t('createPromptPage.promptTitlePlaceholder')}</h2>
        
        <div className="preview-tabs">
          <button
            type="button"
            className={`tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            {t('createPromptPage.content')}
          </button>
          {usageGuide && (
            <button
              type="button"
              className={`tab ${activeTab === 'usageGuide' ? 'active' : ''}`}
              onClick={() => setActiveTab('usageGuide')}
            >
              {t('createPromptPage.usageGuide')}
            </button>
          )}
        </div>
        
        <div className="preview-content">
          {activeTab === 'content' ? (
            <>
              <Markdown>{content || t('createPromptPage.contentPlaceholder')}</Markdown>
              {content && <CopyButton text={content} />}
            </>
          ) : (
            <Markdown>{usageGuide}</Markdown>
          )}
        </div>
      </div>
    </div>
  );
}
```

## 表单验证工具

以下是一个用于提示词表单验证的工具函数示例：

```typescript
// src/utils/validators.js

// 验证标题
export function validateTitle(title) {
  if (!title || !title.trim()) {
    return { valid: false, message: 'titleRequired' };
  }
  
  if (title.length > 50) {
    return { valid: false, message: 'titleTooLong', args: { max: 50 } };
  }
  
  return { valid: true };
}

// 验证内容
export function validateContent(content) {
  if (!content || !content.trim()) {
    return { valid: false, message: 'contentRequired' };
  }
  
  return { valid: true };
}

// 验证描述
export function validateDescription(description) {
  if (!description || !description.trim()) {
    return { valid: false, message: 'descriptionRequired' };
  }
  
  if (description.length > 500) {
    return { valid: false, message: 'descriptionTooLong', args: { max: 500 } };
  }
  
  return { valid: true };
}

// 验证分类
export function validateCategory(categoryId) {
  if (!categoryId) {
    return { valid: false, message: 'categoryRequired' };
  }
  
  return { valid: true };
}

// 验证整个表单
export function validatePromptForm(formData) {
  const errors = {};
  
  const titleValidation = validateTitle(formData.title);
  if (!titleValidation.valid) {
    errors.title = titleValidation.message;
  }
  
  const contentValidation = validateContent(formData.content);
  if (!contentValidation.valid) {
    errors.content = contentValidation.message;
  }
  
  const descriptionValidation = validateDescription(formData.description);
  if (!descriptionValidation.valid) {
    errors.description = descriptionValidation.message;
  }
  
  const categoryValidation = validateCategory(formData.categoryId);
  if (!categoryValidation.valid) {
    errors.categoryId = categoryValidation.message;
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
```

以上示例代码涵盖了提示词创建、编辑、预览和验证的核心功能，可以根据项目需求进行调整和扩展。 