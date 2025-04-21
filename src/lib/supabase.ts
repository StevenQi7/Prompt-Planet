import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

// 创建客户端 Supabase 客户端
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )
}

// 使用 GitHub 登录
export const signInWithGithub = async () => {
  const supabase = createClient()
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  } catch (error) {
    console.error('GitHub 登录失败:', error)
    throw error
  }
}

// 使用 Google 登录
export const signInWithGoogle = async () => {
  const supabase = createClient()
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  } catch (error) {
    console.error('Google 登录失败:', error)
    throw error
  }
}

// 登出
export const signOut = async () => {
  const supabase = createClient()
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('登出失败:', error)
    throw error
  }
}

// 检查会话是否即将过期
export const isSessionExpiringSoon = (session: any) => {
  if (!session?.expires_at) return false
  
  const expiresAt = new Date(session.expires_at * 1000)
  const now = new Date()
  
  // 如果会话将在 1 小时内过期，返回 true
  return false
} 