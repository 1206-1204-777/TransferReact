import { AlertCircle, Calendar, CheckCircle, Clock, FileText, Send, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface HolidayRequest {
  id: number;
  date: string;
  type: 'PAID' | 'SPECIAL' | 'SICK' | 'OTHER';
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  approverName?: string;
}

interface OvertimeRequest {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  approverName?: string;
  estimatedHours?: number;
}

interface HolidayFormData {
  date: string;
  type: 'PAID' | 'SPECIAL' | 'SICK' | 'OTHER';
  reason: string;
}

interface OvertimeFormData {
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export const HolidayScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'holiday' | 'overtime'>('holiday');
  const [holidayRequests, setHolidayRequests] = useState<HolidayRequest[]>([]);
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [holidayForm, setHolidayForm] = useState<HolidayFormData>({
    date: '',
    type: 'PAID',
    reason: ''
  });

  const [overtimeForm, setOvertimeForm] = useState<OvertimeFormData>({
    date: '',
    startTime: '18:00',
    endTime: '20:00',
    reason: ''
  });

  const currentUserId = 1;

  useEffect(() => {
    loadHolidayRequests();
    loadOvertimeRequests();
  }, []);

  // 休日申請一覧を読み込み
  const loadHolidayRequests = async () => {
    setLoading(true);
    try {
      // デモデータ
      setHolidayRequests([
        {
          id: 1,
          date: '2025-08-15',
          type: 'PAID',
          reason: '家族旅行のため',
          status: 'APPROVED',
          createdAt: '2025-07-20T10:30:00',
          approverName: '鈴木 部長'
        },
        {
          id: 2,
          date: '2025-08-20',
          type: 'SPECIAL',
          reason: '結婚式参列のため',
          status: 'PENDING',
          createdAt: '2025-07-22T14:15:00'
        }
      ]);
    } catch (error) {
      console.error('休日申請取得エラー:', error);
      setMessage({ type: 'error', text: '休日申請データの読み込みに失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  // 残業申請一覧を読み込み
  const loadOvertimeRequests = async () => {
    try {
      // デモデータ
      setOvertimeRequests([
        {
          id: 1,
          date: '2025-07-25',
          startTime: '18:00',
          endTime: '21:00',
          reason: 'プロジェクトデッドライン対応',
          status: 'APPROVED',
          createdAt: '2025-07-24T16:30:00',
          approverName: '鈴木 部長',
          estimatedHours: 3
        },
        {
          id: 2,
          date: '2025-07-30',
          startTime: '18:00',
          endTime: '20:00',
          reason: '月末処理対応',
          status: 'PENDING',
          createdAt: '2025-07-29T17:45:00',
          estimatedHours: 2
        }
      ]);
    } catch (error) {
      console.error('残業申請取得エラー:', error);
    }
  };

  // 休日申請送信
  const submitHolidayRequest = async () => {
    if (!holidayForm.date || !holidayForm.reason.trim()) {
      setMessage({ type: 'error', text: '日付と理由を入力してください' });
      return;
    }

    setLoading(true);
    try {
      setMessage({ type: 'success', text: '休日申請を送信しました' });
      setHolidayForm({ date: '', type: 'PAID', reason: '' });
      await loadHolidayRequests();
    } catch (error) {
      console.error('休日申請送信エラー:', error);
      setMessage({ type: 'error', text: '申請の送信に失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  // 残業申請送信
  const submitOvertimeRequest = async () => {
    if (!overtimeForm.date || !overtimeForm.startTime || !overtimeForm.endTime || !overtimeForm.reason.trim()) {
      setMessage({ type: 'error', text: 'すべての項目を入力してください' });
      return;
    }

    if (overtimeForm.startTime >= overtimeForm.endTime) {
      setMessage({ type: 'error', text: '終了時間は開始時間より後に設定してください' });
      return;
    }

    setLoading(true);
    try {
      setMessage({ type: 'success', text: '残業申請を送信しました' });
      setOvertimeForm({ date: '', startTime: '18:00', endTime: '20:00', reason: '' });
      await loadOvertimeRequests();
    } catch (error) {
      console.error('残業申請送信エラー:', error);
      setMessage({ type: 'error', text: '申請の送信に失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  // 休日申請キャンセル
  const cancelHolidayRequest = async (requestId: number) => {
    if (!window.confirm('この休日申請をキャンセルしてもよろしいですか？')) {
      return;
    }

    try {
      setMessage({ type: 'success', text: '休日申請をキャンセルしました' });
      await loadHolidayRequests();
    } catch (error) {
      console.error('休日申請キャンセルエラー:', error);
      setMessage({ type: 'error', text: 'キャンセルに失敗しました' });
    }
  };

  // 残業申請キャンセル
  const cancelOvertimeRequest = async (requestId: number) => {
    if (!window.confirm('この残業申請をキャンセルしてもよろしいですか？')) {
      return;
    }

    try {
      setMessage({ type: 'success', text: '残業申請をキャンセルしました' });
      await loadOvertimeRequests();
    } catch (error) {
      console.error('残業申請キャンセルエラー:', error);
      setMessage({ type: 'error', text: 'キャンセルに失敗しました' });
    }
  };

  // 残業時間計算
  const calculateOvertimeHours = (startTime: string, endTime: string): number => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return Math.round((endMinutes - startMinutes) / 60 * 10) / 10;
  };

  // 休日種別の表示名取得
  const getHolidayTypeText = (type: string) => {
    const types = {
      'PAID': '有給休暇',
      'SPECIAL': '特別休暇',
      'SICK': '病気休暇',
      'OTHER': 'その他'
    };
    return types[type as keyof typeof types] || type;
  };

  // ステータスの表示
  const getStatusDisplay = (status: string) => {
    if (status === 'PENDING') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          申請中
        </span>
      );
    } else if (status === 'APPROVED') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          承認済
        </span>
      );
    } else if (status === 'REJECTED') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" />
          却下
        </span>
      );
    }
    return null;
  };

  // メッセージ自動消去
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">休日・残業申請</h2>
      </div>

      {/* メッセージ表示 */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-300 text-green-700' 
            : 'bg-red-100 border border-red-300 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* タブナビゲーション */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('holiday')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'holiday'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          休日申請
        </button>
        <button
          onClick={() => setActiveTab('overtime')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'overtime'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          残業申請
        </button>
      </div>

      {/* 休日申請タブ */}
      {activeTab === 'holiday' && (
        <div className="space-y-6">
          {/* 休日申請フォーム */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">新規休日申請</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="holiday-date" className="block text-sm font-medium text-gray-700 mb-1">
                  休日日付 <span className="text-red-500">*</span>
                </label>
                <input
                  id="holiday-date"
                  type="date"
                  value={holidayForm.date}
                  onChange={(e) => setHolidayForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="holiday-type" className="block text-sm font-medium text-gray-700 mb-1">
                  休日種別 <span className="text-red-500">*</span>
                </label>
                <select
                  id="holiday-type"
                  value={holidayForm.type}
                  onChange={(e) => setHolidayForm(prev => ({ 
                    ...prev, 
                    type: e.target.value as 'PAID' | 'SPECIAL' | 'SICK' | 'OTHER' 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="PAID">有給休暇</option>
                  <option value="SPECIAL">特別休暇</option>
                  <option value="SICK">病気休暇</option>
                  <option value="OTHER">その他</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="holiday-reason" className="block text-sm font-medium text-gray-700 mb-1">
                理由 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="holiday-reason"
                value={holidayForm.reason}
                onChange={(e) => setHolidayForm(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="休日取得の理由を入力してください"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={submitHolidayRequest}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                申請
              </button>
              <button
                onClick={() => setHolidayForm({ date: '', type: 'PAID', reason: '' })}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                クリア
              </button>
            </div>
          </div>

          {/* 休日申請履歴 */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">休日申請履歴</h3>
            </div>
            
            <div className="overflow-x-auto">
              {holidayRequests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  申請履歴がありません
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        申請日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        休日日付
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        休日種別
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        理由
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        承認者
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {holidayRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(request.createdAt).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(request.date).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getHolidayTypeText(request.type)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {request.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusDisplay(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.approverName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {request.status === 'PENDING' ? (
                            <button
                              onClick={() => cancelHolidayRequest(request.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              取消
                            </button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 残業申請タブ */}
      {activeTab === 'overtime' && (
        <div className="space-y-6">
          {/* 残業申請フォーム */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">新規残業申請</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="overtime-date" className="block text-sm font-medium text-gray-700 mb-1">
                  残業日 <span className="text-red-500">*</span>
                </label>
                <input
                  id="overtime-date"
                  type="date"
                  value={overtimeForm.date}
                  onChange={(e) => setOvertimeForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="overtime-start" className="block text-sm font-medium text-gray-700 mb-1">
                  開始時間 <span className="text-red-500">*</span>
                </label>
                <input
                  id="overtime-start"
                  type="time"
                  value={overtimeForm.startTime}
                  onChange={(e) => setOvertimeForm(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="overtime-end" className="block text-sm font-medium text-gray-700 mb-1">
                  終了時間 <span className="text-red-500">*</span>
                </label>
                <input
                  id="overtime-end"
                  type="time"
                  value={overtimeForm.endTime}
                  onChange={(e) => setOvertimeForm(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">
                予想残業時間: {calculateOvertimeHours(overtimeForm.startTime, overtimeForm.endTime)}時間
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="overtime-reason" className="block text-sm font-medium text-gray-700 mb-1">
                理由 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="overtime-reason"
                value={overtimeForm.reason}
                onChange={(e) => setOvertimeForm(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="残業が必要な理由を入力してください"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={submitOvertimeRequest}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                申請
              </button>
              <button
                onClick={() => setOvertimeForm({ date: '', startTime: '18:00', endTime: '20:00', reason: '' })}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                クリア
              </button>
            </div>
          </div>

          {/* 残業申請履歴 */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">残業申請履歴</h3>
            </div>
            
            <div className="overflow-x-auto">
              {overtimeRequests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  申請履歴がありません
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        申請日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        残業日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        時間
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        予想時間
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        理由
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        承認者
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {overtimeRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(request.createdAt).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(request.date).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.startTime} ～ {request.endTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.estimatedHours}時間
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {request.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusDisplay(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.approverName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {request.status === 'PENDING' ? (
                            <button
                              onClick={() => cancelOvertimeRequest(request.id)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              取消
                            </button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};