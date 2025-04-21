import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface PromptImageGalleryProps {
  images: string[];
  title: string;
  onImageClick: (index: number) => void;
}

export default function PromptImageGallery({ 
  images, 
  title,
  onImageClick 
}: PromptImageGalleryProps) {
  const { t } = useLanguage();

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('promptDetail.usageEffect')}</h2>
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="relative aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden cursor-pointer group"
              onClick={() => onImageClick(index)}
            >
              <Image
                src={image}
                alt={`${title} - ${t('promptDetail.example' as any)} ${index + 1}`}
                width={400}
                height={300}
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                  {t('promptDetail.clickToView')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 