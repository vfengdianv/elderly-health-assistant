const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 认证中间件 - 验证 JWT Token
const auth = (req, res, next) => {
  try {
    // 从 Authorization header 获取 token
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证 Token',
        error_code: 'NO_TOKEN'
      });
    }

    // 验证 token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token 已过期',
        error_code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token 无效',
        error_code: 'INVALID_TOKEN'
      });
    }

    res.status(401).json({
      success: false,
      message: '认证失败',
      error_code: 'AUTHENTICATION_FAILED'
    });
  }
};

// 可选的认证中间件 - 不要求必须提供 token
const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // 忽略错误，继续处理
  }

  next();
};

module.exports = {
  auth,
  optionalAuth
};
