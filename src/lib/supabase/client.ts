// 从主 supabase 文件重新导出
import { createClient } from '../supabase';
import { createClient as createServerClient } from '../supabase-server';

export { createClient, createServerClient }; 