@echo off
chcp 65001 >nul
title 老年人健康智能助手 - 服务端
echo ==========================================
echo   老年人健康智能助手 - 一键启动
echo ==========================================
echo.
echo 正在检查环境...

node -v >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js 已安装

where mongod >nul 2>&1
if errorlevel 1 (
    echo [警告] 未检测到 MongoDB，请确保 MongoDB 服务已启动
    echo 如已启动请忽略此警告
)

echo.
echo 正在启动服务器...
echo 请访问 http://localhost:5000
echo 按 Ctrl+C 停止服务器
echo ==========================================
echo.

node server.js

pause
