import sharp from 'sharp';

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export async function compressImage(
  buffer: Buffer,
  options: CompressOptions = {}
): Promise<Buffer> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 80,
    format = 'webp'
  } = options;

  return sharp(buffer)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .toFormat(format, { quality })
    .toBuffer();
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || 'webp';
}

export function generateUniqueFilename(
  originalFilename: string,
  userId: string
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalFilename);
  return `prompt-images/${userId}/${timestamp}-${randomString}.${extension}`;
} 