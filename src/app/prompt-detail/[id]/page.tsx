import React from 'react';
import PromptDetail from '@/components/PromptDetail';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase-server';
import * as metadataUtils from '@/utils/metadata';

// 定义动态路由页面的参数类型
interface PromptDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 动态生成元数据
export async function generateMetadata({ params }: PromptDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    // 获取提示词数据
    const supabase = createClient();
    const { data: prompt, error } = await supabase
      .from('prompts')
      .select(`
        id, 
        title, 
        description, 
        status,
        is_public,
        language,
        updated_at,
        category_id,
        categories:categories(id, name, display_name)
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (error || !prompt || prompt.status !== 'published' || !prompt.is_public) {
      // 返回默认元数据
      return metadataUtils.generateMetadata('promptDetail.title', 'promptDetail.subtitle');
    }
    
    // 安全地获取分类名称
    let categoryName = '';
    if (prompt.categories && typeof prompt.categories === 'object' && 'display_name' in prompt.categories) {
      categoryName = String(prompt.categories.display_name || '');
    }
    
    // 准备动态元数据
    return {
      title: prompt.title,
      description: prompt.description,
      keywords: [categoryName, prompt.language, '提示词', 'AI提示词', 'prompt', prompt.title],
      openGraph: {
        title: `${prompt.title} | PromptShare`,
        description: prompt.description,
        type: 'article',
        url: `${process.env.SITE_URL || 'https://promptshare.example.com'}/prompt-detail/${id}`,
        publishedTime: prompt.updated_at,
      },
      twitter: {
        card: 'summary_large_image',
        title: prompt.title,
        description: prompt.description,
      },
    };
  } catch (e) {
    console.error('获取提示词元数据失败:', e);
    return metadataUtils.generateMetadata('promptDetail.title', 'promptDetail.subtitle');
  }
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  return (
    <main className="bg-gray-50 min-h-screen pb-10">
      <PromptDetail promptId={id} />
    </main>
  );
} 