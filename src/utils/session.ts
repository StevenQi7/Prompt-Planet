/**
 * 从Cookie中获取用户ID
 * @param cookieStore Cookie存储对象
 * @returns 用户ID或null
 */
export function getUserIdFromCookie(cookieStore: { get: (name: string) => { value?: string } | undefined }) {
  try {
    return cookieStore.get('userId')?.value || null;
  } catch (error) {
    
    return null;
  }
} 