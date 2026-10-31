const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const { mongoConfig } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// 连接 MongoDB
mongoose.connect(mongoConfig.uri, mongoConfig.options)
  .then(() => {
    console.log('✅ MongoDB 数据库连接成功');
  })
  .catch((err) => {
    console.error('❌ MongoDB 连接失败:', err.message);
    // 继续启动，但会出现错误
  });

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const authRoutes = require('./routes/authRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const dietRoutes = require('./routes/dietRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/medication', medicationRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/exercise', exerciseRoutes);
app.use('/api/ai', aiRoutes);

// 静态文件服务 - 生产环境前端文件
app.use(express.static(path.join(__dirname, 'public')));

// SPA 路由回退 - 所有非 API 请求返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`✅ 服务器运行在端口 ${PORT}`);
  console.log(`📱 请访问 http://localhost:${PORT}`);
});

module.exports = app;