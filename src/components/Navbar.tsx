'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/button';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated, isAdmin, loading } = useAuth();
  
  // 切换语言
  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };
  
  // 处理登出
  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t('auth.logoutSuccess'));
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error(t('auth.logoutError'));
    }
  };
  
  // 添加点击外部区域关闭菜单的事件监听
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuOpen && 
        userMenuRef.current && 
        userButtonRef.current && 
        !userMenuRef.current.contains(event.target as Node) &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    
    // 添加全局点击事件监听
    document.addEventListener('mousedown', handleClickOutside);
    
    // 清理事件监听
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-12 w-12">
                <Image 
                  src="/favicon.svg" 
                  alt="PromptShare Logo" 
                  width={48} 
                  height={48}
                  priority
                />
              </div>
              <span className="font-bold text-xl text-gray-800">{t('appName')}</span>
            </Link>
          </div>
          
          {/* 搜索框 */}
          <div className="hidden md:block flex-grow max-w-lg mx-8">
            <form action="/search-results" method="get">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder={t('nav.searchPlaceholder')}
                  className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-indigo-500 transition-colors duration-300"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>
          </div>
          
          {/* 导航链接 */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/browse" 
              className={`${pathname === '/browse' ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-300`}
            >
              <i className="fas fa-th-large mr-1"></i>{t('nav.browse')}
            </Link>
            
            <Link 
              href="/help" 
              className={`${pathname === '/help' ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-300`}
            >
              <i className="fas fa-question-circle mr-1"></i>{t('nav.help')}
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  href="/profile" 
                  className={`${pathname === '/profile' ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-300`}
                >
                  <i className="fas fa-user-edit mr-1"></i>{t('nav.myPrompts')}
                </Link>
                <Link 
                  href="/create-prompt" 
                  className={`${pathname === '/create-prompt' ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-300`}
                >
                  <i className="fas fa-magic mr-1"></i>{t('nav.createPrompt')}
                </Link>
                <Link 
                  href="/favorites" 
                  className={`${pathname === '/favorites' ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-300`}
                >
                  <i className="fas fa-bookmark mr-1"></i>{t('nav.favorites')}
                </Link>
              </>
            )}
            
            {/* 语言切换按钮 */}
            <button
              onClick={toggleLanguage}
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 flex items-center"
            >
              <i className="fas fa-globe mr-1"></i>
              <span className="text-sm">{language === 'zh' ? 'ZH' : 'EN'}</span>
            </button>
            
            {/* 登录按钮或用户菜单 */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  ref={userButtonRef}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 flex items-center"
                >
                  {user && user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.nickname || user.email} 
                      className="w-6 h-6 rounded-full mr-1"
                    />
                  ) : (
                    <i className="fas fa-user mr-1"></i>
                  )}
                  <span className="text-sm">{user?.nickname || user?.email}</span>
                  <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                {userMenuOpen && (
                  <div 
                    ref={userMenuRef}
                    className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl z-10 py-2 w-40 border border-gray-100"
                  >
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-200">
                      <i className="fas fa-user-circle mr-2"></i>{t('nav.profile')}
                    </Link>
                    {/* 管理员独有的审核管理选项 */}
                    {isAdmin && (
                      <Link 
                        href="/admin/review" 
                        className={`block px-4 py-2 ${pathname === '/admin/review' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'} transition duration-200`}
                      >
                        <i className="fas fa-clipboard-check mr-2"></i>{t('nav.adminReview')}
                      </Link>
                    )}
                    <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-200">
                      <i className="fas fa-cog mr-2"></i>{t('nav.settings')}
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition duration-200"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>{t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 flex items-center"
              >
                <i className="fas fa-sign-in-alt mr-1"></i>
                {t('auth.login')}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 