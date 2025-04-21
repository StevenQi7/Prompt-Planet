import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById } from '@/services/userService';
import { favoritePrompt } from '@/services/promptService';
import { createClient } from '@/lib/supabase-server';

// 获取用户收藏列表
export async function GET(request: NextRequest) {
  try {
    // 获取分页参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '9');
    const offset = (page - 1) * pageSize;
    
    // 获取筛选和排序参数
    const categoryId = searchParams.get('category_id') || null;
    const sort = searchParams.get('sort') || 'newest';  // 默认按最新收藏排序

    

    // 获取当前用户 - 先调用cookies()等动态API
    const cookieStore = cookies();
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

    // 构建基础查询
    let query = supabase
      .from('favorites')
      .select(`
        *,
        prompt:prompts(
          *,
          category:categories(*),
          tags:prompt_tags(
            tag:tags(*)
          )
        )
      `)
      .eq('user_id', userId);

    // 根据分类 ID 筛选
    if (categoryId) {
      query = query.eq('prompt.category_id', categoryId);
    }

    // 添加排序条件
    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    }
    
    // 添加分页
    query = query.range(offset, offset + pageSize - 1);

    // 执行查询
    const { data: favorites, error, count } = await query;

    if (error) {
      
      throw error;
    }

    

    // 获取总数量
    let countQuery = supabase
      .from('favorites')
      .select(`
        id,
        prompt:prompts(
          category_id
        )
      `, { count: 'exact' })
      .eq('user_id', userId);
      
    // 如果有分类 ID，添加分类筛选
    if (categoryId) {
      countQuery = countQuery.eq('prompt.category_id', categoryId);
    }
    
    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      
      throw countError;
    }

    // 如果没有收藏记录，直接返回空数组
    if (!favorites || favorites.length === 0) {
      return NextResponse.json({
        prompts: [],
        total: totalCount || 0
      });
    }

    // 处理并格式化数据 - 过滤掉没有关联prompts的收藏
    const formattedFavorites = favorites
      .filter((favorite: any) => favorite.prompt) // 确保prompt存在
      .map((favorite: any) => {
        const prompt = favorite.prompt;
        if (!prompt) return null; // 跳过没有关联prompt的收藏
        
        return {
          id: prompt.id,
          title: prompt.title || '无标题',
          description: prompt.description || '',
          category: prompt.category?.display_name || prompt.category?.name || '未分类',
          category_id: prompt.category?.id || '',
          categoryName: prompt.category?.name || '',
          categoryColor: prompt.category?.color || 'blue',
          views: prompt.view_count || 0,
          favoriteDate: favorite.created_at ? new Date(favorite.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          content: prompt.content || '',
          tags: Array.isArray(prompt.tags) ? prompt.tags.map((t: any) => ({
            id: t.tag?.id || '',
            name: t.tag?.name || '',
            display_name: t.tag?.display_name || ''
          })) : []
        };
      })
      .filter(Boolean); // 过滤掉null值

    // 如果是依赖prompt的排序，需要手动排序
    if (sort === 'mostUsed') {
      formattedFavorites.sort((a: any, b: any) => b.views - a.views);
    } else if (sort === 'name') {
      formattedFavorites.sort((a: any, b: any) => a.title.localeCompare(b.title));
    }

    // 记录日志用于调试
    

    return NextResponse.json({
      prompts: formattedFavorites,
      total: totalCount || 0
    });
  } catch (error) {
    
    return NextResponse.json({ error: '获取用户收藏失败，请稍后重试' }, { status: 500 });
  }
}

// 添加收藏
export async function POST(request: NextRequest) {
  try {
    // 获取当前用户 - 先调用cookies()等动态API
    const cookieStore = cookies();
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const userId = user.id;
    const { promptId } = await request.json();

    if (!promptId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    // 验证用户是否存在
    const userProfile = await getUserById(userId);
    if (!userProfile) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 添加收藏
    await favoritePrompt(userId, promptId);

    return NextResponse.json({ message: '收藏成功' });
  } catch (error) {
    
    return NextResponse.json({ error: '添加收藏失败，请稍后重试' }, { status: 500 });
  }
}

// 取消收藏
export async function DELETE(request: NextRequest) {
  try {
    // 获取当前用户 - 先调用cookies()等动态API
    // const cookieStore = cookies();
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const userId = user.id;
    const { promptId } = await request.json();

    if (!promptId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    // 验证用户是否存在
    const userProfile = await getUserById(userId);
    if (!userProfile) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 取消收藏
    await favoritePrompt(userId, promptId);

    return NextResponse.json({ message: '取消收藏成功' });
  } catch (error) {
    
    return NextResponse.json({ error: '取消收藏失败，请稍后重试' }, { status: 500 });
  }
} 