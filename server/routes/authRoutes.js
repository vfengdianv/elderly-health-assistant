const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// 公开路由
// 用户注册
router.post('/register', authController.register);

// 用户登录
router.post('/login', authController.login);

// 需要认证的路由
// 获取当前用户信息
router.get('/current', auth, authController.getCurrentUser);

// 获取用户资料
router.get('/profile', auth, authController.getProfile);

// 更新用户信息
router.put('/profile', auth, authController.updateProfile);

// 修改密码
router.post('/change-password', auth, authController.changePassword);

// 登出
router.post('/logout', auth, authController.logout);

module.exports = router;