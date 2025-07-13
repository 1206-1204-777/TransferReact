import { Calendar } from 'lucide-react';
import React from 'react';
import { AttendanceRecord } from '../../types';

interface TodayAttendanceProps {
  attendance: AttendanceRecord;
}

export const TodayAttendance: React.FC<TodayAttendanceProps> = ({ attendance }) => (
  <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <Calendar className="w-6 h-6 mr-3" />
      今日の勤怠
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
        <h3 className="text-sm font-medium text-blue-600 mb-2">定時時刻</h3>
        <p className="text-lg font-semibold text-blue-800">{attendance.scheduledTime}</p>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
        <h3 className="text-sm font-medium text-green-600 mb-2">出勤時刻</h3>
        <p className="text-lg font-semibold text-green-800">{attendance.clockIn || '-'}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
        <h3 className="text-sm font-medium text-purple-600 mb-2">退勤時刻</h3>
        <p className="text-lg font-semibold text-purple-800">{attendance.clockOut || '勤務中'}</p>
      </div>
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
        <h3 className="text-sm font-medium text-orange-600 mb-2">勤務時間</h3>
        <p className="text-lg font-semibold text-orange-800">{attendance.workHours}</p>
      </div>
    </div>
  </div>
);