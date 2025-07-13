import { Edit3, FileText } from 'lucide-react';
import React from 'react';
import { AttendanceRecord } from '../../types';

interface AttendanceTableProps {
  history: AttendanceRecord[];
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ history }) => (
  <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
    <div className="px-8 py-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/20">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <FileText className="w-6 h-6 mr-3" />
        勤怠履歴
      </h2>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出勤時間</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">退勤時間</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">勤務時間</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">残業時間</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody className="bg-white/50 divide-y divide-gray-100">
          {history.map((record) => (
            <tr key={record.date} className="hover:bg-purple-50/50 transition-all duration-300">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">
                  {new Date(record.date).toLocaleDateString('ja-JP', { 
                    month: '2-digit', 
                    day: '2-digit',
                    weekday: 'short'
                  })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.clockIn}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.clockOut}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.workHours}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  record.overtime === '0分' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {record.overtime}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  完了
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-purple-600 hover:text-purple-900 hover:bg-purple-50 p-2 rounded-xl transition-all duration-300" aria-label="編集">
                  <Edit3 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);