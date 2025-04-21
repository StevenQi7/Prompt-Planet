import { NextRequest, NextResponse } from 'next/server';
import { getAdminReviewPrompts } from '@/services/promptService';
import { createClient } from '@/lib/supabase-server';

// 管理员获取待审核提示词列表
export async function GET(req: NextRequest) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'reviewing'; // 默认获取待审核的
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryId = searchParams.get('categoryId') || undefined;

    // 生成缓存控制头，prompts 数据短时间缓存
    // 针对不同类型的请求设置不同的缓存策略
    let cacheControl = '';
    if (limit === 1) {
      // 如果是统计类请求，设置更长的缓存时间
      cacheControl = 'public, s-maxage=60, stale-while-revalidate=300';
    } else {
      // 常规列表请求，设置较短的缓存时间
      cacheControl = 'public, s-maxage=10, stale-while-revalidate=30';
    }

    // 生成缓存控制头
    const cacheHeaders = {
      'Cache-Control': cacheControl,
      'CDN-Cache-Control': limit === 1 ? 'public, max-age=60' : 'public, max-age=10',
      'Vercel-CDN-Cache-Control': limit === 1 ? 'public, max-age=60' : 'public, max-age=10'
    };

    // 计算ETag
    // 使用查询参数组合生成唯一的ETag
    const timestamp = Math.floor(Date.now() / (limit === 1 ? 60000 : 10000)); // 统计请求每60秒更新，列表请求每10秒更新
    const queryHash = `${status}-${page}-${limit}-${categoryId || 'all'}-${timestamp}`;
    const etag = `"prompts-${queryHash}"`;

    // 检查客户端缓存头，实现条件请求
    const ifNoneMatch = req.headers.get('if-none-match');
    
    // 使用条件请求，如果客户端已有最新数据，则返回304
    if (ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: { ...cacheHeaders, 'ETag': etag }
      });
    }

    // 获取当前用户
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const userId = user.id;

    // 检查用户角色
    const userRole = user.user_metadata?.role;
    
    if (userRole !== 'admin') {
      return NextResponse.json({ error: '无权访问' }, { status: 403 });
    }

    // 获取审核提示词列表
    const result = await getAdminReviewPrompts({
      status: status as string,
      page,
      limit,
      categoryId
    });

    // 处理响应数据
    return NextResponse.json({
      prompts: result.prompts.map(prompt => {
        // 避免二次解析，images 在 getAdminReviewPrompts 中已经解析过
        return {
          ...prompt,
          // 如果 images 已经是数组，则不再解析
          images: Array.isArray(prompt.images) ? prompt.images : 
                  (typeof prompt.images === 'string' ? 
                    (prompt.images ? JSON.parse(prompt.images) : []) : 
                    [])
        };
      }),
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    }, {
      headers: {
        ...cacheHeaders,
        'ETag': etag,
        'Last-Modified': new Date().toUTCString()
      }
    });
  } catch (error) {
    
    return NextResponse.json({ error: '获取审核提示词失败，请稍后重试' }, { status: 500 });
  }
} 