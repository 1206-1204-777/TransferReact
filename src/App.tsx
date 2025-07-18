import React, { useEffect, useState } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(initialMockUser);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const jwtToken = localStorage.getItem('jwtToken');
      const storedUserId = localStorage.getItem('currentUserId');
      const storedUsername = localStorage.getItem('username');
      const storedUserRole = localStorage.getItem('userRole');

      if (jwtToken && storedUserId && storedUsername && storedUserRole) {
        try {
          const payload = JSON.parse(atob(jwtToken.split('.')[1]));
          const expirationTime = payload.exp * 1000;

          if (expirationTime > Date.now()) {
            setIsLoggedIn(true);
            setUser({
              id: Number(storedUserId),
              name: storedUsername,
              department: storedUserRole === 'ADMIN' ? '管理者' : '一般ユーザー',
              avatar: '👤'
            });
            const lastActiveScreen = localStorage.getItem('lastActiveScreen');
            if (lastActiveScreen) {
              setActiveScreen(lastActiveScreen);
            }
          } else {
            console.log('JWTトークンが期限切れです。自動的にログアウトします。');
            // JWT関連のlocalStorageのみクリアし、勤務状態はクリアしない
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('currentUserId');
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');
            // localStorage.removeItem('lastActiveScreen'); // 勤務状態が残るようにクリアしない
            setIsLoggedIn(false);
            setUser(initialMockUser);
            // setActiveScreen('attendance'); // ログイン画面に戻るが、勤務状態はAttendanceScreenが管理
          }
        } catch (error) {
          console.error('JWTトークンの解析に失敗しました。自動的にログアウトします。', error);
          // JWT関連のlocalStorageのみクリアし、勤務状態はクリアしない
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('currentUserId');
          localStorage.removeItem('username');
          localStorage.removeItem('userRole');
          // localStorage.removeItem('lastActiveScreen'); // 勤務状態が残るようにクリアしない
          setIsLoggedIn(false);
          setUser(initialMockUser);
          // setActiveScreen('attendance'); // ログイン画面に戻るが、勤務状態はAttendanceScreenが管理
        }
      } else {
        setIsLoggedIn(false);
        setUser(initialMockUser);
        setActiveScreen('attendance');
      }
    };

    checkAuthStatus();

    const interval = setInterval(checkAuthStatus, 1000); // 1秒ごとにチェック

    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    // ログイン成功時にAttendanceScreenの初期状態をリセットしない
    // AttendanceScreenがlocalStorageから状態を読み込むため、ここでは特に何もしない
    const lastActiveScreen = localStorage.getItem('lastActiveScreen');
    setActiveScreen(lastActiveScreen || 'attendance'); // 最後に見ていた画面、またはデフォルト
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('lastActiveScreen'); // 明示的なログアウトでは全てクリア
    // 勤務状態のlocalStorageはクリアしない
    // localStorage.removeItem('currentClockIn');
    // localStorage.removeItem('currentClockOut');
    // localStorage.removeItem('currentAttendanceStatus');
    setIsLoggedIn(false);
    setUser(initialMockUser);
    setActiveScreen('attendance');
    console.log('ログアウトしました');
  };

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('lastActiveScreen', activeScreen);
    }
  }, [activeScreen, isLoggedIn]);


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
            {activeScreen !== 'attendance' && activeScreen !== 'edit' && activeScreen !== 'holiday' && activeScreen !== 'schedule' && activeScreen !== 'location' && (
              <div style={{ display: 'block' }}>
                <AttendanceScreen />
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
