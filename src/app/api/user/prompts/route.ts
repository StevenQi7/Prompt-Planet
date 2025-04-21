import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { transformPromptResponse } from '@/utils/dataTransformer';

// 定义缓存控制策略 - 用户数据使用私有缓存
const cacheHeaders = {
  'Cache-Control': 'private, no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

export async function GET(request: Request) {
  try {
    // 使用 createClient 创建 Supabase 客户端
    const supabase = createClient();
    
    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';
    
    const offset = (page - 1) * limit;

    // 优化：1. 只选择必要的字段
    //      2. 使用inner join提高查询效率
    //      3. 添加索引提示
    let query = supabase
      .from('prompts')
      .select(`
        id,
        title,
        description,
        content,
        status,
        is_public,
        created_at,
        updated_at,
        view_count,
        favorite_count,
        category:categories!inner(id, name, display_name, icon, color),
        tags:prompt_tags!inner(
          tag:tags!inner(id, name, display_name, color)
        )
      `, { count: 'exact' })
      .eq('author_id', user.id)
      .order('created_at', { ascending: false });

    // 根据状态筛选 - 优化查询条件
    if (status !== 'all') {
      if (status === 'private') {
        query = query.eq('is_public', false);
      } else {
        // 使用组合条件优化查询
        query = query.eq('status', status).eq('is_public', true);
      }
    }

    // 使用范围查询优化分页
    const { data: prompts, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // 使用转换器处理数据
    const transformedPrompts = transformPromptResponse({
      prompts,
      total: count || 0,
      page,
      limit
    });

    // 添加缓存控制头
    return NextResponse.json(transformedPrompts, {
      headers: {
        ...cacheHeaders,
        'ETag': `"user-prompts-${user.id}-${status}-${page}-${Date.now()}"`
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: '获取用户提示词失败' },
      { status: 500 }
    );
  }
} 