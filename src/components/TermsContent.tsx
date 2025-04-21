'use client';

import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';

export default function TermsContent() {
  const { t } = useTranslations();

  const sections = [
    'introduction',
    'definitions',
    'account',
    'content',
    'intellectual',
    'liability',
    'changes'
  ] as const;

  const getTermsKey = (section: typeof sections[number], type: 'title' | 'content') => {
    return `terms.sections.${section}.${type}` as const;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题横幅 */}
      <div className="relative mb-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('terms.title')}</h1>
            <p className="text-lg text-gray-100">{t('terms.lastUpdated')}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 目录 */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">目录</h2>
            <nav>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section}>
                    <a
                      href={`#${section}`}
                      className="text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      {t(getTermsKey(section, 'title'))}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 条款内容 */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            {sections.map((section) => (
              <section key={section} id={section} className="mb-12 last:mb-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t(getTermsKey(section, 'title'))}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t(getTermsKey(section, 'content'))}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 