import { createClient } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Tag = Database['public']['Tables']['tags']['Row'];
type PromptTag = Database['public']['Tables']['prompt_tags']['Row'];
type Prompt = Database['public']['Tables']['prompts']['Row'];

// 获取热门标签
export async function getPopularTags(limit = 20) {
  try {
    const supabase = createClient();
    
    // 获取所有标签
    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .order('count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return tags;
  } catch (error) {
    
    throw error;
  }
}

// 获取所有标签
export async function getAllTags() {
  try {
    const supabase = createClient();
    
    // 获取所有标签
    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .order('count', { ascending: false });

    if (error) throw error;
    return tags;
  } catch (error) {
    
    throw error;
  }
}

// 根据ID获取标签
export async function getTagById(id: string) {
  try {
    const supabase = createClient();
    const { data: tag, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return tag;
  } catch (error) {
    
    throw error;
  }
}

// 创建标签
export async function createTag(tagData: {
  name: string;
  displayName: string;
  slug: string;
  color: string;
}) {
  try {
    // 检查标签名是否已存在
    const supabase = createClient();
    
    // 分别检查名称和slug是否已存在
    const { data: nameExists } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tagData.name)
      .maybeSingle();
      
    const { data: slugExists } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', tagData.slug)
      .maybeSingle();

    if (nameExists) {
      throw new Error('标签名已存在');
    }
    
    if (slugExists) {
      throw new Error('标签slug已存在');
    }

    const { data: tag, error: createError } = await supabase
      .from('tags')
      .insert([tagData])
      .select();

    if (createError) throw createError;
    return tag;
  } catch (error) {
    
    throw error;
  }
}

// 更新标签
export async function updateTag(
  id: string,
  tagData: {
    displayName?: string;
    color?: string;
  }
) {
  try {
    const supabase = createClient();
    const { data: tag, error } = await supabase
      .from('tags')
      .update(tagData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return tag;
  } catch (error) {
    
    throw error;
  }
}

// 根据标签获取提示词数量
export async function getTagPromptsCount(id: string) {
  try {
    const supabase = createClient();
    const { data: promptTags, error } = await supabase
      .from('prompt_tags')
      .select('*')
      .eq('tagId', id);

    if (error) throw error;
    
    const promptIds = promptTags.map(pt => pt.promptId);
    
    if (promptIds.length === 0) {
      return 0;
    }
    
    // 统计已发布的提示词数量
    const { data: publishedPrompts, error: countError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptIds)
      .eq('status', 'published')
      .eq('is_public', true);

    if (countError) throw countError;
    
    return publishedPrompts.length;
  } catch (error) {
    
    throw error;
  }
}

// 搜索标签
export async function searchTags(query: string, limit = 10) {
  try {
    const supabase = createClient();
    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(limit);

    if (error) throw error;
    return tags;
  } catch (error) {
    
    throw error;
  }
}

// 根据ID列表获取标签
export async function getPromptTagsByIds(tagIds: string[]) {
  try {
    const supabase = createClient();
    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .in('id', tagIds);

    if (error) throw error;
    return tags;
  } catch (error) {
    
    throw error;
  }
} 