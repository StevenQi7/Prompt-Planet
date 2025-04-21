import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

// 创建服务器端 Supabase 客户端
export const createClient = () => {
  const cookieStore = cookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          try {
            const cookie = (await cookieStore).get(name)
            return cookie?.value
          } catch (error) {
            console.error('Error getting cookie in server client:', error)
            return null
          }
        },
        async set(name: string, value: string, options: Omit<ResponseCookie, 'name' | 'value'>) {
          try {
            (await cookieStore).set({ name, value, ...options })
          } catch (error) {
            console.error('Error setting cookie in server client:', error)
            // 在服务器组件中调用 set 方法时会抛出错误
            // 如果有中间件刷新用户会话，这个错误可以忽略
          }
        },
        async remove(name: string, options: Omit<ResponseCookie, 'name' | 'value'>) {
          try {
            (await cookieStore).delete({ name, ...options })
          } catch (error) {
            console.error('Error removing cookie in server client:', error)
            // 在服务器组件中调用 remove 方法时会抛出错误
            // 如果有中间件刷新用户会话，这个错误可以忽略
          }
        }
      }
    }
  )
}

// 获取当前用户 - 服务器端使用
export const getCurrentUser = async () => {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }
    return user
  } catch (error) {
    console.error('Exception when getting current user:', error)
    return null
  }
} 