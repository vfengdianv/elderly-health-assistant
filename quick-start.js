#!/usr/bin/env node
/**
 * 老年人健康智能助手 - 快速启动脚本
 * 使用方法：node quick-start.js [--seed]
 * 参数：
 *   --seed  初始化数据库（添加示例药物数据）
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const shouldSeed = args.includes('--seed');

// 提示：如果需要初始化数据库，使用 node quick-start.js --seed
console.log('💡 提示：如果需要初始化数据库，请使用 node quick-start.js --seed\n');

console.log('\n========================================');
console.log('  老年人健康智能助手 - 快速启动');
console.log('========================================\n');

// 检查Node版本
const nodeVersion = process.version;
console.log(`✓ Node.js 版本: ${nodeVersion}`);

// 检查必要的目录
const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'client');

if (!fs.existsSync(serverDir)) {
  console.error('❌ 错误：找不到server目录');
  process.exit(1);
}

if (!fs.existsSync(clientDir)) {
  console.error('❌ 错误：找不到client目录');
  process.exit(1);
}

console.log('✓ 项目目录结构正确\n');

// 检查环境配置
const envFile = path.join(serverDir, '.env');
if (!fs.existsSync(envFile)) {
  console.warn('⚠ 警告：未找到 server/.env 文件');
  console.warn('   请确保已配置以下环境变量：');
  console.warn('   - PORT=5000');
  console.warn('   - MONGODB_URI=mongodb://localhost:27017/elderly_health_assistant');
  console.warn('   - DEEPSEEK_API_KEY=your_api_key\n');
}

// 启动函数
async function startServices() {
  console.log('📦 开始启动服务...\n');

  // 如果需要初始化数据库
  if (shouldSeed) {
    console.log('🌱 初始化数据库...');
    const seedScript = path.join(serverDir, 'scripts', 'seedDrugData.js');
    
    if (fs.existsSync(seedScript)) {
      const seed = spawn('node', [seedScript], {
        cwd: serverDir,
        stdio: 'inherit'
      });

      await new Promise((resolve, reject) => {
        seed.on('close', (code) => {
          if (code === 0) {
            console.log('\n✓ 数据库初始化成功\n');
            resolve();
          } else {
            console.error('\n⚠ 数据库初始化失败（可能是MongoDB未运行）');
            console.error('   但应用仍可启动，数据库功能暂不可用\n');
            resolve(); // 继续启动应用，不中断流程
          }
        });
        seed.on('error', reject);
      });
    } else {
      console.warn('⚠ 警告：找不到数据库初始化脚本\n');
    }
  } else {
    console.log('⏭️  已跳过数据库初始化');
    console.log('   数据库功能暂不可用，但应用仍可启动\n');
  }

  // 启动后端
  console.log('🚀 启动后端服务 (http://localhost:5000)...');
  const backend = spawn('node', ['server.js'], {
    cwd: serverDir,
    stdio: 'inherit'
  });

  backend.on('error', (err) => {
    console.error('❌ 后端启动失败:', err.message);
    process.exit(1);
  });

  // 等待后端启动
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 启动前端
  console.log('\n🚀 启动前端应用 (http://localhost:3000)...');
  const frontend = spawn('D:\\Node\\node.exe', ['node_modules/react-scripts/bin/react-scripts.js', 'start'], {
    cwd: clientDir,
    stdio: 'inherit',
    shell: false,
    env: Object.assign({}, process.env, {
      DANGEROUSLY_DISABLE_HOST_CHECK: 'true',
      HOST: 'localhost',
      PORT: '3000'
    })
  });

  frontend.on('error', (err) => {
    console.error('❌ 前端启动失败:', err.message);
    console.error('   尝试使用备选方案...');
    // 备选方案：尝试使用npm命令
    const fallback = spawn('npm', ['start'], {
      cwd: clientDir,
      stdio: 'inherit',
      shell: true,
      env: Object.assign({}, process.env, {
        PATH: 'D:\\Node;' + process.env.PATH
      })
    });
  });

  console.log('\n========================================');
  console.log('✓ 所有服务启动成功！');
  console.log('========================================');
  console.log('\n📱 前端应用: http://localhost:3000');
  console.log('🔧 后端API: http://localhost:5000/api');
  console.log('\n按 Ctrl+C 停止所有服务\n');

  // 处理进程关闭
  process.on('SIGINT', () => {
    console.log('\n\n关闭所有服务...');
    backend.kill();
    frontend.kill();
    setTimeout(() => process.exit(0), 1000);
  });
}

// 执行启动
startServices().catch(err => {
  console.error('❌ 启动失败:', err.message);
  process.exit(1);
});
