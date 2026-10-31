#!/bin/bash

# 项目初始化脚本
echo "正在安装项目依赖..."

# 安装后端依赖
cd /home/elderly-health-assistant/server
npm install --production

# 构建前端
cd /home/elderly-health-assistant/client
npm install
npm run build

echo "依赖安装完成！"
