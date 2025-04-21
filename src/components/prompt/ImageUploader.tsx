import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/promptEditUtils';

interface ImageUploaderProps {
  previewImages: string[];
  setPreviewImages: React.Dispatch<React.SetStateAction<string[]>>;
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  previewImages,
  setPreviewImages,
  maxImages = 4
}) => {
  const { t } = useLanguage();

  // 处理文件上传
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (previewImages.length >= maxImages) {
      toast(t('editPromptPage.maxImagesReached').replace('{count}', maxImages.toString()), { icon: '⚠️' });
      return;
    }

    // 限制数量
    const filesToUpload = acceptedFiles.slice(0, maxImages - previewImages.length);
    
    // 上传每个文件
    for (const file of filesToUpload) {
      try {
        const imageUrl = await uploadImage(file, t);
        // 添加图片URL到预览
        setPreviewImages(prev => [...prev, imageUrl]);
      } catch (error: any) {
        toast(error.message || t('editPromptPage.uploadError'), { icon: '❌' });
      }
    }
  }, [previewImages.length, t, maxImages, setPreviewImages]);
  
  // 设置文件上传区域
  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 2097152, // 2MB
    multiple: true
  });
  
  // 删除预览图片
  const removeImage = (index: number) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('createPromptPage.uploadImages')}</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('createPromptPage.uploadImages')}
        </label>
        
        <div 
          {...getRootProps()} 
          className="mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors duration-300 cursor-pointer"
        >
          <input {...getInputProps()} />
          <div className="space-y-2 text-center">
            <i className="fas fa-cloud-upload-alt text-indigo-400 text-3xl mb-2 transition-all duration-300 transform hover:scale-110"></i>
            <div className="flex text-sm text-gray-600 justify-center">
              <p>{t('createPromptPage.uploadImagesPlaceholder')}</p>
            </div>
            <p className="text-xs text-gray-500">
              {t('createPromptPage.uploadImagesDesc')}
            </p>
          </div>
        </div>
        
        {previewImages.length > 0 && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            {previewImages.map((image, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden shadow-sm border border-gray-200 group">
                <img 
                  src={image} 
                  alt={`${t('createPromptPage.previewImage')} ${index + 1}`} 
                  className="w-full h-auto min-h-[160px] object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <button 
                    type="button" 
                    className="text-white bg-red-500 hover:bg-red-600 p-1 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader; 