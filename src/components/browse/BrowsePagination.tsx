'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface BrowsePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export default function BrowsePagination({
  currentPage,
  totalPages,
  totalItems,
  isLoading,
  onPageChange
}: BrowsePaginationProps) {
  const { t } = useLanguage();
  
  // 如果总页数为0或1，不显示分页组件
  if (totalPages <= 1) return null;
  
  return (
    <div className="mt-8 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      {/* 显示条目信息 */}
      <div className="text-sm text-gray-600 mb-4 md:mb-0">
        {t('browse.pagination.showing')
          .replace('{start}', String((currentPage - 1) * 18 + 1))
          .replace('{end}', String(Math.min(currentPage * 18, totalItems)))
          .replace('{total}', String(totalItems))}
      </div>
      
      {/* 分页按钮 */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isLoading}
          className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${
            currentPage === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
          } transition-colors duration-300`}
        >
          <i className="fas fa-chevron-left mr-1 text-xs"></i> {t('browse.pagination.prev')}
        </button>
        
        {/* 页码显示 */}
        <div className="flex items-center space-x-1">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            // 只显示当前页及其前后各一页（如果可能）
            if (
              pageNumber === 1 || 
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                    currentPage === pageNumber
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  } transition-colors duration-300`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              (pageNumber === 2 && currentPage > 3) ||
              (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
            ) {
              // 显示省略号
              return <span key={pageNumber} className="text-gray-400">...</span>;
            }
            return null;
          })}
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages || isLoading}
          className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${
            currentPage >= totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
          } transition-colors duration-300`}
        >
          {t('browse.pagination.next')} <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </button>
      </div>
    </div>
  );
} 