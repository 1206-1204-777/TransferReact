import React from 'react';
import { Tab } from '../../types';

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex space-x-2 mb-6 overflow-x-auto">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
          activeTab === tab.id
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
            : 'bg-white/50 text-gray-600 hover:bg-purple-50'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);