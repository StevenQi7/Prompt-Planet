import React from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { PasswordFormData, PasswordVisibility } from '@/utils/settingsUtils';
import FormMessage from '../Auth/FormMessage';
import { TFunction } from '@/types/i18n';

interface PasswordFormProps {
  formData: PasswordFormData;
  errors: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    general: string;
  };
  passwordVisibility: PasswordVisibility;
  isLoading: boolean;
  successMessage?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePasswordVisibility: (field: keyof PasswordVisibility) => void;
  onCancel: () => void;
  t: TFunction;
}

const PasswordForm: React.FC<PasswordFormProps> = ({
  formData,
  errors,
  passwordVisibility,
  isLoading,
  successMessage,
  onInputChange,
  onTogglePasswordVisibility,
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

      {/* 当前密码 */}
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
          {t('settings.currentPassword')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-gray-400" />
          </div>
          <input
            type={passwordVisibility.currentPassword ? "text" : "password"}
            id="currentPassword"
            value={formData.currentPassword}
            onChange={onInputChange}
            className={`w-full pl-10 pr-10 px-3 py-2 border ${
              errors.currentPassword ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-gray-700`}
            placeholder={t('settings.passwordPlaceholder')}
          />
          <button 
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => onTogglePasswordVisibility('currentPassword')}
            tabIndex={-1}
          >
            {passwordVisibility.currentPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
        )}
      </div>

      {/* 新密码 */}
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
          {t('settings.newPassword')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-gray-400" />
          </div>
          <input
            type={passwordVisibility.newPassword ? "text" : "password"}
            id="newPassword"
            value={formData.newPassword}
            onChange={onInputChange}
            className={`w-full pl-10 pr-10 px-3 py-2 border ${
              errors.newPassword ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-gray-700`}
            placeholder={t('settings.passwordPlaceholder')}
          />
          <button 
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => onTogglePasswordVisibility('newPassword')}
            tabIndex={-1}
          >
            {passwordVisibility.newPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
        )}
      </div>

      {/* 确认新密码 */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          {t('settings.confirmPassword')} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-gray-400" />
          </div>
          <input
            type={passwordVisibility.confirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={onInputChange}
            className={`w-full pl-10 pr-10 px-3 py-2 border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-gray-700`}
            placeholder={t('settings.passwordPlaceholder')}
          />
          <button 
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => onTogglePasswordVisibility('confirmPassword')}
            tabIndex={-1}
          >
            {passwordVisibility.confirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
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

export default PasswordForm; 