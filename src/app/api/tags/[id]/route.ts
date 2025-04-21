import { NextRequest, NextResponse } from 'next/server';
import { getTagById } from '@/services/tagService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tagId = id;
    
    if (!tagId) {
      return NextResponse.json({ error: '标签ID不能为空' }, { status: 400 });
    }
    
    const tag = await getTagById(tagId);
    
    if (!tag) {
      return NextResponse.json({ error: '标签不存在' }, { status: 404 });
    }
    
    return NextResponse.json(tag);
  } catch (error) {
    
    return NextResponse.json({ error: '获取标签详情失败，请稍后重试' }, { status: 500 });
  }
} 