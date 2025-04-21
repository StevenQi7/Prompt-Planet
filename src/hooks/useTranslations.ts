import { useLanguage } from '@/contexts/LanguageContext';

export function useTranslations() {
  const { t } = useLanguage();
  return { t };
} 