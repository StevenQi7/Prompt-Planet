/**
 * 表单验证工具函数
 */

/**
 * 检查字符串是否为空
 * @param value 需要检查的字符串
 * @returns 是否为空
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return value === null || value === undefined || value.trim() === '';
};

/**
 * 检查字符串是否超过最大长度
 * @param value 需要检查的字符串
 * @param maxLength 最大长度
 * @returns 是否超过最大长度
 */
export const isOverMaxLength = (value: string, maxLength: number): boolean => {
  if (isEmpty(value)) return false;
  return value.length > maxLength;
};

/**
 * 检查字符串是否小于最小长度
 * @param value 需要检查的字符串
 * @param minLength 最小长度
 * @returns 是否小于最小长度
 */
export const isUnderMinLength = (value: string, minLength: number): boolean => {
  if (isEmpty(value)) return true;
  return value.length < minLength;
};

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否为有效邮箱
 */
export const isValidEmail = (email: string): boolean => {
  if (isEmpty(email)) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * 验证手机号格式（中国大陆）
 * @param phone 手机号
 * @returns 是否为有效手机号
 */
export const isValidPhone = (phone: string): boolean => {
  if (isEmpty(phone)) return false;
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证URL格式
 * @param url URL地址
 * @returns 是否为有效URL
 */
export const isValidUrl = (url: string): boolean => {
  if (isEmpty(url)) return false;
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 验证密码强度
 * 至少包含一个数字、一个小写字母、一个大写字母和一个特殊字符
 * @param password 密码
 * @returns 是否为强密码
 */
export const isStrongPassword = (password: string): boolean => {
  if (isEmpty(password)) return false;
  if (isUnderMinLength(password, 8)) return false;
  
  const hasNumber = /\d/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  return hasNumber && hasLowerCase && hasUpperCase && hasSpecialChar;
};

/**
 * 验证两个值是否相等
 * @param value1 第一个值
 * @param value2 第二个值
 * @returns 是否相等
 */
export const isEqual = (value1: any, value2: any): boolean => {
  return value1 === value2;
}; 