import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { updatePromptStatus } from '@/services/promptService';

// 管理员审核提示词
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

    // 检查用户是否是管理员
    const isAdmin = user.user_metadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: '无权访问' }, { status: 403 });
    }

    // 获取请求体数据
    const body = await request.json();
    const { status, notes } = body;

    // 验证审核状态
    if (!status || !['published', 'rejected'].includes(status)) {
      return NextResponse.json({ error: '无效的审核状态' }, { status: 400 });
    }

    // 更新提示词状态
    const updatedPrompt = await updatePromptStatus({
      promptId,
      reviewerId: user.id,
      status,
      notes: notes || ''
    });

    return NextResponse.json({
      message: status === 'published' ? '审核通过成功' : '审核拒绝成功',
      prompt: {
        ...updatedPrompt,
        images: updatedPrompt.images ? JSON.parse(updatedPrompt.images as string) : []
      }
    });
  } catch (error) {
    
    return NextResponse.json({ error: '审核提示词失败，请稍后重试' }, { status: 500 });
  }
} 