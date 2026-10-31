// 创建超级管理员账号脚本
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// 导入 User 模型
const User = require('../models/User');

// 连接 MongoDB
const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/elderly_health_assistant';

async function createAdmin() {
  try {
    console.log('正在连接到数据库...');
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ 数据库连接成功\n');

    // 超级管理员凭证
    const adminData = {
      username: 'admin',
      email: 'admin@elderly-health.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345', // 生产环境请通过环境变量 ADMIN_PASSWORD 设置
      firstName: '超级',
      lastName: '管理员',
      age: 30,
      gender: '男',
      phone: '13800138000',
      isActive: true
    };

    // 检查是否已存在
    const existingAdmin = await User.findOne({ 
      $or: [
        { username: adminData.username },
        { email: adminData.email }
      ]
    });

    if (existingAdmin) {
      console.log('❌ 错误: 管理员账号已存在！');
      console.log('   用户名:', existingAdmin.username);
      console.log('   邮箱:', existingAdmin.email);
      await mongoose.connection.close();
      return;
    }

    // 创建新的管理员用户
    const admin = new User(adminData);
    
    console.log('📝 正在创建管理员账号...');
    console.log('   用户名:', adminData.username);
    console.log('   邮箱:', adminData.email);
    console.log('   密码: ***' + adminData.password.slice(-4));
    console.log('');

    const savedAdmin = await admin.save();

    console.log('✅ 超级管理员账号创建成功！\n');
    console.log('═══════════════════════════════════════');
    console.log('账号信息:');
    console.log('═══════════════════════════════════════');
    console.log('用户名:', savedAdmin.username);
    console.log('邮箱:', savedAdmin.email);
    console.log('密码:', adminData.password);
    console.log('名字:', savedAdmin.firstName + ' ' + savedAdmin.lastName);
    console.log('账号ID:', savedAdmin._id);
    console.log('创建时间:', savedAdmin.createdAt);
    console.log('═══════════════════════════════════════\n');
    console.log('⚠️  提示:');
    console.log('1. 请妥善保管此账号凭证');
    console.log('2. 建议首次登录后立即修改密码');
    console.log('3. 可以用这个账号登录应用: http://localhost:3000\n');

    await mongoose.connection.close();
    console.log('✅ 数据库连接已关闭');
    process.exit(0);

  } catch (error) {
    console.error('❌ 创建管理员失败:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// 执行创建
createAdmin();
