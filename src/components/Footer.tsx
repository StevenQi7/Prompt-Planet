'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Footer() {
  const { t } = useLanguage();
  const { isAuthenticated, user, isAdmin } = useAuth();
  
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-robot text-indigo-400 text-2xl"></i>
              <span className="font-bold text-xl">{t('appName')}</span>
            </div>
            <p className="text-gray-400 text-sm">{t('footer.slogan')}</p>
          </div>
          <div>
            <h4 className="font-medium text-lg mb-2">{t('footer.quickLinks')}</h4>
            <ul className="space-y-1 text-gray-400">
              <li><Link href="/" className="hover:text-indigo-400">{t('footer.home')}</Link></li>
              <li><Link href="/browse" className="hover:text-indigo-400">{t('footer.browse')}</Link></li>
              
              {isAuthenticated ? (
                // 已登录用户链接
                <>
                  <li><Link href="/create-prompt" className="hover:text-indigo-400">{t('footer.create')}</Link></li>
                  <li><Link href="/profile" className="hover:text-indigo-400">{t('footer.profile')}</Link></li>
                  <li><Link href="/settings" className="hover:text-indigo-400">{t('footer.settings')}</Link></li>
                  {isAdmin && (
                    <li><Link href="/admin/review" className="hover:text-indigo-400">{t('footer.adminReview')}</Link></li>
                  )}
                </>
              ) : (
                // 未登录用户链接
                <>
                  <li><Link href="/login" className="hover:text-indigo-400">{t('footer.login')}</Link></li>
                  <li><Link href="/register" className="hover:text-indigo-400">{t('footer.register')}</Link></li>
                  <li><Link href="/help" className="hover:text-indigo-400">{t('footer.help')}</Link></li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-lg mb-2">{t('footer.about')}</h4>
            <ul className="space-y-1 text-gray-400">
              <li><Link href="/about" className="hover:text-indigo-400">{t('footer.aboutUs')}</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400">{t('footer.contact')}</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-400">{t('footer.terms')}</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-400">{t('footer.privacy')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-lg mb-2">{t('footer.followUs')}</h4>
            <div className="flex space-x-4">
              <a href="https://x.com/Jason_qeb" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="https://github.com/StevenQi7" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400">
                <i className="fab fa-github text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-4 pt-3 text-center text-gray-400 text-sm">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
} 