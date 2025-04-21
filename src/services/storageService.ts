import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, getPublicUrl } from '@/lib/r2';
import { Readable } from 'stream';

export async function uploadFile(
  key: string,
  file: Buffer | Readable,
  contentType: string
): Promise<string> {
  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
      })
    );

    return getPublicUrl(key);
  } catch (error) {
    
    throw new Error('上传文件失败');
  }
}

export async function downloadFile(key: string): Promise<Buffer> {
  try {
    const response = await r2Client.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      })
    );

    if (!response.Body) {
      throw new Error('文件不存在');
    }

    // 将 Readable 流转换为 Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of response.Body as Readable) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  } catch (error) {
    
    throw new Error('下载文件失败');
  }
} 