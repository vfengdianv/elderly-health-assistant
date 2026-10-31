import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authAPI from '../api/auth';
import { getUser, getToken, clearAuth } from '../utils/storage';

// 创建认证上下文
export const AuthContext = createContext();

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初始化 - 检查本地存储中是否有 Token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getToken();
        const storedUser = getUser();

        if (token && storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('认证初始化错误:', err);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 注册函数
  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.register(userData);

      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, message: '注册成功' };
      }

      setError(response.message);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || '注册失败';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 登录函数
  const login = useCallback(async (username, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.login({ username, password });

      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, message: '登录成功' };
      }

      setError(response.message);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || '登录失败';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 登出函数
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      return { success: true, message: '登出成功' };
    } catch (err) {
      const message = err.response?.data?.message || '登出失败';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 更新用户资料
  const updateProfile = useCallback(async (profileData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.updateProfile(profileData);

      if (response.success) {
        setUser(response.data);
        return { success: true, message: '资料更新成功' };
      }

      setError(response.message);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || '资料更新失败';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 修改密码
  const changePassword = useCallback(async (passwordData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.changePassword(passwordData);

      if (response.success) {
        return { success: true, message: '密码修改成功' };
      }

      setError(response.message);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || '密码修改失败';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 获取当前用户信息
  const fetchCurrentUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.getCurrentUser();

      if (response.success) {
        setUser(response.data);
        return response.data;
      }

      return null;
    } catch (err) {
      console.error('获取当前用户信息失败:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    fetchCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 自定义 Hook - 使用认证上下文
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内使用');
  }
  return context;
};
