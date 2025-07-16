import { Clock, Edit, MapPin, Plus, Save, Trash2, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Location {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  createdBy: string;
  createdById: number;
}

interface LocationFormData {
  name: string;
  startTime: string;
  endTime: string;
}

export const LocationScreen: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    startTime: '09:00',
    endTime: '18:00'
  });
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const currentUserId = Number(localStorage.getItem('userId'));

  // 勤務地一覧を読み込み
const loadLocations = async () => {
  setLoading(true);
  try {
    const { apiClient } = await import('../../utils/api');
    const response = await apiClient.get('/api/locations');
    
    if (response.status === 200) {
      setLocations(response.data);
    }
  } catch (error: any) {
    console.error('勤務地取得エラー:', error);
    setMessage({ type: 'error', text: 'データの読み込みに失敗しました' });
  } finally {
    setLoading(false);
  }
};

  // フォーム送信処理
const handleSubmit = async () => {
  if (!formData.name.trim()) {
    setMessage({ type: 'error', text: '勤務地名を入力してください' });
    return;
  }

  if (formData.startTime >= formData.endTime) {
    setMessage({ type: 'error', text: '終了時間は開始時間より後に設定してください' });
    return;
  }

  setLoading(true);
  
  try {
    const { apiClient } = await import('../../utils/api');
    const userId = Number(localStorage.getItem('userId'));
    
    if (!userId) {
      setMessage({ type: 'error', text: 'ユーザーIDが見つかりません' });
      return;
    }

    const requestData = {
      name: formData.name,
      startTime: formData.startTime,
      endTime: formData.endTime,
      createdBy : userId
    };

    if (isEditing) {
      // 編集機能（バックエンドにPUTエンドポイントが必要）
      const response = await apiClient.put(`/api/locations/${isEditing}`, requestData);
      
      if (response.status === 200) {
        setMessage({ type: 'success', text: '勤務地が更新されました' });
      }
    } else {
      // 新規登録
      const response = await apiClient.post('/api/locations', requestData);
      
      if (response.status === 201) {
        setMessage({ type: 'success', text: '勤務地が登録されました' });
      }
    }
    
    clearForm();
    await loadLocations(); // 一覧を再読み込み
    
  } catch (error: any) {
    console.error('勤務地登録エラー:', error);
    setMessage({ type: 'error', text: error.response?.data || '登録に失敗しました' });
  } finally {
    setLoading(false);
  }
};

  // 編集開始
  const startEdit = (location: Location) => {
    setFormData({
      name: location.name,
      startTime: location.startTime,
      endTime: location.endTime
    });
    setIsEditing(location.id);
  };

  // 削除処理
const handleDelete = async (locationId: number) => {
  if (!window.confirm('この勤務地を削除してもよろしいですか？')) {
    return;
  }

  try {
    const { apiClient } = await import('../../utils/api');
    const userId = Number(localStorage.getItem('userId'));
    
    if (!userId) {
      setMessage({ type: 'error', text: 'ユーザーIDが見つかりません' });
      return;
    }

    const response = await apiClient.delete(`/api/locations/${locationId}?currentUserId=${userId}`);
    
    if (response.status === 204) {
      setMessage({ type: 'success', text: '勤務地が削除されました' });
      await loadLocations(); // 一覧を再読み込み
    }
  } catch (error: any) {
    console.error('勤務地削除エラー:', error);
    
    if (error.response?.status === 403) {
      setMessage({ type: 'error', text: '削除権限がありません' });
    } else if (error.response?.status === 404) {
      setMessage({ type: 'error', text: '勤務地が見つかりません' });
    } else {
      setMessage({ type: 'error', text: '削除に失敗しました' });
    }
  }
};

  // フォームクリア
  const clearForm = () => {
    setFormData({
      name: '',
      startTime: '09:00',
      endTime: '18:00'
    });
    setIsEditing(null);
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
        <MapPin className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">勤務地登録</h2>
      </div>

      {/* メッセージ表示 */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-300 text-green-700' 
            : 'bg-red-100 border border-red-300 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <Save className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* 登録フォーム */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {isEditing ? '勤務地編集' : '新規勤務地登録'}
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="location-name" className="block text-sm font-medium text-gray-700 mb-1">
                勤務地名 <span className="text-red-500">*</span>
              </label>
              <input
                id="location-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="例: 東京オフィス"
              />
            </div>
            
            <div>
              <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">
                標準出勤時間 <span className="text-red-500">*</span>
              </label>
              <input
                id="start-time"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div>
              <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
                標準退勤時間 <span className="text-red-500">*</span>
              </label>
              <input
                id="end-time"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditing ? '更新' : '登録'}
            </button>
            
            {isEditing && (
              <button
                onClick={clearForm}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                キャンセル
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 登録済み勤務地一覧 */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            登録済み勤務地一覧
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : locations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              登録された勤務地がありません
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    勤務地名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    標準出勤時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    標準退勤時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{location.createdBy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{location.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-900">{location.startTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-900">{location.endTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(location)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(location.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          削除
                        </button>
                      </div>
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