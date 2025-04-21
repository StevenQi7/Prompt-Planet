'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoMdClose } from 'react-icons/io';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface ImageModalProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ images, initialIndex, isOpen, onClose }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // 当初始索引变化时更新当前索引
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // 关闭模态框时的Escape键监听
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // 处理箭头键导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length]);

  // 前往下一张图片
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // 前往上一张图片
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // 点击背景关闭模态框
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      {/* 关闭按钮 */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all z-10"
        aria-label="关闭"
      >
        <IoMdClose size={24} />
      </button>

      {/* 导航按钮 - 只有当有多张图片时显示 */}
      {images.length > 1 && (
        <>
          <button 
            onClick={goToPrev}
            className="absolute left-4 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all z-10"
            aria-label="上一张"
          >
            <IoChevronBack size={24} />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-4 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all z-10"
            aria-label="下一张"
          >
            <IoChevronForward size={24} />
          </button>
        </>
      )}

      {/* 图片容器 */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center p-4">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={images[currentIndex]}
            alt={`预览图片 ${currentIndex + 1}`}
            className="object-contain max-h-full"
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
            unoptimized={true}
          />
        </div>
      </div>

      {/* 图片计数器 - 只有当有多张图片时显示 */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
} 