'use client';

import React from 'react';
import { FaLayerGroup, FaCheckCircle, FaClock, FaTimes, FaEye } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

interface PromptCounts {
  prompts: number;
  publishedPrompts: number;
  reviewingPrompts: number;
  rejectedPrompts: number;
  privatePrompts: number;
  favorites: number;
}

interface ProfileTabsProps {
  activeTab: string;
  promptCounts: PromptCounts;
  setActiveTab: (tab: string) => void;
  setCurrentPage: (page: number) => void;
}

export default function ProfileTabs({
  activeTab,
  promptCounts,
  setActiveTab,
  setCurrentPage
}: ProfileTabsProps) {
  const { t } = useLanguage();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-wrap gap-4 overflow-x-auto pb-2">
        <TabButton 
          active={activeTab === 'all'} 
          onClick={() => handleTabChange('all')}
          icon={<FaLayerGroup className="mr-2 text-gray-500" />}
          label={t('profile.all')}
          count={promptCounts.prompts}
        />
        
        <TabButton 
          active={activeTab === 'published'} 
          onClick={() => handleTabChange('published')}
          icon={<FaCheckCircle className="mr-2 text-gray-500" />}
          label={t('profile.published')}
          count={promptCounts.publishedPrompts}
        />
        
        <TabButton 
          active={activeTab === 'reviewing'} 
          onClick={() => handleTabChange('reviewing')}
          icon={<FaClock className="mr-2 text-gray-500" />}
          label={t('profile.reviewing')}
          count={promptCounts.reviewingPrompts}
        />
        
        <TabButton 
          active={activeTab === 'rejected'} 
          onClick={() => handleTabChange('rejected')}
          icon={<FaTimes className="mr-2 text-gray-500" />}
          label={t('profile.rejected')}
          count={promptCounts.rejectedPrompts}
        />
        
        <TabButton 
          active={activeTab === 'private'} 
          onClick={() => handleTabChange('private')}
          icon={<FaEye className="mr-2 text-gray-500" />}
          label={t('profile.private') || '私密'}
          count={promptCounts.privatePrompts}
        />
      </div>
    </div>
  );
}

// 标签按钮组件
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}

function TabButton({ active, onClick, icon, label, count }: TabButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`${
        active 
          ? 'text-indigo-600 border-indigo-600' 
          : 'text-gray-600 hover:text-indigo-600 border-transparent hover:border-indigo-200'
      } border-b-2 pb-3 font-medium flex items-center whitespace-nowrap transition-all duration-300`}
    >
      {icon}
      {label} <span className="ml-1.5 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">{count}</span>
    </button>
  );
} 