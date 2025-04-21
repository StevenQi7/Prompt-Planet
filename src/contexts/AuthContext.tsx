'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, isSessionExpiringSoon } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

// 用户类型定义
type User = {
  id: string;
  username: string;
  email: string;
  nickname?: string;
  avatar?: string;
  role: string;
  _count?: {
    prompts: number;
    favorites: number;
    publishedPrompts: number;
    reviewingPrompts: number;
    rejectedPrompts: number;
    privatePrompts: number;
  };
};

// 认证上下文类型定义
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUserInfo: (updatedUser: Partial<User>) => void;
  isAuthenticated: boolean | null;
  isAdmin: boolean | null;
  signOut: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

// 注册数据类型定义
type RegisterData = {
  username: string;
  email: string;
  password: string;
  nickname?: string;
};

// 创建认证上下文
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 将Supabase用户转换为应用User类型
const mapSupabaseUserToUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    username: supabaseUser.user_metadata?.preferred_username || supabaseUser.email?.split('@')[0] || '',
    email: supabaseUser.email || '',
    nickname: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || '',
    avatar: supabaseUser.user_metadata?.avatar_url,
    role: supabaseUser.user_metadata?.role || 'user', // 默认角色
    _count: {
      prompts: 0,
      favorites: 0,
      publishedPrompts: 0,
      reviewingPrompts: 0,
      rejectedPrompts: 0,
      privatePrompts: 0
    }
  };
};

// 认证上下文提供者组件
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  const supabase = createClient();

  // 日志函数，便于调试
  const logAuthEvent = (event: string, details?: any) => {
    console.log(`[Auth] ${event}`, details || '');
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        logAuthEvent('初始化认证');
        // 获取当前会话
        const { data: { session } } = await supabase.auth.getSession();
        
        // 如果有会话但即将过期，尝试刷新
        if (session && isSessionExpiringSoon(session)) {
          try {
            logAuthEvent('会话即将过期，尝试刷新');
            await supabase.auth.refreshSession();
            logAuthEvent('会话已刷新');
          } catch (refreshError) {
            logAuthEvent('刷新会话失败', refreshError);
          }
        }
        
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
        
        if (supabaseUser && !error) {
          logAuthEvent('获取到用户信息', { id: supabaseUser.id, email: supabaseUser.email });
          const mappedUser = mapSupabaseUserToUser(supabaseUser);
          setUser(mappedUser);
          setIsAuthenticated(true);
          setIsAdmin(supabaseUser.user_metadata?.role === 'admin');
          
          // 使用本地存储提高状态恢复速度
          if (typeof window !== 'undefined') {
            localStorage.setItem('userAuthenticated', 'true');
          }
        } else {
          logAuthEvent('未获取到用户信息或发生错误', error);
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
          
          // 清除本地存储
          if (typeof window !== 'undefined') {
            localStorage.removeItem('userAuthenticated');
          }
        }
      } catch (error) {
        logAuthEvent('认证初始化错误', error);
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
        setSessionChecked(true);
      }
    };

    // 快速从本地存储恢复基本认证状态
    const quickRestore = () => {
      if (typeof window !== 'undefined') {
        const storedAuth = localStorage.getItem('userAuthenticated');
        if (storedAuth === 'true') {
          setIsAuthenticated(true);
        }
      }
    };

    quickRestore(); // 立即尝试恢复基本状态
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logAuthEvent('认证状态变化', { event, userId: session?.user?.id });
      
      if (session?.user) {
        const mappedUser = mapSupabaseUserToUser(session.user);
        setUser(mappedUser);
        setIsAuthenticated(true);
        setIsAdmin(session.user.user_metadata?.role === 'admin');
        
        // 检查会话是否即将过期
        if (isSessionExpiringSoon(session)) {
          try {
            logAuthEvent('会话即将过期，尝试刷新');
            await supabase.auth.refreshSession();
            logAuthEvent('会话已刷新');
          } catch (refreshError) {
            logAuthEvent('刷新会话失败', refreshError);
          }
        }
        
        // 存储认证状态
        if (typeof window !== 'undefined') {
          localStorage.setItem('userAuthenticated', 'true');
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        
        // 清除认证状态
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userAuthenticated');
        }
      }
      setLoading(false);
      setSessionChecked(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const apiData = await response.json();
  
        if (response.ok) {
          setUser(apiData.user);
          return { success: true, message: '登录成功' };
        } else {
          return { success: false, message: apiData.error || '登录失败' };
        }
      } else {
        const mappedUser = mapSupabaseUserToUser(data.user);
        setUser(mappedUser);
        setIsAdmin(data.user.user_metadata?.role === 'admin');
        return { success: true, message: '登录成功' };
      }
    } catch (error) {
      console.error('登录错误:', error);
      return { success: false, message: '登录过程中发生错误，请稍后重试' };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            preferred_username: userData.username,
            full_name: userData.nickname
          }
        }
      });
      
      if (error) {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        const apiData = await response.json();
  
        if (response.ok) {
          return { success: true, message: '注册成功' };
        } else {
          return { success: false, message: apiData.error || '注册失败' };
        }
      } else {
        const mappedUser = mapSupabaseUserToUser(data.user);
        setUser(mappedUser);
        return { success: true, message: '注册成功' };
      }
    } catch (error) {
      console.error('注册错误:', error);
      return { success: false, message: '注册过程中发生错误，请稍后重试' };
    }
  };

  const logout = async () => {
    try {
      logAuthEvent('开始登出');
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setIsAuthenticated(false);
      
      // 清除本地存储
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userAuthenticated');
        // 清除可能存在的其他与用户相关的本地存储
        localStorage.removeItem('supabase.auth.token');
      }
      logAuthEvent('登出成功');
    } catch (error) {
      logAuthEvent('登出错误', error);
    }
  };

  const updateUserInfo = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  };

  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('GitHub 登录错误:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google 登录错误:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      logAuthEvent('开始登出 (signOut)');
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      
      // 清除本地存储
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userAuthenticated');
        // 清除可能存在的其他与用户相关的本地存储
        localStorage.removeItem('supabase.auth.token');
      }
      logAuthEvent('登出成功 (signOut)');
      
      // 强制页面刷新以确保状态完全重置
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      logAuthEvent('登出错误 (signOut)', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserInfo,
    isAuthenticated,
    isAdmin,
    signOut,
    signInWithGithub,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
}; 