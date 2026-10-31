import axios from 'axios';
import { setToken, setUser, getToken } from '../utils/storage';

// 创建 API 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 请求拦截器 - 添加 Token
api.interceptors.request.use(
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

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token 已过期或无效，清除本地存储
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // 重定向到登录页面
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 用户注册
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      passwordConfirm: userData.passwordConfirm,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      age: userData.age || null,
      gender: userData.gender || '其他',
      phone: userData.phone || ''
    });

    if (response.data.success) {
      // 保存 Token 和用户信息
      setToken(response.data.data.token);
      setUser(response.data.data.user);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// 用户登录
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', {
      username: credentials.username,
      password: credentials.password
    });

    if (response.data.success) {
      // 保存 Token 和用户信息
      setToken(response.data.data.token);
      setUser(response.data.data.user);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// 获取当前用户信息
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/current');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 获取用户资料
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    if (response.data.success) {
      setUser(response.data.data);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新用户资料
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.success) {
      setUser(response.data.data);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 修改密码
export const changePassword = async (passwordData) => {
  try {
    const response = await api.post('/auth/change-password', {
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 登出
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    // 清除本地存储
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    return response.data;
  } catch (error) {
    // 即使 API 调用失败，也要清除本地存储
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    throw error;
  }
};

export default api;
