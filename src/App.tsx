import React, { useState } from 'react';
import { AttendanceScreen } from './components/attendance/AttendanceScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { CustomModal } from './components/common/CustomModal';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { EditScreen } from './components/edit/EditScreen';
import { HolidayScreen } from './components/holiday/HolidayScreen';
import { LocationScreen } from './components/location/LocationScreen';
import { ScheduleScreen } from './components/schedule/ScheduleScreen';
import { User } from './types';
import { initialMockUser } from './utils/constants';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState('attendance');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwtToken'));
  const [user, setUser] = useState<User>(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUsername && storedUserId) {
      return {
        id: Number(storedUserId),
        name: storedUsername,
        department: storedUserRole === 'ADMIN' ? '管理者' : '一般ユーザー',
        avatar: '👤'
      };
    }
    return initialMockUser;
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    setActiveScreen('attendance');
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    console.log('ログアウトしました');
  };

  // renderScreen関数は不要になるか、シンプルになります。
  // 各画面コンポーネントを直接レンダリングし、CSSで表示・非表示を制御します。

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-inter">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {!isLoggedIn ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <Header user={user} onLogout={handleLogout} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <Navigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
            
            {/* ここが変更点: 各画面コンポーネントを常にレンダリングし、CSSで表示を制御 */}
            <div style={{ display: activeScreen === 'attendance' ? 'block' : 'none' }}>
              <AttendanceScreen />
            </div>
            <div style={{ display: activeScreen === 'edit' ? 'block' : 'none' }}>
              <EditScreen />
            </div>
            <div style={{ display: activeScreen === 'holiday' ? 'block' : 'none' }}>
              <HolidayScreen />
            </div>
            <div style={{ display: activeScreen === 'schedule' ? 'block' : 'none' }}>
              <ScheduleScreen />
            </div>
            <div style={{ display: activeScreen === 'location' ? 'block' : 'none' }}>
              <LocationScreen />
            </div>
            {/* デフォルトの画面が必要な場合、ここに含めるか、上記いずれかをデフォルトとします */}
            {activeScreen !== 'attendance' && activeScreen !== 'edit' && activeScreen !== 'holiday' && activeScreen !== 'schedule' && activeScreen !== 'location' && (
              <div style={{ display: 'block' }}>
                <AttendanceScreen /> {/* 未知のactiveScreenの場合のデフォルト */}
              </div>
            )}
          </div>
        </>
      )}

      <CustomModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="ログアウト確認"
        confirmText="ログアウト"
        cancelText="キャンセル"
      >
        <p>本当にログアウトしますか？</p>
      </CustomModal>
    </div>
  );
};

export default App;
