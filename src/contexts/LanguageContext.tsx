'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import locales, { Language } from '@/locales';

// 支持嵌套的翻译键类型
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationKey = NestedKeyOf<typeof locales.zh>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, any>) => string;
}

const defaultContext: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  t: (key: TranslationKey) => key,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');

  // 初始化时，尝试从localStorage中恢复语言设置，如果没有则默认为英语
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
        setLanguage(savedLanguage as Language);
      } else {
        // 默认使用英语
        localStorage.setItem('language', 'en');
      }
    }
  }, []);

  // 保存语言偏好到localStorage
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: TranslationKey, params?: Record<string, any>): string => {
    const translations = locales[language];
    if (!translations) {
      return key;
    }
    
    // 处理嵌套的翻译键
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value === undefined || value === null) {
        return key;
      }
      value = value[k];
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    let text = value;
    
    // 如果有参数，进行替换
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}; 