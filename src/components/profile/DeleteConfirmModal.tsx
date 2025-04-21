'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  isDeleting,
  onCancel,
  onConfirm
}: DeleteConfirmModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 transform transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-800">{t('profile.confirmDelete')}</h3>
        
        <div className="mt-4">
          <p className="text-gray-600 mb-2">{t('profile.deletePromptWarning')}</p>
          <p className="text-red-600 text-sm">{t('profile.deletePromptConfirm')}</p>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-300"
          >
            {t('profile.cancel')}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center justify-center min-w-[100px]"
          >
            {isDeleting ? t('profile.deleting') : t('profile.confirmDeleteBtn')}
            {isDeleting && (
              <span className="ml-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 