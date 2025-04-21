import React from 'react';
import { FaFilter } from 'react-icons/fa';
import { Category } from '@/utils/adminUtils';

interface ReviewFilterProps {
  isOpen: boolean;
  onToggle: () => void;
  categories: Category[];
  selectedCategoryId?: string;
  timeFilter: string;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTimeFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onApplyFilter: () => void;
  getT: (key: string) => string;
}

const ReviewFilter: React.FC<ReviewFilterProps> = ({
  isOpen,
  onToggle,
  categories,
  selectedCategoryId,
  timeFilter,
  onCategoryChange,
  onTimeFilterChange,
  onApplyFilter,
  getT
}) => {
  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
      >
        {getT('admin.filter')}
        <FaFilter className="ml-2" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 py-2 border border-gray-100">
          <div className="px-4 py-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">{getT('admin.category')}</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              onChange={onCategoryChange}
              value={selectedCategoryId || ''}
            >
              <option>{getT('browse.allCategories')}</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.displayName || category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="px-4 py-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">{getT('admin.submissionTime')}</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              onChange={onTimeFilterChange}
              value={timeFilter}
            >
              <option value="all">{getT('admin.allTime')}</option>
              <option value="today">{getT('admin.today')}</option>
              <option value="week">{getT('admin.thisWeek')}</option>
              <option value="month">{getT('admin.thisMonth')}</option>
            </select>
          </div>
          
          <hr className="my-2" />
          
          <div className="px-4 py-2 flex justify-end">
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300"
              onClick={onApplyFilter}
            >
              {getT('admin.applyFilter')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewFilter; 