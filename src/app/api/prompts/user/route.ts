import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById } from '@/services/userService';
import { getUserPrompts } from '@/services/promptService';
import { getUserIdFromCookie } from '@/utils/session';

// 获取当前用户的提示词
export async function GET(req: NextRequest) {
  try {
    // 从Cookie中获取用户ID
    const cookieStore = await cookies();
    const userId = getUserIdFromCookie(cookieStore);

    if (!userId) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 验证用户是否存在
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 获取查询参数
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const isPrivate = searchParams.get('isPrivate') === 'true';
    const includeReviews = searchParams.get('includeReviews') === 'true';

    // 获取用户创建的提示词，传递分页参数
    const result = await getUserPrompts(userId, status || undefined, page, limit, isPrivate, includeReviews);

    // 直接返回原始结果，不使用transformPromptResponse进行转换，以避免数据字段丢失
    return NextResponse.json(result);
  } catch (error) {
    
    return NextResponse.json({ error: '获取用户提示词失败，请稍后重试' }, { status: 500 });
  }
} 