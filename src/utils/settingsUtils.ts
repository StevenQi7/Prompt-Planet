/**
 * 设置页面相关工具函数
 */
import { toast } from 'react-hot-toast';
import { isEqual } from './validationUtils';
import { TFunction } from '@/types/i18n';

// 表单字段类型
export interface SettingsFormData {
  nickname: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 错误信息类型
export interface SettingsFormErrors {
  nickname: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  general: string;
}

// 基本信息表单数据类型
export interface BasicInfoFormData {
  nickname: string;
}

// 密码表单数据类型
export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 密码可见性状态类型
export interface PasswordVisibility {
  currentPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
}

/**
 * 更新用户基本信息
 * @param data 用户基本信息数据
 * @param t 国际化函数
 * @param callbacks 回调函数对象
 * @returns 请求是否成功
 */
export const updateUserBasicInfo = async (
  data: BasicInfoFormData,
  t: TFunction,
  callbacks?: {
    onStart?: () => void;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
    onFinish?: () => void;
  }
): Promise<boolean> => {
  try {
    if (callbacks?.onStart) callbacks.onStart();
    
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: data.nickname
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      toast.success(t('settings.saveSuccess'));
      if (callbacks?.onSuccess) callbacks.onSuccess(responseData);
      return true;
    } else {
      const errorMessage = responseData.error || t('common.updateFailed');
      toast.error(errorMessage);
      if (callbacks?.onError) callbacks.onError(errorMessage);
      return false;
    }
  } catch (err) {
    const errorMessage = t('common.updateFailed');
    toast.error(errorMessage);
    if (callbacks?.onError) callbacks.onError(errorMessage);
    return false;
  } finally {
    if (callbacks?.onFinish) callbacks.onFinish();
  }
};

/**
 * 更新用户密码
 * @param data 密码数据
 * @param t 国际化函数
 * @param callbacks 回调函数对象
 * @returns 请求是否成功
 */
export const updateUserPassword = async (
  data: PasswordFormData,
  t: TFunction,
  callbacks?: {
    onStart?: () => void;
    onSuccess?: (data: any) => void;
    onError?: (error: string, fieldError?: { field: string; message: string }) => void;
    onFinish?: () => void;
  }
): Promise<boolean> => {
  try {
    if (callbacks?.onStart) callbacks.onStart();
    
    const response = await fetch('/api/user/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      toast.success(t('settings.saveSuccess'));
      if (callbacks?.onSuccess) callbacks.onSuccess(responseData);
      return true;
    } else {
      const errorMessage = responseData.error || t('common.updateFailed');
      toast.error(errorMessage);
      
      // 处理特定字段错误
      if (responseData.error === '当前密码不正确' || responseData.error === 'Current password is incorrect') {
        if (callbacks?.onError) {
          callbacks.onError(errorMessage, {
            field: 'currentPassword',
            message: errorMessage
          });
        }
      } else {
        if (callbacks?.onError) callbacks.onError(errorMessage);
      }
      
      return false;
    }
  } catch (err) {
    const errorMessage = t('common.updateFailed');
    toast.error(errorMessage);
    if (callbacks?.onError) callbacks.onError(errorMessage);
    return false;
  } finally {
    if (callbacks?.onFinish) callbacks.onFinish();
  }
};

/**
 * 验证基本信息表单
 * @param data 表单数据
 * @param t 国际化函数
 * @returns 验证结果对象 { isValid, errors }
 */
export const validateBasicInfoForm = (
  data: BasicInfoFormData,
  t: TFunction
): { isValid: boolean; errors: Pick<SettingsFormErrors, 'nickname' | 'general'> } => {
  let isValid = true;
  const errors = {
    nickname: '',
    general: ''
  };

  // 验证昵称 (可选)
  if (data.nickname && data.nickname.length > 30) {
    errors.nickname = t('settings.nicknameTooLong');
    isValid = false;
  }

  return { isValid, errors };
};

/**
 * 验证密码表单
 * @param data 表单数据
 * @param t 国际化函数
 * @returns 验证结果对象 { isValid, errors }
 */
export const validatePasswordForm = (
  data: PasswordFormData,
  t: TFunction
): { isValid: boolean; errors: Pick<SettingsFormErrors, 'currentPassword' | 'newPassword' | 'confirmPassword' | 'general'> } => {
  let isValid = true;
  const errors = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    general: ''
  };

  // 验证当前密码
  if (!data.currentPassword) {
    errors.currentPassword = t('settings.currentPasswordRequired');
    isValid = false;
  }

  // 验证新密码
  if (!data.newPassword) {
    errors.newPassword = t('settings.newPasswordRequired');
    isValid = false;
  } else if (data.newPassword.length < 8) {
    errors.newPassword = t('auth.passwordRequirements');
    isValid = false;
  }

  // 验证确认密码
  if (!isEqual(data.newPassword, data.confirmPassword)) {
    errors.confirmPassword = t('settings.passwordMismatch');
    isValid = false;
  }

  return { isValid, errors };
};

/**
 * 切换密码可见性
 * @param currentState 当前状态
 * @param field 字段名称
 * @returns 新状态
 */
export const togglePasswordVisibility = (
  currentState: PasswordVisibility,
  field: keyof PasswordVisibility
): PasswordVisibility => {
  return {
    ...currentState,
    [field]: !currentState[field]
  };
}; 