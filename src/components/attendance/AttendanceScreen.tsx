import { Clock } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
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

// 時刻をHH:MM形式にフォーマットするヘルパー関数
const formatToHHMM = (timeString: string | null | undefined): string | null => {
  if (!timeString) return null;
  const isoMatch = timeString.match(/T(\d{2}:\d{2})/);
  if (isoMatch && isoMatch[1]) {
    return isoMatch[1];
  }
  const parts = timeString.split(':');
  if (parts.length >= 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return timeString;
};

export const AttendanceScreen: React.FC = () => {
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord>(() => {
    const savedClockIn = localStorage.getItem('currentClockIn');
    const savedClockOut = localStorage.getItem('currentClockOut');
    const savedStatus = localStorage.getItem('currentAttendanceStatus'); // 'working' or 'complete'

    const formattedSavedClockIn = formatToHHMM(savedClockIn);
    const formattedSavedClockOut = formatToHHMM(savedClockOut);

    if (formattedSavedClockIn && savedStatus === 'working') {
      return {
        date: new Date().toISOString().split('T')[0],
        scheduledTime: '09:00 ～ 18:00 （実労働: 8時間）',
        clockIn: formattedSavedClockIn,
        clockOut: formattedSavedClockOut || null, // 退勤はまだの場合もある
        workHours: '0時間0分', // 再計算が必要ならここで
        overtime: '0分',
        breakHours: '0時間（自動）',
        status: 'working',
      };
    }
    return {
      date: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00 ～ 18:00 （実労働: 8時間）',
      clockIn: null,
      clockOut: null,
      workHours: '0時間0分',
      overtime: '0分',
      breakHours: '0時間（自動）',
      status: 'complete',
    };
  });
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());

  const [userId, setUserId] = useState<string | null>(null);
  const [isEditAllowed, setIsEditAllowed] = useState(false);
  const [originalClockInTime, setOriginalClockInTime] = useState<string | null>(() => {
    return localStorage.getItem('originalClockInTime');
  });

  useEffect(() => {
    if (originalClockInTime) {
      localStorage.setItem('originalClockInTime', originalClockInTime);
    } else {
      localStorage.removeItem('originalClockInTime');
    }
  }, [originalClockInTime]);


  useEffect(() => {
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error('ユーザーIDがlocalStorageに見つかりません。');
      setMessage({ type: 'error', text: 'ユーザーIDが取得できません。再ログインしてください。' });
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    const updateEditAllowedStatus = () => {
      if (originalClockInTime) {
        const [hours, minutes] = originalClockInTime.split(':').map(Number);
        const clockInMoment = new Date();
        clockInMoment.setHours(hours, minutes, 0, 0);

        const thirtyMinutesLater = new Date(clockInMoment.getTime() + 30 * 60 * 1000);

        if (Date.now() < thirtyMinutesLater.getTime()) {
          setIsEditAllowed(true);
        } else {
          setIsEditAllowed(false);
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
          }
        }
      } else {
        setIsEditAllowed(false);
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = undefined;
        }
      }
    };

    updateEditAllowedStatus();
    intervalId = setInterval(updateEditAllowedStatus, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [originalClockInTime]);

  useEffect(() => {
    if (todayAttendance.clockIn) {
      localStorage.setItem('currentClockIn', todayAttendance.clockIn);
      localStorage.setItem('currentAttendanceStatus', todayAttendance.status);
    } else {
      localStorage.removeItem('currentClockIn');
      localStorage.removeItem('currentClockOut');
      localStorage.removeItem('currentAttendanceStatus');
    }
    if (todayAttendance.clockOut) {
      localStorage.setItem('currentClockOut', todayAttendance.clockOut);
      localStorage.setItem('currentAttendanceStatus', todayAttendance.status);
    }
  }, [todayAttendance.clockIn, todayAttendance.clockOut, todayAttendance.status]);


  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const revalidateTodayAttendance = useCallback(async () => {
    if (!userId) {
      console.warn('ユーザーIDが未設定のため、今日の勤怠情報の再検証をスキップします。');
      return;
    }
    try {
      setMessage({ type: '', text: '' }); // API呼び出しの前に既存のメッセージをクリア

      // 🚨 修正点: /api/attendance/{userId}/date/{today} の代わりに /api/attendance/{userId}/status を呼び出す
      console.log(`API呼び出し: /api/attendance/${userId}/status`);
      const response = await apiClient.get(`/api/attendance/${userId}/status`);

      if (response.status === 200 && response.data) {
        const apiResponse: { working: boolean; clockIn?: string; clockOut?: string; date?: string; } = response.data;
        
        // APIから返されたworkingステータスに基づいてtodayAttendanceを更新
        if (apiResponse.working) {
          // 勤務中であれば、clockInとstatusを更新
          const apiClockIn = formatToHHMM(apiResponse.clockIn);
          setTodayAttendance(prev => ({
            ...prev,
            date: apiResponse.date || prev.date, // APIから日付が返されれば更新、なければ現在のものを維持
            clockIn: apiClockIn,
            clockOut: null, // 勤務中なのでclockOutはnull
            status: 'working'
          }));
          setOriginalClockInTime(apiClockIn); // originalClockInTimeも更新
        } else {
          // 勤務中でなければ、全てリセット
          setTodayAttendance(prev => ({
            ...prev,
            date: new Date().toISOString().split('T')[0], // 今日の日付にリセット
            clockIn: null,
            clockOut: null,
            workHours: '0時間0分',
            overtime: '0分',
            breakHours: '0時間（自動）',
            status: 'complete',
          }));
          setOriginalClockInTime(null); // originalClockInTimeもリセット
        }
      } else {
        // APIが200 OKだがデータが空、またはAPIが200 OK以外の場合
        // UIを未打刻/退勤済みにリセットする
        setTodayAttendance(prev => ({
          ...prev,
          date: new Date().toISOString().split('T')[0],
          clockIn: null,
          clockOut: null,
          workHours: '0時間0分',
          overtime: '0分',
          breakHours: '0時間（自動）',
          status: 'complete',
        }));
        setOriginalClockInTime(null);
        console.warn('APIから勤務ステータスが取得できませんでした、または勤務中ではありません。UI状態をリセットします。');
      }
    } catch (error) {
      console.error('今日の勤怠情報の再検証エラー:', error);
      setMessage({ type: 'error', text: '今日の勤怠情報の取得中にネットワークエラーが発生しました。' });
      // エラー時もtodayAttendanceを初期状態にリセット
      setTodayAttendance(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0],
        clockIn: null,
        clockOut: null,
        workHours: '0時間0分',
        overtime: '0分',
        breakHours: '0時間（自動）',
        status: 'complete',
      }));
      setOriginalClockInTime(null);
    }
  }, [userId]);


  // 勤怠履歴をAPIから取得
  const loadAttendanceHistory = useCallback(async (month: string) => {
    if (!userId) {
      console.warn('ユーザーIDが未設定のため、勤怠履歴のロードをスキップします。');
      return;
    }
    setLoading(true);
    try {
      console.log(`勤怠履歴取得: userId=${userId}, month=${month}`);
      
      const response = await apiClient.get(`/api/attendance/monthly/${userId}?month=${month}`);
      
      if (response.status === 200) {
        console.log('勤怠履歴データ:', response.data);
        if (response.data && response.data.length > 0) {
          const formattedHistory = response.data.map((record: AttendanceRecord) => ({
            ...record,
            clockIn: formatToHHMM(record.clockIn),
            clockOut: formatToHHMM(record.clockOut),
          }));
          setAttendanceHistory(formattedHistory);
        } else {
          setAttendanceHistory([]);
        }
      } else {
        console.error('勤怠履歴取得エラー:', response.status);
        setMessage({ type: 'error', text: '勤怠履歴の読み込みに失敗しました。' });
        setAttendanceHistory([]);
      }
    } catch (error) {
      console.error('勤怠履歴取得エラー:', error);
      setMessage({ type: 'error', text: '勤怠履歴の読み込み中にエラーが発生しました。' });
      setAttendanceHistory([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 月変更ハンドラー
  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
  };

  // 初期化とデータ取得
  useEffect(() => {
    if (userId) {
      loadAttendanceHistory(selectedMonth);
      revalidateTodayAttendance();
    }
  }, [selectedMonth, userId, loadAttendanceHistory, revalidateTodayAttendance]);

  const getCurrentFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateWorkHours = (clockIn: string, clockOut: string) => {
    const [inHour, inMinute] = clockIn.split(':').map(Number);
    const [outHour, outMinute] = clockOut.split(':').map(Number);

    let totalMinutesIn = inHour * 60 + inMinute;
    let totalMinutesOut = outHour * 60 + outMinute;

    if (totalMinutesOut < totalMinutesIn) {
      totalMinutesOut += 24 * 60;
    }

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
      if (!userId) {
        setMessage({ type: 'error', text: 'ユーザーIDが見つかりません。再ログインしてください。' });
        return;
      }

      const requestData: ClockInRequestDto = {
        userId: Number(userId),
        type: "WORK"
      };
      const response = await apiClient.post('/api/attendance/clockin', requestData);

      if (response.status === 200) {
        setTodayAttendance(prev => ({
          ...prev,
          clockIn: now,
          status: 'working',
        }));
        setOriginalClockInTime(now);
        setMessage({ type: 'success', text: response.data.message || `出勤打刻が完了しました: ${now}` });
        setTimeout(async () => {
          await loadAttendanceHistory(selectedMonth);
          await revalidateTodayAttendance();
        }, 500);
      } else {
        setMessage({ type: 'error', text: response.data.message || '出勤打刻に失敗しました' });
        await revalidateTodayAttendance();
      }
    } catch (error: any) {
      console.error('出勤打刻中にエラーが発生しました:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || '出勤打刻中にエラーが発生しました' });
      await revalidateTodayAttendance();
    } finally {
      setLoading(false);
    }
  };

  const handleClockInRemote = async () => {
    setLoading(true);
    const now = getCurrentFormattedTime();
    try {
      if (!userId) {
        setMessage({ type: 'error', text: 'ユーザーIDが見つかりません。再ログインしてください。' });
        return;
      }

      const requestData: ClockInRequestDto = {
        userId: Number(userId),
        type: "REMOTE"
      };
      const response = await apiClient.post('/api/attendance/clockin', requestData);

      if (response.status === 200) {
        setTodayAttendance(prev => ({
          ...prev,
          clockIn: now,
          status: 'working',
        }));
        setOriginalClockInTime(now);
        setMessage({ type: 'success', text: response.data.message || `リモート出勤打刻が完了しました: ${now}` });
        setTimeout(async () => {
          await loadAttendanceHistory(selectedMonth);
          await revalidateTodayAttendance();
        }, 500);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'リモート出勤打刻に失敗しました' });
        await revalidateTodayAttendance();
      }
    } catch (error: any) {
      console.error('リモート出勤打刻中にエラーが発生しました:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'リモート出勤打刻中にエラーが発生しました' });
      await revalidateTodayAttendance();
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    const now = getCurrentFormattedTime();
    try {
      if (!userId) {
        setMessage({ type: 'error', text: 'ユーザーIDが見つかりません。再ログインしてください。' });
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
          }));
          setOriginalClockInTime(null);
        } else {
          setMessage({ type: 'error', text: '出勤打刻がされていません。' });
        }
        setMessage({ type: 'success', text: `退勤打刻が完了しました: ${now}` });
        setTimeout(async () => {
          await loadAttendanceHistory(selectedMonth);
          await revalidateTodayAttendance();
        }, 500);
      } else {
        setMessage({ type: 'error', text: response.data.message || '退勤打刻に失敗しました' });
        await revalidateTodayAttendance();
      }
    } catch (error: any) {
      console.error('退勤打刻中にエラーが発生しました:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || '退勤打刻中にエラーが発生しました' });
      await revalidateTodayAttendance();
    } finally {
      setLoading(false);
    }
  };

  const handleEditClock = () => {
    setShowEditDialog(true);
  };

  const handleSaveEditedTime = async (newTime: string) => {
    console.log('送信する時刻:', newTime);
    setLoading(true);
    try {
      if (!userId) {
        setMessage({ type: 'error', text: 'ユーザーIDが見つかりません。再ログインしてください。' });
        return;
      }
      
      const requestData: UserAttendanceUpdateRequestDto = {
        userId: Number(userId),
        date: new Date().toISOString().split('T')[0],
        startTime: newTime
      };

      const response = await apiClient.post(`/api/attendance/update/${userId}`, requestData);

      if (response.status === 200) {
        setTodayAttendance(prev => {
          const updatedClockIn = newTime;
          const updatedClockOut = prev.clockOut;
          let workHours = prev.workHours;
          let breakHours = prev.breakHours;
          let overtime = prev.overtime;

          if (updatedClockIn && updatedClockOut) {
            const calculated = calculateWorkHours(updatedClockIn, updatedClockOut);
            workHours = calculated.workHours;
            breakHours = calculated.breakHours;
            overtime = calculated.overtime;
          }

          return {
            ...prev,
            clockIn: updatedClockIn,
            workHours,
            breakHours,
            overtime,
          };
        });
        setMessage({ type: 'success', text: `打刻時刻を ${newTime} に修正しました` });
        setIsEditAllowed(false);
        setTimeout(async () => {
          await loadAttendanceHistory(selectedMonth);
          await revalidateTodayAttendance();
        }, 500);
      } else {
        setMessage({ type: 'error', text: response.data.message || '打刻時刻の修正に失敗しました' });
        await revalidateTodayAttendance();
      }
    } catch (error: any) {
      console.error('打刻時刻修正中にエラーが発生しました:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || '打刻時刻修正中にエラーが発生しました' });
      await revalidateTodayAttendance();
    } finally {
      setLoading(false);
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
          isWithin30Minutes={isEditAllowed}
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
