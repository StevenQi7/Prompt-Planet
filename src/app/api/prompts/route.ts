import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedPrompts, getLatestPrompts, searchPrompts, createPrompt } from '@/services/promptService';
import { getUserById } from '@/services/userService';
import { transformPromptResponse } from '@/utils/dataTransformer';
import { createClient } from '@/lib/supabase-server';
import { Redis } from '@upstash/redis';

// 创建 Redis 客户端
const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
});

// 定义缓存控制策略
const cacheHeaders = {
  'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300',
  'CDN-Cache-Control': 'public, max-age=30',
  'Vercel-CDN-Cache-Control': 'public, max-age=30',
};

// 定义缓存键前缀和过期时间
const FEATURED_CACHE_PREFIX = 'featured:';
const LATEST_CACHE_PREFIX = 'latest:';
const SEARCH_CACHE_PREFIX = 'search:';
const FEATURED_CACHE_TTL = 1800; // 30分钟
const LATEST_CACHE_TTL = 300; // 5分钟
const SEARCH_CACHE_TTL = 60; // 1分钟

// 获取提示词列表或搜索提示词
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const categoryId = searchParams.get('category');
    const tagId = searchParams.get('tag');
    const lang = searchParams.get('lang') || searchParams.get('language');
    const sortBy = searchParams.get('sort') as 'latest' | 'popular' | 'relevance';
    const pageStr = searchParams.get('page');
    const limitStr = searchParams.get('limit');
    const featured = searchParams.get('featured') === 'true';
    const latest = searchParams.get('latest') === 'true';
    const status = searchParams.get('status');
    const exclude = searchParams.get('exclude');

    // 获取多个分类和标签参数
    const categoryIds = searchParams.getAll('categories[]');
    const tagIdsFromArray = searchParams.getAll('tags[]');
    
    // 获取单个标签参数的多个值（支持tag=id1&tag=id2格式）
    const tagIdsFromSingle = searchParams.getAll('tag');
    
    // 处理tags参数（逗号分隔的格式，如tags=id1,id2）
    const tagsParam = searchParams.get('tags');
    const tagIdsFromComma = tagsParam ? tagsParam.split(',') : [];
    
    // 合并所有标签ID来源
    const allTagIds = [...tagIdsFromArray, ...tagIdsFromSingle, ...tagIdsFromComma];
    // 去重
    const uniqueTagIds = [...new Set(allTagIds)];
    
    const page = pageStr ? parseInt(pageStr) : 1;
    const limit = limitStr ? parseInt(limitStr) : 9;

    // 生成缓存键
    const cacheKey = featured 
      ? `${FEATURED_CACHE_PREFIX}${lang || 'all'}-${page}-${limit}`
      : latest
        ? `${LATEST_CACHE_PREFIX}${lang || 'all'}-${page}-${limit}`
        : `${SEARCH_CACHE_PREFIX}${query || ''}-${categoryId || ''}-${uniqueTagIds.join('_') || ''}-${lang || ''}-${sortBy || ''}-${page}-${limit}-${status || ''}-${exclude || ''}`;

    // 生成 ETag
    const etag = `"${cacheKey}-${Math.floor(Date.now() / 30000)}"`; // 每30秒更新一次

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

    let result;
    let cacheTTL = SEARCH_CACHE_TTL;

    // 获取特色提示词（首页推荐）
    if (featured) {
      result = await getFeaturedPrompts(limit, page, lang || undefined);
      cacheTTL = FEATURED_CACHE_TTL;
    }
    // 获取最新提示词
    else if (latest) {
      result = await getLatestPrompts(limit, page, lang || undefined);
      cacheTTL = LATEST_CACHE_TTL;
    }
    // 搜索提示词
    else {
      result = await searchPrompts({
        query: query || undefined,
        categoryId: categoryId || undefined,
        categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        tagId: tagId || undefined,
        tagIds: uniqueTagIds.length > 0 ? uniqueTagIds : undefined,
        lang: lang || undefined,
        page,
        limit,
        sortBy: sortBy || 'latest',
        status: status || undefined,
        exclude: exclude || undefined,
      });
    }

    // 使用转换器处理数据
    const transformedResult = transformPromptResponse(result);

    // 存储到 Redis 缓存
    await redis.set(cacheKey, transformedResult, {
      ex: cacheTTL
    });
    
    return NextResponse.json(transformedResult, {
      headers: {
        ...cacheHeaders,
        'ETag': etag,
        'Last-Modified': new Date().toUTCString(),
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: '获取提示词失败' }, { status: 500 });
  }
}

// 创建新提示词
export async function POST(req: NextRequest) {
  try {
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

    // 解析请求体
    const body = await req.json();
    const { title, description, content, usageGuide, categoryId, tags, images, language, isPublic } = body;

    // 验证必填字段
    if (!title || !description || !content || !categoryId) {
      return NextResponse.json({ error: '标题、描述、内容和分类为必填项' }, { status: 400 });
    }

    // 创建提示词
    const prompt = await createPrompt({
      title,
      description,
      content,
      usageGuide,
      categoryId,
      authorId: user.id,
      tags,
      images,
      language,
      isPublic,
    });

    // 转换响应数据
    const transformedPrompt = transformPromptResponse(prompt);

    return NextResponse.json({ 
      prompt: transformedPrompt, 
      message: '提示词创建成功，正在等待审核' 
    }, { status: 201 });
  } catch (error) {
    
    return NextResponse.json({ error: '创建提示词失败' }, { status: 500 });
  }
} 