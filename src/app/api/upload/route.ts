import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { uploadFile } from '@/services/storageService';
import { generateUniqueFilename } from '@/utils/imageUtils';
import sharp from 'sharp';

// 定义允许的文件类型
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DIMENSION = 1920;

// 处理图片上传
export async function POST(request: NextRequest) {
  try {
    // 获取当前用户
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const userId = user.id;
    
    // 解析表单数据
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '未上传文件' }, { status: 400 });
    }
    
    // 验证文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: '不支持的文件类型，仅支持 JPG、PNG、WebP 和 GIF 格式' 
      }, { status: 400 });
    }
    
    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: '文件大小不能超过2MB' 
      }, { status: 400 });
    }
    
    // 读取文件内容
    const buffer = Buffer.from(await file.arrayBuffer());
    
    try {
      // 使用 sharp 优化图片
      const metadata = await sharp(buffer).metadata();
      
      // 计算调整后的尺寸
      let width = metadata.width;
      let height = metadata.height;
      
      if (width && height) {
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
      }
      
      // 根据原始格式选择最佳的输出格式
      let optimizedBuffer;
      if (file.type === 'image/gif') {
        // GIF保持原格式
        optimizedBuffer = buffer;
      } else {
        // 其他格式转换为WebP以获得更好的压缩率
        optimizedBuffer = await sharp(buffer)
          .resize(width, height, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({
            quality: 80,
            effort: 6 // 压缩级别（0-6）
          })
          .toBuffer();
      }
      
      // 生成唯一文件名
      const filePath = generateUniqueFilename(file.name, userId);
      
      // 上传到存储
      const imageUrl = await uploadFile(
        filePath, 
        optimizedBuffer, 
        file.type === 'image/gif' ? 'image/gif' : 'image/webp'
      );
      
      return NextResponse.json({ 
        imageUrl,
        path: filePath
      });
    } catch (error) {
      console.error('图片处理失败:', error);
      return NextResponse.json({ 
        error: '图片处理失败，请重试' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json({ 
      error: '上传失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 });
  }
} 