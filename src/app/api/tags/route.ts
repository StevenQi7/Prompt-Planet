import { NextRequest, NextResponse } from 'next/server';
import { getAllTags, getPopularTags, searchTags, getTagById, getPromptTagsByIds } from '@/services/tagService';
import { Redis } from '@upstash/redis';

// 创建 Redis 客户端
const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
});

// 定义缓存控制策略
const cacheHeaders = {
  'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
  'CDN-Cache-Control': 'public, max-age=1800',
  'Vercel-CDN-Cache-Control': 'public, max-age=1800',
};

// 定义缓存键前缀和过期时间
const TAGS_CACHE_PREFIX = 'tags:';
const POPULAR_TAGS_CACHE_PREFIX = 'tags:popular:';
const SEARCH_TAGS_CACHE_PREFIX = 'tags:search:';
const TAGS_CACHE_TTL = 86400; // 24小时
const POPULAR_TAGS_CACHE_TTL = 3600; // 1小时
const SEARCH_TAGS_CACHE_TTL = 300; // 5分钟

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const popular = searchParams.get('popular') === 'true';
    const limitStr = searchParams.get('limit');
    const limit = limitStr ? parseInt(limitStr) : 20;
    const ids = searchParams.get('ids');

    // 根据IDs获取多个标签
    if (ids) {
      const tagIds = ids.split(',');
      const cacheKey = `${TAGS_CACHE_PREFIX}ids:${tagIds.sort().join(',')}`;
      
      // 尝试从缓存获取
      const cachedTags = await redis.get(cacheKey);
      if (cachedTags) {
        return NextResponse.json(cachedTags);
      }
      
      try {
        const tags = await getPromptTagsByIds(tagIds);
        
        if (tags && tags.length > 0) {
          // 缓存结果
          await redis.set(cacheKey, tags, {
            ex: TAGS_CACHE_TTL
          });
          return NextResponse.json(tags);
        } else {
          return NextResponse.json([]);
        }
      } catch (error) {
        return NextResponse.json([]);
      }
    }

    // 生成缓存键
    let cacheKey = '';
    let cacheTTL = TAGS_CACHE_TTL;

    if (query) {
      cacheKey = `${SEARCH_TAGS_CACHE_PREFIX}${query}:${limit}`;
      cacheTTL = SEARCH_TAGS_CACHE_TTL;
    } else if (popular) {
      cacheKey = `${POPULAR_TAGS_CACHE_PREFIX}${limit}`;
      cacheTTL = POPULAR_TAGS_CACHE_TTL;
    } else {
      cacheKey = `${TAGS_CACHE_PREFIX}all`;
    }

    // 生成 ETag
    const etag = `"${cacheKey}-${Math.floor(Date.now() / 300000)}"`; // 每5分钟更新一次

    // 检查客户端缓存
    const ifNoneMatch = req.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: { ...cacheHeaders, 'ETag': etag }
      });
    }

    // 尝试从 Redis 获取缓存
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult, {
        headers: {
          ...cacheHeaders,
          'ETag': etag,
          'Last-Modified': new Date().toUTCString(),
          'X-Cache': 'HIT'
        }
      });
    }

    let tags;

    // 搜索标签
    if (query) {
      tags = await searchTags(query, limit);
    }
    // 获取热门标签
    else if (popular) {
      tags = await getPopularTags(limit);
    }
    // 获取所有标签
    else {
      tags = await getAllTags();
    }

    // 存储到 Redis 缓存
    await redis.set(cacheKey, tags, {
      ex: cacheTTL
    });

    return NextResponse.json(tags, {
      headers: {
        ...cacheHeaders,
        'ETag': etag,
        'Last-Modified': new Date().toUTCString(),
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: '获取标签列表失败，请稍后重试' },
      { status: 500 }
    );
  }
} 