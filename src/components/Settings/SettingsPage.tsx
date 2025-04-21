'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import TabMenu from './TabMenu';
import BasicInfoForm from './BasicInfoForm';
import PasswordForm from './PasswordForm';
import LoadingSpinner from '../UI/LoadingSpinner';
import { TFunction } from '@/types/i18n';
import { 
  SettingsFormData, 
  SettingsFormErrors, 
  PasswordVisibility,
  updateUserBasicInfo,
  updateUserPassword,
  validateBasicInfoForm,
  validatePasswordForm,
  togglePasswordVisibility
} from '@/utils/settingsUtils';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, loading, updateUserInfo } = useAuth();
  const router = useRouter();

  // 表单状态
  const [formData, setFormData] = useState<SettingsFormData>({
    nickname: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 表单验证错误
  const [errors, setErrors] = useState<SettingsFormErrors>({
    nickname: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    general: ''
  });

  // 成功消息
  const [successMessage, setSuccessMessage] = useState('');

  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  
  // 活动标签
  const [activeTab, setActiveTab] = useState('basicInfo');

  // 密码可见性状态
  const [passwordVisibilities, setPasswordVisibilities] = useState<PasswordVisibility>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  // 标签列表
  const tabs = [
    { id: 'basicInfo', label: t('settings.basicInfo') },
    { id: 'changePassword', label: t('settings.changePassword') }
  ];

  // 在用户数据加载后更新表单
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nickname: user.nickname || ''
      }));
    }
  }, [user]);

  // 如果未登录，重定向到登录页面
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // 重置表单消息
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // 清除相关错误
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }

    // 如果修改了密码字段，检查确认密码是否匹配
    if (id === 'newPassword' || id === 'confirmPassword') {
      const newPasswordVal = id === 'newPassword' ? value : formData.newPassword;
      const confirmPasswordVal = id === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (confirmPasswordVal && newPasswordVal !== confirmPasswordVal) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: t('settings.passwordMismatch')
        }));
      } else if (confirmPasswordVal) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }));
      }
    }
  };

  // 切换密码可见性
  const handleTogglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setPasswordVisibilities(prev => togglePasswordVisibility(prev, field));
  };

  // 取消基本信息编辑
  const handleCancelBasicInfo = () => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nickname: user.nickname || ''
      }));
    }
    setErrors(prev => ({ ...prev, nickname: '', general: '' }));
    setSuccessMessage('');
  };

  // 取消密码编辑
  const handleCancelPassword = () => {
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setErrors(prev => ({ 
      ...prev, 
      currentPassword: '', 
      newPassword: '', 
      confirmPassword: '', 
      general: '' 
    }));
    setSuccessMessage('');
  };

  // 更新基本信息
  const handleUpdateBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const tFunction: TFunction = (key: any, params?: any) => t(key, params);
    
    const { isValid, errors: validationErrors } = validateBasicInfoForm(
      { nickname: formData.nickname },
      tFunction
    );
    
    if (!isValid) {
      setErrors(prev => ({ 
        ...prev, 
        nickname: validationErrors.nickname,
        general: validationErrors.general
      }));
      return;
    }

    const success = await updateUserBasicInfo(
      { nickname: formData.nickname },
      tFunction,
      {
        onStart: () => {
          setIsLoading(true);
          setErrors(prev => ({ ...prev, general: '' }));
          setSuccessMessage('');
        },
        onSuccess: () => {
          setSuccessMessage(t('settings.saveSuccess'));
          // 更新全局用户状态
          updateUserInfo({
            nickname: formData.nickname
          });
        },
        onError: (error) => {
          setErrors(prev => ({ ...prev, general: error }));
        },
        onFinish: () => {
          setIsLoading(false);
        }
      }
    );
  };

  // 更新密码
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const tFunction: TFunction = (key: any, params?: any) => t(key, params);
    
    const { isValid, errors: validationErrors } = validatePasswordForm(
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      },
      tFunction
    );
    
    if (!isValid) {
      setErrors(prev => ({ 
        ...prev,
        currentPassword: validationErrors.currentPassword,
        newPassword: validationErrors.newPassword,
        confirmPassword: validationErrors.confirmPassword,
        general: validationErrors.general
      }));
      return;
    }
    
    const success = await updateUserPassword(
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      },
      tFunction,
      {
        onStart: () => {
          setIsLoading(true);
          setErrors(prev => ({ ...prev, general: '' }));
          setSuccessMessage('');
        },
        onSuccess: () => {
          setSuccessMessage(t('settings.saveSuccess'));
          // 清除密码字段
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
        },
        onError: (error, fieldError) => {
          if (fieldError) {
            setErrors(prev => ({ 
              ...prev, 
              [fieldError.field]: fieldError.message 
            }));
          } else {
            setErrors(prev => ({ ...prev, general: error }));
          }
        },
        onFinish: () => {
          setIsLoading(false);
        }
      }
    );
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    if (activeTab === 'basicInfo') {
      handleUpdateBasicInfo(e);
    } else {
      handleUpdatePassword(e);
    }
  };

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-6 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{t('settings.title')}</h1>
          <p className="text-gray-600">{t('settings.subtitle')}</p>
        </div>

        {/* 设置卡片 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* 标签菜单 */}
          <TabMenu 
            tabs={tabs} 
            activeTab={activeTab} 
            onChange={setActiveTab} 
          />

          {/* 表单区域 */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* 基本信息表单 */}
              {activeTab === 'basicInfo' && (
                <BasicInfoForm
                  user={user}
                  formData={{ nickname: formData.nickname }}
                  errors={{ 
                    nickname: errors.nickname, 
                    general: errors.general 
                  }}
                  isLoading={isLoading}
                  successMessage={successMessage}
                  onInputChange={handleInputChange}
                  onCancel={handleCancelBasicInfo}
                  t={t as any}
                />
              )}

              {/* 修改密码表单 */}
              {activeTab === 'changePassword' && (
                <PasswordForm
                  formData={{
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                  }}
                  errors={{
                    currentPassword: errors.currentPassword,
                    newPassword: errors.newPassword,
                    confirmPassword: errors.confirmPassword,
                    general: errors.general
                  }}
                  passwordVisibility={passwordVisibilities}
                  isLoading={isLoading}
                  successMessage={successMessage}
                  onInputChange={handleInputChange}
                  onTogglePasswordVisibility={handleTogglePasswordVisibility}
                  onCancel={handleCancelPassword}
                  t={t as any}
                />
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 