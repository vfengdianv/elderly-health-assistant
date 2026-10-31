#!/bin/bash

# 阿里云服务器部署脚本
# 使用方法：chmod +x deploy.sh && ./deploy.sh

echo "========================================="
echo "  老年人健康智能助手 - 阿里云部署脚本  "
echo "========================================="

# 1. 更新系统
echo "正在更新系统包..."
sudo yum update -y || sudo apt-get update -y

# 2. 安装 Node.js (v16.x)
echo "正在安装 Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash - || curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs || sudo apt-get install -y nodejs

# 3. 安装 MongoDB
echo "正在安装 MongoDB..."
if command -v yum &> /dev/null; then
    # CentOS/RHEL
    sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo <<EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF
    sudo yum install -y mongodb-org
else
    # Ubuntu/Debian
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
fi

# 4. 启动 MongoDB
echo "正在启动 MongoDB..."
sudo systemctl start mongod
sudo systemctl enable mongod

# 5. 安装 PM2
echo "正在安装 PM2..."
sudo npm install -g pm2

# 6. 安装 Nginx
echo "正在安装 Nginx..."
sudo yum install -y nginx || sudo apt-get install -y nginx

# 7. 配置防火墙
echo "正在配置防火墙..."
if command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --permanent --add-port=3000/tcp
    sudo firewall-cmd --permanent --add-port=5000/tcp
    sudo firewall-cmd --reload
else
    sudo ufw allow 'Nginx Full'
    sudo ufw allow 3000/tcp
    sudo ufw allow 5000/tcp
    sudo ufw enable
fi

echo "========================================="
echo "  环境安装完成！                        "
echo "========================================="
echo ""
echo "下一步："
echo "1. 上传项目代码到服务器"
echo "2. 运行 setup.sh 安装依赖"
echo "3. 运行 start.sh 启动服务"
