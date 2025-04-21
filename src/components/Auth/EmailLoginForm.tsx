import React, { useState } from 'react';
import { Button } from '@/components/UI/button';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { createClient } from '@/lib/supabase';
import FormInput from './FormInput';
import FormMessage from './FormMessage';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { validateLoginForm, LoginFormData, AuthFormErrors } from '@/utils/authValidation';
import { TFunction } from '@/types/i18n';

interface EmailLoginFormProps {
  onBackClick: () => void;
}

const EmailLoginForm: React.FC<EmailLoginFormProps> = ({ onBackClick }) => {
  const { t } = useLanguage();
  const router = useRouter();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [loading, setLoading] = useState(false);

  // 翻译Supabase错误信息的函数
  const translateAuthError = (errorMessage: string): string => {
    // 常见的Supabase错误消息映射
    const errorMap: Record<string, string> = {
      'Invalid login credentials': t('auth.invalidCredentials' as any),
      'Email not confirmed': t('auth.emailNotConfirmed' as any),
      'User not found': t('auth.userNotFound' as any),
      'Email already in use': t('auth.emailAlreadyInUse' as any),
      'Password should be at least 6 characters': t('auth.passwordTooShort' as any),
      'Unable to validate email address': t('auth.invalidEmailFormat' as any)
    };

    // 检查错误消息是否在映射表中，如果在则返回对应的翻译，否则返回原始错误消息
    return errorMap[errorMessage] || errorMessage;
  };

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
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    const validation = validateLoginForm(formData, t as TFunction);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      console.log('开始登录...');
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('登录错误:', error);
        throw error;
      }

      console.log('登录成功，准备跳转...');
      toast.success(t('auth.loginSuccess'));
      
      // 使用 setTimeout 确保 toast 显示完成后再跳转
      setTimeout(() => {
        try {
          console.log('执行跳转...');
          router.push('/');
          router.refresh();
          console.log('跳转指令已执行');
        } catch (navigationError) {
          console.error('导航错误:', navigationError);
          // 如果导航失败，强制刷新页面
          window.location.href = '/';
        }
      }, 1000);
    } catch (error: any) {
      console.error('登录处理错误:', error);
      // 翻译错误消息
      const translatedError = translateAuthError(error.message);
      toast.error(translatedError || t('auth.loginError'));
      setErrors({
        ...errors,
        general: translatedError || t('auth.loginError')
      });
      setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    // 表单验证
    const validation = validateLoginForm(formData, t as TFunction);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      console.log('开始注册...');
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('注册错误:', error);
        throw error;
      }

      console.log('注册成功');
      toast.success(t('auth.verificationEmailSent'));
      
      // 如果注册成功但需要邮箱验证，显示适当信息
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.success('此邮箱已注册，请直接登录');
      }
      
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error('注册处理错误:', error);
      // 翻译错误消息
      const translatedError = translateAuthError(error.message);
      toast.error(translatedError || t('auth.registerError'));
      setErrors({
        ...errors,
        general: translatedError || t('auth.registerError')
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailSignIn} className="space-y-4 w-full">
      {errors.general && <FormMessage errorMessage={errors.general} />}
      
      <FormInput
        id="email"
        label={t('auth.email')}
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder={t('auth.emailPlaceholder')}
        required
        disabled={loading}
        error={errors.email}
        icon={<FaEnvelope className="text-gray-400" />}
      />
      
      <FormInput
        id="password"
        label={t('auth.password')}
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder={t('auth.passwordPlaceholder')}
        required
        disabled={loading}
        error={errors.password}
        icon={<FaLock className="text-gray-400" />}
      />
      
      <div className="flex flex-col gap-3">
        <Button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-circle-notch fa-spin mr-2"></i>
              {t('auth.loggingIn')}
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt mr-2"></i>
              {t('auth.login')}
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
          onClick={handleEmailSignUp}
          disabled={loading}
        >
          <i className="fas fa-user-plus mr-2"></i>
          {t('auth.register')}
        </Button>
      </div>
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBackClick}
        className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2"
      >
        <i className="fas fa-arrow-left mr-2"></i>
        {t('auth.backToOtherMethods')}
      </Button>
    </form>
  );
};

export default EmailLoginForm; 