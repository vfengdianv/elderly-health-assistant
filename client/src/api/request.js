import axios from 'axios';
import { getToken, clearAuth } from '../utils/storage';

// 开发环境下，如果配置了 proxy，则不设置 baseURL 或设为 /api
const request = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? (process.env.REACT_APP_API_URL || '') 
    : '', 
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token 过期或无效
      clearAuth();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default request;
