import { Calendar, Clock, Edit3, MapPin } from 'lucide-react';
import React from 'react';

interface NavigationProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeScreen, onScreenChange }) => {
  const navItems = [
    { id: 'attendance', label: '勤怠登録', icon: Clock },
    { id: 'edit', label: '勤怠修正', icon: Edit3 },
    { id: 'holiday', label: '休日・残業申請', icon: Calendar },
    { id: 'schedule', label: 'スケジュール提出', icon: Calendar },
    { id: 'location', label: '勤務地登録', icon: MapPin }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-2 shadow-xl border border-white/20 mb-8">
      <nav className="flex space-x-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={`px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                activeScreen === item.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
              aria-current={activeScreen === item.id ? 'page' : undefined}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};