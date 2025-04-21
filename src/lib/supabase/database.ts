import { createClient } from './client'
import { Database } from '@/types/supabase'

type Tables = Database['public']['Tables']

// 数据库表名常量
export const TABLES = {
  PROMPTS: 'prompts',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  PROMPT_TAGS: 'prompt_tags',
  FAVORITES: 'favorites',
  REVIEWS: 'reviews'
}

// 数据库操作函数
export const database = {
  // Prompt 相关
  prompts: {
    async create(prompt: Tables['prompts']['Insert']) {
      const supabase = createClient()
      const { data, error } = await supabase
        .from(TABLES.PROMPTS)
        .insert(prompt)
        .select()
      return { data: data as Tables['prompts']['Row'][] | null, error }
    },
    async getById(id: string) {
      const supabase = createClient()
      const { data, error } = await supabase
        .from(TABLES.PROMPTS)
        .select(`
          *,
          category:categories(*),
          tags:prompt_tags!inner(tag:tags(*))
        `)
        .eq('id', id)
        .single()
      return { data, error }
    },
    async update(id: string, updates: Partial<Tables['prompts']['Update']>) {
      const supabase = createClient()
      const { data, error } = await supabase
        .from(TABLES.PROMPTS)
        .update(updates)
        .eq('id', id)
      return { data, error }
    },
    async delete(id: string) {
      const supabase = createClient()
      const { data, error } = await supabase
        .from(TABLES.PROMPTS)
        .delete()
        .eq('id', id)
      return { data, error }
    }
  },

  // 分类相关
  categories: {
    async getAll() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from(TABLES.CATEGORIES)
        .select('*')
        .order('name')
      return { data: data as Tables['categories']['Row'][] | null, error }
    }
  },

  // 标签相关
  tags: {
    async getAll() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from(TABLES.TAGS)
        .select('*')
        .order('name')
      return { data: data as Tables['tags']['Row'][] | null, error }
    }
  },

  // 收藏相关
  favorites: {
    async toggle(userId: string, promptId: string) {
      const supabase = createClient()
      // 检查是否已收藏
      const { data: existing } = await supabase
        .from(TABLES.FAVORITES)
        .select('id')
        .eq('user_id', userId)
        .eq('prompt_id', promptId)
        .single()

      if (existing) {
        // 取消收藏
        const { data, error } = await supabase
          .from(TABLES.FAVORITES)
          .delete()
          .eq('id', existing.id)
        return { data, error, action: 'unfavorite' }
      } else {
        // 添加收藏
        const { data, error } = await supabase
          .from(TABLES.FAVORITES)
          .insert({ user_id: userId, prompt_id: promptId })
        return { data, error, action: 'favorite' }
      }
    }
  }
} 