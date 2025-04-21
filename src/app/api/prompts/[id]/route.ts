import { getPromptById, updatePrompt, deletePrompt } from '@/services/promptService';
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { transformPromptResponse } from '@/utils/dataTransformer';
import { getUserById } from '@/services/userService';
import { Redis } from '@upstash/redis';

// 创建 Redis 客户端
const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
});

// 定义缓存控制策略
const cacheHeaders = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  'CDN-Cache-Control': 'public, max-age=60',
  'Vercel-CDN-Cache-Control': 'public, max-age=60',
};

// 定义缓存键前缀
const PROMPT_CACHE_PREFIX = 'prompt:';
const PROMPT_CACHE_TTL = 3600; // 1小时的缓存时间

// GET /api/prompts/[id] - 获取提示词详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 获取提示词ID
    const { id } = await params;
    
    // 检查客户端缓存头
    const ifNoneMatch = request.headers.get('if-none-match');
    const etag = `"prompt-${id}-${Math.floor(Date.now() / 60000)}"`; // 每分钟更新一次
    
    if (ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: { ...cacheHeaders, 'ETag': etag }
      });
    }

    // 尝试从 Redis 获取缓存
    const cacheKey = `${PROMPT_CACHE_PREFIX}${id}`;
    const cachedPrompt = await redis.get(cacheKey);
    
    if (cachedPrompt) {
      return NextResponse.json(cachedPrompt, {
        headers: {
          ...cacheHeaders,
          'ETag': etag,
          'Last-Modified': new Date().toUTCString(),
          'X-Cache': 'HIT'
        }
      });
    }
    
    // 如果缓存未命中，查询提示词详情
    const prompt = await getPromptById(id);

    if (!prompt) {
      return NextResponse.json({ error: '提示词不存在' }, { status: 404 });
    }

    // 使用转换器处理数据
    const transformedPrompt = transformPromptResponse(prompt);

    // 存储到 Redis 缓存
    await redis.set(cacheKey, transformedPrompt, {
      ex: PROMPT_CACHE_TTL // 设置过期时间
    });

    return NextResponse.json(transformedPrompt, {
      headers: {
        ...cacheHeaders,
        'ETag': etag,
        'Last-Modified': new Date().toUTCString(),
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: '获取提示词详情失败' },
      { status: 500 }
    );
  }
}

// PUT /api/prompts/[id] - 更新提示词
export async function PUT(
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

    // 检查是否有权限修改
    if (prompt.author_id !== user.id && userProfile.role !== 'admin') {
      return NextResponse.json({ error: '无权修改此提示词' }, { status: 403 });
    }

    // 解析请求体
    const body = await request.json();
    const { title, description, content, usageGuide, categoryId, tags, images, language, isPublic, status } = body;

    // 更新提示词
    const updatedPrompt = await updatePrompt(promptId, {
      title,
      description,
      content,
      usageGuide,
      categoryId,
      tags,
      images,
      language,
      isPublic,
      status
    }, user.id);

    // 更新后删除缓存
    const cacheKey = `${PROMPT_CACHE_PREFIX}${promptId}`;
    await redis.del(cacheKey);

    return NextResponse.json({ prompt: updatedPrompt });
  } catch (error) {
    return NextResponse.json({ error: '更新提示词失败' }, { status: 500 });
  }
}

// DELETE /api/prompts/[id] - 删除提示词
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

    // 检查是否有权限删除
    if (prompt.author_id !== user.id && userProfile.role !== 'admin') {
      return NextResponse.json({ error: '无权删除此提示词' }, { status: 403 });
    }

    // 删除提示词
    await deletePrompt(promptId, user.id);

    // 删除缓存
    const cacheKey = `${PROMPT_CACHE_PREFIX}${promptId}`;
    await redis.del(cacheKey);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '删除提示词失败' }, { status: 500 });
  }
} 