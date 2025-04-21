import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials } from '@/services/userService';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码为必填项' }, { status: 400 });
    }

    // 验证用户凭证
    const user = await validateCredentials(email, password);

    if (!user) {
      return NextResponse.json({ error: '邮箱或密码不正确' }, { status: 401 });
    }

    // 创建会话（这里简化处理，实际应用中应使用 JWT 或 NextAuth.js）
    const response = NextResponse.json({
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
      }
    });

    // 获取请求的 host
    const host = req.headers.get('host') || '';
    const domain = host.split(':')[0]; // 移除端口号

    // 设置 Cookie
    response.cookies.set('userId', user.id, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      domain: domain,
      sameSite: 'lax'
    });

    return response;
  } catch (error) {
    
    return NextResponse.json({ error: '登录失败，请稍后重试' }, { status: 500 });
  }
} 