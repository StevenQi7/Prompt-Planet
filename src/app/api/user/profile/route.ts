import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getUserById, updateUser } from '@/services/userService';

export async function PUT(req: NextRequest) {
  try {
    // 使用 Supabase 的用户认证信息获取用户
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }
    
    const userId = user.id;

    // 解析请求体
    const body = await req.json();
    const { nickname } = body;

    // 获取用户信息，验证用户是否存在
    const userProfile = await getUserById(userId);
    if (!userProfile) {
      // 如果在 profiles 表中不存在，但在 auth 表中存在，则尝试使用用户信息创建基本资料
      try {
        // 创建基本资料
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: user.email?.split('@')[0] || userId.substring(0, 8),
            nickname: user.user_metadata?.full_name || '',
            avatar: user.user_metadata?.avatar_url || ''
          })
          .select()
          .single();
          
        if (createError) {
          
          return NextResponse.json({ error: '用户不存在且创建资料失败' }, { status: 404 });
        }
      } catch (createError) {
        
        return NextResponse.json({ error: '用户不存在且创建资料失败' }, { status: 404 });
      }
    }

    // 更新用户信息
    const updatedUser = await updateUser(userId, { nickname });

    // 返回更新成功的用户信息
    return NextResponse.json({
      message: '个人信息更新成功',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        nickname: updatedUser.nickname,
        role: updatedUser.role,
        avatar: updatedUser.avatar
      }
    });
  } catch (error: any) {
    
    
    // 处理已知错误类型
    if (error.message === '用户不存在') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json({ error: '更新失败，请稍后重试' }, { status: 500 });
  }
} 