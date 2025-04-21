# 认证流程

本文档演示了如何在 Prompt Planet 项目中实现用户认证和授权功能。

## 用户注册

以下是用户注册组件的示例代码：

```typescript
import { useState } from 'react';
import { registerUser } from '@/services/authService';
import { useLanguage } from '@/hooks/useLanguage';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

function RegisterForm() {
  const { t } = useLanguage();
  const router = useRouter();
  
  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    agreeTerms: false
  });
  
  // 加载状态和错误信息
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // 清除对应的错误信息
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // 验证表单
  const validateForm = () => {
    const newErrors = {};
    
    // 用户名验证
    if (!formData.username.trim()) {
      newErrors.username = t('auth.usernameRequired');
    } else if (formData.username.length < 3) {
      newErrors.username = t('auth.usernameTooShort');
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = t('auth.usernameInvalid');
    }
    
    // 邮箱验证
    if (!formData.email.trim()) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }
    
    // 密码验证
    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.passwordTooShort');
    }
    
    // 确认密码验证
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsDoNotMatch');
    }
    
    // 昵称验证（可选）
    if (formData.nickname && formData.nickname.length > 20) {
      newErrors.nickname = t('auth.nicknameTooLong');
    }
    
    // 条款同意验证
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = t('auth.termsRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname || formData.username
      });
      
      toast.success(t('auth.registrationSuccess'));
      router.push('/auth/login?registered=true');
    } catch (err) {
      console.error('注册失败:', err);
      
      // 处理不同类型的错误
      if (err.code === 'AUTH_DUPLICATE_USER') {
        setErrors({
          ...errors,
          username: t('auth.usernameExists')
        });
      } else if (err.code === 'AUTH_DUPLICATE_EMAIL') {
        setErrors({
          ...errors,
          email: t('auth.emailExists')
        });
      } else {
        toast.error(t('auth.registrationFailed'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-form-container">
      <h1>{t('auth.register')}</h1>
      <p className="auth-subtitle">{t('auth.registerSubtitle')}</p>
      
      <form onSubmit={handleSubmit} className="auth-form">
        {/* 用户名 */}
        <div className="form-group">
          <label htmlFor="username">
            {t('auth.username')} <span className="required">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            placeholder={t('auth.usernamePlaceholder')}
            className={errors.username ? 'error' : ''}
            required
          />
          {errors.username && <div className="error-message">{errors.username}</div>}
        </div>
        
        {/* 邮箱 */}
        <div className="form-group">
          <label htmlFor="email">
            {t('auth.email')} <span className="required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t('auth.emailPlaceholder')}
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        {/* 密码 */}
        <div className="form-group">
          <label htmlFor="password">
            {t('auth.password')} <span className="required">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={t('auth.passwordPlaceholder')}
            className={errors.password ? 'error' : ''}
            required
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>
        
        {/* 确认密码 */}
        <div className="form-group">
          <label htmlFor="confirmPassword">
            {t('auth.confirmPassword')} <span className="required">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            className={errors.confirmPassword ? 'error' : ''}
            required
          />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>
        
        {/* 昵称（可选） */}
        <div className="form-group">
          <label htmlFor="nickname">{t('auth.nickname')}</label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            value={formData.nickname}
            onChange={handleInputChange}
            placeholder={t('auth.nicknamePlaceholder')}
            className={errors.nickname ? 'error' : ''}
          />
          {errors.nickname && <div className="error-message">{errors.nickname}</div>}
        </div>
        
        {/* 同意条款 */}
        <div className="form-group checkbox-group">
          <input
            id="agreeTerms"
            name="agreeTerms"
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            className={errors.agreeTerms ? 'error' : ''}
          />
          <label htmlFor="agreeTerms" className="checkbox-label">
            {t('auth.agreeTerms')} <Link href="/terms">{t('auth.termsOfUse')}</Link> {t('auth.and')} <Link href="/privacy">{t('auth.privacyPolicy')}</Link>
          </label>
          {errors.agreeTerms && <div className="error-message">{errors.agreeTerms}</div>}
        </div>
        
        {/* 提交按钮 */}
        <button
          type="submit"
          className="btn-primary btn-block"
          disabled={loading}
        >
          {loading ? t('auth.registering') : t('auth.register')}
        </button>
      </form>
      
      <div className="auth-links">
        <p>
          {t('auth.alreadyHaveAccount')} <Link href="/auth/login">{t('auth.login')}</Link>
        </p>
      </div>
    </div>
  );
}
```

## 用户登录

以下是用户登录组件的示例代码：

```typescript
import { useState, useEffect } from 'react';
import { loginUser } from '@/services/authService';
import { useLanguage } from '@/hooks/useLanguage';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // 加载状态和错误信息
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 如果用户已登录，则重定向到首页
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
    
    // 注册成功的消息提示
    if (router.query.registered === 'true') {
      toast.success(t('auth.registrationSuccessCheckEmail'));
    }
  }, [isAuthenticated, user, router, t]);
  
  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // 清除错误信息
    if (error) {
      setError('');
    }
  };
  
  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 简单验证
    if (!formData.email.trim() || !formData.password) {
      setError(t('auth.emailAndPasswordRequired'));
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      // 保存认证令牌
      localStorage.setItem('accessToken', result.accessToken);
      
      // 如果需要记住登录状态，则保存刷新令牌
      if (formData.rememberMe) {
        localStorage.setItem('refreshToken', result.refreshToken);
      }
      
      toast.success(t('auth.loginSuccess'));
      
      // 如果有重定向 URL，则跳转到该 URL，否则跳转到首页
      const redirectUrl = router.query.redirect || '/dashboard';
      router.push(redirectUrl);
    } catch (err) {
      console.error('登录失败:', err);
      
      // 根据错误类型设置错误信息
      if (err.code === 'AUTH_INVALID_CREDENTIALS') {
        setError(t('auth.invalidCredentials'));
      } else {
        setError(t('auth.loginFailed'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-form-container">
      <h1>{t('auth.login')}</h1>
      <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>
      
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message form-error">{error}</div>}
        
        {/* 邮箱 */}
        <div className="form-group">
          <label htmlFor="email">{t('auth.email')}</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t('auth.emailPlaceholder')}
            required
          />
        </div>
        
        {/* 密码 */}
        <div className="form-group">
          <label htmlFor="password">{t('auth.password')}</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={t('auth.passwordPlaceholder')}
            required
          />
        </div>
        
        {/* 记住我和忘记密码 */}
        <div className="form-row">
          <div className="form-group checkbox-group">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
            />
            <label htmlFor="rememberMe" className="checkbox-label">
              {t('auth.rememberMe')}
            </label>
          </div>
          
          <div className="forgot-password">
            <Link href="/auth/reset-password">{t('auth.forgotPassword')}</Link>
          </div>
        </div>
        
        {/* 提交按钮 */}
        <button
          type="submit"
          className="btn-primary btn-block"
          disabled={loading}
        >
          {loading ? t('auth.loggingIn') : t('auth.login')}
        </button>
      </form>
      
      <div className="auth-links">
        <p>
          {t('auth.dontHaveAccount')} <Link href="/auth/register">{t('auth.register')}</Link>
        </p>
      </div>
    </div>
  );
}
```

## 认证 Hook

下面是一个用于管理认证状态的 React Hook 示例：

```typescript
// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import { getCurrentUser, refreshToken, logoutUser } from '@/services/authService';

// 创建认证上下文
const AuthContext = createContext(null);

// 认证提供者组件
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 获取当前用户信息
  const fetchCurrentUser = async () => {
    setIsLoading(true);
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('获取用户信息失败:', err);
      
      // 如果令牌过期，尝试刷新令牌
      if (err.code === 'AUTH_TOKEN_EXPIRED') {
        await tryRefreshToken();
      } else {
        // 其他错误，清除认证状态
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // 尝试刷新令牌
  const tryRefreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      
      if (!refreshTokenValue) {
        throw new Error('没有刷新令牌');
      }
      
      const result = await refreshToken(refreshTokenValue);
      
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      
      // 重新获取用户信息
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('刷新令牌失败:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };
  
  // 登出
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('登出失败:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };
  
  // 初始化认证状态
  useEffect(() => {
    fetchCurrentUser();
    
    // 设置定时刷新令牌
    const refreshInterval = setInterval(() => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshTokenValue = localStorage.getItem('refreshToken');
      
      if (accessToken && refreshTokenValue) {
        tryRefreshToken();
      }
    }, 15 * 60 * 1000); // 每15分钟刷新一次令牌
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // 提供认证上下文
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login: fetchCurrentUser,
        logout,
        refreshUser: fetchCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 使用认证 Hook
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  
  return context;
}
```

## 受保护的路由组件

下面是一个用于保护需要登录的路由的组件示例：

```typescript
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  
  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
      </div>
    );
  }
  
  // 如果用户未登录，重定向到登录页
  if (!isAuthenticated) {
    // 在客户端执行重定向
    if (typeof window !== 'undefined') {
      router.replace(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
    return null;
  }
  
  // 如果需要管理员权限但用户不是管理员，重定向到首页
  if (adminOnly && user.role !== 'admin') {
    // 在客户端执行重定向
    if (typeof window !== 'undefined') {
      router.replace('/');
    }
    return null;
  }
  
  // 用户已登录且满足权限要求，显示子组件
  return children;
}

// 使用示例
function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <div>只有管理员才能访问此页面</div>
    </ProtectedRoute>
  );
}

function UserProfilePage() {
  return (
    <ProtectedRoute>
      <div>登录用户的个人资料页</div>
    </ProtectedRoute>
  );
}
```

## 密码重置流程

以下是密码重置流程的示例代码：

```typescript
// 请求重置密码页面
function RequestPasswordReset() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError(t('auth.emailRequired'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      console.error('请求密码重置失败:', err);
      setError(t('auth.resetPasswordFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-form-container">
      <h1>{t('auth.resetPassword')}</h1>
      <p className="auth-subtitle">{t('auth.resetPasswordSubtitle')}</p>
      
      {success ? (
        <div className="success-message">
          <p>{t('auth.resetPasswordEmailSent')}</p>
          <p>{t('auth.checkEmailInstructions')}</p>
          <Link href="/auth/login" className="btn-primary">
            {t('auth.backToLogin')}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message form-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary btn-block"
            disabled={loading}
          >
            {loading ? t('auth.sending') : t('auth.sendResetLink')}
          </button>
        </form>
      )}
      
      <div className="auth-links">
        <Link href="/auth/login">{t('auth.backToLogin')}</Link>
      </div>
    </div>
  );
}

// 设置新密码页面
function SetNewPassword() {
  const { t } = useLanguage();
  const router = useRouter();
  const { token } = router.query;
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (error) {
      setError('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 验证
    if (!formData.password) {
      setError(t('auth.passwordRequired'));
      return;
    }
    
    if (formData.password.length < 8) {
      setError(t('auth.passwordTooShort'));
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }
    
    setLoading(true);
    
    try {
      // 确认密码重置
      await confirmPasswordReset(token, formData.password);
      setSuccess(true);
      
      // 3秒后跳转到登录页
      setTimeout(() => {
        router.push('/auth/login?reset=success');
      }, 3000);
    } catch (err) {
      console.error('密码重置失败:', err);
      
      if (err.code === 'AUTH_INVALID_TOKEN') {
        setError(t('auth.resetTokenInvalid'));
      } else {
        setError(t('auth.resetPasswordFailed'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 如果没有令牌，显示错误
  if (!token && typeof window !== 'undefined') {
    return (
      <div className="auth-form-container">
        <h1>{t('auth.resetPassword')}</h1>
        <div className="error-message form-error">
          {t('auth.resetTokenMissing')}
        </div>
        <div className="auth-links">
          <Link href="/auth/reset-password" className="btn-primary">
            {t('auth.requestNewResetLink')}
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-form-container">
      <h1>{t('auth.resetPassword')}</h1>
      <p className="auth-subtitle">{t('auth.chooseNewPassword')}</p>
      
      {success ? (
        <div className="success-message">
          <p>{t('auth.passwordResetSuccess')}</p>
          <p>{t('auth.redirectingToLogin')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message form-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="password">
              {t('auth.newPassword')} <span className="required">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t('auth.newPasswordPlaceholder')}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">
              {t('auth.confirmNewPassword')} <span className="required">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder={t('auth.confirmPasswordPlaceholder')}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary btn-block"
            disabled={loading}
          >
            {loading ? t('auth.resetting') : t('auth.resetPassword')}
          </button>
        </form>
      )}
    </div>
  );
}
```

以上示例代码涵盖了用户注册、登录、认证状态管理、路由保护和密码重置等关键功能，可以根据项目需求进行调整和扩展。 