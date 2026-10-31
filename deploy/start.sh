#!/bin/bash

# 启动服务脚本
echo "正在启动服务..."

# 启动后端
cd /home/elderly-health-assistant
pm2 start deploy/ecosystem.config.js

# 配置 PM2 开机自启
pm2 startup
pm2 save

echo "服务启动完成！"
echo "后端运行在: http://localhost:5000"
echo "使用 pm2 status 查看服务状态"
echo "使用 pm2 logs 查看日志"
