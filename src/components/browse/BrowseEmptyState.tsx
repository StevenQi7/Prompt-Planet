'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface BrowseEmptyStateProps {
  onResetFilters: () => void;
}

export default function BrowseEmptyState({ onResetFilters }: BrowseEmptyStateProps) {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
      <div className="text-gray-400 text-5xl mb-4">
        <i className="fas fa-search"></i>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {t('browse.noResults')}
      </h3>
      <p className="text-gray-600 mb-6">
        {t('searchResults.tryAgain')}
      </p>
      <button
        onClick={onResetFilters}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300"
      >
        {t('browse.allCategories')}
      </button>
    </div>
  );
} 