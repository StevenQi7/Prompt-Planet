import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number; 
  itemsPerPage: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = ''
}) => {
  const { t } = useLanguage();
  
  if (totalPages <= 1) return null;
  
  // 计算分页显示信息
  const getPaginationInfo = () => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    
    return { start, end, total: totalItems };
  };
  
  const paginationInfo = getPaginationInfo();
  
  // 渲染页码按钮
  const renderPageButtons = () => {
    const pageButtons = [];
    const maxButtonsToShow = 5; // 最多显示的页码按钮数
    
    // 添加第一页按钮
    pageButtons.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`w-9 h-9 flex items-center justify-center rounded-lg ${
          currentPage === 1 ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-indigo-50'
        }`}
      >
        1
      </button>
    );
    
    // 计算要显示的页码范围
    let startPage = Math.max(2, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxButtonsToShow - 3);
    
    // 调整开始页码，确保显示足够多的按钮
    startPage = Math.max(2, Math.min(startPage, totalPages - maxButtonsToShow + 2));
    
    // 如果需要，添加前省略号
    if (startPage > 2) {
      pageButtons.push(<span key="ellipsis-start" className="px-1">...</span>);
    }
    
    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg ${
            currentPage === i ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-indigo-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // 如果需要，添加后省略号
    if (endPage < totalPages - 1) {
      pageButtons.push(<span key="ellipsis-end" className="px-1">...</span>);
    }
    
    // 添加最后一页按钮（如果总页数大于1）
    if (totalPages > 1) {
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg ${
            currentPage === totalPages ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-indigo-50'
          }`}
        >
          {totalPages}
        </button>
      );
    }
    
    return pageButtons;
  };
  
  return (
    <div className={`flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm ${className}`}>
      <div className="text-sm text-gray-600 mb-4 md:mb-0">
        {t('pagination.showing', {
          start: paginationInfo.start,
          end: paginationInfo.end,
          total: paginationInfo.total
        })}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
        >
          <FaChevronLeft />
        </button>
        
        {/* 页码按钮 */}
        {renderPageButtons()}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-50'}`}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination; 