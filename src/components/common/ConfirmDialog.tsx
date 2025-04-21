import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  icon?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  confirmButtonClass = 'bg-indigo-600 hover:bg-indigo-700',
  cancelButtonClass = 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  icon
}) => {
  const { t } = useLanguage();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          {title && (
            <div className="flex items-center mb-4">
              {icon && <div className="mr-3">{icon}</div>}
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
          )}
          
          <div className="mt-2">
            <p className="text-sm text-gray-600">{message}</p>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border border-transparent rounded-md shadow-sm ${cancelButtonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={onCancel}
            >
              {cancelText || t('common.cancel')}
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm ${confirmButtonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={onConfirm}
            >
              {confirmText || t('common.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 