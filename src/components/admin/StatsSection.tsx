import React from 'react';
import { FaClipboardCheck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import StatsCard from './StatsCard';
import { AdminStats } from '@/utils/adminUtils';

interface StatsSectionProps {
  stats: AdminStats;
  getT: (key: string) => string;
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats, getT }) => {
  const statsItems = [
    {
      icon: <FaClipboardCheck className="text-indigo-600 text-xl" />,
      count: stats.pending,
      label: getT('admin.pending'),
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600'
    },
    {
      icon: <FaCheckCircle className="text-green-600 text-xl" />,
      count: stats.approved,
      label: getT('admin.approved'),
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      icon: <FaTimesCircle className="text-red-600 text-xl" />,
      count: stats.rejected,
      label: getT('admin.rejected'),
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {statsItems.map((item, index) => (
        <StatsCard
          key={index}
          icon={item.icon}
          count={item.count}
          label={item.label}
          bgColor={item.bgColor}
          textColor={item.textColor}
        />
      ))}
    </div>
  );
};

export default StatsSection; 