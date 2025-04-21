import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 模拟数据 - 在实际应用中，这些数据可能来自数据库
    const testimonials = [
      {
        id: 1,
        name: '陈瑞阳',
        title: '人工智能工程师',
        content: '这个平台上的提示词非常实用，帮助我大大提高了工作效率。强烈推荐给所有AI从业者！',
        avatar: '/avatars/avatar-1.png',
        rating: 5
      },
      {
        id: 2,
        name: '林雨晴',
        title: '内容创作者',
        content: '作为一名内容创作者，我发现这里的提示词能够帮助我突破创作瓶颈，产出更高质量的内容。',
        avatar: '/avatars/avatar-2.png',
        rating: 4
      },
      {
        id: 3,
        name: '王浩然',
        title: '数据科学家',
        content: '提示词共享平台为我的日常工作带来了极大便利，我可以快速找到适合特定任务的优质提示。',
        avatar: '/avatars/avatar-3.png',
        rating: 5
      },
      {
        id: 4,
        name: '刘婧萱',
        title: '产品经理',
        content: '平台上的提示词分类清晰，质量有保证，帮助我更有效地使用AI工具进行产品规划和设计。',
        avatar: '/avatars/avatar-4.png',
        rating: 4
      }
    ];

    return NextResponse.json({ testimonials });
  } catch (error) {
    
    return NextResponse.json(
      { error: '获取评价数据失败' },
      { status: 500 }
    );
  }
} 