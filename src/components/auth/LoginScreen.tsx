import axios from 'axios';
import React, { useState } from 'react';
import { Message, User } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { MessageDisplay } from '../common/MessageDisplay';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/api/auth/login', { username, password });

      if (response.status === 200) {
        const data = response.data;
        if (data.token) {
          localStorage.setItem('jwtToken', data.token);
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('username', data.username);
          localStorage.setItem('userRole', data.role);

          setMessage({ type: 'success', text: 'ログインに成功しました！' });
          onLoginSuccess({
            id: data.userId,
            name: data.username,
            department: data.role === 'ADMIN' ? '管理者' : '一般ユーザー',
            avatar: '👤'
          });
        } else {
          setMessage({ type: 'error', text: 'ログインに失敗しました: トークンがありません。' });
        }
      } else {
        setMessage({ type: 'error', text: response.data.message || 'ログインに失敗しました。' });
      }
    } catch (error: any) {
      console.error('ログインエラー:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage({ type: 'error', text: error.response.data.message });
      } else {
        setMessage({ type: 'error', text: 'サーバーとの通信中にエラーが発生しました。' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          勤怠管理システム
        </h1>
        <MessageDisplay message={message} onClear={() => setMessage({ type: '', text: '' })} />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              ユーザー名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="ユーザー名を入力してください"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="パスワードを入力してください"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'ログイン'}
          </button>
        </form>
        <div className="text-center text-gray-600">
          <p>アカウントをお持ちでない方は <a href="#" className="text-purple-600 hover:underline">新規登録</a></p>
        </div>
      </div>
    </div>
  );
};