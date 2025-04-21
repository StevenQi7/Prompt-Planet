import React from 'react';
import { FaUser, FaEnvelope, FaUserTag } from 'react-icons/fa';
import { BasicInfoFormData } from '@/utils/settingsUtils';
import FormMessage from '../Auth/FormMessage';
import { TFunction } from '@/types/i18n';

interface BasicInfoFormProps {
  user: {
    username: string;
    email: string;
    nickname?: string;
  };
  formData: BasicInfoFormData;
  errors: {
    nickname: string;
    general: string;
  };
  isLoading: boolean;
  successMessage?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  t: TFunction;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  user,
  formData,
  errors,
  isLoading,
  successMessage,
  onInputChange,
  onCancel,
  t
}) => {
  return (
    <div className="space-y-4">
      {/* 成功或错误消息 */}
      <FormMessage 
        successMessage={successMessage} 
        errorMessage={errors.general}
      />

      {/* 用户名 (只读) */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          {t('settings.username')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaUser className="text-gray-400" />
          </div>
          <input
            type="text"
            id="username"
            value={user.username}
            readOnly
            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
          />
        </div>
      </div>

      {/* 邮箱 (只读) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t('settings.email')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            value={user.email}
            readOnly
            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
          />
        </div>
      </div>

      {/* 昵称 */}
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
          {t('settings.nickname')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaUserTag className="text-gray-400" />
          </div>
          <input
            type="text"
            id="nickname"
            value={formData.nickname}
            onChange={onInputChange}
            className={`w-full pl-10 px-3 py-2 border ${
              errors.nickname ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-gray-700`}
            placeholder={t('settings.nicknamePlaceholder')}
          />
        </div>
        {errors.nickname && (
          <p className="mt-1 text-sm text-red-600">{errors.nickname}</p>
        )}
      </div>

      {/* 表单按钮 */}
      <div className="flex items-center justify-end mt-4 space-x-3">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          onClick={onCancel}
        >
          {t('settings.cancel')}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? t('settings.saving') : t('settings.saveChanges')}
        </button>
      </div>
    </div>
  );
};

export default BasicInfoForm; 