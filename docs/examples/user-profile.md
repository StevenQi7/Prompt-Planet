# 用户资料管理

本文档演示了如何在 Prompt Planet 项目中实现用户资料管理功能，包括资料查看、编辑和密码修改等。

## 用户资料页面

以下是用户资料页面组件的示例代码：

```typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/services/userService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import UserPrompts from '@/components/Profile/UserPrompts';
import UserBio from '@/components/Profile/UserBio';
import UserStats from '@/components/Profile/UserStats';
import NotFound from '@/components/common/NotFound';
import { toast } from 'react-hot-toast';

function UserProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { username } = router.query;
  
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('prompts'); // prompts, favorites, about
  
  // 判断是否是当前用户查看自己的资料
  const isOwnProfile = currentUser && currentUser.username === username;
  
  // 获取用户资料
  useEffect(() => {
    if (!username) return;
    
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile(username);
        setUserProfile(data);
        setError(null);
      } catch (err) {
        console.error('获取用户资料失败:', err);
        setError(err.message || t('profile.errorLoadingProfile'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [username, t]);
  
  // 切换标签页
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // 显示加载状态
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <LoadingSpinner />
        <p>{t('common.loading')}</p>
      </div>
    );
  }
  
  // 显示错误信息
  if (error || !userProfile) {
    return (
      <NotFound
        title={t('profile.userNotFound')}
        message={t('profile.userNotFoundMessage')}
        actionText={t('common.backToHome')}
        actionLink="/"
      />
    );
  }
  
  return (
    <div className="container py-5">
      <div className="row">
        {/* 左侧用户信息 */}
        <div className="col-lg-3">
          <div className="profile-sidebar">
            <div className="text-center mb-4">
              <div className="profile-avatar">
                {userProfile.avatarUrl ? (
                  <img 
                    src={userProfile.avatarUrl} 
                    alt={userProfile.nickname || userProfile.username} 
                    className="rounded-circle img-fluid"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {(userProfile.nickname || userProfile.username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <h3 className="mt-3">{userProfile.nickname || userProfile.username}</h3>
              <p className="text-muted">@{userProfile.username}</p>
              
              {userProfile.joinDate && (
                <p className="text-muted small">
                  {t('profile.memberSince')} {new Date(userProfile.joinDate).toLocaleDateString()}
                </p>
              )}
              
              {isOwnProfile && (
                <button 
                  className="btn btn-outline-primary btn-sm mt-2"
                  onClick={() => router.push('/settings')}
                >
                  {t('profile.editProfile')}
                </button>
              )}
            </div>
            
            <UserBio bio={userProfile.bio} />
            <UserStats stats={userProfile.stats} />
          </div>
        </div>
        
        {/* 右侧内容区 */}
        <div className="col-lg-9">
          <div className="profile-content">
            {/* 标签页导航 */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'prompts' ? 'active' : ''}`}
                  onClick={() => handleTabChange('prompts')}
                >
                  {t('profile.prompts')}
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                  onClick={() => handleTabChange('favorites')}
                >
                  {t('profile.favorites')}
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                  onClick={() => handleTabChange('about')}
                >
                  {t('profile.about')}
                </button>
              </li>
            </ul>
            
            {/* 标签页内容 */}
            <div className="tab-content">
              {activeTab === 'prompts' && (
                <UserPrompts 
                  username={userProfile.username} 
                  isOwnProfile={isOwnProfile} 
                />
              )}
              
              {activeTab === 'favorites' && (
                <div>
                  {/* 用户收藏的提示词组件 */}
                  {isOwnProfile ? (
                    <UserFavorites username={userProfile.username} />
                  ) : (
                    <div className="alert alert-info">
                      {t('profile.favoritesPrivate')}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'about' && (
                <div className="about-section">
                  <h3>{t('profile.aboutUser', { username: userProfile.nickname || userProfile.username })}</h3>
                  
                  {userProfile.bio ? (
                    <div className="bio-full">
                      <p>{userProfile.bio}</p>
                    </div>
                  ) : (
                    <p className="text-muted">{t('profile.noBio')}</p>
                  )}
                  
                  {/* 其他用户信息 */}
                  <div className="user-details mt-4">
                    <h4>{t('profile.userStats')}</h4>
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        {t('profile.totalPrompts')}
                        <span className="badge bg-primary rounded-pill">{userProfile.stats.totalPrompts}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        {t('profile.totalFavorites')}
                        <span className="badge bg-primary rounded-pill">{userProfile.stats.totalFavorites}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        {t('profile.totalViews')}
                        <span className="badge bg-primary rounded-pill">{userProfile.stats.totalViews}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 用户设置页面

以下是用户设置页面组件的示例代码：

```typescript
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import BasicInfoForm from '@/components/Settings/BasicInfoForm';
import PasswordForm from '@/components/Settings/PasswordForm';
import AvatarUploader from '@/components/Settings/AvatarUploader';
import { updateUserProfile, updateUserPassword } from '@/services/userService';
import { toast } from 'react-hot-toast';

function SettingsPage() {
  const { t } = useLanguage();
  const { user, refreshUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile'); // profile, security
  const [loading, setLoading] = useState(false);
  
  // 基本信息表单状态
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    nickname: user?.nickname || '',
    bio: user?.bio || ''
  });
  
  // 基本信息表单错误状态
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    nickname: '',
    bio: ''
  });
  
  // 密码表单状态
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // 密码表单错误状态
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // 处理基本信息输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 清除对应的错误信息
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // 处理密码输入变化
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    // 清除对应的错误信息
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: ''
      });
    }
  };
  
  // 验证基本信息表单
  const validateProfileForm = () => {
    const errors = {};
    
    // 昵称验证
    if (formData.nickname && formData.nickname.length > 20) {
      errors.nickname = t('settings.nicknameTooLong');
    }
    
    // 个人简介验证
    if (formData.bio && formData.bio.length > 500) {
      errors.bio = t('settings.bioTooLong');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 验证密码表单
  const validatePasswordForm = () => {
    const errors = {};
    
    // 当前密码验证
    if (!passwordData.currentPassword) {
      errors.currentPassword = t('settings.currentPasswordRequired');
    }
    
    // 新密码验证
    if (!passwordData.newPassword) {
      errors.newPassword = t('settings.newPasswordRequired');
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = t('settings.passwordTooShort');
    }
    
    // 确认密码验证
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = t('settings.passwordsDoNotMatch');
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 提交基本信息表单
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await updateUserProfile({
        nickname: formData.nickname,
        bio: formData.bio
      });
      
      // 更新本地用户数据
      await refreshUser();
      
      toast.success(t('settings.profileUpdateSuccess'));
    } catch (err) {
      console.error('更新个人资料失败:', err);
      toast.error(t('settings.profileUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  // 提交密码表单
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await updateUserPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // 清空密码表单
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success(t('settings.passwordUpdateSuccess'));
    } catch (err) {
      console.error('更新密码失败:', err);
      
      // 处理不同类型的错误
      if (err.code === 'AUTH_INVALID_PASSWORD') {
        setPasswordErrors({
          ...passwordErrors,
          currentPassword: t('settings.currentPasswordIncorrect')
        });
      } else {
        toast.error(t('settings.passwordUpdateFailed'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 处理头像上传成功
  const handleAvatarUploadSuccess = async () => {
    // 更新本地用户数据
    await refreshUser();
    toast.success(t('settings.avatarUpdateSuccess'));
  };
  
  return (
    <div className="container py-5">
      <div className="row">
        {/* 左侧导航 */}
        <div className="col-lg-3">
          <div className="settings-sidebar">
            <h3>{t('settings.title')}</h3>
            <div className="nav flex-column nav-pills mt-4">
              <button
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="bi bi-person me-2"></i>
                {t('settings.profileSettings')}
              </button>
              <button
                className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <i className="bi bi-shield-lock me-2"></i>
                {t('settings.securitySettings')}
              </button>
            </div>
          </div>
        </div>
        
        {/* 右侧内容区 */}
        <div className="col-lg-9">
          <div className="settings-content">
            {/* 个人资料设置 */}
            {activeTab === 'profile' && (
              <div className="card">
                <div className="card-header">
                  <h4>{t('settings.profileSettings')}</h4>
                </div>
                <div className="card-body">
                  {/* 头像上传 */}
                  <div className="mb-4">
                    <h5>{t('settings.avatar')}</h5>
                    <AvatarUploader
                      currentAvatar={user?.avatarUrl}
                      onUploadSuccess={handleAvatarUploadSuccess}
                    />
                  </div>
                  
                  {/* 基本信息表单 */}
                  <BasicInfoForm
                    formData={formData}
                    errors={formErrors}
                    loading={loading}
                    onChange={handleInputChange}
                    onSubmit={handleProfileSubmit}
                    onCancel={() => setFormData({
                      username: user?.username || '',
                      email: user?.email || '',
                      nickname: user?.nickname || '',
                      bio: user?.bio || ''
                    })}
                    t={t}
                  />
                </div>
              </div>
            )}
            
            {/* 安全设置 */}
            {activeTab === 'security' && (
              <div className="card">
                <div className="card-header">
                  <h4>{t('settings.securitySettings')}</h4>
                </div>
                <div className="card-body">
                  {/* 密码修改表单 */}
                  <PasswordForm
                    formData={passwordData}
                    errors={passwordErrors}
                    loading={loading}
                    onChange={handlePasswordChange}
                    onSubmit={handlePasswordSubmit}
                    onCancel={() => setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    })}
                    t={t}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 头像上传组件

以下是头像上传组件的示例代码：

```typescript
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { uploadAvatar } from '@/services/uploadService';
import { toast } from 'react-hot-toast';

function AvatarUploader({ currentAvatar, onUploadSuccess }) {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  // 处理文件选择
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error(t('upload.invalidFileType'));
      return;
    }
    
    // 验证文件大小（最大 2MB）
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('upload.fileTooLarge'));
      return;
    }
    
    // 创建预览
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // 上传文件
    handleUpload(file);
  };
  
  // 上传文件
  const handleUpload = async (file) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      await uploadAvatar(formData);
      
      // 通知上传成功
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error('上传头像失败:', err);
      toast.error(t('upload.avatarUploadFailed'));
      // 清除预览
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="avatar-uploader">
      <div className="current-avatar">
        {preview || currentAvatar ? (
          <img
            src={preview || currentAvatar}
            alt={t('settings.avatar')}
            className="rounded-circle img-thumbnail"
            width="100"
            height="100"
          />
        ) : (
          <div className="avatar-placeholder rounded-circle">
            <i className="bi bi-person-fill"></i>
          </div>
        )}
      </div>
      
      <div className="upload-controls mt-3">
        <label htmlFor="avatar-upload" className="btn btn-outline-primary">
          {uploading ? t('upload.uploading') : t('settings.changeAvatar')}
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="d-none"
          disabled={uploading}
        />
        
        {currentAvatar && !preview && (
          <button
            className="btn btn-outline-danger ms-2"
            onClick={() => {
              // 实现删除头像的功能
              if (confirm(t('settings.confirmDeleteAvatar'))) {
                // 调用删除头像的 API
                // ...
              }
            }}
            disabled={uploading}
          >
            {t('settings.removeAvatar')}
          </button>
        )}
      </div>
      
      <p className="text-muted small mt-2">
        {t('upload.avatarRequirements')}
      </p>
    </div>
  );
}
```

## 基本信息表单组件

以下是基本信息表单组件的示例代码：

```typescript
import { useLanguage } from '@/hooks/useLanguage';

function BasicInfoForm({ formData, errors, loading, onChange, onSubmit, onCancel, t }) {
  return (
    <form onSubmit={onSubmit}>
      <h5>{t('settings.basicInfo')}</h5>
      
      {/* 用户名（不可修改） */}
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          {t('settings.username')}
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="form-control"
          value={formData.username}
          disabled
        />
        <div className="form-text text-muted">
          {t('settings.usernameCannotBeChanged')}
        </div>
      </div>
      
      {/* 邮箱（不可修改） */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          {t('settings.email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control"
          value={formData.email}
          disabled
        />
        <div className="form-text text-muted">
          {t('settings.emailCannotBeChanged')}
        </div>
      </div>
      
      {/* 昵称 */}
      <div className="mb-3">
        <label htmlFor="nickname" className="form-label">
          {t('settings.nickname')}
        </label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          className={`form-control ${errors.nickname ? 'is-invalid' : ''}`}
          value={formData.nickname}
          onChange={onChange}
          placeholder={t('settings.nicknamePlaceholder')}
        />
        {errors.nickname && (
          <div className="invalid-feedback">{errors.nickname}</div>
        )}
        <div className="form-text text-muted">
          {t('settings.nicknameHelp')}
        </div>
      </div>
      
      {/* 个人简介 */}
      <div className="mb-3">
        <label htmlFor="bio" className="form-label">
          {t('settings.bio')}
        </label>
        <textarea
          id="bio"
          name="bio"
          className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
          value={formData.bio}
          onChange={onChange}
          rows="4"
          placeholder={t('settings.bioPlaceholder')}
        ></textarea>
        {errors.bio && (
          <div className="invalid-feedback">{errors.bio}</div>
        )}
        <div className="form-text text-muted">
          {t('settings.bioHelp')}
        </div>
      </div>
      
      {/* 按钮 */}
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-outline-secondary me-2"
          onClick={onCancel}
          disabled={loading}
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? t('common.saving') : t('common.save')}
        </button>
      </div>
    </form>
  );
}
```

## 用户提示词组件

以下是用户提示词组件的示例代码：

```typescript
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { getUserPrompts } from '@/services/promptService';
import PromptCard from '@/components/Prompt/PromptCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';

function UserPrompts({ username, isOwnProfile }) {
  const { t } = useLanguage();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  // 获取用户提示词
  useEffect(() => {
    const fetchUserPrompts = async () => {
      try {
        setLoading(true);
        const result = await getUserPrompts(username, pagination.currentPage);
        setPrompts(result.data);
        setPagination({
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalItems: result.totalItems
        });
        setError(null);
      } catch (err) {
        console.error('获取用户提示词失败:', err);
        setError(err.message || t('profile.errorLoadingPrompts'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserPrompts();
  }, [username, pagination.currentPage, t]);
  
  // 处理页面变化
  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      currentPage: page
    });
  };
  
  // 显示加载状态
  if (loading && pagination.currentPage === 1) {
    return (
      <div className="text-center my-5">
        <LoadingSpinner />
        <p>{t('common.loading')}</p>
      </div>
    );
  }
  
  // 显示错误信息
  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }
  
  // 没有提示词时显示空状态
  if (prompts.length === 0) {
    return (
      <EmptyState
        title={isOwnProfile ? t('profile.noPromptsOwn') : t('profile.noPrompts')}
        message={isOwnProfile ? t('profile.createFirstPrompt') : t('profile.userHasNoPrompts')}
        actionText={isOwnProfile ? t('profile.createPrompt') : null}
        actionLink={isOwnProfile ? '/prompts/create' : null}
        icon="pencil-square"
      />
    );
  }
  
  return (
    <div className="user-prompts">
      <div className="row">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="col-md-6 col-lg-4 mb-4">
            <PromptCard prompt={prompt} />
          </div>
        ))}
      </div>
      
      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
```

以上示例代码涵盖了用户资料查看、编辑和管理等关键功能，可以根据项目需求进行调整和扩展。 