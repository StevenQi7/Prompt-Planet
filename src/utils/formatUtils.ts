/**
 * 格式化相关工具函数
 */
import { toast } from 'react-hot-toast';

/**
 * 格式化数字，将大数字转换为K、M格式
 * @param count 数字值
 * @returns 格式化后的字符串
 */
export const formatCount = (count: number | null | undefined): string => {
  if (count === undefined || count === null) return '0';
  
  if (count < 1000) return count.toString();
  
  if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}K`.replace('.0K', 'K');
  }
  
  return `${(count / 1000000).toFixed(1)}M`.replace('.0M', 'M');
};

/**
 * 获取相对时间描述
 * @param dateString 日期字符串
 * @param language 当前语言
 * @returns 相对时间描述
 */
export const getTimeAgo = (dateString: string, language: string = 'en'): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  let result = '';
  
  if (diffInSeconds < minute) {
    result = language === 'zh' ? '刚刚' : 'just now';
  } else if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute);
    result = language === 'zh' ? `${minutes}分钟前` : `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour);
    result = language === 'zh' ? `${hours}小时前` : `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < week) {
    const days = Math.floor(diffInSeconds / day);
    result = language === 'zh' ? `${days}天前` : `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < month) {
    const weeks = Math.floor(diffInSeconds / week);
    result = language === 'zh' ? `${weeks}周前` : `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < year) {
    const months = Math.floor(diffInSeconds / month);
    result = language === 'zh' ? `${months}个月前` : `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInSeconds / year);
    result = language === 'zh' ? `${years}年前` : `${years} year${years > 1 ? 's' : ''} ago`;
  }
  
  return result;
};

/**
 * 截断文本，超过指定长度则显示省略号
 * @param text 原始文本
 * @param maxLength 最大长度
 * @returns 截断后的文本
 */
export const truncateText = (text: string | undefined | null, maxLength: number): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * 复制提示词内容到剪贴板
 * @param content 提示词内容
 * @param successCallback 成功回调函数
 */
export const copyPromptContent = (content: string, successCallback?: () => void): void => {
  navigator.clipboard.writeText(content)
    .then(() => {
      toast.success('已复制到剪贴板');
      if (successCallback) {
        successCallback();
      }
    })
    .catch(err => {
      console.error('复制失败:', err);
      toast.error('复制失败，请手动复制');
    });
};

/**
 * 格式化日期
 * @param date 日期字符串
 * @returns 格式化后的日期
 */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}; 