'use client';

import React from 'react';
import { FaUsers, FaBullseye, FaRocket, FaLightbulb } from 'react-icons/fa';
import { useTranslations } from '@/hooks/useTranslations';

export default function AboutContent() {
  const { t } = useTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主页面标题横幅 */}
      <div className="relative mb-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('about.title')}</h1>
            <p className="text-xl text-gray-100 mb-6">{t('about.subtitle')}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 我们的故事 */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('about.ourStory.title')}</h2>
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <p className="text-gray-700 mb-4">{t('about.ourStory.content1')}</p>
            <p className="text-gray-700 mb-4">{t('about.ourStory.content2')}</p>
            <p className="text-gray-700">{t('about.ourStory.content3')}</p>
          </div>
        </div>

        {/* 我们的价值观 */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('about.ourValues.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <FaUsers className="text-indigo-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{t('about.ourValues.community.title')}</h3>
              </div>
              <p className="text-gray-700">{t('about.ourValues.community.description')}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <FaBullseye className="text-indigo-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{t('about.ourValues.quality.title')}</h3>
              </div>
              <p className="text-gray-700">{t('about.ourValues.quality.description')}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <FaRocket className="text-indigo-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{t('about.ourValues.innovation.title')}</h3>
              </div>
              <p className="text-gray-700">{t('about.ourValues.innovation.description')}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <FaLightbulb className="text-indigo-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{t('about.ourValues.sharing.title')}</h3>
              </div>
              <p className="text-gray-700">{t('about.ourValues.sharing.description')}</p>
            </div>
          </div>
        </div>

        {/* 加入我们 */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('about.joinUs.title')}</h2>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-4">{t('about.joinUs.subtitle')}</h3>
            <p className="mb-6">{t('about.joinUs.description')}</p>
            <a href="/contact" className="inline-block bg-white text-indigo-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-md">
              {t('about.joinUs.contactButton')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 