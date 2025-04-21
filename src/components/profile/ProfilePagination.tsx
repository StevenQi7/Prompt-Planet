'use client';

import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfilePaginationProps {
  currentPage: number;
  totalPages: number;
  totalPrompts: number;
  promptsPerPage: number;
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

export default function ProfilePagination({
  currentPage,
  totalPages,
  totalPrompts,
  promptsPerPage,
  goToPage,
  goToPreviousPage,
  goToNextPage
}: ProfilePaginationProps) {
  const { t } = useLanguage();
  
  // 计算显示的起始和结束项
  const startItemIndex = totalPrompts === 0 ? 0 : ((currentPage - 1) * promptsPerPage) + 1;
  const endItemIndex = Math.min(currentPage * promptsPerPage, totalPrompts);

  return (
    <div className="border-t border-gray-200 px-5 py-4">
      <div className="flex flex-wrap justify-between items-center">
        <div className="text-sm text-gray-500 mb-4 md:mb-0">
          {`${t('profile.pagination.showing').replace('{start}', `${startItemIndex}`).replace('{end}', `${endItemIndex}`).replace('{total}', `${totalPrompts}`)}`}
        </div>
        
        <div className="flex space-x-1">
          {/* 上一页按钮 */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 border text-sm font-medium rounded-md flex items-center ${
              currentPage === 1
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FaChevronLeft className="mr-1 text-xs" /> {t('profile.pagination.prev')}
          </button>
          
          {/* 页码按钮 */}
          <div className="hidden md:flex">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              const isCurrentPage = pageNumber === currentPage;
              
              // 只显示当前页码附近的页码，加上第一页和最后一页
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-9 h-9 mx-0.5 text-sm font-medium rounded-md flex items-center justify-center ${
                      isCurrentPage
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              
              // 添加省略号
              if (
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return (
                  <span
                    key={pageNumber}
                    className="w-9 h-9 mx-0.5 text-sm text-gray-500 flex items-center justify-center"
                  >
                    ...
                  </span>
                );
              }
              
              return null;
            })}
          </div>
          
          {/* 下一页按钮 */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1.5 border text-sm font-medium rounded-md flex items-center ${
              currentPage === totalPages || totalPages === 0
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t('profile.pagination.next')} <FaChevronRight className="ml-1 text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
} 