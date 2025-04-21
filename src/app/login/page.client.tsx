'use client'

import React from 'react';
import LoginButtons from '@/components/LoginButtons'
import { Toaster } from 'react-hot-toast'
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPageClient() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-t-xl border border-b-0 border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-user text-indigo-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{t('auth.title')}</h1>
          </div>
          <p className="text-gray-600 ml-13">
            {t('auth.subtitle')}
          </p>
        </div>
        
        <div className="bg-white p-6 shadow-sm rounded-b-xl border border-t-0 border-gray-200">
          <LoginButtons />
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
} 