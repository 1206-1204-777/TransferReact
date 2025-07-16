// ScheduleScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { ScheduleData, ScheduleItem, SubmittedSchedule } from '../../types';

interface BatchSetupData {
  type: 'work' | 'holiday';
  startTime: string;
  endTime: string;
  selectedDates: string[];
}

export const ScheduleScreen: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    return today.toISOString().slice(0, 7);
  });
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submittedSchedules, setSubmittedSchedules] = useState<SubmittedSchedule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBatchSetup, setShowBatchSetup] = useState(false);
  const [showIndividualEdit, setShowIndividualEdit] = useState(false);
  const [editingDate, setEditingDate] = useState<string>('');

  const [batchData, setBatchData] = useState<BatchSetupData>({
    type: 'work',
    startTime: '09:00',
    endTime: '18:00',
    selectedDates: []
  });

  const [individualData, setIndividualData] = useState({
    startTime: '09:00',
    endTime: '18:00'
  });

  const [userId, setUserId] = useState<string | null>('123'); // MOCK USER ID - Replace with actual user ID logic

  const loadSubmittedSchedules = useCallback(async () => {
    if (!userId) return;

    try {
      const { apiClient } = await import('../../utils/api');
      const response = await apiClient.get(`/api/schedule/submitted?userId=${userId}`);

      if (response.status === 200) {
        setSubmittedSchedules(response.data);
      }
    } catch (error: any) {
      console.error('提出履歴取得エラー:', error);
      setMessage({ type: 'error', text: '提出履歴の読み込みに失敗しました。' });
    }
  }, [userId]);

  const loadScheduleData = async () => {
    setLoading(true);
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { apiClient } = await import('../../utils/api');
      const [year, month] = selectedMonth.split('-').map(Number);
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;

      const response = await apiClient.get(`/api/schedule/week?userId=${userId}&start=${startDate}`);
      const convertedScheduleData = (schedules: any[]): ScheduleData => {
        const converted: ScheduleData = {};
        schedules.forEach(schedule => {
          const dateKey = schedule.date;
          converted[dateKey] = {
            type: schedule.isWorkDay ? 'work' : 'holiday',
            ...(schedule.isWorkDay && {
              startTime: schedule.startTime,
              endTime: schedule.endTime
            })
          };
        });
        return converted;
      };
      setScheduleData(convertedScheduleData(response.data));
    } catch (error: any) {
      console.error('スケジュールデータ取得エラー:', error);
      setMessage({ type: 'error', text: 'スケジュールデータの読み込みに失敗しました。' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadScheduleData();
      loadSubmittedSchedules();
    } else {
      setLoading(false);
    }
  }, [selectedMonth, userId, loadSubmittedSchedules]);

  const generateCalendarDays = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startWeekday; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return { days, year, month };
  };

  const updateDaySchedule = (day: number, type: 'work' | 'holiday') => {
    const { year, month } = generateCalendarDays(selectedMonth);
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    setScheduleData((prev: ScheduleData) => {
      const newData = { ...prev };
      if (newData[dateKey]?.type === type) {
        delete newData[dateKey];
      } else {
        newData[dateKey] = {
          type,
          ...(type === 'work' ? { startTime: '09:00', endTime: '18:00' } : {})
        };
      }
      saveScheduleData(newData);
      return newData;
    });
  };

  const openIndividualEdit = (day: number) => {
    const { year, month } = generateCalendarDays(selectedMonth);
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const existingData = scheduleData[dateKey];
    if (existingData && existingData.type === 'work') {
      setIndividualData({
        startTime: existingData.startTime || '09:00',
        endTime: existingData.endTime || '18:00'
      });
    } else {
      setIndividualData({
        startTime: '09:00',
        endTime: '18:00'
      });
    }

    setEditingDate(dateKey);
    setShowIndividualEdit(true);
  };

  const saveIndividualTime = () => {
    if (individualData.startTime >= individualData.endTime) {
      setMessage({ type: 'error', text: '終了時間は開始時間より後に設定してください' });
      return;
    }

    setScheduleData((prev: ScheduleData) => {
      const updatedItem: ScheduleItem = {
        type: 'work',
        startTime: individualData.startTime,
        endTime: individualData.endTime
      };
      const newData = {
        ...prev,
        [editingDate]: updatedItem
      };
      saveScheduleData(newData);
      return newData;
    });

    setShowIndividualEdit(false);
    setMessage({ type: 'success', text: '勤務時間を設定しました' });
  };

  const toggleBatchDate = (day: number) => {
    const { year, month } = generateCalendarDays(selectedMonth);
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    setBatchData((prev: BatchSetupData) => ({
      ...prev,
      selectedDates: prev.selectedDates.includes(dateKey)
        ? prev.selectedDates.filter((date: string) => date !== dateKey)
        : [...prev.selectedDates, dateKey]
    }));
  };

  const applyBatchSettings = () => {
    if (batchData.selectedDates.length === 0) {
      setMessage({ type: 'error', text: '設定する日付を選択してください' });
      return;
    }

    if (batchData.type === 'work' && batchData.startTime >= batchData.endTime) {
      setMessage({ type: 'error', text: '終了時間は開始時間より後に設定してください' });
      return;
    }

    setScheduleData((prev: ScheduleData) => {
      const newData = { ...prev };
      batchData.selectedDates.forEach((dateKey: string) => {
        if (batchData.type === 'work') {
          newData[dateKey] = {
            type: 'work',
            startTime: batchData.startTime,
            endTime: batchData.endTime
          } as ScheduleItem;
        } else {
          newData[dateKey] = { type: 'holiday' } as ScheduleItem;
        }
      });
      saveScheduleData(newData);
      return newData;
    });

    setBatchData((prev: BatchSetupData) => ({
      ...prev,
      type: 'work',
      startTime: '09:00',
      endTime: '18:00',
      selectedDates: []
    }));
    setShowBatchSetup(false);
    setMessage({ type: 'success', text: `${batchData.selectedDates.length}日のスケジュールを一括設定しました` });
  };

  const setAllWorkDays = () => {
    const { days, year, month } = generateCalendarDays(selectedMonth);
    const newSchedule: ScheduleData = { ...scheduleData };

    days.forEach(day => {
      if (day) {
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayOfWeek = new Date(year, month - 1, day).getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          newSchedule[dateKey] = {
            type: 'work',
            startTime: '09:00',
            endTime: '18:00'
          };
        }
      }
    });

    setScheduleData(newSchedule);
    saveScheduleData(newSchedule);
    setMessage({ type: 'success', text: '平日を出勤日に設定しました' });
  };

  const clearSchedule = () => {
    setScheduleData({});
    saveScheduleData({});
    setMessage({ type: 'success', text: 'スケジュールをクリアしました' });
  };

  const saveScheduleData = async (data: ScheduleData) => {
    if (!userId) {
      setMessage({ type: 'error', text: 'データの保存に失敗しました: 認証されていません。' });
      return;
    }
    try {
      const { apiClient } = await import('../../utils/api');

      // Convert scheduleData to a list of ScheduleDayDto compatible objects
      const daysToSend = Object.keys(data).map(dateKey => {
        const item = data[dateKey];
        // Ensure the type sent matches backend's WorkType enum (e.g., "WORK", "HOLIDAY")
        return {
          date: dateKey,
          type: item.type.toUpperCase(), // Convert 'work' to 'WORK', 'holiday' to 'HOLIDAY'
          // If your backend needs startTime/endTime for WORK type, include them here.
          // For now, based on ScheduleDayDto.java, only date and type are mandatory.
        };
      });

      const requestBody = {
        userId: Number(userId),
        days: daysToSend,
      };

      const response = await apiClient.post('/api/schedule/save', requestBody); // Assuming a save endpoint exists

      if (response.status === 200) {
        // setMessage({ type: 'success', text: 'スケジュールを自動保存しました' });
      } else {
        setMessage({ type: 'error', text: 'スケジュールデータの保存に失敗しました' });
      }
    } catch (error: any) {
      console.error('スケジュール保存エラー:', error);
      setMessage({ type: 'error', text: 'スケジュールデータの保存に失敗しました' });
    }
  };


  const submitSchedule = async () => {
    if (!userId) {
      setMessage({ type: 'error', text: '提出に失敗しました: 認証されていません。' });
      return;
    }

    const stats = getScheduleStats();
    if (stats.unsetDays > 0) {
      setMessage({ type: 'error', text: '全ての日付にスケジュールを設定してから提出してください' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { apiClient } = await import('../../utils/api');

      // 🚨 ここを修正: バックエンドのScheduleRequestDtoに合わせる
      // scheduleData を List<ScheduleDayDto> の形に変換
      const daysToSubmit = Object.keys(scheduleData).map(dateKey => {
        const item = scheduleData[dateKey];
        // バックエンドのWorkType (WORK, REMOTE, HOLIDAY) に合わせる
        let typeString = item.type.toUpperCase();
        // 必要に応じてREMOTEなどを追加
        // if (item.type === 'remote') { typeString = 'REMOTE'; }

        return {
          date: dateKey, // "YYYY-MM-DD" 形式
          type: typeString,
          // startTime, endTime は ScheduleDayDto にないので送信しない
          // もしバックエンドで必要なら ScheduleDayDto に追加し、ここで含める
        };
      });

      const requestData = {
        userId: Number(userId),
        days: daysToSubmit, // ここを修正
        // workDays, holidayDays はバックエンドのScheduleRequestDtoにないので削除
      };

      const response = await apiClient.post('/api/schedule/submit', requestData);

      if (response.status === 200) {
        setMessage({ type: 'success', text: 'スケジュールを提出しました' });
        await loadSubmittedSchedules();
      }
    } catch (error: any) {
      console.error('スケジュール提出エラー:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || '提出に失敗しました' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScheduleStats = () => {
    const workDays = Object.values(scheduleData).filter((item: ScheduleItem) => item.type === 'work').length;
    const holidayDays = Object.values(scheduleData).filter((item: ScheduleItem) => item.type === 'holiday').length;
    const { days } = generateCalendarDays(selectedMonth);
    const totalDays = days.filter(day => day !== null).length;
    const unsetDays = totalDays - workDays - holidayDays;
    return { workDays, holidayDays, unsetDays, totalDays };
  };

  const stats = getScheduleStats();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const { days, year, month } = generateCalendarDays(selectedMonth);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 font-inter">
      <div className="flex items-center gap-3 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-600">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <h2 className="text-2xl font-bold text-gray-800">スケジュール提出</h2>
      </div>

      {userId && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2 text-blue-700 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>現在のユーザーID: {userId}</span>
        </div>
      )}

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-green-100 border border-green-300 text-green-700'
            : 'bg-red-100 border border-red-300 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-8.84"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          )}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <div>
            <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-2">
              対象月
            </label>
            <input
              id="month-select"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={setAllWorkDays}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              平日を出勤日に
            </button>
            <button
              onClick={() => setShowBatchSetup(true)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              一括設定
            </button>
            <button
              onClick={clearSchedule}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              クリア
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.workDays}</div>
            <div className="text-sm text-gray-600">出勤日</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.holidayDays}</div>
            <div className="text-sm text-gray-600">休日</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.unsetDays}</div>
            <div className="text-sm text-gray-600">未設定</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.totalDays}</div>
            <div className="text-sm text-gray-600">総日数</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {year}年{month}月のスケジュール
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                <div key={day} className={`p-3 text-center font-medium ${
                  index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="p-3" />;
                }

                const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const scheduleItem = scheduleData[dateKey];
                const isWeekend = index % 7 === 0 || index % 7 === 6;
                const isBatchSelected = showBatchSetup && batchData.selectedDates.includes(dateKey);

                return (
                  <div key={`day-${day}`} className="relative">
                    <div
                      className={`p-2 text-center border rounded-lg transition-all hover:shadow-md min-h-[80px] flex flex-col justify-between ${
                        scheduleItem?.type === 'work'
                          ? 'bg-blue-100 border-blue-300 text-blue-800'
                          : scheduleItem?.type === 'holiday'
                          ? 'bg-red-100 border-red-300 text-red-800'
                          : isBatchSelected
                          ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                          : isWeekend
                          ? 'bg-gray-50 border-gray-200 text-gray-500'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      } ${showBatchSetup ? 'cursor-pointer' : ''}`}
                      onClick={() => showBatchSetup ? toggleBatchDate(day) : undefined}
                    >
                      <div className="text-sm font-medium mb-1">{day}</div>

                      {scheduleItem?.type === 'work' && scheduleItem.startTime && scheduleItem.endTime && (
                        <div className="text-xs text-blue-700 mb-1">
                          {scheduleItem.startTime}-{scheduleItem.endTime}
                        </div>
                      )}

                      {!showBatchSetup && (
                        <div className="flex gap-1 justify-center flex-wrap mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateDaySchedule(day, 'work');
                            }}
                            className={`w-6 h-6 rounded text-xs font-bold transition-colors flex items-center justify-center ${
                              scheduleItem?.type === 'work'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-blue-200'
                            }`}
                            title="出勤日に設定"
                          >
                            出
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateDaySchedule(day, 'holiday');
                            }}
                            className={`w-6 h-6 rounded text-xs font-bold transition-colors flex items-center justify-center ${
                              scheduleItem?.type === 'holiday'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-red-200'
                            }`}
                            title="休日に設定"
                          >
                            休
                          </button>
                          {scheduleItem?.type === 'work' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openIndividualEdit(day);
                              }}
                              className="w-6 h-6 rounded text-xs font-bold bg-green-200 text-green-600 hover:bg-green-300 transition-colors flex items-center justify-center"
                              title="時間設定"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      )}

                      {showBatchSetup && isBatchSelected && (
                        <div className="absolute top-1 right-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-yellow-600">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-8.84"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">操作方法</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 「出」ボタンで出勤日設定、「休」ボタンで休日設定</li>
            <li>• 出勤日の「編集」ボタンで個別の勤務時間を設定</li>
            <li>• 「一括設定」で複数日の勤務時間をまとめて設定</li>
            <li>• 再度クリックすると設定を解除できます</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-gray-600">
            出勤日: {stats.workDays}日 / 休日: {stats.holidayDays}日 / 未設定: {stats.unsetDays}日
          </div>
          <button
            onClick={submitSchedule}
            disabled={isSubmitting || stats.unsetDays > 0 || !userId}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
            スケジュール提出
          </button>
        </div>
        {stats.unsetDays > 0 && (
          <p className="text-sm text-red-600 mt-2">
            ※ 全ての日付にスケジュールを設定してから提出してください
          </p>
        )}
        {!userId && (
          <p className="text-sm text-red-600 mt-2">
            ※ ユーザー認証が完了していません。
          </p>
        )}
      </div>

      {showBatchSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">一括スケジュール設定</h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="batch-type"
                    value="work"
                    checked={batchData.type === 'work'}
                    onChange={(e) => setBatchData((prev: BatchSetupData) => ({ ...prev, type: e.target.value as 'work' | 'holiday' }))}
                    className="form-radio h-4 w-4 text-blue-600 transition-colors duration-150 ease-in-out"
                    title="勤務日として設定"
                  />
                  <span className="ml-2 text-gray-700">勤務日</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="batch-type"
                    value="holiday"
                    checked={batchData.type === 'holiday'}
                    onChange={(e) => setBatchData((prev: BatchSetupData) => ({ ...prev, type: e.target.value as 'work' | 'holiday' }))}
                    className="form-radio h-4 w-4 text-red-600 transition-colors duration-150 ease-in-out"
                    title="休日として設定"
                  />
                  <span className="ml-2 text-gray-700">休日</span>
                </label>
              </div>

              {batchData.type === 'work' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      開始時間
                    </label>
                    <input
                      type="time"
                      value={batchData.startTime}
                      onChange={(e) => setBatchData((prev: BatchSetupData) => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="09:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      終了時間
                    </label>
                    <input
                      type="time"
                      value={batchData.endTime}
                      onChange={(e) => setBatchData((prev: BatchSetupData) => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="18:00"
                    />
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                選択した日付: {batchData.selectedDates.length}日
                {batchData.selectedDates.length > 0 && (
                  <div className="mt-2 text-xs max-h-24 overflow-y-auto">
                    {batchData.selectedDates.sort().map((date: string) =>
                      new Date(date).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })
                    ).join(', ')}
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-800 mb-3">
                  {year}年{month}月 - 適用する日付を選択してください
                </h4>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                    <div key={day} className={`p-2 text-center font-medium text-xs ${
                      index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    if (!day) {
                      return <div key={`modal-empty-${index}`} className="p-2" />;
                    }

                    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isSelected = batchData.selectedDates.includes(dateKey);
                    const isWeekend = index % 7 === 0 || index % 7 === 6;
                    const existingSchedule = scheduleData[dateKey];

                    return (
                      <div key={`modal-day-${day}`} className="relative">
                        <button
                          onClick={() => toggleBatchDate(day)}
                          className={`w-full p-2 text-center border rounded transition-all hover:shadow-sm min-h-[70px] flex flex-col justify-between items-center ${
                            isSelected
                              ? 'bg-blue-500 border-blue-600 text-white'
                              : existingSchedule?.type === 'work'
                              ? 'bg-blue-100 border-blue-200 text-blue-800'
                              : existingSchedule?.type === 'holiday'
                              ? 'bg-red-100 border-red-200 text-red-800'
                              : isWeekend
                              ? 'bg-gray-100 border-gray-200 text-gray-500'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-sm font-medium">{day}</div>
                          {existingSchedule?.type === 'work' && existingSchedule.startTime && existingSchedule.endTime && (
                            <div className="text-xs mt-1">
                              {existingSchedule.startTime}-{existingSchedule.endTime}
                            </div>
                          )}
                           {isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-1">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-8.84"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => {
                      const workdays: string[] = [];
                      days.forEach((day, index) => {
                        if (day) {
                          const dateObj = new Date(year, month - 1, day);
                          const dayOfWeek = dateObj.getDay();
                          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                            const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            workdays.push(dateKey);
                          }
                        }
                      });
                      setBatchData((prev: BatchSetupData) => ({ ...prev, selectedDates: workdays }));
                    }}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    平日選択
                  </button>
                  <button
                    onClick={() => setBatchData((prev: BatchSetupData) => ({ ...prev, selectedDates: [] }))}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    選択解除
                  </button>
                </div>
              </div>

              <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                💡 ヒント: 日付をクリックして選択/解除できます。選択した日付に同じスケジュールが設定されます。
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={applyBatchSettings}
                disabled={batchData.selectedDates.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                適用 ({batchData.selectedDates.length}日)
              </button>
              <button
                onClick={() => {
                  setShowBatchSetup(false);
                  setBatchData((prev: BatchSetupData) => ({ ...prev, type: 'work', startTime: '09:00', endTime: '18:00', selectedDates: [] }));
                }}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {showIndividualEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-auto shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">個別勤務時間設定</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    開始時間
                  </label>
                  <input
                    type="time"
                    value={individualData.startTime}
                    onChange={(e) => setIndividualData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="09:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    終了時間
                  </label>
                  <input
                    type="time"
                    value={individualData.endTime}
                    onChange={(e) => setIndividualData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="18:00"
                  />
                </div>
              </div>

              <div className="text-sm text-gray-600">
                設定日: {new Date(editingDate).toLocaleDateString('ja-JP')}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={saveIndividualTime}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                保存
              </button>
              <button
                onClick={() => setShowIndividualEdit(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">提出履歴</h3>
        </div>

        <div className="overflow-x-auto">
          {submittedSchedules.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              提出履歴がありません
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    対象月
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    提出日時
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    出勤日数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    休日数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    承認者
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submittedSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-500">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(schedule.month + '-01').toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(schedule.submittedAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {schedule.workDays}日
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {schedule.holidayDays}日
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        schedule.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : schedule.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {schedule.status === 'approved' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-8.84"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        )}
                        {schedule.status === 'rejected' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        )}
                        {schedule.status === 'submitted' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        )}
                        {schedule.status === 'approved' ? '承認済' :
                         schedule.status === 'rejected' ? '却下' : '提出済'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {schedule.approverName || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};