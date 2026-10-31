# 老年人健康智能助手

这是一个为老年人设计的健康管理助手，集成了用药管理、饮食建议和运动指导三大核心功能模块，并通过DeepSeek AI提供智能决策支持。

## 🎯 项目概述

本项目致力于为老年人提供安全、便捷、智能的健康管理解决方案。通过React前端和Node.js后端，结合MongoDB数据库和DeepSeek AI技术，打造一个完整的健康生态系统。

## 📁 项目结构

```
elderly-health-assistant/
├── client/                           # 前端应用（React + Ant Design）
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # 公共组件
│   │   │   │   ├── Header.js
│   │   │   │   ├── Footer.js
│   │   │   │   └── Sidebar.js
│   │   │   ├── medication/          # 用药管理组件 ✅ 已完成
│   │   │   │   ├── MedicationReminder.js
│   │   │   │   ├── DrugInfo.js
│   │   │   │   └── MedicationAdvice.js
│   │   │   ├── diet/                # 饮食管理组件
│   │   │   │   ├── DietPlan.js
│   │   │   │   └── NutritionTracker.js
│   │   │   └── exercise/            # 运动管理组件 ✅ 已完成
│   │   │       ├── ExercisePlan.js
│   │   │       └── ExerciseTracker.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── package-lock.json
│
├── server/                           # 后端服务（Express + MongoDB）
│   ├── config/                       # 配置文件
│   │   ├── db.js
│   │   └── deepseek.js
│   ├── controllers/                  # 业务逻辑控制器
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── medicationController.js   # ✅ 已完成（8个接口）
│   │   ├── dietController.js
│   │   └── exerciseController.js
│   ├── models/                       # 数据模型
│   │   ├── User.js
│   │   ├── HealthProfile.js
│   │   ├── Medication.js             # ✅ MongoDB Schema
│   │   ├── DrugInfo.js               # ✅ MongoDB Schema
│   │   ├── DietPlan.js
│   │   └── ExercisePlan.js
│   ├── routes/                       # API路由
│   │   ├── authRoutes.js
│   │   ├── medicationRoutes.js       # ✅ 8条RESTful路由
│   │   ├── dietRoutes.js
│   │   ├── exerciseRoutes.js
│   │   └── aiRoutes.js
│   ├── scripts/
│   │   └── seedDrugData.js           # ✅ 数据库初始化脚本
│   ├── utils/
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── .env                          # 环境配置
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── MEDICATION_MODULE_GUIDE.md    # ✅ 用药模块详细指南
│   └── README.md
│
├── MEDICATION_IMPLEMENTATION_REPORT.md  # ✅ 用药模块完整实现报告（351行）
├── DIET_IMPLEMENTATION_REPORT.md        # ✅ 饮食模块完整实现报告（466行）
├── DIET_QUICK_START.md                 # ✅ 饮食模块快速开始指南（358行）
├── TESTING_GUIDE.md                    # ✅ 饮食模块完整测试指南（449行）
├── QUICK_REFERENCE.md                   # ✅ API快速参考指南（273行）
├── ACCEPTANCE_CHECKLIST.md              # ✅ 功能验收清单（374行）
├── BUG_FIX_REPORT.md                   # ✅ Bug 修复报告（312行）
├── quick-start.js                       # ✅ 快速启动脚本（131行）
├── 项目启动指南.md
├── 项目计划书.md
└── README.md                            # 本文件
```

## 🛠️ 技术栈

### 前端
- **React** 18.2.0 - 用户界面框架
- **Ant Design** 5.10.0 - ✅ UI组件库
- **Axios** 1.6.0 - ✅ HTTP客户端
- **Day.js** 1.11.10 - ✅ 日期处理库
- **Recharts** 2.10.0 - ✅ 数据可视化图表库

### 后端
- **Node.js** - 运行环境
- **Express.js** 4.18.2 - Web框架
- **MongoDB** 7.5.0 - ✅ 数据库
- **Redis** 4.6.7 - 缓存服务
- **Axios** 1.6.0 - ✅ HTTP客户端
- **DeepSeek API** - ✅ AI服务

### DevTools
- **Nodemon** 3.0.1 - 开发工具

## ⚡ 核心功能

### 1. 运动智能指导 ✅ 已完成
- 个性化运动计划制定
- 运动数据实时追踪
- 运动统计与分析

### 2. 饮食智能管理 ✅ 已完成
- **饮食计划制定** - 创建、管理、编辑个性化饮食计划
  - 详细的四餐营养数据（早餐、午餐、晚餐、加餐）
  - 支持热量、蛋白质、脂肪、碳水等营养素追踪
  - 自定义热量目标设置
  - 计划列表展示、编辑、删除

- **营养摄入追踪** - 实时监控营养摄入情况
  - 营养统计仪表板（热量、蛋白质、脂肪、碳水）
  - 最近7天热量趋势图表
  - 各餐次热量分布饼图
  - 热量达成进度条
  - 最新计划详情展示

- **AI智能建议** - DeepSeek集成个性化饮食建议
  - 基于当前营养摄入生成建议
  - 考虑用户饮食偏好
  - 实时建议生成

**API端点:** 6个RESTful接口
```
POST   /api/diet/plans              # 创建饮食计划
GET    /api/diet/plans              # 获取计划列表
PUT    /api/diet/plans/:id          # 更新计划
DELETE /api/diet/plans/:id          # 删除计划
GET    /api/diet/nutrition-stats    # 获取营养统计
POST   /api/diet/advice             # 获取AI建议
```

### 4. 智能助手 🚧 开发中
- 智能问答系统
- 语音识别支持
- ~~图像识别~~ (已移除)

### 5. 用户认证系统 ✅ 已完成
- **用户注册** - 安全的密码加密和验证
  - 用户信息完整性验证
  - 邮箱唯一性检查
  - bcryptjs 密码加密 (salt=10)
  
- **用户登录** - JWT Token 认证
  - 7天有效期 Token
  - 自动登录状态管理
  - Token 过期自动跳转登录
  
- **用户资料管理** - 个人信息和密码修改
  - 用户基本信息编辑
  - 安全的密码修改流程
  - 个人资料展示
  
- **访问控制** - 路由和 API 保护
  - 受保护路由自动重定向
  - 所有 API 端点 JWT 验证
  - 多用户数据完全隔离

**API端点:** 7个RESTful接口
```
POST   /api/auth/register              # 用户注册
POST   /api/auth/login                 # 用户登录
GET    /api/auth/current-user          # 获取当前用户
GET    /api/auth/profile               # 获取用户资料
PUT    /api/auth/profile               # 更新用户资料
POST   /api/auth/change-password       # 修改密码
POST   /api/auth/logout                # 登出
```

## ✨ 技术亮点

1. **前后端分离**: 完整的 REST API 设计，便于扩展和维护
2. **AI 集成**: DeepSeek API 实现智能建议
3. **数据可视化**: Recharts 专业的图表展示
4. **响应式设计**: Ant Design 组件库保证多设备适配
5. **用户认证系统**: JWT Token + bcryptjs 密码加密，支持多用户
6. **数据隔离**: 基于 userId 的数据查询隔离，完全的多用户支持
7. **超时防护**: 数据库不可用时，添加了5秒超时防护，返回正常响应
8. **容错机制**: 数据库异常时返回空数据，应用继续运行而不是崩溃

## 📚 应用容错机制

### 什么是容错防护
- 当 MongoDB 数据库不可用时，API 会启动容错机制，返回标准格式的空数据
- 前端显示空数据界面，用户体验友好，无红色错误提示
- 配置数据库后，应用会自动使用真实数据，无需代码修改
- 详情参考：[BUG_FIX_REPORT.md](./BUG_FIX_REPORT.md) 中的"修复原理"部分

## 🐛 已知问题与解决方案

### 1. 营养统计超时 (MongoDB 未连接) - ✅ 已解决
**问题**: 当 MongoDB 数据库未运行时，获取营养统计会监时超时。

**解决方案**: 
- ✅ 已修复: 添加了5秒超时防护，数据库不可用时返回空数据。
- ✅ 已完成: MongoDB 8.2 于 2025-12-23 成功安装且数据库已连接。
- **当前状态**: 数据正常保存到 MongoDB 数据库中，不再使用容错机制。
详见 [BUG_FIX_REPORT.md](./BUG_FIX_REPORT.md) 的"后续配置 MongoDB"部分。

### 2. 前端组件缺少认证检查 - ✅ 已解决
**问题**: 某些前端组件在页面加载时未检查用户认证状态，导致无法获取用户信息。

**解决方案**:
- ✅ 已修复: DietPlan.js、NutritionTracker.js、ExerciseTracker.js、MedicationReminder.js
- ✅ 添加了 useAuth Hook 和用户检查
- ✅ 移除了硬编码的 'default-user' userId
- **当前状态**: 所有组件都支持多用户数据隔离

## 🚀 快速开始

### 前置要求
- Node.js >= 14.0.0
- MongoDB 8.2 (已配置，服务运行中)
- DeepSeek API Key

### 创建管理员账号（首次使用）

```bash
cd server
node scripts/createAdmin.js
```

这会创建一个超级管理员账号：
- 用户名: `admin`
- 密码: `Admin@12345`

### 一键启动（推荐）

```bash
# 终端1: 启动后端 (http://localhost:5000)
cd server
npm start

# 终端2: 启动前端 (http://localhost:3000)
cd client
npm start
```

然后用上面创建的 admin 账号登录即可

### 手动安装依赖

```bash
# 安装前端依赖
cd client
npm install
cd ..

# 安装后端依赖
cd server
npm install
cd ..
```

### 初始化数据库（可选）

```bash
cd server
# 添加示例药物数据（仅第一次需要）
node scripts/seedDrugData.js
```

## 📚 文档

### 核心文档
| 文档 | 描述 | 行数 |
|-----|-----|-----|
| [DIET_IMPLEMENTATION_REPORT.md](./DIET_IMPLEMENTATION_REPORT.md) | 饮食模块完整实现报告 | 466行 |
| [DIET_QUICK_START.md](./DIET_QUICK_START.md) | 饮食模块快速开始指南 | 358行 |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | 饮食模块完整测试指南 | 449行 |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | API快速参考指南 | 273行 |
| [ACCEPTANCE_CHECKLIST.md](./ACCEPTANCE_CHECKLIST.md) | 功能验收清单 | 374行 |
| [BUG_FIX_REPORT.md](./BUG_FIX_REPORT.md) | 营养统计超时 Bug 修复报告 | 312行 |
| [server/MEDICATION_MODULE_GUIDE.md](./server/MEDICATION_MODULE_GUIDE.md) | 用药模块详细使用指南 | 272行 |

### 认证系统相关
- 后端 JWT 认证中间件: `server/middleware/auth.js`
- 认证控制器: `server/controllers/authController.js` (8个函数)
- 认证路由: `server/routes/authRoutes.js` (7个端点)
- 前端认证工具: `client/src/utils/storage.js` (Token 存储)
- 前端 API 拦截: `client/src/api/auth.js` (自动添加 Authorization header)
- 认证上下文: `client/src/context/AuthContext.js` (全局状态管理)
- 登录组件: `client/src/components/auth/Login.js`
- 注册组件: `client/src/components/auth/Register.js`
- 用户资料: `client/src/components/auth/UserProfile.js`
- 受保护路由: `client/src/components/auth/ProtectedRoute.js`

### 环境配置

在 `server/.env` 文件中配置以下变量：

```env
# 服务器配置
PORT=5000

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/elderly_health_assistant
REDIS_HOST=localhost
REDIS_PORT=6379

# DeepSeek API配置
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_MAX_TOKENS=1000
```

## 🧪 API示例

### 用户注册

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "password": "Password@123",
    "firstName": "张",
    "lastName": "三"
  }'
```

### 用户登录

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@12345"
  }'

# 返回 Token
# {"success":true,"data":{"user":{...},"token":"eyJhbGciOi..."}}
```

### 创建用药提醒（需要 Token）

```bash
curl -X POST http://localhost:5000/api/medication/reminders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "medicationName": "阿司匹林",
    "dosage": "100mg",
    "frequency": "早餐后",
    "startTime": "2025-12-19"
  }'
```

### 查询药物信息

```bash
curl "http://localhost:5000/api/medication/drug-info?drugName=阿司匹林"
```

### 获取当前用户信息

```bash
curl -X GET http://localhost:5000/api/auth/current-user \
  -H "Authorization: Bearer <your_token>"
```

## 📊 项目进度

### 已完成 ✅
- [x] 项目基础框架戠建
- [x] 前端React应用初始化
- [x] 后端Express服务戠建
- [x] 运动智能功能模块（完整实现）
  - [x] 运动计划制定（CRUD操作）
  - [x] 运动数据追踪与统计
  - [x] DeepSeek AI集成智能建议
  - [x] 前后端完整联调
  - [x] 数据可视化展示（趣势图、上会图）
- [x] 饮食智能功能模块（完整实现）
  - [x] 饮食计划制定（CRUD操作）
  - [x] 营养摄入追踪与统计
  - [x] DeepSeek AI集成智能建议
  - [x] 前后端完整联调
  - [x] 数据可视化展示（趋势图、饼图）
- [x] 用户认证系统（完整实现）
  - [x] 用户注册与登录
  - [x] JWT Token 认证
  - [x] 用户资料管理
  - [x] 受保护路由和 API 端点
  - [x] 多用户数据隔离

### 开发中 🚧
- [ ] 健康档案管理
- [ ] 医生顾问功能
- [ ] 家庭成员管理

### 完成度 📊
**整体完成率**: 60% ✅
- 核心功能模块: 100% (饮食、运动)
- 用户认证系统: 100% (注册、登录、资料管理)
- 多用户数据隔离: 100% ✅
- 后续计划: 40% (推送、依从性、医患沟通)

### 计划中 📋
- [ ] 推送通知功能
- [ ] 用药依从性统计
- [ ] 医患沟通平台
- [ ] 多语言支持
- [ ] 移动端适配优化

## 🎓 开发者指南

### 代码结构说明

**后端架构** - MVC模式
- **Models** - MongoDB数据模型定义
- **Controllers** - 业务逻辑处理
- **Routes** - API路由定义
- **Config** - 配置文件（数据库、API）
- **Utils** - 工具函数

**前端架构** - 组件化设计
- **Components** - React函数式组件
- **Sidebar** - 导航组件
- **API调用** - Axios + async/await

### 添加新功能

1. 创建数据模型 (`server/models/`)
2. 实现控制器 (`server/controllers/`)
3. 配置路由 (`server/routes/`)
4. 创建前端组件 (`client/src/components/`)
5. 在App.js中添加路由
6. 更新Sidebar导航

## 🔗 相关链接

- [DeepSeek API文档](https://deepseek.com)
- [React官方文档](https://react.dev)
- [Express.js官方文档](https://expressjs.com)
- [MongoDB官方文档](https://docs.mongodb.com)
- [Ant Design官方文档](https://ant.design)

## 📝 许可证

MIT License

## 👥 贡献

欢迎提交Issue和Pull Request！

## 📞 支持

如有任何问题或建议，请联系开发团队。

---

**项目版本**: 2.0.0  
**最后更新**: 2025年12月23日 (用户认证系统完整实现 + 多用户数据隔离)  
**维护者**: AI Assistant

## 🔐 用户认证详解

### 默认管理员账号

首次运行时可使用以下凭证登录（通过 `server/scripts/createAdmin.js` 创建）：

```
用户名: admin
邮箱: admin@elderly-health.com
密码: Admin@12345
```

⚠️ **建议首次登录后立即修改密码**

### 认证流程

1. **注册** → 用户输入用户名、邮箱、密码
2. **密码加密** → 使用 bcryptjs (salt=10) 加密
3. **登录验证** → 密码比对成功后生成 JWT Token
4. **Token 保存** → localStorage 存储 Token 和用户信息
5. **API 调用** → 自动在 Authorization header 添加 Bearer Token
6. **Token 过期** → 401 错误时自动跳转到登录页面

### 技术实现

- **密码加密**: bcryptjs (salt rounds = 10)
- **Token 算法**: JWT (HS256)
- **Token 有效期**: 7天
- **存储位置**: localStorage (key: auth_token, auth_user)
- **请求拦截**: Axios 自动在每个请求添加 Authorization header

### 数据隔离保证

每个 API 端点都会验证用户身份，确保：
- ✅ 用户只能查看自己的数据
- ✅ 用户只能修改自己的数据
- ✅ 跨用户数据访问返回 403 Forbidden
- ✅ Token 过期或无效返回 401 Unauthorized

---

## 📁 补充文档（docs/ 目录）

| 文档 | 说明 |
| --- | --- |
| [老年人健康智能助手项目综合文档.pdf](./docs/老年人健康智能助手项目综合文档.pdf) | 项目综合文档（行业调研、投资效益分析、用药/饮食/运动三大功能方案） |
| [系统分析与设计文档.md](./docs/系统分析与设计文档.md) | 系统架构、数据库设计、接口设计 |
| [项目计划书.md](./docs/项目计划书.md) | 项目计划书 |
| [项目启动指南.md](./docs/项目启动指南.md) | 本地环境搭建与启动步骤 |
| [后续升级计划.md](./docs/后续升级计划.md) | 后续迭代与升级规划 |
| [系统演示视频录制指南.md](./docs/系统演示视频录制指南.md) | 演示视频录制脚本 |
| [QUICK_TEST_CHECKLIST.md](./docs/QUICK_TEST_CHECKLIST.md) | 功能测试清单 |
| [项目方案内容.txt](./docs/项目方案内容.txt) | 综合文档纯文本版（便于检索） |
| [文档与代码对照总结.md](./docs/文档与代码对照总结.md) | 文档内容与代码实现对照总结 |

## 🔐 安全说明

- 仓库中**不包含**任何 `.env` 真实配置与 API Key，请参考 `server/.env.example` / `client/.env.example` 自行创建。
- 文档与代码中出现的 DeepSeek API Key 已统一脱敏为 `your-deepseek-api-key`，请勿在公开渠道提交真实密钥。
- 默认管理员账号仅用于本地开发，请在生产环境修改密码与 JWT 密钥。
