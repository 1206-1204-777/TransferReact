import { Edit3, FileText } from 'lucide-react';
import React from 'react';
import { AttendanceRecord } from '../../types';

interface AttendanceTableProps {
  history: AttendanceRecord[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  history, 
  selectedMonth, 
  onMonthChange 
}) => {
  
  const formatMinutesToHoursAndMinutes = (totalMinutes: number | null | undefined) => {
    if (totalMinutes === undefined || totalMinutes === null || isNaN(totalMinutes)) return '-';
    if (totalMinutes < 0) totalMinutes = 0;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0 && minutes === 0) return '0分';
    if (hours === 0) return `${minutes}分`;
    if (minutes === 0) return `${hours}時間`;
    return `${hours}時間${minutes}分`;
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '-';
    
    try {
      // ISO形式対応：'2025-05-26T09:37:00' → 時刻抽出
      const isoMatch = timeStr.match(/T(\d{2}:\d{2})/);
      if (isoMatch && isoMatch[1]) {
        return isoMatch[1];
      }
      
      // 時刻のみ形式：'09:37'など
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      }
      
      return timeStr;
    } catch (e) {
      console.error('時刻フォーマットエラー:', e);
      return '-';
    }
  };

  // 安全なプロパティアクセスのヘルパー関数
  const getTotalWorkMin = (record: any) => {
    return record.totalWorkMin ?? record.totalWorkMinutes ?? null;
  };

  const getOvertimeMinutes = (record: any) => {
    return record.overtimeMinutes ?? record.overtime ?? null;
  };

  const getTotalBreakMin = (record: any) => {
    return record.totalBreakMin ?? record.totalBreakMinutes ?? 60;
  };

  const handleEditClick = (record: AttendanceRecord) => {
    // 編集機能の実装 - 現在は未実装
    console.log('編集対象の記録:', record);
    alert(`${record.date}の勤怠編集機能は現在開発中です。`);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FileText className="w-6 h-6 mr-3" />
          勤怠履歴
        </h2>
        
        {/* 月選択 */}
        <div className="mt-4">
          <label htmlFor="monthSelect" className="block text-sm font-medium text-gray-700 mb-2">
            月を選択:
          </label>
          <input
            id="monthSelect"
            type="month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            aria-label="勤怠履歴の月を選択"
            title="勤怠履歴の月を選択"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出勤時間</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">退勤時間</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">実労働時間</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">残業時間</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">休憩時間</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-gray-100">
            {history.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  記録がありません
                </td>
              </tr>
            ) : (
              history.map((record) => (
                <tr key={record.date} className="hover:bg-purple-50/50 transition-all duration-300">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString('ja-JP', { 
                        year: 'numeric',
                        month: '2-digit', 
                        day: '2-digit',
                        weekday: 'short'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(record.clockIn)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(record.clockOut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatMinutesToHoursAndMinutes(getTotalWorkMin(record))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      (getOvertimeMinutes(record) || 0) === 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {formatMinutesToHoursAndMinutes(getOvertimeMinutes(record) || 0)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatMinutesToHoursAndMinutes(getTotalBreakMin(record))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                      {record.clockIn && record.clockOut ? (
                        <span className="bg-green-100 text-green-800">完了</span>
                      ) : record.clockIn ? (
                        <span className="bg-yellow-100 text-yellow-800">勤務中</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-800">未打刻</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-purple-600 hover:text-purple-900 hover:bg-purple-50 p-2 rounded-xl transition-all duration-300" 
                      aria-label={`${new Date(record.date).toLocaleDateString('ja-JP')}の勤怠を編集`}
                      title="勤怠を編集"
                      onClick={() => handleEditClick(record)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};