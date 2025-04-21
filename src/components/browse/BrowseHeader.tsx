'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface BrowseHeaderProps {
  totalItems: number;
  isGridView: boolean;
  onToggleView: (isGrid: boolean) => void;
}

export default function BrowseHeader({
  totalItems,
  isGridView,
  onToggleView
}: BrowseHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 shadow-sm">
          <i className="fas fa-th-large text-indigo-600"></i>
        </div>
        {t('browse.title')}
      </h1>
      <p className="text-gray-600 ml-13 pl-1">{t('browse.subtitle')}</p>
    </div>
  );
} 