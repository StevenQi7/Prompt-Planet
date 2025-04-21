import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/contexts/LanguageContext';
import CopyButton from '@/components/CopyButton';

interface PromptContentProps {
  content: string;
  usageGuide?: string;
}

export default function PromptContent({ content, usageGuide }: PromptContentProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{t('promptDetail.promptContent')}</h2>
        <CopyButton
          textToCopy={content}
          className="bg-white hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-md shadow-sm transition duration-300 flex items-center shrink-0"
        />
      </div>
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
        <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm">{content}</pre>
      </div>
      
      {/* 使用指南 - 可选部分 */}
      {usageGuide && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('promptDetail.usageGuide')}</h2>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="prose max-w-none text-sm">
              <ReactMarkdown>{usageGuide}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 