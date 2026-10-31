const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT 密钥（应从环境变量读取）
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// 生成 JWT Token
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm, firstName, lastName, age, gender, phone } = req.body;

    // 验证必需字段
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数: username, email, password, passwordConfirm',
        error_code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // 验证密码一致性
    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: '两次输入的密码不一致',
        error_code: 'PASSWORD_MISMATCH'
      });
    }

    // 验证密码长度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少 6 位',
        error_code: 'PASSWORD_TOO_SHORT'
      });
    }

    // 验证用户名长度
    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: '用户名长度至少 3 位',
        error_code: 'USERNAME_TOO_SHORT'
      });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.username === username ? '用户名已存在' : '邮箱已被注册',
        error_code: 'USER_ALREADY_EXISTS'
      });
    }

    // 创建新用户
    const newUser = new User({
      username,
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      age: age || null,
      gender: gender || '其他',
      phone: phone || ''
    });

    // 保存用户（会自动加密密码）
    const savedUser = await newUser.save();

    // 生成 Token
    const token = generateToken(savedUser._id, savedUser.email);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: savedUser.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('用户注册错误:', error);

    // 处理 Mongoose 验证错误
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: '数据验证失败: ' + Object.values(error.errors).map(e => e.message).join(', '),
        error_code: 'VALIDATION_ERROR'
      });
    }

    // 处理重复键错误
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} 已存在`,
        error_code: 'DUPLICATE_KEY'
      });
    }

    res.status(500).json({
      success: false,
      message: '注册失败',
      error_code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证必需字段
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数: username, password',
        error_code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // 查找用户（包括密码字段）
    const user = await User.findOne({ $or: [{ username }, { email: username }] }).select('+password');

    // 检查用户是否存在
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误',
        error_code: 'INVALID_CREDENTIALS'
      });
    }

    // 检查用户是否激活
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: '用户已被禁用',
        error_code: 'USER_DISABLED'
      });
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误',
        error_code: 'INVALID_CREDENTIALS'
      });
    }

    // 生成 Token
    const token = generateToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('用户登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败',
      error_code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user 由认证中间件设置
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
        error_code: 'USER_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: '获取用户信息成功',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error_code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// 获取用户资料
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
        error_code: 'USER_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: '获取用户资料成功',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('获取用户资料错误:', error);
    res.status(500).json({
      success: false,
      message: '获取用户资料失败',
      error_code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, age, gender, phone } = req.body;

    // 准备更新数据（仅更新允许的字段）
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender;
    if (phone !== undefined) updateData.phone = phone;

    // 更新用户
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
        error_code: 'USER_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: '用户信息更新成功',
      data: user.toJSON()
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: '数据验证失败: ' + Object.values(error.errors).map(e => e.message).join(', '),
        error_code: 'VALIDATION_ERROR'
      });
    }

    res.status(500).json({
      success: false,
      message: '更新用户信息失败',
      error_code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// 修改密码
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // 验证必需字段
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数',
        error_code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // 验证新密码一致性
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '两次输入的密码不一致',
        error_code: 'PASSWORD_MISMATCH'
      });
    }

    // 验证新密码长度
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少 6 位',
        error_code: 'PASSWORD_TOO_SHORT'
      });
    }

    // 获取用户（包括密码字段）
    const user = await User.findById(req.user.userId).select('+password');

    // 验证旧密码
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '原密码错误',
        error_code: 'INVALID_OLD_PASSWORD'
      });
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({
      success: false,
      message: '修改密码失败',
      error_code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// 登出（客户端删除 Token）
exports.logout = (req, res) => {
  // 由于使用 JWT，服务器不需要处理登出
  // 客户端应删除本地存储中的 Token
  res.status(200).json({
    success: true,
    message: '登出成功'
  });
};
