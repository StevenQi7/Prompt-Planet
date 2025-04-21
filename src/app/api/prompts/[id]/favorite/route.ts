import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getUserById } from '@/services/userService';

// 切换收藏状态
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 获取提示词ID
    const { id: promptId } = await params;
    
    // 获取当前用户
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 验证用户是否存在
    const userProfile = await getUserById(user.id);
    if (!userProfile) {
      return NextResponse.json({ error: '用户不存在' }, { status: 401 });
    }

    // 检查提示词是否存在
    const { data: prompt, error: promptError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .single();

    if (promptError || !prompt) {
      return NextResponse.json({ error: '提示词不存在' }, { status: 404 });
    }

    // 检查是否已经收藏
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)
      .single();

    if (existingFavorite) {
      return NextResponse.json({ error: '已经收藏过该提示词' }, { status: 400 });
    }

    // 添加收藏
    const { error: favoriteError } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        prompt_id: promptId
      });

    if (favoriteError) {
      throw favoriteError;
    }

    // 更新提示词的收藏数
    const { error: updateError } = await supabase
      .from('prompts')
      .update({ favorite_count: prompt.favorite_count + 1 })
      .eq('id', promptId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    
    return NextResponse.json({ error: '收藏提示词失败' }, { status: 500 });
  }
}

// 检查用户是否已收藏该提示词
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 获取提示词ID
    const { id: promptId } = await params;
    
    // 获取当前用户 - 先调用cookies()等动态API
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ favorited: false });
    }

    // 查询是否已收藏
    const { data: favorite, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)
      .maybeSingle();
    
    if (error) throw error;

    return NextResponse.json({ favorited: !!favorite });
  } catch (error) {
    
    return NextResponse.json({ favorited: false });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 获取提示词ID
    const { id: promptId } = await params;
    
    // 获取当前用户
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 验证用户是否存在
    const userProfile = await getUserById(user.id);
    if (!userProfile) {
      return NextResponse.json({ error: '用户不存在' }, { status: 401 });
    }

    // 检查提示词是否存在
    const { data: prompt, error: promptError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .single();

    if (promptError || !prompt) {
      return NextResponse.json({ error: '提示词不存在' }, { status: 404 });
    }

    // 检查是否已经收藏
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('prompt_id', promptId)
      .single();

    if (!existingFavorite) {
      return NextResponse.json({ error: '未收藏该提示词' }, { status: 400 });
    }

    // 删除收藏
    const { error: favoriteError } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('prompt_id', promptId);

    if (favoriteError) {
      throw favoriteError;
    }

    // 更新提示词的收藏数
    const { error: updateError } = await supabase
      .from('prompts')
      .update({ favorite_count: Math.max(0, prompt.favorite_count - 1) })
      .eq('id', promptId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    
    return NextResponse.json({ error: '取消收藏提示词失败' }, { status: 500 });
  }
} 