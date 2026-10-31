// 数据库配置

// MongoDB连接配置
const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/elderly_health_assistant',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
};

// Redis连接配置
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null
};

module.exports = {
  mongoConfig,
  redisConfig
};