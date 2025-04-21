import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { Redis } from '@upstash/redis';

// 创建 Redis 客户端
const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
});

// 定义缓存控制策略 - 用户统计数据使用较短的缓存时间
const cacheHeaders = {
  'Cache-Control': 'private, max-age=60',
  'CDN-Cache-Control': 'private, no-store',
};

// 定义缓存键前缀和过期时间
const USER_STATS_CACHE_PREFIX = 'user:stats:';
const USER_STATS_CACHE_TTL = 300; // 5分钟

export async function GET() {
  try {
    const supabase = createClient();
    
    // 直接获取已验证的用户信息
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: '用户未登录', isLoggedIn: false }, { status: 401 });
    }

    // 尝试从 Redis 获取缓存
    const cacheKey = `${USER_STATS_CACHE_PREFIX}${user.id}`;
    const cachedStats = await redis.get(cacheKey);
    
    if (cachedStats) {
      return NextResponse.json(cachedStats, {
        headers: {
          ...cacheHeaders,
          'X-Cache': 'HIT'
        }
      });
    }

    // 获取用户提示词统计
    const { data: prompts, error: promptsError } = await supabase
      .from('prompts')
      .select('status, is_public')
      .eq('author_id', user.id);

    if (promptsError) {
      throw promptsError;
    }

    // 获取用户收藏的提示词数量
    const { data: favorites, error: favoritesError } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id);

    if (favoritesError) {
      throw favoritesError;
    }

    // 计算各种状态的提示词数量
    const stats = {
      prompts: prompts.length,
      publishedPrompts: prompts.filter(p => p.status === 'published' && p.is_public).length,
      reviewingPrompts: prompts.filter(p => p.status === 'reviewing' && p.is_public).length,
      rejectedPrompts: prompts.filter(p => p.status === 'rejected' && p.is_public).length,
      privatePrompts: prompts.filter(p => !p.is_public).length,
      favorites: favorites.length
    };

    // 存储到 Redis 缓存
    await redis.set(cacheKey, stats, {
      ex: USER_STATS_CACHE_TTL
    });

    return NextResponse.json(stats, {
      headers: {
        ...cacheHeaders,
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: '获取用户统计信息失败' },
      { status: 500 }
    );
  }
} 