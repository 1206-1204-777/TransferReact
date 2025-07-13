import { Edit3, Eye, Save, Trash2, XCircle } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { EditRequest, Message, UserAttendanceUpdateRequestDto } from '../../types';
import { apiClient } from '../../utils/api';
import { initialMockEditHistory } from '../../utils/constants';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { MessageDisplay } from '../common/MessageDisplay';

export const EditScreen: React.FC = () => {
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [editHistory, setEditHistory] = useState<EditRequest[]>(initialMockEditHistory);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    reason: '',
    startTime: '',
    endTime: '',
    comment: ''
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        date: formData.date,
        clockIn: formData.startTime,
        clockOut: formData.endTime,
        reason: formData.reason,
        comment: formData.comment
      };
      const response = await apiClient.post(`/api/attendance/update/${userId}`, requestData);

      if (response.data.success) {
        const newRequest: EditRequest = {
          id: editHistory.length + 1,
          requestDate: new Date().toISOString().split('T')[0],
          targetDate: formData.date,
          changes: `出勤: ${formData.startTime || '-'} → ${formData.startTime || '-'}, 退勤: ${formData.endTime || '-'} → ${formData.endTime || '-'}`,
          reason: formData.reason,
          status: 'pending',
          approver: '-'
        };
        setEditHistory(prev => [newRequest, ...prev]);
        setMessage({ type: 'success', text: response.data.message || '勤怠修正申請が送信されました' });
        setFormData({ date: new Date().toISOString().split('T')[0], reason: '', startTime: '', endTime: '', comment: '' });
      } else {
        setMessage({ type: 'error', text: response.data.message || '勤怠修正申請に失敗しました' });
      }
    } catch (error: any) {
      console.error('勤怠修正申請中にエラーが発生しました:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || '勤怠修正申請中にエラーが発生しました' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = (id: number) => {
    setLoading(true);
    try {
      setEditHistory(prev => prev.filter(req => req.id !== id));
      setMessage({ type: 'success', text: '修正申請を削除しました' });
    } catch (error: any) {
      console.error('修正申請の削除中にエラーが発生しました:', error);
      setMessage({ type: 'error', text: '修正申請の削除に失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Edit3 className="w-6 h-6 mr-3" />
          勤怠修正
        </h2>
        <MessageDisplay message={message} onClear={() => setMessage({ type: '', text: '' })} />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-2">修正日</label>
              <input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <div>
              <label htmlFor="edit-reason" className="block text-sm font-medium text-gray-700 mb-2">修正理由</label>
              <select
                id="edit-reason"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                required
              >
                <option value="">選択してください</option>
                <option value="打刻忘れ">打刻忘れ</option>
                <option value="打刻ミス">打刻ミス</option>
                <option value="システムエラー">システムエラー</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="edit-start-time" className="block text-sm font-medium text-gray-700 mb-2">出勤時刻</label>
              <input
                id="edit-start-time"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="edit-end-time" className="block text-sm font-medium text-gray-700 mb-2">退勤時刻</label>
              <input
                id="edit-end-time"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
          <div>
            <label htmlFor="edit-comment" className="block text-sm font-medium text-gray-700 mb-2">備考</label>
            <textarea
              id="edit-comment"
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
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
              <Save className="w-5 h-5 mr-2" />
              修正申請
            </button>
            <button
              type="button"
              onClick={() => setFormData({ date: new Date().toISOString().split('T')[0], reason: '', startTime: '', endTime: '', comment: '' })}
              className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300"
            >
              <XCircle className="w-5 h-5 mr-2" />
              クリア
            </button>
          </div>
        </form>
        {loading && <LoadingSpinner />}
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/20">
          <h3 className="text-xl font-bold text-gray-800">修正申請履歴</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申請日</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">対象日</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">修正内容</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申請理由</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">承認者</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-100">
              {editHistory.map((record) => (
                <tr key={record.id} className="hover:bg-purple-50/50 transition-all duration-300">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.requestDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.targetDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.changes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      record.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : record.status === 'pending'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status === 'approved' ? '承認済み' : 
                       record.status === 'pending' ? '申請中' : '却下'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.approver}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {record.status === 'pending' ? (
                      <button 
                        onClick={() => handleDeleteRequest(record.id)}
                        className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-xl transition-all duration-300"
                        aria-label="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="text-purple-600 hover:text-purple-900 hover:bg-purple-50 p-2 rounded-xl transition-all duration-300" aria-label="詳細を見る">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};