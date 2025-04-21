import { createClient } from '@/lib/supabase-server';

// 创建新用户
export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
  nickname?: string;
  phone?: string;
  avatar?: string;
}) {
  try {
    const supabase = createClient();
    
    // 使用 Supabase Auth API 注册用户
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
          full_name: userData.nickname || userData.username,
          phone: userData.phone,
          avatar_url: userData.avatar,
          role: 'user',
        }
      }
    });
    
    if (error) throw error;
    
    // 确保用户已创建
    if (!data.user) {
      throw new Error('创建用户失败');
    }
    
    return {
      id: data.user.id,
      email: data.user.email,
      username: data.user.user_metadata.username,
      nickname: data.user.user_metadata.full_name,
      avatar: data.user.user_metadata.avatar_url,
      role: data.user.user_metadata.role
    };
  } catch (error) {
    
    throw error;
  }
}

// 验证用户凭证
export async function validateCredentials(email: string, password: string) {
  try {
    const supabase = createClient();
    
    // 使用 Supabase Auth API 登录用户
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error || !data.user) {
      return null;
    }
    
    return {
      id: data.user.id,
      email: data.user.email,
      username: data.user.user_metadata.username,
      nickname: data.user.user_metadata.full_name,
      avatar: data.user.user_metadata.avatar_url,
      role: data.user.user_metadata.role
    };
  } catch (error) {
    
    throw error;
  }
}

// 根据ID获取用户
export async function getUserById(id: string) {
  try {
    const supabase = createClient();
    
    // 获取用户详细信息
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        nickname,
        avatar
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      
      return null;
    }
    
    if (!data) {
      
      return null;
    }
    
    // 获取用户的提示词和收藏数量
    const [promptsCount, favoritesCount] = await Promise.all([
      supabase.from('prompts').select('id', { count: 'exact' }).eq('author_id', id).then(res => res.count || 0),
      supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', id).then(res => res.count || 0)
    ]);
    
    // 获取当前会话用户，检查是否为管理员
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // 如果当前用户就是被查询的用户，且用户元数据中有角色信息，则使用元数据中的角色
    let role = 'user'; // 默认角色
    if (user && user.id === id && user.user_metadata?.role) {
      role = user.user_metadata.role;
    }
    
    return {
      id: data.id,
      username: data.username,
      nickname: data.nickname,
      avatar: data.avatar,
      role: role,
      _count: {
        prompts: promptsCount,
        favorites: favoritesCount
      }
    };
  } catch (error) {
    
    return null;
  }
}

// 更新用户信息
export async function updateUser(
  id: string,
  userData: {
    nickname?: string;
    phone?: string;
    avatar?: string;
    password?: string;
    currentPassword?: string;
  }
) {
  try {
    const supabase = createClient();
    
    // 获取当前用户，确保是更新自己的信息
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    
    if (getUserError || !user || user.id !== id) {
      throw new Error('用户不存在或无权限');
    }
    
    // 更新密码（如果提供）
    if (userData.password && userData.currentPassword) {
      // 使用当前密码进行验证
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: userData.currentPassword
      });
      
      if (signInError) {
        throw new Error('当前密码不正确');
      }
      
      // 更新密码
      const { error: updatePasswordError } = await supabase.auth.updateUser({
        password: userData.password
      });
      
      if (updatePasswordError) {
        throw updatePasswordError;
      }
    }
    
    // 更新用户元数据
    const updateData: any = {};
    if (userData.nickname !== undefined) updateData.full_name = userData.nickname;
    if (userData.phone !== undefined) updateData.phone = userData.phone;
    if (userData.avatar !== undefined) updateData.avatar_url = userData.avatar;
    
    const { data: updatedUserData, error: updateError } = await supabase.auth.updateUser({
      data: updateData
    });
    
    if (updateError) {
      throw updateError;
    }
    
    // 同时更新 profiles 表中的数据
    const profileData: any = {};
    if (userData.nickname !== undefined) profileData.nickname = userData.nickname;
    if (userData.avatar !== undefined) profileData.avatar = userData.avatar;
    
    if (Object.keys(profileData).length > 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', id);
      
      if (profileError) {
        
        // 继续执行，因为 Auth 表已更新成功
      }
    }
    
    const updatedUser = updatedUserData.user;
    
    // 获取用户的提示词和收藏数量
    const [promptsCount, favoritesCount] = await Promise.all([
      supabase.from('prompts').select('id', { count: 'exact' }).eq('author_id', id).then(res => res.count || 0),
      supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', id).then(res => res.count || 0)
    ]);
    
    return {
      id: updatedUser!.id,
      email: updatedUser!.email,
      username: updatedUser!.user_metadata.username || updatedUser!.email?.split('@')[0] || '',
      nickname: updatedUser!.user_metadata.full_name || '',
      avatar: updatedUser!.user_metadata.avatar_url || '',
      role: updatedUser!.user_metadata.role || 'user',
      _count: {
        prompts: promptsCount,
        favorites: favoritesCount
      }
    };
  } catch (error) {
    
    throw error;
  }
} 