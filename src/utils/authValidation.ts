import { TFunction } from '@/types/i18n';

// 定义表单错误类型
export interface AuthFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  nickname?: string;
  general?: string;
  backend?: string;
}

// 登录表单数据类型
export interface LoginFormData {
  email: string;
  password: string;
}

// 注册表单数据类型
export interface RegisterFormData {
  username: string;
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * 验证登录表单
 * @param data 登录表单数据
 * @param t 国际化函数
 * @returns 验证结果和错误信息
 */
export const validateLoginForm = (
  data: LoginFormData,
  t: TFunction
): { isValid: boolean; errors: AuthFormErrors } => {
  let isValid = true;
  const errors: AuthFormErrors = {};

  // 验证邮箱
  if (!data.email) {
    errors.email = t('auth.emailRequired');
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = t('auth.emailFormat');
    isValid = false;
  }

  // 验证密码
  if (!data.password) {
    errors.password = t('auth.passwordRequired');
    isValid = false;
  }

  return { isValid, errors };
};

/**
 * 验证注册表单
 * @param data 注册表单数据
 * @param t 国际化函数
 * @returns 验证结果和错误信息
 */
export const validateRegisterForm = (
  data: RegisterFormData,
  t: TFunction
): { isValid: boolean; errors: AuthFormErrors } => {
  let isValid = true;
  const errors: AuthFormErrors = {};

  // 验证用户名
  if (!data.username) {
    errors.username = t('auth.usernameRequired');
    isValid = false;
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.username = t('auth.usernameRequirements');
    isValid = false;
  }

  // 验证邮箱
  if (!data.email) {
    errors.email = t('auth.emailRequired');
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = t('auth.emailFormat');
    isValid = false;
  }

  // 验证密码
  if (!data.password) {
    errors.password = t('auth.passwordRequired');
    isValid = false;
  } else if (data.password.length < 8) {
    errors.password = t('auth.passwordRequirements');
    isValid = false;
  }

  // 验证确认密码
  if (!data.confirmPassword) {
    errors.confirmPassword = t('auth.confirmPasswordRequired');
    isValid = false;
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = t('auth.passwordMismatch');
    isValid = false;
  }

  return { isValid, errors };
}; 