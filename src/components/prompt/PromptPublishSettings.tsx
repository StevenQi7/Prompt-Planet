import React, { ChangeEvent } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PromptPublishSettingsProps {
  isPublic: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PromptPublishSettings: React.FC<PromptPublishSettingsProps> = ({
  isPublic,
  onChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={isPublic}
            onChange={onChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm font-medium text-gray-700">
            {t('createPromptPage.publicShare')}
          </label>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {t('createPromptPage.publicShareDesc')}
        </p>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-md font-medium text-blue-800 mb-2">
          <i className="fas fa-info-circle mr-2"></i>
          {isPublic 
            ? t('createPromptPage.publicReviewNotice')
            : t('createPromptPage.privateNotice')
          }
        </h3>
        <p className="text-sm text-blue-700">
          {isPublic 
            ? t('createPromptPage.publicReviewDesc')
            : t('createPromptPage.privateDesc')
          }
        </p>
      </div>
    </div>
  );
};

export default PromptPublishSettings; 