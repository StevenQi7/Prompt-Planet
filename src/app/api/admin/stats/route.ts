import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { Redis } from '@upstash/redis';

// 创建 Redis 客户端
const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
});

// 定义缓存控制策略
const cacheHeaders = {
  'Cache-Control': 'private, max-age=30, stale-while-revalidate=300',
  'CDN-Cache-Control': 'private, no-store',
};

// 定义缓存键前缀和过期时间
const ADMIN_STATS_CACHE_PREFIX = 'admin:stats:';
const ADMIN_STATS_CACHE_TTL = 300; // 5分钟

// 获取提示词统计数据
export async function GET(req: NextRequest) {
  try {
    // 检查客户端缓存头，实现条件请求
    const ifNoneMatch = req.headers.get('if-none-match');
    
    // 生成一个简单的ETag，每30秒更新一次
    const timestamp = Math.floor(Date.now() / 30000); // 30秒为一个时间单位
    const etag = `"admin-stats-${timestamp}"`;
    
    // 使用条件请求，如果客户端已有最新数据，则返回304
    if (ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: { ...cacheHeaders, 'ETag': etag }
      });
    }

    // 检查用户权限
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 检查用户角色
    const userRole = user.user_metadata?.role;
    
    if (userRole !== 'admin') {
      return NextResponse.json({ error: '无权访问' }, { status: 403 });
    }

    // 尝试从 Redis 获取缓存
    const cacheKey = `${ADMIN_STATS_CACHE_PREFIX}all`;
    const cachedStats = await redis.get(cacheKey);
    
    if (cachedStats) {
      return NextResponse.json({
        stats: cachedStats
      }, {
        headers: {
          ...cacheHeaders,
          'X-Cache': 'HIT',
          'ETag': etag
        }
      });
    }

    // 构建一个更高效的查询，使用一次数据库调用获取所有状态的计数
    const { data, error } = await supabase
      .rpc('get_prompt_stats');

    if (error) {
      // 尝试退回到多次查询的方式
      return await getFallbackStats(supabase);
    }

    // 数据格式应该是 { reviewing, published, rejected, total }
    if (!data) {
      return await getFallbackStats(supabase);
    }

    // 存储到 Redis 缓存
    await redis.set(cacheKey, data, {
      ex: ADMIN_STATS_CACHE_TTL
    });

    return NextResponse.json({
      stats: data
    }, {
      headers: {
        ...cacheHeaders,
        'X-Cache': 'MISS',
        'ETag': etag,
        'Last-Modified': new Date().toUTCString()
      }
    });
  } catch (error) {
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 });
  }
}

// 备用方法：使用多次查询获取统计数据
async function getFallbackStats(supabase: any) {
  try {
    // 尝试从 Redis 获取缓存
    const cacheKey = `${ADMIN_STATS_CACHE_PREFIX}fallback`;
    const cachedStats = await redis.get(cacheKey);
    
    if (cachedStats) {
      return NextResponse.json({
        stats: cachedStats
      }, {
        headers: {
          ...cacheHeaders,
          'X-Cache': 'HIT'
        }
      });
    }

    // 获取正在审核的提示词数量
    const { count: reviewingCount, error: reviewingError } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'reviewing');

    if (reviewingError) throw reviewingError;

    // 获取已发布的提示词数量
    const { count: publishedCount, error: publishedError } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    if (publishedError) throw publishedError;

    // 获取已拒绝的提示词数量
    const { count: rejectedCount, error: rejectedError } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');

    if (rejectedError) throw rejectedError;

    // 计算总数
    const stats = {
      reviewing: reviewingCount || 0,
      published: publishedCount || 0,
      rejected: rejectedCount || 0,
      total: (reviewingCount || 0) + (publishedCount || 0) + (rejectedCount || 0)
    };

    // 存储到 Redis 缓存
    await redis.set(cacheKey, stats, {
      ex: ADMIN_STATS_CACHE_TTL
    });

    return NextResponse.json({
      stats
    }, {
      headers: {
        ...cacheHeaders,
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 });
  }
} 