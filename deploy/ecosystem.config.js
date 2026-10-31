// PM2 进程管理配置文件
module.exports = {
  apps: [
    {
      name: 'elderly-health-backend',
      script: './server/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
