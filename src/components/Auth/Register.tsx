'use client';

import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import FormInput from './FormInput';
import FormMessage from './FormMessage';
import { validateRegisterForm, RegisterFormData, AuthFormErrors } from '@/utils/authValidation';
import { TFunction } from '@/types/i18n';

export default function Register() {
  const { t } = useLanguage();
  const { register } = useAuth();
  const router = useRouter();
  
  // 注册信息状态
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // 错误信息状态
  const [errors, setErrors] = useState<AuthFormErrors>({});
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  
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
        [id]: undefined
      }));
    }
    
    // 如果修改了密码或确认密码，验证两者是否匹配
    if (id === 'password' || id === 'confirmPassword') {
      if (id === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: t('auth.passwordMismatch')
        }));
      } else if (id === 'confirmPassword' && value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: t('auth.passwordMismatch')
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: undefined
        }));
      }
    }
  };

  // 处理表单提交
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // 表单验证
    const validation = validateRegisterForm(formData, t as TFunction);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname
      });
      
      if (!result.success) {
        toast.error(result.message);
        setErrors({ 
          ...errors, 
          general: result.message 
        });
      } else {
        toast.success(t('auth.registerSuccess'));
        router.push('/login');
      }
    } catch (error) {
      
      toast.error(t('auth.registerError'));
      setErrors({ 
        ...errors, 
        general: (error as Error).message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            {t('auth.registerTitle')}
          </h1>
          <p className="text-gray-600">{t('auth.registerSubtitle')}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300">
          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {errors.general && (
                <FormMessage errorMessage={errors.general} />
              )}
              
              <FormInput
                id="username"
                label={t('auth.username')}
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="username"
                required
                disabled={isLoading}
                error={errors.username}
                icon={<FaUser className="text-gray-400" />}
              />
              
              <FormInput
                id="nickname"
                label={t('auth.nickname')}
                type="text"
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="Your display name"
                disabled={isLoading}
                icon={<FaUserTag className="text-gray-400" />}
              />
              
              <FormInput
                id="email"
                label={t('auth.email')}
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                required
                disabled={isLoading}
                error={errors.email}
                icon={<FaEnvelope className="text-gray-400" />}
              />
              
              <FormInput
                id="password"
                label={t('auth.password')}
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
                error={errors.password}
                icon={<FaLock className="text-gray-400" />}
              />
              
              <FormInput
                id="confirmPassword"
                label={t('auth.confirmPassword')}
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
                error={errors.confirmPassword}
                icon={<FaLock className="text-gray-400" />}
              />
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg shine-effect disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? t('auth.registering') : t('auth.register')}
              </button>
            </div>
          </form>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600">
              {t('auth.hasAccount')}{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 