'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * 首页顶部 Hero 区域组件
 */
export default function HeroSection() {
  const { t } = useLanguage();
  
  return (
    <section className="hero-bg relative">
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-2xl">
          {/* 标语 */}
          <div className="inline-block px-3 py-1 bg-white/15 backdrop-filter backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4 animate-pulse border border-white/40 shadow-sm">
            <i className="fas fa-bolt text-yellow-300 mr-1"></i> {t('homePage.tagline')}
          </div>
          
          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {t('homePage.title1')}<br/>{t('homePage.title2')}
            <span className="relative inline-block">
              <span className="relative z-10">{t('homePage.titleHighlight')}</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-indigo-400/20 -z-10"></span>
            </span>
          </h1>
          
          {/* 描述 */}
          <p className="text-xl text-gray-100 mb-8 max-w-lg">
            {t('homePage.description')}
          </p>
          
          {/* 按钮组 */}
          <div className="flex flex-wrap gap-4">
            <Link href="/browse" className="bg-white hover:bg-gray-50 text-indigo-600 font-medium py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md hover:shadow-lg shine-effect">
              <i className="fas fa-search mr-2"></i>{t('homePage.exploreBtnText')}
            </Link>
            <Link href="/create-prompt" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md hover:shadow-lg shine-effect">
              <i className="fas fa-magic mr-2"></i>{t('homePage.createBtnText')}
            </Link>
          </div>
        </div>
      </div>
      {/* 底部渐变过渡 */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  );
} 