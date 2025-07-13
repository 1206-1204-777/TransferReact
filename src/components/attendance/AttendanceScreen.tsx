import { Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AttendanceRecord, ClockInRequestDto, Message, UserAttendanceUpdateRequestDto } from '../../types';
import { apiClient } from '../../utils/api';
import { CurrentTime } from '../common/CurrentTime';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { MessageDisplay } from '../common/MessageDisplay';
import { AttendanceStatus } from './AttendanceStatus';
import { AttendanceTable } from './AttendanceTable';
import { ClockButtons } from './ClockButtons';
import { ClockEditDialog } from './ClockEditDialog';
import { TodayAttendance } from './TodayAttendance';

export const AttendanceScreen: React.FC = () => {
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord>({
    date: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00 ～ 18:00 （実労働: 8時間）',
    clockIn: null,
    clockOut: null,
    workHours: '0時間0分',
    overtime: '0分',
    breakHours: '0時間（自動）',
    status: 'complete',
    isWithin30Minutes: false
  });
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());

  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // 勤怠履歴をAPIから取得
  const loadAttendanceHistory = async (month: string) => {
    try {
      const userId = Number(localStorage.getItem('userId'));
      if (!userId) {
        console.error('ユーザーIDが見つかりません');
        return;
      }

      console.log(`勤怠履歴取得: userId=${userId}, month=${month}`);
      
      const response = await apiClient.get(`/api/attendance/monthly/${userId}?month=${month}`);
      
      if (response.status === 200) {
        console.log('勤怠履歴データ:', response.data);
        if (response.data && response.data.length > 0) {
          setAttendanceHistory(response.data);
        } else {
          setAttendanceHistory([]);
        }
      } else {
        console.error('勤怠履歴取得エラー:', response.status);
        setAttendanceHistory([]);
      }
    } catch (error) {
      console.error('勤怠履歴取得エラー:', error);
      setAttendanceHistory([]);
    }
  };

  // 月変更ハンドラー
  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
    loadAttendanceHistory(newMonth);
  };

  // 初期化とデータ取得
  useEffect(() => {
    loadAttendanceHistory(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    loadAttendanceHistory(getCurrentMonth());
  }, []);

  const getCurrentFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateWorkHours = (clockIn: string, clockOut: string) => {
    const [inHour, inMinute] = clockIn.split(':').map(Number);
    const [outHour, outMinute] = clockOut.split(':').map(Number);

    const totalMinutesIn = inHour * 60 + inMinute;
    const totalMinutesOut = outHour * 60 + outMinute;

    let diffMinutes = totalMinutesOut - totalMinutesIn;
    
    let breakMinutes = 60; 
    if (diffMinutes > 360) {
      diffMinutes -= breakMinutes;
    } else {
      breakMinutes = 0;
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return {
      workHours: `${hours}時間${minutes}分`,
      breakHours: `${breakMinutes / 60}時間（自動）`,
      overtime: '0分'
    };
  };

  const handleClockIn = async () => {
    setLoading(true);
    const now = getCurrentFormattedTime();
    try {
      const userId = Number(localStorage.getItem('userId'));
      if (!userId) {
        setMessage({ type: 'error', text: 'ユーザーIDが見つかりません。再ログインしてください。' });
        setLoading(false);
        return;
      }

      const requestData: ClockInRequestDto = {
        userId: userId,
        type: "WORK"
      };
      const response = await apiClient.post('/api/attendance/clockin', requestData);

      if (response.status === 200) {
        setTodayAttendance(prev => ({
          ...prev,
          clockIn: now,
          status: 'working',
          isWithin30Minutes: true
        }));
        setMessage({ type: 'success', text: response.data.message || `出勤打刻が完了しました: ${now}` });
        
        // 勤怠履歴を更新
        await loadAttendanceHistory(selectedMonth);
      } else {
        setMessage({ type: 'error', text: response.data.message || '出勤打刻に失敗しました' });
      }
    } catch (error: any) {
      console.error('出勤打刻中にエラーが発生しました:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || '出勤打刻中にエラーが発生しました' });
    } finally {
      setLoading(false);
    }
  };

  const handleClockInRemote = async () => {
    setLoading(true);
    const now = getCurrentFormattedTime();
    try {
      const userId = Number(localStorage.getItem('userId'));
      if (!userId) {
        setMessage({ type: 'error', text: 'ユーザーIDが見つかりません。再ログインしてください。' });
        setLoading(false);
        return;
      }

      const requestData: ClockInRequestDto = {
        userId: userId,
        type: "REMOTE"
      };
      const response = await apiClient.post('/api/attendance/clockin', requestData);

      if (response.status === 200) {
        setTodayAttendance(prev => ({
          ...prev,
          clockIn: now,
          status: 'working',
          isWithin30Minutes: true
        }));
        setMessage({ type: 'success', text: response.data.message || `リモート出勤打刻が完了しました: ${now}` });
        
        // 勤怠履歴を更新
        await loadAttendanceHistory(selectedMonth);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'リモート出勤打刻に失敗しました' });
      }
    } catch (error: any) {
      console.error('リモート出勤打刻中にエラーが発生しました:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'リモート出勤打刻中にエラーが発生しました' });
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    const now = getCurrentFormattedTime();
    try {
      const userId = Number(localStorage.getItem('userId'));
      if (!userId) {
        setMessage({ type: 'error', text: 'ユーザーIDが見つかりません。再ログインしてください。' });
        setLoading(false);
        return;
      }

      const response = await apiClient.post(`/api/attendance/clock-out/${userId}`);

      if (response.status === 200) {
        if (todayAttendance.clockIn) {
          const { workHours, breakHours, overtime } = calculateWorkHours(todayAttendance.clockIn, now);
          setTodayAttendance(prev => ({
            ...prev,
            clockOut: now,
            workHours,
            breakHours,
            overtime,
            status: 'complete',
            isWithin30Minutes: false
          }));
          setMessage({ type: 'success', text: `退勤打刻が完了しました: ${now}` });
        } else {
          setMessage({ type: 'error', text: '出勤打刻がされていません。' });
        }
        
        // 勤怠履歴を更新
        await loadAttendanceHistory(selectedMonth);
      } else {
        setMessage({ type: 'error', text: response.data.message || '退勤打刻に失敗しました' });
      }
    } catch (error: any) {
      console.error('退勤打刻中にエラーが発生しました:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || '退勤打刻中にエラーが発生しました' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClock = () => {
    setShowEditDialog(true);
  };

  const handleSaveEditedTime = async (newTime: string) => {
    setLoading(true);
    try {
      const userId = Number(localStorage.getItem('userId'));
      if (!userId) {
        setMessage({ type: 'error', text: 'ユーザーIDが見つかりません。再ログインしてください。' });
        setLoading(false);
        return;
      }
      
      const requestData: UserAttendanceUpdateRequestDto = {
        userId: userId,
        date: new Date().toISOString().split('T')[0],
        clockIn: newTime
      };

      const response = await apiClient.post(`/api/attendance/update/${userId}`, requestData);

      if (response.status === 200) {
        setTodayAttendance(prev => ({
          ...prev,
          clockIn: newTime,
          isWithin30Minutes: false
        }));
        setMessage({ type: 'success', text: `打刻時刻を ${newTime} に修正しました` });
        
        // 勤怠履歴を更新
        await loadAttendanceHistory(selectedMonth);
      } else {
        setMessage({ type: 'error', text: response.data.message || '打刻時刻の修正に失敗しました' });
      }
    } catch (error: any) {
      console.error('打刻時刻修正中にエラーが発生しました:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || '打刻時刻修正中にエラーが発生しました' });
    } finally {
      setLoading(false);
      setShowEditDialog(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Clock className="w-6 h-6 mr-3" />
          打刻
        </h2>
        <MessageDisplay message={message} onClear={() => setMessage({ type: '', text: '' })} />
        <CurrentTime />
        <AttendanceStatus status={todayAttendance.status} />
        <ClockButtons
          status={todayAttendance.status}
          loading={loading}
          onClockIn={handleClockIn}
          onClockInRemote={handleClockInRemote}
          onClockOut={handleClockOut}
          isWithin30Minutes={todayAttendance.isWithin30Minutes || false}
          onEditClock={handleEditClock}
        />
        {loading && <LoadingSpinner />}
      </div>
      <TodayAttendance attendance={todayAttendance} />
      <AttendanceTable 
        history={attendanceHistory} 
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
      />
      
      <ClockEditDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleSaveEditedTime}
        currentTime={todayAttendance.clockIn || getCurrentFormattedTime()}
      />
    </div>
  );
};