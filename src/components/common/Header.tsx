import { Bell, Clock, LogOut } from 'lucide-react';
import React from 'react';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => (
  <div className="relative backdrop-blur-sm bg-white/80 shadow-lg border-b border-white/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              勤怠管理システム
            </h1>
            <p className="text-sm text-gray-600">Attendance Management System</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.avatar}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <p className="text-xs text-gray-500">{user.department}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
            aria-label="ログアウト"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);