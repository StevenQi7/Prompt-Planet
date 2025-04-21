import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/services/userService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password, nickname } = body;

    // 验证必填字段
    if (!username || !email || !password) {
      return NextResponse.json({ error: '用户名、邮箱和密码为必填项' }, { status: 400 });
    }

    // 验证电子邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '邮箱格式不正确' }, { status: 400 });
    }

    // 验证密码长度
    if (password.length < 8) {
      return NextResponse.json({ error: '密码长度至少为8个字符' }, { status: 400 });
    }

    // 验证用户名格式（只允许字母、数字和下划线）
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ error: '用户名只能包含字母、数字和下划线' }, { status: 400 });
    }

    // 创建用户
    const user = await createUser({
      username,
      email,
      password,
      nickname: nickname || username
    });

    return NextResponse.json({ 
      message: '注册成功', 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname
      }
    }, { status: 201 });
  } catch (error: any) {
    
    
    // 处理已知错误
    if (error.message === '用户名已被使用' || error.message === '邮箱已被注册') {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    
    return NextResponse.json({ error: '注册失败，请稍后重试' }, { status: 500 });
  }
} 