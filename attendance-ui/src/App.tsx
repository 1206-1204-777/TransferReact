/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  Plus,
  Clock3,
  Timer,
  Coffee,
  Upload,
  Building,
  Monitor,
  CalendarDays,
  CheckSquare,
  X
} from 'lucide-react';

// モックデータ
const mockUser = {
  id: 1,
  name: '山田 太郎',
  department: '開発部',
  avatar: '🧑‍💻'
};

const mockTodayAttendance = {
  scheduledTime: '09:00 ～ 18:00 （実労働: 8時間）',
  clockIn: '09:15',
  clockOut: null,
  workHours: '6時間30分',
  breakHours: '1時間（自動）',
  status: 'working',
  clockInTime: new Date('2025-07-09T09:15:00'),
  canEdit: true
};

// カスタムフック
const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return currentTime;
};

// 共通コンポーネント
const MessageDisplay = ({ message, onClear }) => {
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(onClear, 5000);
type Message = { type: string; text: string };
type MessageDisplayProps = {
  message: Message;
  onClear: () => void;
};
const MessageDisplay = ({ message, onClear }: MessageDisplayProps) => {
    }
  }, [message.text, onClear]);

  if (!message.text) return null;

  return (
    <div className={`mb-4 p-4 rounded-2xl border ${
      message.type === 'success' 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      <div className="flex items-center space-x-2">
        {message.type === 'success' ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
        <span>{message.text}</span>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    <span className="ml-2 text-gray-600">処理中...</span>
  </div>
);

type User = {
  id: number;
  name: string;
  department: string;
  avatar: string;
};
type HeaderProps = {
  user: User;
  onLogout: () => void;
};
const Header = ({ user, onLogout }: HeaderProps) => (
const Header = ({ user, onLogout }) => (
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
type NavigationProps = {
  activeScreen: string;
  onScreenChange: (id: string) => void;
};
const Navigation = ({ activeScreen, onScreenChange }: NavigationProps) => {
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ナビゲーションコンポーネント
const Navigation = ({ activeScreen, onScreenChange }) => {
  const navItems = [
    { id: 'attendance', label: '勤怠登録', icon: Clock },
    { id: 'schedule', label: 'スケジュール提出', icon: CalendarDays },
    { id: 'holiday', label: '休日・残業申請', icon: Calendar },
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
              className={`flex items-center px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                activeScreen === item.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
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

// 現在時刻コンポーネント
const CurrentTime = () => {
  const currentTime = useCurrentTime();
  
  return (
    <div className="text-center mb-6">
      <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
type AttendanceStatusProps = {
  status: string;
};
const AttendanceStatus = ({ status }: AttendanceStatusProps) => {
      </div>
      <div className="text-lg text-gray-600">
        {currentTime.toLocaleDateString('ja-JP', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          weekday: 'long' 
        })}
      </div>
    </div>
  );
};

// 勤怠状態コンポーネント
const AttendanceStatus = ({ status }) => {
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
      default:
        return {
          text: '退勤中',
          color: 'bg-gray-50 text-gray-800 border-gray-200',
          icon: Timer,
          dotColor: 'bg-gray-400'
        };
type ClockButtonsProps = {
  status: string;
  loading: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
  onRemoteClockIn: () => void;
};
const ClockButtons = ({ status, loading, onClockIn, onClockOut, onRemoteClockIn }: ClockButtonsProps) => {
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

// 打刻ボタンコンポーネント
const ClockButtons = ({ status, loading, onClockIn, onClockOut, onRemoteClockIn }) => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4 justify-center">
        <button
          onClick={onClockIn}
          disabled={loading || status === 'working'}
          className="flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
type TodayAttendanceProps = {
  attendance: {
    scheduledTime: string;
    clockIn: string | null;
    clockOut: string | null;
    workHours: string;
    breakHours: string;
    status: string;
    clockInTime: Date;
    canEdit: boolean;
  };
};
const TodayAttendance = ({ attendance }: TodayAttendanceProps) => (
          出勤
        </button>
        <button
          onClick={onRemoteClockIn}
          disabled={loading || status === 'working'}
          className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Monitor className="w-5 h-5 mr-2" />
          出勤（リモート）
        </button>
        <button
          onClick={onClockOut}
          disabled={loading || status !== 'working'}
          className="flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Timer className="w-5 h-5 mr-2" />
          退勤
        </button>
  type ScheduleItem = {
    type: string;
    startTime?: string;
    endTime?: string;
  const [bulkSchedule, setBulkSchedule] = useState<{
    type: string;
    startTime: string;
    endTime: string;
    dayOfWeek: number[];
    startDate: string;
    endDate: string;
  }>({
    type: 'work',
    startTime: '09:00',
    endTime: '18:00',
    dayOfWeek: [],
    startDate: '',
    endDate: ''
  });
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
  const handleDateClick = (date: { date: Date; isCurrentMonth: boolean }) => {
  </div>
);

// スケジュール提出画面（改修版）
const ScheduleScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [schedule, setSchedule] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [bulkSchedule, setBulkSchedule] = useState({
    type: 'work',
    startTime: '09:00',
    endTime: '18:00',
    dayOfWeek: [],
    startDate: '',
    endDate: ''
  const getDateStyle = (date: { date: Date; isCurrentMonth: boolean }) => {

  // カレンダー生成
  const generateCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(selectedYear, selectedMonth, -i);
      days.push({ date: day, isCurrentMonth: false });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(selectedYear, selectedMonth + 1, day);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  const handleDateClick = (date) => {
    if (!date.isCurrentMonth) return;
    
    const dateKey = `${date.date.getFullYear()}-${String(date.date.getMonth() + 1).padStart(2, '0')}-${String(date.date.getDate()).padStart(2, '0')}`;
    const currentSchedule = schedule[dateKey] || { type: 'work', startTime: '09:00', endTime: '18:00' };
    
    let nextType;
    if (currentSchedule.type === 'work') nextType = 'holiday';
    else nextType = 'work';
    
    setSchedule(prev => ({
      ...prev,
      [dateKey]: {
        ...currentSchedule,
        type: nextType
      }
    }));
  };

  const getDateStyle = (date) => {
  const handleDayOfWeekChange = (dayIndex: number) => {
    
    const dateKey = `${date.date.getFullYear()}-${String(date.date.getMonth() + 1).padStart(2, '0')}-${String(date.date.getDate()).padStart(2, '0')}`;
    const scheduleItem = schedule[dateKey] || { type: 'work' };
    
    const baseStyle = 'w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 relative';
    
    switch (scheduleItem.type) {
      case 'holiday':
        return `${baseStyle} bg-red-100 text-red-800 border-2 border-red-300`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800 border-2 border-gray-300 hover:bg-gray-200`;
    }
  };

  const handleBulkApply = () => {
    if (!bulkSchedule.startDate || !bulkSchedule.endDate) {
      setMessage({ type: 'error', text: '開始日と終了日を選択してください' });
      return;
    }

    const startDate = new Date(bulkSchedule.startDate);
    const endDate = new Date(bulkSchedule.endDate);
    
    if (startDate > endDate) {
      setMessage({ type: 'error', text: '開始日は終了日より前に設定してください' });
      return;
    }

    const newSchedule = { ...schedule };
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      
      if (bulkSchedule.dayOfWeek.length === 0 || bulkSchedule.dayOfWeek.includes(dayOfWeek)) {
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        newSchedule[dateKey] = {
          type: bulkSchedule.type,
          startTime: bulkSchedule.startTime,
          endTime: bulkSchedule.endTime
        };
      }
    }
    
    setSchedule(newSchedule);
    setShowBulkInput(false);
    setMessage({ type: 'success', text: '一括設定が完了しました' });
  };

  const handleDayOfWeekChange = (dayIndex) => {
    setBulkSchedule(prev => ({
      ...prev,
      dayOfWeek: prev.dayOfWeek.includes(dayIndex)
        ? prev.dayOfWeek.filter(d => d !== dayIndex)
        : [...prev.dayOfWeek, dayIndex]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: 'スケジュールが提出されました' });
    }, 1000);
  };

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <CalendarDays className="w-6 h-6 mr-3" />
          スケジュール提出（公休登録）
        </h2>
        
        <MessageDisplay message={message} onClear={() => setMessage({ type: '', text: '' })} />
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedYear}年{selectedMonth + 1}月
            </h3>
            <div className="flex space-x-2">
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{i + 1}月</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 border-2 border-gray-300 rounded"></div>
                  <span>出勤</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-200 border-2 border-red-300 rounded"></div>
                  <span>公休</span>
                </div>
              </div>
              <button
                onClick={() => setShowBulkInput(!showBulkInput)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                一括設定
              </button>
            </div>
          </div>

          {/* 一括設定パネル */}
          {showBulkInput && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-4">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">一括設定</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">開始日</label>
                  <input
                    type="date"
                    value={bulkSchedule.startDate}
                    onChange={(e) => setBulkSchedule(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">終了日</label>
                  <input
                    type="date"
                    value={bulkSchedule.endDate}
                    onChange={(e) => setBulkSchedule(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">対象曜日（複数選択可）</label>
                <div className="flex flex-wrap gap-2">
                  {dayNames.map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDayOfWeekChange(index)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        bulkSchedule.dayOfWeek.includes(index)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">選択なしの場合は全ての日に適用されます</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">種別</label>
                  <select
                    value={bulkSchedule.type}
                    onChange={(e) => setBulkSchedule(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="work">出勤</option>
                    <option value="holiday">公休</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">開始時間</label>
                  <input
                    type="time"
                    value={bulkSchedule.startTime}
                    onChange={(e) => setBulkSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    disabled={bulkSchedule.type === 'holiday'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">終了時間</label>
                  <input
                    type="time"
                    value={bulkSchedule.endTime}
                    onChange={(e) => setBulkSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    disabled={bulkSchedule.type === 'holiday'}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleBulkApply}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  適用
                </button>
                <button
                  onClick={() => setShowBulkInput(false)}
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  キャンセル
                </button>
              </div>
            </div>
          )}
          
          <div className="border border-gray-200 rounded-2xl p-4">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {generateCalendar().map((day, index) => (
                <div
                  key={index}
                  className={getDateStyle(day)}
                  onClick={() => handleDateClick(day)}
                >
                  {day.date.getDate()}
                  {/* 時間表示（公休以外） */}
                  {day.isCurrentMonth && (() => {
                    const dateKey = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}-${String(day.date.getDate()).padStart(2, '0')}`;
                    const scheduleItem = schedule[dateKey];
                    return scheduleItem && scheduleItem.type === 'work' && scheduleItem.startTime !== '09:00' && scheduleItem.endTime !== '18:00' ? (
                      <div className="text-xs text-gray-600 absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                        {scheduleItem.startTime?.slice(0, 2)}
                      </div>
                    ) : null;
                  })()}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            <Upload className="w-5 h-5 mr-2" />
            スケジュール提出
          </button>
        </div>
        
        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
};

// 勤怠登録画面
const AttendanceScreen = () => {
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(mockTodayAttendance);

  const handleClockIn = async (workType = 'office') => {
    setLoading(true);
    setTimeout(() => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      setMessage({ type: 'success', text: `${workType === 'remote' ? 'リモート' : 'オフィス'}出勤打刻が完了しました` });
      setTodayAttendance(prev => ({ ...prev, status: 'working' }));
    }, 1000);
  };

  const handleClockOut = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: '退勤打刻が完了しました' });
      setTodayAttendance(prev => ({ ...prev, status: 'off' }));
    }, 1000);
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
          onClockIn={() => handleClockIn('office')}
          onClockOut={handleClockOut}
          onRemoteClockIn={() => handleClockIn('remote')}
        />
        {loading && <LoadingSpinner />}
      </div>
      <TodayAttendance attendance={todayAttendance} />
    </div>
  );
};

// 簡単な休日申請画面
const HolidayScreen = () => {
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    reason: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: '休日申請が送信されました' });
      setFormData({ date: '', type: '', reason: '' });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-3" />
          休日申請
        </h2>
        <MessageDisplay message={message} onClear={() => setMessage({ type: '', text: '' })} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                休日日付 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                休日種別 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              >
                <option value="">選択してください</option>
                <option value="paid">有給休暇</option>
                <option value="special">特別休暇</option>
                <option value="sick">病気休暇</option>
                <option value="other">その他</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">理由</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              申請
            </button>
            <button
              type="button"
              onClick={() => setFormData({ date: '', type: '', reason: '' })}
              className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300"
            >
              <XCircle className="w-5 h-5 mr-2" />
              クリア
            </button>
          </div>
        </form>
        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
};

// 勤務地登録画面
const LocationScreen = () => {
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '09:00',
    endTime: '18:00'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: '勤務地が登録されました' });
      setFormData({ name: '', startTime: '09:00', endTime: '18:00' });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <MapPin className="w-6 h-6 mr-3" />
          勤務地登録
        </h2>
        <MessageDisplay message={message} onClear={() => setMessage({ type: '', text: '' })} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              勤務地名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="例: 東京オフィス"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                標準出勤時間 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                標準退勤時間 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              登録
            </button>
            <button
              type="button"
              onClick={() => setFormData({ name: '', startTime: '09:00', endTime: '18:00' })}
              className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300"
            >
              <XCircle className="w-5 h-5 mr-2" />
              クリア
            </button>
          </div>
        </form>
        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
};

// メインアプリケーション
const AttendanceApp = () => {
  const [activeScreen, setActiveScreen] = useState('attendance');
  const [user] = useState(mockUser);

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      alert('ログアウトしました');
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'attendance':
        return <AttendanceScreen />;
      case 'schedule':
        return <ScheduleScreen />;
      case 'holiday':
        return <HolidayScreen />;
      case 'location':
        return <LocationScreen />;
      default:
        return <AttendanceScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <Header user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Navigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
        {renderScreen()}
      </div>
    </div>
  );
};

export default AttendanceApp; 