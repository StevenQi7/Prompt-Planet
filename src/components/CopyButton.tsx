'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CopyButtonProps {
  textToCopy?: string;
  content?: string;
  id?: string;
  copiedId?: string | null;
  handleCopy?: (id: string, content: string) => void;
  className?: string;
}

export default function CopyButton({ 
  textToCopy, 
  content, 
  id, 
  copiedId, 
  handleCopy, 
  className = 'text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center shine-effect'
}: CopyButtonProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // 使用内部复制状态或外部传入的复制状态
  const isCopied = id && copiedId ? copiedId === id : copied;
  const textToCopyFinal = textToCopy || content || '';

  const copy = () => {
    if (id && handleCopy && content) {
      // 使用外部处理函数
      handleCopy(id, content);
    } else {
      // 使用内部复制逻辑
      try {
        // 首先尝试使用现代 Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopyFinal)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
              
              fallbackCopy();
            });
        } else {
          // 如果不支持 Clipboard API，使用后备方案
          fallbackCopy();
        }
      } catch (err) {
        
        fallbackCopy();
      }
    }
  };

  // 后备复制方案
  const fallbackCopy = () => {
    try {
      // 创建临时文本区域
      const textArea = document.createElement('textarea');
      textArea.value = textToCopyFinal;
      
      // 设置样式使其不可见
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      
      // 选择并复制文本
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      
      // 清理
      textArea.remove();
      
      // 更新状态
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      
    }
  };

  return (
    <button
      onClick={copy}
      className={className}
      aria-label={t('homePage.copyButton')}
    >
      {isCopied ? (
        <span className="flex items-center text-green-600">
          <i className="fas fa-check mr-1.5"></i> {t('homePage.copied')}
        </span>
      ) : (
        <span className="flex items-center">
          <i className="fas fa-copy mr-1.5"></i> {t('homePage.copyButton')}
        </span>
      )}
    </button>
  );
} 