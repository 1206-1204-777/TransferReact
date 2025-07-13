import { Clock3, Coffee, Timer } from 'lucide-react';
import React from 'react';

interface AttendanceStatusProps {
  status: 'complete' | 'working' | 'breaking';
}

export const AttendanceStatus: React.FC<AttendanceStatusProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'working':
        return {
          text: '勤務中',
          color: 'bg-green-50 text-green-800 border-green-200',
          icon: Clock3,
          dotColor: 'bg-green-400'
        };
      case 'breaking':
        return {
          text: '休憩中',
          color: 'bg-orange-50 text-orange-800 border-orange-200',
          icon: Coffee,
          dotColor: 'bg-orange-400'
        };
      default: // 'complete'
        return {
          text: '退勤中',
          color: 'bg-gray-50 text-gray-800 border-gray-200',
          icon: Timer,
          dotColor: 'bg-gray-400'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl p-6 border ${config.color} mb-6`}>
      <div className="flex items-center justify-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${config.dotColor} animate-pulse`}></div>
        <Icon className="w-6 h-6" />
        <span className="text-xl font-semibold">{config.text}</span>
      </div>
    </div>
  );
};