'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEdit, FaSync, FaPlus, FaChevronRight, FaStar } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import DefaultAvatar from '@/components/UI/DefaultAvatar';

interface PromptCounts {
  prompts: number;
  publishedPrompts: number;
  reviewingPrompts: number;
  rejectedPrompts: number;
  privatePrompts: number;
  favorites: number;
}

interface ProfileHeaderProps {
  user: any;
  promptCounts: PromptCounts;
  refreshData: () => Promise<void>;
}

export default function ProfileHeader({
  user,
  promptCounts,
  refreshData
}: ProfileHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
      {/* 个人信息头部 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <FaEdit className="text-indigo-600" />
          </div>
          {t('profile.title')}
        </h1>
        <p className="text-gray-600 ml-13 pl-1">{t('profile.subtitle')}</p>
      </div>
      
      <div className="px-6 py-5">
        <div className="flex flex-col md:flex-row justify-between items-center mb-5">
          <div className="flex items-center">
            {/* 用户头像 */}
            <div className="relative mr-4">
              {(user && 'user_metadata' in user && user.user_metadata?.avatar_url) ? (
                <Image 
                  src={user.user_metadata.avatar_url}
                  alt={t('auth.nickname') || '用户头像'} 
                  width={80} 
                  height={80}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-md"
                  unoptimized={true}
                />
              ) : (
                <DefaultAvatar 
                  username={user?.email || t('promptDetail.user')}
                  size={64} 
                />
              )}
            </div>
            
            {/* 用户信息 */}
            <div className="text-left">
              <h1 className="text-xl font-semibold text-gray-800 mb-1">
                {(user && 'nickname' in user) ? user.nickname 
                : (user && 'user_metadata' in user) ? 
                  (user.user_metadata?.full_name || user.user_metadata?.preferred_username || user?.email)
                  : user?.email}
              </h1>
              <div className="text-sm text-gray-500 flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {(user && 'user_metadata' in user && user.user_metadata?.role === 'admin') ? t('admin.adminRole') || '管理员' : t('admin.normalUser') || '普通用户'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => refreshData()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center shadow-sm"
            >
              <FaSync className="mr-2" /> {t('profile.refresh')}
            </button>
            <Link href="/create-prompt" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center shadow-sm group relative overflow-hidden">
              <FaPlus className="mr-2" /> {t('profile.createNew')}
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></span>
            </Link>
          </div>
        </div>
        
        {/* 统计卡片 */}
        <ProfileStatsCards promptCounts={promptCounts} />
      </div>
    </div>
  );
}

// 统计卡片组件
function ProfileStatsCards({ promptCounts }: { promptCounts: PromptCounts }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100 flex items-center group hover:translate-y-[-5px] hover:shadow-lg transition-transform transition-shadow duration-300">
        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 shadow-sm group-hover:bg-indigo-200 transition-colors duration-300">
          <FaEdit className="text-indigo-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{promptCounts.prompts}</p>
          <p className="text-gray-600 text-sm">{t('profile.createdPrompts')}</p>
        </div>
        <div className="ml-auto">
          <a href="#myPrompts" className="text-indigo-600 hover:text-indigo-800 flex items-center">
            <span className="mr-1">{t('profile.view')}</span>
            <FaChevronRight className="text-xs" />
          </a>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 flex items-center group hover:translate-y-[-5px] hover:shadow-lg transition-transform transition-shadow duration-300">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 shadow-sm group-hover:bg-purple-200 transition-colors duration-300">
          <FaStar className="text-purple-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{promptCounts.favorites || 0}</p>
          <p className="text-gray-600 text-sm">{t('profile.favoritedPrompts')}</p>
        </div>
        <div className="ml-auto">
          <Link href="/favorites" className="text-purple-600 hover:text-purple-800 flex items-center">
            <span className="mr-1">{t('profile.view')}</span>
            <FaChevronRight className="text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
} 