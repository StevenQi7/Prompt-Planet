import React from 'react';
import dynamic from 'next/dynamic';
import MarkdownIt from 'markdown-it';
import { useLanguage } from '@/contexts/LanguageContext';
import 'react-markdown-editor-lite/lib/index.css';

// 动态导入编辑器组件避免SSR问题
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
  loading: () => {
    try {
      const { t } = useLanguage();
      return (
        <div className="w-full h-[400px] border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
          <div className="text-gray-500">{t('editPromptPage.editorLoading')}</div>
        </div>
      );
    } catch (error) {
      return (
        <div className="w-full h-[400px] border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
          <div className="text-gray-500">编辑器加载中...</div>
        </div>
      );
    }
  },
});

interface PromptContentEditorProps {
  content: string;
  usageGuide: string;
  onContentChange: ({ text }: { text: string }) => void;
  onUsageGuideChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  contentValidation: { valid: boolean; message: string };
  hideUsageGuide?: boolean;
}

const PromptContentEditor: React.FC<PromptContentEditorProps> = ({
  content,
  usageGuide,
  onContentChange,
  onUsageGuideChange,
  contentValidation,
  hideUsageGuide = false
}) => {
  const { t } = useLanguage();
  
  // 初始化Markdown解析器
  const mdParser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  return (
    <div className="mb-6">
      <div>
        <label htmlFor="promptContent" className="block text-sm font-medium text-gray-700 mb-2">
          {t('createPromptPage.content')} <span className="text-red-500">*</span>
        </label>
        
        <div className="markdown-editor">
          <MdEditor
            value={content}
            renderHTML={text => mdParser.render(text)}
            onChange={onContentChange}
            style={{ height: '400px' }}
            config={{
              view: { menu: true, md: true, html: false },
              canView: { menu: true, md: true, html: false, fullScreen: true },
              shortcuts: true,
            }}
            placeholder={t('editPromptPage.contentPlaceholder')}
          />
        </div>
        
        {!contentValidation.valid && (
          <p className="mt-1 text-sm text-red-600">{contentValidation.message}</p>
        )}
      </div>
      
      {!hideUsageGuide && (
        <div className="mt-4">
          <label htmlFor="usageGuide" className="block text-sm font-medium text-gray-700 mb-1">
            {t('editPromptPage.usageGuide')}
          </label>
          <textarea 
            id="usageGuide" 
            name="usageGuide" 
            rows={3}
            placeholder={t('editPromptPage.usageGuidePlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={usageGuide}
            onChange={onUsageGuideChange}
          />
        </div>
      )}
    </div>
  );
};

export default PromptContentEditor; 