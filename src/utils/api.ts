import axios from 'axios';

// Axiosインスタンスの作成とインターセプターの設定
export const apiClient = axios.create({
  baseURL: '/', // package.jsonのproxy設定により、/api/** は自動的にバックエンドに転送される
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター: 全てのAPIリクエストにJWTトークンを付与
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); // localStorageからJWTトークンを取得
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Authorizationヘッダーに付与
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);