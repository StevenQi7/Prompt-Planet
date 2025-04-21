import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // 创建响应
    const response = NextResponse.json({
      message: '登出成功'
    });

    // 清除Cookie
    response.cookies.set('userId', '', {
      httpOnly: true,
      expires: new Date(0), // 设置为过去的时间，使Cookie立即过期
      path: '/',
    });

    return response;
  } catch (error) {
    
    return NextResponse.json({ error: '登出失败，请稍后重试' }, { status: 500 });
  }
} 