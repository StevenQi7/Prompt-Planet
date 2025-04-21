import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    // 创建服务器端supabase客户端
    const supabase = createClient();
    
    // 直接获取已验证的用户信息
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: '用户未登录', isLoggedIn: false }, { status: 401 });
    }
    
    // 从数据库获取用户的扩展信息（如果需要）
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select(`
        id,
        username,
        nickname,
        avatar,
        role,
        created_at,
        updated_at
      `)
      .eq('id', user.id)
      .single();
      
    // 获取提示词计数
    const { data: promptsCount, error: promptsError } = await supabase
      .from('prompts')
      .select('id, status, is_public', { count: 'exact' })
      .eq('author_id', user.id);
      
    // 获取收藏计数
    const { data: favoritesCount, error: favoritesError } = await supabase
      .from('favorites')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id);
      
    // 计算各种状态的提示词数量
    const counts = promptsCount ? {
      prompts: promptsCount.length || 0,
      publishedPrompts: promptsCount.filter(p => p.status === 'published' && p.is_public).length || 0,
      reviewingPrompts: promptsCount.filter(p => p.status === 'reviewing' && p.is_public).length || 0,
      rejectedPrompts: promptsCount.filter(p => p.status === 'rejected' && p.is_public).length || 0,
      privatePrompts: promptsCount.filter(p => !p.is_public).length || 0,
      favorites: favoritesCount?.length || 0
    } : {
      prompts: 0,
      publishedPrompts: 0,
      reviewingPrompts: 0,
      rejectedPrompts: 0,
      privatePrompts: 0,
      favorites: 0
    };
    
    // 组合响应数据
    const responseData = {
      id: user.id,
      email: user.email,
      username: userProfile?.username || user.email?.split('@')[0] || '',
      nickname: userProfile?.nickname || user.user_metadata?.full_name || '',
      avatar: userProfile?.avatar || user.user_metadata?.avatar_url || '',
      role: userProfile?.role || 'user',
      _count: counts,
      isLoggedIn: true
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    
    return NextResponse.json({ error: '获取用户信息失败', isLoggedIn: false }, { status: 500 });
  }
} 