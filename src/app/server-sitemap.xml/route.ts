import { getServerSideSitemap } from 'next-sitemap';
import { createClient } from '@/lib/supabase-server';
import type { ISitemapField } from 'next-sitemap';

export async function GET() {
  try {
    // 创建 Supabase 客户端
    const supabase = createClient();
    
    // 获取所有已发布的提示词
    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('id, updated_at')
      .eq('status', 'published')
      .eq('is_public', true)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('获取提示词失败:', error);
      return getServerSideSitemap([]);
    }
    
    // 构建 sitemap 内容
    const sitemapEntries: ISitemapField[] = prompts.map((prompt) => ({
      loc: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/prompt-detail/${prompt.id}`,
      lastmod: prompt.updated_at ? new Date(prompt.updated_at).toISOString() : new Date().toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.8,
    }));
    
    // 返回 XML sitemap
    return getServerSideSitemap(sitemapEntries);
  } catch (e) {
    console.error('生成 sitemap 时出错:', e);
    return getServerSideSitemap([]);
  }
} 