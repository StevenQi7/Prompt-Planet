import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// 定义缓存控制策略 - 分类数据可以缓存更长时间，因为不经常变化
const cacheHeaders = {
  'Cache-Control': 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400',
  'CDN-Cache-Control': 'public, max-age=7200',
  'Vercel-CDN-Cache-Control': 'public, max-age=7200',
  'Surrogate-Control': 'public, max-age=86400',
  'Surrogate-Key': 'categories'
};

// 定义计数数据的类型
interface CategoryCount {
  category_id: string;
  count: number;
}

export async function GET(req: NextRequest) {
  try {
    // 检查是否需要包含每个分类的提示词数量
    const { searchParams } = new URL(req.url);
    const includeCount = searchParams.get('includeCount') !== 'false'; // 默认包含数量

    // 检查客户端缓存头，实现条件请求
    const ifNoneMatch = req.headers.get('if-none-match');
    const ifModifiedSince = req.headers.get('if-modified-since');
    
    // 生成一个简单的ETag（在生产环境中，应该基于数据内容生成）
    const etag = `"categories-v1-${new Date().toDateString()}"`;
    
    // 使用条件请求，如果客户端已有最新数据，则返回304
    if (ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: { ...cacheHeaders, 'ETag': etag }
      });
    }

    const supabase = createClient();
    
    // 获取所有分类，按照显示名称排序
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_name', { ascending: true });
    
    if (error) {
      throw error;
    }

    // 如果需要包含数量统计，则获取每个分类的提示词数量
    let categoryCounts: Record<string, number> = {};
    
    if (includeCount) {
      try {
        // 使用 SQL 查询获取每个分类的提示词数量
        const { data: countData, error: countError } = await supabase.rpc(
          'get_category_counts'
        );
        
        if (countError) {
          
          
          // 备用方法：手动统计每个分类的提示词数量
          for (const category of data) {
            const { count, error: countError } = await supabase
              .from('prompts')
              .select('*', { count: 'exact', head: true })
              .eq('status', 'published')
              .eq('is_public', true)
              .eq('category_id', category.id);
            
            if (!countError) {
              categoryCounts[category.id] = count || 0;
            }
          }
        } else if (countData) {
          // 处理存储过程返回的数据
          countData.forEach((item: CategoryCount) => {
            categoryCounts[item.category_id] = item.count;
          });
        }
      } catch (countError) {
        
      }
    }
    
    // 转换数据结构
    const categories = data.map(category => ({
      id: category.id,
      name: category.name,
      displayName: category.display_name,
      icon: category.icon,
      color: category.color,
      count: categoryCounts[category.id] || 0
    }));
    
    // 返回结果，添加缓存控制头
    return NextResponse.json(categories, {
      headers: {
        ...cacheHeaders,
        'ETag': etag,
        'Last-Modified': new Date().toUTCString()
      }
    });
  } catch (error) {
    
    return NextResponse.json(
      { error: '获取分类失败，请稍后重试' },
      { status: 500 }
    );
  }
} 