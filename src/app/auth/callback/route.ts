import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/types/supabase'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            async get(name: string) {
              try {
                const cookie = (await cookieStore).get(name)
                return cookie?.value
              } catch (error) {
                console.error('Error getting cookie in auth callback:', error)
                return null
              }
            },
            async set(name: string, value: string, options: Omit<ResponseCookie, 'name' | 'value'>) {
              try {
                (await cookieStore).set({ name, value, ...options })
              } catch (error) {
                console.error('Error setting cookie in auth callback:', error)
                // 在服务器组件中调用 set 方法时会抛出错误
                // 如果有中间件刷新用户会话，这个错误可以忽略
              }
            },
            async remove(name: string, options: Omit<ResponseCookie, 'name' | 'value'>) {
              try {
                (await cookieStore).delete({ name, ...options })
              } catch (error) {
                console.error('Error removing cookie in auth callback:', error)
                // 在服务器组件中调用 remove 方法时会抛出错误
                // 如果有中间件刷新用户会话，这个错误可以忽略
              }
            }
          }
        }
      )
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error('Error exchanging code for session:', error)
      // 虽然出错，但我们仍然重定向到主页，让用户有机会重新登录
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
} 