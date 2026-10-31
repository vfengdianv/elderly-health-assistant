# 老年人健康智能助手 - 一键启动脚本
$Host.UI.RawUI.WindowTitle = "老年人健康智能助手 - 服务端"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  老年人健康智能助手 - 一键启动" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "正在检查环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "[OK] Node.js 已安装: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未检测到 Node.js，请先安装 Node.js" -ForegroundColor Red
    Write-Host "下载地址: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "按 Enter 键退出"
    exit 1
}

# 检查 MongoDB（可选）
try {
    $mongoVersion = mongod --version 2>$null | Select-Object -First 1
    if ($mongoVersion) {
        Write-Host "[OK] MongoDB 已安装" -ForegroundColor Green
    } else {
        Write-Host "[警告] 未检测到 MongoDB，请确保 MongoDB 服务已启动" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[警告] 未检测到 MongoDB，请确保 MongoDB 服务已启动" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "正在启动服务器..." -ForegroundColor Green
Write-Host "请访问 http://localhost:5000" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 启动服务器
node server.js

Read-Host "按 Enter 键退出"
