// src/components/edit/EditScreen.tsx
import { Edit3, Eye, Save, Trash2, XCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'; // useEffect をインポート
import { EditRequest, Message, UserAttendanceUpdateRequestDto } from '../../types'; // UserAttendanceUpdateRequestDto をインポート
import { apiClient } from '../../utils/api';
import { initialMockEditHistory } from '../../utils/constants';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { MessageDisplay } from '../common/MessageDisplay';

// getCurrentMonthRange 関数をコンポーネントの外に移動するか、
// コンポーネントの内部（return の外）に定義します。
// ここでは、コンポーネント内部に定義し、必要に応じて useCallback でメモ化します。

export const EditScreen: React.FC = () => {
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [editHistory, setEditHistory] = useState<EditRequest[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    reason: '',
    startTime: '', // 修正後の出勤時刻 (requestedClockIn に対応)
    endTime: '',   // 修正後の退勤時刻 (requestedClockOut に対応)
    comment: ''
  });

  // ユーザーIDをローカルストレージから取得
  const userId = Number(localStorage.getItem('userId'));

  // 勤怠修正履歴をロードする関数
  const loadEditRequests = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: 実際のAPIから履歴を取得する処理に置き換える
      // 例: const response = await apiClient.get(`/api/attendance/edit-requests?userId=${userId}`);
      // setEditHistory(response.data);
      setEditHistory(initialMockEditHistory); // モックデータをロード
    } catch (error: any) {
      console.error('勤怠修正履歴のロード中にエラーが発生しました:', error);
      setMessage({ type: 'error', text: '勤怠修正履歴のロードに失敗しました' });
    } finally {
      setLoading(false);
    }
  }, [userId]); // userId が変わったら再ロード

  // コンポーネントマウント時に履歴をロード
  useEffect(() => {
    if (userId) { // userId が有効な場合のみロード
      loadEditRequests();
    } else {
      setMessage({ type: 'error', text: 'ユーザーIDが見つかりません。再ログインしてください。' });
    }
  }, [userId, loadEditRequests]); // userId と loadEditRequests が変わったら実行

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => { // async キーワードを追加
    e.preventDefault();
    setLoading(true);
    try {
      if (!userId) {
        setMessage({ type: 'error', text: 'ユーザーIDが見つかりません。再ログインしてください。' });
        setLoading(false);
        return;
      }

      // バックエンドに送信するリクエストデータ
      // UserAttendanceUpdateRequestDto を使用
      const requestData: UserAttendanceUpdateRequestDto = {
        userId: userId,
        date: formData.date,
        startTime: formData.startTime || null, // 空文字の場合はnullにする
        endTime: formData.endTime || null,     // 空文字の場合はnullにする
        reason: formData.reason,
        comment: formData.comment
      };

      // API呼び出し (エンドポイントとデータ構造がバックエンドと一致しているか確認してください)
      // 例: `/api/attendance/update/${userId}` が UserAttendanceUpdateRequestDto を受け取る場合
      // `/api/attendance/edit-requests` は一般的なエンドポイント名
      const response = await apiClient.post('/api/attendance/edit-requests', requestData); // await の位置を修正

      if (response.data.success) {
        // changes プロパティを動的に生成するロジック
        let changesText = '';
        if (formData.startTime) {
          changesText += `出勤: 変更なし → ${formData.startTime}`;
        }
        if (formData.endTime) {
          if (changesText) changesText += ', '; // 複数ある場合はカンマで区切る
          changesText += `退勤: 変更なし → ${formData.endTime}`;
        }
        if (!changesText) {
          changesText = '変更なし'; // 出勤・退勤時刻の入力がない場合
        }

        // 新しい修正申請オブジェクトを作成
        const newRequest: EditRequest = {
          // IDの生成ロジックを改善: 既存の履歴の最大ID + 1 (履歴が空の場合は 1)
          id: editHistory.length > 0 ? Math.max(...editHistory.map(req => req.id)) + 1 : 1,
          userId: userId, // EditRequest インターフェースに userId が必須になったため追加
          requestDate: new Date().toISOString().split('T')[0],
          targetDate: formData.date,
          changes: changesText, // 生成した修正内容の文字列
          reason: formData.reason,
          status: 'pending', // 新しい申請は常に 'pending'
          approver: '-', // 承認者は初期状態では '-'
          requestedClockIn: formData.startTime || undefined, // undefined にするとプロパティが追加されない
          requestedClockOut: formData.endTime || undefined,
          // currentClockIn, currentClockOut は、もし修正前の値を取得できるAPIがあれば設定
          // approvedDate, approverId は申請中なので設定しない
        };

        setEditHistory(prev => [newRequest, ...prev]); // 新しい申請を履歴の先頭に追加
        setMessage({ type: 'success', text: response.data.message || '勤怠修正申請が送信されました' });
        // フォームをリセット
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

  const handleDeleteRequest = useCallback((id: number) => { // useCallback を追加
    setLoading(true);
    try {
      // TODO: 実際にはAPIを呼び出してDBから申請を削除する処理が必要です
      setEditHistory(prev => prev.filter((req: EditRequest) => req.id !== id)); // prev と req に型アノテーションを追加
      setMessage({ type: 'success', text: '修正申請を削除しました' });
    } catch (error: any) {
      console.error('修正申請の削除中にエラーが発生しました:', error);
      setMessage({ type: 'error', text: '修正申請の削除に失敗しました' });
    } finally {
      setLoading(false);
    }
  }, []); // 依存配列は空でOK

  // 日付入力の min/max 属性を生成するヘルパー関数
  const getCurrentMonthRange = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();

    return {
      min: `${year}-${month}-01`,
      max: `${year}-${month}-${String(lastDay).padStart(2, '0')}`
    };
  }, []);

  const { min, max } = getCurrentMonthRange(); // コンポーネントのレンダリングスコープ内で呼び出す

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
                min={min} // min 属性を追加
                max={max} // max 属性を追加
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
