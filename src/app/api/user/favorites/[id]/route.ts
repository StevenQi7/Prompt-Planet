import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getUserById } from '@/services/userService';

// 删除指定ID的收藏
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 获取提示词ID
    const { id: promptId } = await params;
    
    if (!promptId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }
    
    // 获取当前用户
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const userId = user.id;

    // 验证用户是否存在
    const userProfile = await getUserById(userId);
    if (!userProfile) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 查询该收藏是否存在
    const { data: existingFavorite, error: favoriteError } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('prompt_id', promptId)
      .single();

    if (favoriteError || !existingFavorite) {
      return NextResponse.json({ error: '该收藏不存在' }, { status: 404 });
    }

    // 删除收藏
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('prompt_id', promptId);

    if (deleteError) {
      throw deleteError;
    }

    // 更新提示词的收藏计数
    const { data: prompt, error: promptError } = await supabase
      .from('prompts')
      .select('favorite_count')
      .eq('id', promptId)
      .single();

    if (!promptError && prompt) {
      await supabase
        .from('prompts')
        .update({ favorite_count: Math.max(0, prompt.favorite_count - 1) })
        .eq('id', promptId);
    }

    return NextResponse.json({ success: true, message: '取消收藏成功' });
  } catch (error) {
    return NextResponse.json({ error: '取消收藏失败，请稍后重试' }, { status: 500 });
  }
} 