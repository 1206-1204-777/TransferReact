#!/bin/bash
# 空のファイルに内容を追加するスクリプト

echo "🔧 空ファイルに内容を追加します..."

cd src

# =============================================================================
# 空のファイルに基本的なコンポーネントコードを追加
# =============================================================================

# components/holiday/HolidayScreen.tsx
echo "📝 HolidayScreen.tsx を修正中..."
cat > components/holiday/HolidayScreen.tsx << 'EOF'
import React from 'react';

export const HolidayScreen: React.FC = () => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">休日・残業申請</h2>
      <p>休日・残業申請画面（実装予定）</p>
    </div>
  );
};
EOF

# components/location/LocationScreen.tsx
echo "📝 LocationScreen.tsx を修正中..."
cat > components/location/LocationScreen.tsx << 'EOF'
import React from 'react';

export const LocationScreen: React.FC = () => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">勤務地登録</h2>
      <p>勤務地登録画面（実装予定）</p>
    </div>
  );
};
EOF

# components/schedule/ScheduleScreen.tsx
echo "📝 ScheduleScreen.tsx を修正中..."
cat > components/schedule/ScheduleScreen.tsx << 'EOF'
import React from 'react';

export const ScheduleScreen: React.FC = () => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">スケジュール提出</h2>
      <p>スケジュール提出画面（実装予定）</p>
    </div>
  );
};
EOF

# utils/api.ts (空の場合)
if [ ! -s "utils/api.ts" ]; then
echo "📝 api.ts を修正中..."
cat > utils/api.ts << 'EOF'
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
EOF
fi

# hooks/useCurrentTime.ts (空の場合)
if [ ! -s "hooks/useCurrentTime.ts" ]; then
echo "📝 useCurrentTime.ts を修正中..."
cat > hooks/useCurrentTime.ts << 'EOF'
import { useState, useEffect } from 'react';

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return currentTime;
};
EOF
fi

# components/attendance/AttendanceScreen.tsx (空の場合)
if [ ! -s "components/attendance/AttendanceScreen.tsx" ]; then
echo "📝 AttendanceScreen.tsx を修正中..."
cat > components/attendance/AttendanceScreen.tsx << 'EOF'
import React from 'react';

export const AttendanceScreen: React.FC = () => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">勤怠登録</h2>
      <p>勤怠登録画面（実装予定）</p>
    </div>
  );
};
EOF
fi

# components/attendance/AttendanceStatus.tsx (空の場合)
if [ ! -s "components/attendance/AttendanceStatus.tsx" ]; then
echo "📝 AttendanceStatus.tsx を修正中..."
cat > components/attendance/AttendanceStatus.tsx << 'EOF'
import React from 'react';

interface AttendanceStatusProps {
  status: 'complete' | 'working' | 'breaking';
}

export const AttendanceStatus: React.FC<AttendanceStatusProps> = ({ status }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p>勤務状態: {status}</p>
    </div>
  );
};
EOF
fi

# components/attendance/ClockButtons.tsx (空の場合)
if [ ! -s "components/attendance/ClockButtons.tsx" ]; then
echo "📝 ClockButtons.tsx を修正中..."
cat > components/attendance/ClockButtons.tsx << 'EOF'
import React from 'react';

interface ClockButtonsProps {
  onClockIn: () => void;
  onClockOut: () => void;
}

export const ClockButtons: React.FC<ClockButtonsProps> = ({ onClockIn, onClockOut }) => {
  return (
    <div className="flex space-x-4">
      <button onClick={onClockIn} className="px-4 py-2 bg-green-500 text-white rounded">
        出勤
      </button>
      <button onClick={onClockOut} className="px-4 py-2 bg-red-500 text-white rounded">
        退勤
      </button>
    </div>
  );
};
EOF
fi

# components/attendance/TodayAttendance.tsx (空の場合)
if [ ! -s "components/attendance/TodayAttendance.tsx" ]; then
echo "📝 TodayAttendance.tsx を修正中..."
cat > components/attendance/TodayAttendance.tsx << 'EOF'
import React from 'react';

export const TodayAttendance: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">今日の勤怠</h3>
      <p>勤怠情報を表示</p>
    </div>
  );
};
EOF
fi

# components/attendance/AttendanceTable.tsx (空の場合)
if [ ! -s "components/attendance/AttendanceTable.tsx" ]; then
echo "📝 AttendanceTable.tsx を修正中..."
cat > components/attendance/AttendanceTable.tsx << 'EOF'
import React from 'react';

export const AttendanceTable: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">勤怠履歴</h3>
      <p>勤怠履歴テーブルを表示</p>
    </div>
  );
};
EOF
fi

# components/attendance/ClockEditDialog.tsx (空の場合)
if [ ! -s "components/attendance/ClockEditDialog.tsx" ]; then
echo "📝 ClockEditDialog.tsx を修正中..."
cat > components/attendance/ClockEditDialog.tsx << 'EOF'
import React from 'react';

interface ClockEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClockEditDialog: React.FC<ClockEditDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">打刻修正</h3>
        <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
          閉じる
        </button>
      </div>
    </div>
  );
};
EOF
fi

# その他の空ファイルもチェック
empty_files=$(find components/ -name "*.tsx" -size 0 2>/dev/null)
if [ ! -z "$empty_files" ]; then
  echo "🚨 以下の空ファイルが見つかりました："
  echo "$empty_files"
fi

echo ""
echo "✅ 空ファイルの修正が完了しました！"
echo ""
echo "📋 修正されたファイル："
echo "- components/holiday/HolidayScreen.tsx"
echo "- components/location/LocationScreen.tsx" 
echo "- components/schedule/ScheduleScreen.tsx"
echo "- その他の空ファイル"
echo ""
echo "🚀 'npm start' で動作確認してください！"