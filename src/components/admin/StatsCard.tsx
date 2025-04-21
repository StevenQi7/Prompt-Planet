import React from 'react';
import { IconType } from 'react-icons';

interface StatsCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  bgColor: string;
  textColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  count,
  label,
  bgColor,
  textColor
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-800">{count}</p>
          <p className="text-sm font-medium text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 