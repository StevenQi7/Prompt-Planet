'use client';

import React from 'react';
import { FaSearch, FaQuestion, FaBook, FaLightbulb, FaTools, FaUser, FaShieldAlt, FaPaperPlane } from 'react-icons/fa';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HelpPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主页面标题横幅 */}
      <div className="relative mb-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('help.title')}</h1>
            <p className="text-xl text-gray-100 mb-8">{t('help.subtitle')}</p>
            
            {/* 搜索框 */}
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder={t('help.searchPlaceholder')}
                className="w-full px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent hero-bottom-gradient"></div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* 常见问题快速链接 */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('help.faqTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <FaQuestion className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('help.whatIsPrompt.title')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('help.whatIsPrompt.description')}</p>
              <a href="#what-is-prompt" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                {t('help.whatIsPrompt.viewDetails')} →
              </a>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <FaBook className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('help.howToCreate.title')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('help.howToCreate.description')}</p>
              <a href="#how-to-create" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                {t('help.howToCreate.viewDetails')} →
              </a>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <FaUser className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('help.accountManagement.title')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('help.accountManagement.description')}</p>
              <a href="#account-management" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                {t('help.accountManagement.viewDetails')} →
              </a>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <FaShieldAlt className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('help.privacySecurity.title')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('help.privacySecurity.description')}</p>
              <a href="#privacy-security" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                {t('help.privacySecurity.viewDetails')} →
              </a>
            </div>
          </div>
        </div>
        
        {/* 帮助内容类别 */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('help.categoriesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">{t('help.beginnerGuide.title')}</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li>
                    <a href="#getting-started" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <FaLightbulb className="text-indigo-600 text-sm" />
                      </div>
                      {t('help.beginnerGuide.platformIntro')}
                    </a>
                  </li>
                  <li>
                    <a href="#registration" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <FaUser className="text-indigo-600 text-sm" />
                      </div>
                      {t('help.beginnerGuide.registration')}
                    </a>
                  </li>
                  <li>
                    <a href="#profile-setup" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <FaTools className="text-indigo-600 text-sm" />
                      </div>
                      {t('help.beginnerGuide.profileSetup')}
                    </a>
                  </li>
                  <li>
                    <a href="#navigation" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <FaSearch className="text-indigo-600 text-sm" />
                      </div>
                      {t('help.beginnerGuide.browse')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">{t('help.promptCreationGuide.title')}</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li>
                    <a href="#prompt-basics" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <FaBook className="text-indigo-600 text-sm" />
                      </div>
                      {t('help.promptCreationGuide.promptBasics')}
                    </a>
                  </li>
                  <li>
                    <a href="#creating-prompts" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <FaPaperPlane className="text-indigo-600 text-sm" />
                      </div>
                      {t('help.promptCreationGuide.createPrompts')}
                    </a>
                  </li>
                  <li>
                    <a href="#prompt-review" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <FaShieldAlt className="text-indigo-600 text-sm" />
                      </div>
                      {t('help.promptCreationGuide.reviewProcess')}
                    </a>
                  </li>
                  <li>
                    <a href="#best-practices" className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <FaLightbulb className="text-indigo-600 text-sm" />
                      </div>
                      {t('help.promptCreationGuide.bestPractices')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* 帮助文档预览 */}
        <div className="max-w-4xl mx-auto" id="what-is-prompt">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('help.whatIsPromptContent.title')}</h2>
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: t('help.whatIsPromptContent.definition') }}></p>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">{t('help.whatIsPromptContent.importance')}</h3>
            <p className="text-gray-700 mb-4">{t('help.whatIsPromptContent.importanceText')}</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>{t('help.whatIsPromptContent.importanceList1') || '获得更准确、相关的回答'}</li>
              <li>{t('help.whatIsPromptContent.importanceList2') || '引导AI生成更具创意和实用性的内容'}</li>
              <li>{t('help.whatIsPromptContent.importanceList3') || '提高工作效率，减少沟通成本'}</li>
              <li>{t('help.whatIsPromptContent.importanceList4') || '最大化AI工具的价值和潜力'}</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">{t('help.whatIsPromptContent.types')}</h3>
            <p className="text-gray-700 mb-4">{t('help.whatIsPromptContent.typesText')}</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li dangerouslySetInnerHTML={{ __html: t('help.whatIsPromptContent.typesList1') || '<strong>创意写作类</strong>：用于生成创意内容，如故事、诗歌、广告文案等' }}></li>
              <li dangerouslySetInnerHTML={{ __html: t('help.whatIsPromptContent.typesList2') || '<strong>代码开发类</strong>：用于生成代码、调试程序、解释技术概念' }}></li>
              <li dangerouslySetInnerHTML={{ __html: t('help.whatIsPromptContent.typesList3') || '<strong>图像生成类</strong>：用于引导AI生成特定风格、主题的图像' }}></li>
              <li dangerouslySetInnerHTML={{ __html: t('help.whatIsPromptContent.typesList4') || '<strong>思维方式类</strong>：指导AI以特定的思维模式回答问题，如科学家、哲学家视角' }}></li>
              <li dangerouslySetInnerHTML={{ __html: t('help.whatIsPromptContent.typesList5') || '<strong>教育学习类</strong>：用于生成学习资料、解释概念或辅导特定学科' }}></li>
            </ul>
            
            <div className="mt-6">
              <Link href="#how-to-create" className="text-indigo-600 hover:text-indigo-800 font-medium">
                {t('help.whatIsPromptContent.nextArticle')} →
              </Link>
            </div>
          </div>
        </div>
        
        {/* 联系支持团队 */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('help.contactSupport.title')}</h2>
          <p className="text-gray-700 mb-6">
            {t('help.contactSupport.description')}
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 shadow-md"
          >
            {t('help.contactSupport.contactButton')}
          </Link>
        </div>
      </div>
    </div>
  );
} 