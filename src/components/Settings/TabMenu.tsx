import React from 'react';

interface TabItem {
  id: string;
  label: string;
}

interface TabMenuProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

const TabMenu: React.FC<TabMenuProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-3 px-6 text-center font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-indigo-600 border-b-2 border-indigo-500'
              : 'text-gray-500 hover:text-indigo-500'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabMenu; 