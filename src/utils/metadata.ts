import { Metadata } from 'next';
import locales, { Language } from '@/locales';

// 获取当前语言
export const getCurrentLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const storedLanguage = localStorage.getItem('language');
    return (storedLanguage === 'en' || storedLanguage === 'zh') ? storedLanguage as Language : 'en';
  }
  return 'en'; // 默认语言
};

// 获取翻译
export const getTranslation = (key: string, language: Language = 'en'): string => {
  const keys = key.split('.');
  let translation: any = locales[language];
  
  for (const k of keys) {
    if (!translation[k]) {
      return key;
    }
    translation = translation[k];
  }
  
  return translation;
};

// 网站基本信息
const siteConfig = {
  siteName: 'PromptShare',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  twitterHandle: '@Jason_qeb',
  defaultLocale: 'en-US',
  alternateLocales: ['en-US', 'zh-CN'],
};

// 生成页面元数据
export function generateMetadata(
  titleKey: string = 'appName',
  descriptionKey?: string,
  additionalMetadata: Partial<Metadata> = {},
  language: Language = 'en'
): Metadata {
  const title = getTranslation(titleKey, language);
  const description = descriptionKey ? getTranslation(descriptionKey, language) : undefined;
  
  // 基本元数据
  const baseMetadata: Metadata = {
    title: {
      template: `%s | ${siteConfig.siteName}`,
      default: title,
    },
    description,
    keywords: ['AI Prompts', 'Artificial Intelligence', 'Prompt Sharing', 'AI Tools', 'LLM Prompts', 'ChatGPT Prompts', 'Prompt Engineering'],
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: {
      canonical: '/',
      languages: {
        'en-US': '/en',
        'zh-CN': '/zh',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: language === 'zh' ? 'zh_CN' : 'en_US',
      url: siteConfig.siteUrl,
      siteName: siteConfig.siteName,
      title,
      description,
      images: [
        {
          url: `${siteConfig.siteUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
      images: [`${siteConfig.siteUrl}/images/twitter-image.jpg`],
    },
    icons: {
      icon: '/favicon.svg',
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
      other: {
        'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
      },
    },
  };

  // 合并额外的元数据
  return {
    ...baseMetadata,
    ...additionalMetadata,
  };
} 