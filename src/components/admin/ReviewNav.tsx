import React from 'react';
import { AdminStats } from '@/utils/adminUtils';

interface ReviewNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: AdminStats;
  getT: (key: string) => string;
}

const ReviewNav: React.FC<ReviewNavProps> = ({
  activeTab,
  setActiveTab,
  stats,
  getT
}) => {
  // 定义导航项
  const navItems = [
    { id: 'reviewing', label: getT('admin.pending'), count: stats.pending },
    { id: 'all', label: getT('admin.all'), count: stats.total },
    { id: 'published', label: getT('admin.approved'), count: stats.approved },
    { id: 'rejected', label: getT('admin.rejected'), count: stats.rejected }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`${
                activeTab === item.id 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              } px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300`}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ReviewNav; 