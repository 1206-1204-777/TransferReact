/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Users, Calendar, Clock, Search, Check, X, Edit2, Save, TrendingUp, Award, Bell, AlertTriangle, TimerOff, Zap, Download, Plus, Trash2, Eye, UserPlus, Phone } from 'lucide-react';

// モックデータ
const mockUsers = [
  { 
    id: 1, 
    name: '田中太郎', 
    email: 'tanaka@company.com', 
    department: '営業部', 
    workStartTime: '09:00', 
    workEndTime: '18:00', 
    avatar: '🧑‍💼',
    todayClockIn: '09:15',
    todayClockOut: '20:30',
    status: 'overtime',
    overtimeHours: 2.5,
    overtimeType: 'late',
    phone: '090-1234-5678',
    joinDate: '2023-04-01',
    location: '東京オフィス'
  },
  { 
    id: 2, 
    name: '佐藤花子', 
    email: 'sato@company.com', 
    department: '開発部', 
    workStartTime: '10:00', 
    workEndTime: '19:00', 
    avatar: '👩‍💻',
    todayClockIn: '08:30',
    todayClockOut: '19:15',
    status: 'overtime',
    overtimeHours: 1.75,
    overtimeType: 'early',
    phone: '090-2345-6789',
    joinDate: '2022-07-15',
    location: '東京オフィス'
  },
  { 
    id: 3, 
    name: '山田次郎', 
    email: 'yamada@company.com', 
    department: '人事部', 
    workStartTime: '09:30', 
    workEndTime: '18:30', 
    avatar: '👨‍💼',
    todayClockIn: null,
    todayClockOut: null,
    status: 'absent',
    overtimeHours: 0,
    overtimeType: null,
    phone: '090-3456-7890',
    joinDate: '2021-03-10',
    location: '大阪オフィス'
  }
];

const mockHolidayRequests = [
  { 
    id: 1, 
    userId: 1, 
    userName: '田中太郎', 
    startDate: '2025-07-20', 
    endDate: '2025-07-21', 
    reason: '家族旅行のため', 
    status: 'pending',
    requestDate: '2025-07-15',
    type: 'vacation'
  },
  { 
    id: 2, 
    userId: 2, 
    userName: '佐藤花子', 
    startDate: '2025-07-25', 
    endDate: '2025-07-25', 
    reason: '通院のため', 
    status: 'pending',
    requestDate: '2025-07-14',
    type: 'sick'
  }
];

// 社員登録フォーム
const EmployeeRegistrationForm = ({ isOpen, onClose, onSave, editingEmployee }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
    workStartTime: '09:00',
    workEndTime: '18:00',
    location: '東京オフィス',
    joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        name: editingEmployee.name || '',
        email: editingEmployee.email || '',
        department: editingEmployee.department || '',
        phone: editingEmployee.phone || '',
        workStartTime: editingEmployee.workStartTime || '09:00',
        workEndTime: editingEmployee.workEndTime || '18:00',
        location: editingEmployee.location || '東京オフィス',
        joinDate: editingEmployee.joinDate || new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        name: '',
        email: '',
        department: '',
        phone: '',
        workStartTime: '09:00',
        workEndTime: '18:00',
        location: '東京オフィス',
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingEmployee]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          {editingEmployee ? '社員情報編集' : '新規社員登録'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                氏名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                部署 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">選択してください</option>
                <option value="営業部">営業部</option>
                <option value="開発部">開発部</option>
                <option value="人事部">人事部</option>
                <option value="経理部">経理部</option>
                <option value="マーケティング部">マーケティング部</option>
                <option value="総務部">総務部</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                電話番号
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              {editingEmployee ? '更新' : '登録'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState(mockUsers);
  const [holidayRequests, setHolidayRequests] = useState(mockHolidayRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  // 勤怠状況の計算
  const getAttendanceStats = () => {
    const present = users.filter(u => u.status === 'present').length;
    const absent = users.filter(u => u.status === 'absent').length;
    const overtime = users.filter(u => u.status === 'overtime').length;
    const totalOvertimeHours = users.reduce((sum, u) => sum + (u.overtimeHours || 0), 0);
    
    return { present, absent, overtime, totalOvertimeHours };
  };

  const stats = getAttendanceStats();

  // 休日申請の承認・却下
  const handleRequestAction = (requestId: number, action: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setHolidayRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: action }
            : request
        )
      );
      setIsLoading(false);
    }, 300);
  };

  // 社員登録・編集処理
  const handleEmployeeSave = (formData: any) => {
    setIsLoading(true);
    setTimeout(() => {
      if (editingEmployee) {
        setUsers(prev => 
          prev.map(user => 
            user.id === editingEmployee.id 
              ? { ...user, ...formData }
              : user
          )
        );
      } else {
        const newEmployee = {
          id: Date.now(),
          ...formData,
          avatar: '👤',
          todayClockIn: null,
          todayClockOut: null,
          status: 'absent',
          overtimeHours: 0,
          overtimeType: null
        };
        setUsers(prev => [...prev, newEmployee]);
      }
      setShowEmployeeForm(false);
      setEditingEmployee(null);
      setIsLoading(false);
    }, 300);
  };

  // 社員削除処理
  const handleDeleteEmployee = (userId: number) => {
    if (window.confirm('この社員を削除してもよろしいですか？')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleExport = (type: string, format: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`${format.toUpperCase()}ファイルのダウンロードが開始されました`);
    }, 1500);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = holidayRequests.filter(req => req.status === 'pending');
  const absentUsers = users.filter(u => u.status === 'absent');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* アニメーション背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* ヘッダー */}
      <div className="relative backdrop-blur-sm bg-white/80 shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">勤怠・従業員管理システム</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-purple-600 transition-colors" />
                {(pendingRequests.length > 0 || absentUsers.length > 0) && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {pendingRequests.length + absentUsers.length}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  管
                </div>
                <span className="text-sm font-medium text-gray-700">管理者</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メイン統計カード */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">出勤中</p>
                <p className="text-3xl font-bold text-green-600">{stats.present + stats.overtime}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">未出勤</p>
                <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-400 rounded-2xl flex items-center justify-center">
                <TimerOff className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">残業者</p>
                <p className="text-3xl font-bold text-orange-600">{stats.overtime}</p>
                <p className="text-xs text-gray-500 mt-1">総時間: {stats.totalOvertimeHours.toFixed(1)}h</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">承認待ち</p>
                <p className="text-3xl font-bold text-blue-600">{pendingRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-2 shadow-xl border border-white/20 mb-8">
          <nav className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              ダッシュボード
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === 'attendance'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              勤怠管理
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              休日申請承認
              {pendingRequests.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {pendingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === 'export'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Download className="w-4 h-4 mr-2" />
              データ出力
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`flex items-center px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === 'employees'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              社員管理
            </button>
          </nav>
        </div>

        {/* メインコンテンツ */}
        {activeTab === 'dashboard' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">今日の概要</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3">正常出勤</h3>
                <p className="text-3xl font-bold text-green-600">{stats.present}</p>
                <p className="text-sm text-green-600 mt-2">定時通りに勤務</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">残業・早出</h3>
                <p className="text-3xl font-bold text-orange-600">{stats.overtime}</p>
                <p className="text-sm text-orange-600 mt-2">総計 {stats.totalOvertimeHours.toFixed(1)}時間</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3">要注意</h3>
                <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                <p className="text-sm text-red-600 mt-2">未出勤者</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ユーザー名、部署で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 w-full border-0 bg-gray-50/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-300"
                />
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-8 py-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/20">
                <h2 className="text-2xl font-bold text-gray-800">今日の勤怠状況</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase">ユーザー情報</th>
                      <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase">部署</th>
                      <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase">勤務時間</th>
                      <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase">状態</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-purple-50/50 transition-all duration-300">
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-white text-lg">
                              {user.avatar}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                            {user.department}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm text-gray-900">
                            {user.workStartTime} - {user.workEndTime}
                          </div>
                          <div className="text-xs text-gray-500">
                            出勤: {user.todayClockIn || '未打刻'} | 退勤: {user.todayClockOut || '未打刻'}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                            user.status === 'present' ? 'bg-green-100 text-green-800' :
                            user.status === 'overtime' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'present' ? '出勤済み' :
                             user.status === 'overtime' ? '時間外勤務' : '未出勤'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/20">
              <h2 className="text-2xl font-bold text-gray-800">休日申請一覧</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {holidayRequests.map((request) => (
                <div key={request.id} className="p-8 hover:bg-purple-50/50 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-white text-lg">
                          {request.userName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{request.userName}</h3>
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            request.type === 'vacation' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.type === 'vacation' ? '有給休暇' : '病気休暇'}
                          </span>
                        </div>
                        <span className={`ml-4 inline-flex px-4 py-2 text-sm font-medium rounded-full ${
                          request.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status === 'pending' ? '承認待ち' :
                           request.status === 'approved' ? '承認済み' : '却下'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{request.startDate} ～ {request.endDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-4 h-4 text-center">💬</span>
                          <span>{request.reason}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-4 h-4 text-center">📅</span>
                          <span>申請日: {request.requestDate}</span>
                        </div>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRequestAction(request.id, 'approved')}
                          disabled={isLoading}
                          className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-2xl text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          承認
                        </button>
                        <button
                          onClick={() => handleRequestAction(request.id, 'rejected')}
                          disabled={isLoading}
                          className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-2xl text-white bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          却下
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {holidayRequests.length === 0 && (
                <div className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">休日申請はありません</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Download className="w-6 h-6 mr-3" />
              データ出力
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">年月</label>
                  <input
                    type="month"
                    defaultValue="2025-07"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">出力形式</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="csv">CSV形式</option>
                    <option value="excel">Excel形式</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => handleExport('all', 'csv')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    一括ダウンロード
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">個人別勤怠データ</h3>
                  <p className="text-blue-600 text-sm mb-4">各社員の勤怠記録を出力</p>
                  <button
                    onClick={() => handleExport('individual', 'excel')}
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-all duration-300"
                  >
                    Excel出力
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">部署別集計</h3>
                  <p className="text-green-600 text-sm mb-4">部署ごとの勤怠集計を出力</p>
                  <button
                    onClick={() => handleExport('department', 'excel')}
                    disabled={isLoading}
                    className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition-all duration-300"
                  >
                    Excel出力
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">残業時間レポート</h3>
                  <p className="text-orange-600 text-sm mb-4">残業時間の詳細分析</p>
                  <button
                    onClick={() => handleExport('overtime', 'excel')}
                    disabled={isLoading}
                    className="w-full bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition-all duration-300"
                  >
                    Excel出力
                  </button>
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-gray-600">処理中...</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <UserPlus className="w-6 h-6 mr-3" />
                  社員管理
                </h2>
                <button
                  onClick={() => {
                    setEditingEmployee(null);
                    setShowEmployeeForm(true);
                  }}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  新規社員登録
                </button>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="社員名、メール、部署で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-4 w-full border-0 bg-gray-50/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">社員情報</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">部署</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">勤務地</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">勤務時間</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">入社日</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-purple-50/50 transition-all duration-300">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-white text-lg">
                              {user.avatar}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-xs text-gray-400 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                            {user.department}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                            {user.location}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{user.workStartTime} - {user.workEndTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingEmployee(user);
                                setShowEmployeeForm(true);
                              }}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-xl transition-all duration-300"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(user.id)}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-xl transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 社員登録フォーム */}
      <EmployeeRegistrationForm
        isOpen={showEmployeeForm}
        onClose={() => {
          setShowEmployeeForm(false);
          setEditingEmployee(null);
        }}
        onSave={handleEmployeeSave}
        editingEmployee={editingEmployee}
      />
    </div>
  );
};

export default AdminDashboard;