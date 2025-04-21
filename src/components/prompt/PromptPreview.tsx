import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';
import { FaRegCopy } from 'react-icons/fa';

interface PromptPreviewProps {
  formData: {
    title: string;
    description: string;
    promptContent: string;
    usageGuide?: string;
  };
  categoryName: string;
  tags: Array<{id: string, name: string, displayName: string}>;
  previewImages: string[];
  onClose: () => void;
}

const PromptPreview: React.FC<PromptPreviewProps> = ({
  formData,
  categoryName,
  tags,
  previewImages,
  onClose
}) => {
  const { t, language } = useLanguage();
  
  // 复制提示词内容到剪贴板
  const copyPromptContent = () => {
    navigator.clipboard.writeText(formData.promptContent);
    
    // 可以添加一个提示，但由于这只是预览，我们保持简单
    alert(t('promptDetail.copied'));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{t('createPromptPage.previewTitle')}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {/* 标题和基本信息 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {formData.title || t('createPromptPage.noTitle')}
            </h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
              <span className="mr-4">
                <i className="fas fa-folder mr-1"></i> 
                {categoryName || t('createPromptPage.noCategory')}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">
              {formData.description || t('createPromptPage.noDescription')}
            </p>
            
            {/* 标签 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map(tag => (
                  <span 
                    key={tag.id} 
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md"
                  >
                    {language === 'zh' ? tag.displayName : tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* 提示词内容 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{t('promptDetail.promptContent')}</h3>
              <button 
                onClick={copyPromptContent}
                className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
              >
                <FaRegCopy className="mr-1" />
                {t('promptDetail.copyPrompt')}
              </button>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              {formData.promptContent ? (
                <div className="prose max-w-none">
                  <ReactMarkdown>{formData.promptContent}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-500 italic">{t('createPromptPage.noContent')}</p>
              )}
            </div>
          </div>
          
          {/* 使用指南 */}
          {formData.usageGuide && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('promptDetail.usageGuide')}</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="prose max-w-none">
                  <ReactMarkdown>{formData.usageGuide}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
          
          {/* 预览图片 */}
          {previewImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('createPromptPage.previewImages')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previewImages.map((img, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={img} 
                      alt={`${t('createPromptPage.previewImage')} ${index + 1}`}
                      className="w-full h-auto max-h-[300px] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 关闭按钮 */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('createPromptPage.closePreview')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptPreview; 