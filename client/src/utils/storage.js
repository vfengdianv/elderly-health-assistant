// 本地存储工具 - 用于保存 Token 和用户信息

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  REFRESH_TOKEN: 'refresh_token'
};

// 保存 Token
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }
};

// 获取 Token
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

// 删除 Token
export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

// 保存用户信息
export const setUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
};

// 获取用户信息
export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

// 删除用户信息
export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// 清除所有认证信息
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

// 检查是否已登录
export const isLoggedIn = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

// 获取 Authorization Header
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
