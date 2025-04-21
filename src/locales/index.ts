import en from './en';
import zh from './zh';

const locales = {
  en,
  zh
};

export type Language = 'en' | 'zh';
export type TranslationKey = string;

export default locales; 