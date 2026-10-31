# 用药智能模块 - 快速参考指南

## 🎯 核心功能概览

用药智能模块为老年人用户提供了三大核心功能：

| 功能 | 位置 | 主要接口 | 说明 |
|-----|------|--------|------|
| 📋 用药提醒 | 侧边栏"用药提醒" | POST/GET/PUT/DELETE `/api/medication/reminders` | 管理个人用药计划 |
| 💊 药物信息 | 侧边栏"药物信息" | GET `/api/medication/drug-info` | 查询药物详细信息 |
| 🤖 智能建议 | 侧边栏"智能建议" | POST `/api/medication/advice` | AI生成个性化建议 |

---

## ⚡ 快速启动（3步）

### 步骤1：安装依赖
```bash
# 前端
cd client && npm install && cd ..

# 后端
cd server && npm install && cd ..
```

### 步骤2：初始化数据库（可选）
```bash
cd server
node scripts/seedDrugData.js
# 或使用完整路径
D:\Node\node.exe scripts/seedDrugData.js
```

### 步骤3：启动应用
```bash
# 方式1：使用快速启动脚本
node quick-start.js --seed

# 方式2：手动启动
# 终端1 - 启动后端
cd server && npm start

# 终端2 - 启动前端
cd client && npm start
```

**应用地址：**
- 前端: http://localhost:3000
- 后端: http://localhost:5000

---

## 📁 项目文件结构

### 新增/修改的关键文件

```
server/
├── controllers/
│   └── medicationController.js          ← 用药业务逻辑（8个接口）
├── models/
│   ├── Medication.js                    ← 用药提醒数据模型
│   └── DrugInfo.js                      ← 药物信息数据模型
├── routes/
│   └── medicationRoutes.js              ← 用药API路由
├── scripts/
│   └── seedDrugData.js                  ← 数据库初始化脚本
├── .env                                 ← 环境配置（已有DeepSeek密钥）
└── MEDICATION_MODULE_GUIDE.md           ← 详细使用指南

client/
├── src/
│   ├── components/medication/
│   │   ├── MedicationReminder.js        ← 用药提醒组件
│   │   ├── DrugInfo.js                  ← 药物信息组件
│   │   └── MedicationAdvice.js          ← 智能建议组件
│   ├── components/common/
│   │   └── Sidebar.js                   ← 更新了导航链接
│   └── App.js                           ← 更新了路由配置
└── package.json                         ← 已添加antd, axios, dayjs

project-root/
├── quick-start.js                       ← 快速启动脚本
└── MEDICATION_IMPLEMENTATION_REPORT.md  ← 完整实现报告
```

---

## 🔌 API端点速查表

### 用药提醒 (Reminders)
```
POST   /api/medication/reminders          创建提醒
GET    /api/medication/reminders          获取提醒列表
PUT    /api/medication/reminders/:id      更新提醒
DELETE /api/medication/reminders/:id      删除提醒
POST   /api/medication/records            记录用药
GET    /api/medication/records            获取记录
```

### 药物信息 (Drug Info)
```
GET    /api/medication/drug-info          查询药物（参数: drugName）
```

### 智能建议 (AI Advice)
```
POST   /api/medication/advice             获取建议（需要症状等信息）
```

---

## 💾 数据库示例

### Medication表 - 用药提醒
```javascript
{
  _id: ObjectId,
  userId: "user123",
  medicationName: "阿司匹林",
  dosage: "100mg",
  frequency: "早餐后",
  startTime: Date(2025-12-19),
  endTime: Date(2026-12-19),
  reminderTimes: ["08:00", "20:00"],
  instructions: "饭后服用",
  isActive: true,
  createdAt: Date,
  updatedAt: Date
}
```

### DrugInfo表 - 药物信息
```javascript
{
  _id: ObjectId,
  drugName: "阿司匹林",
  category: "抗血栓药",
  indications: "缓解疼痛，预防血栓",
  dosageInfo: "300-500mg，每日3-4次",
  sideEffects: "胃部不适",
  contraindications: "过敏者禁用",
  // ... 其他字段
}
```

---

## 🧪 快速测试

### 测试1：创建用药提醒
```bash
curl -X POST http://localhost:5000/api/medication/reminders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user",
    "medicationName": "阿司匹林",
    "dosage": "100mg",
    "frequency": "早餐后",
    "startTime": "2025-12-19"
  }'
```

### 测试2：查询药物信息
```bash
curl "http://localhost:5000/api/medication/drug-info?drugName=阿司匹林"
```

### 测试3：获取智能建议
```bash
curl -X POST http://localhost:5000/api/medication/advice \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user",
    "symptoms": "头痛、失眠",
    "chronicDiseases": "高血压"
  }'
```

---

## ⚙️ 环境变量配置

**必填项（已配置）：**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elderly_health_assistant
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_API_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
```

**可选项：**
```
DEEPSEEK_TEMPERATURE=0.7        # AI创意度（0-1）
DEEPSEEK_MAX_TOKENS=1000        # 最大输出字数
```

---

## 🐛 常见问题排查

| 问题 | 原因 | 解决方案 |
|-----|------|--------|
| 前端无法连接后端 | 跨域或后端未启动 | 检查proxy配置，确保后端在5000端口 |
| MongoDB连接失败 | MongoDB未运行 | 启动MongoDB服务或使用MongoDB Atlas |
| DeepSeek API错误 | API密钥无效或过期 | 检查.env中的API密钥是否正确 |
| 组件加载失败 | 依赖未安装 | 运行`npm install`安装所有依赖 |
| 数据库初始化失败 | MongoDB未连接 | 确保MongoDB已启动，检查MONGODB_URI |

---

## 📚 详细文档

- **完整实现报告**: `MEDICATION_IMPLEMENTATION_REPORT.md`
- **模块使用指南**: `server/MEDICATION_MODULE_GUIDE.md`
- **项目计划书**: `项目计划书.md`

---

## 🎓 开发者备注

### 关键技术选型
- **前端框架**: React 18 + Ant Design 5
- **后端框架**: Express.js
- **数据库**: MongoDB
- **AI服务**: DeepSeek API
- **HTTP客户端**: Axios
- **日期处理**: Day.js

### 设计思路
1. **分离关注点** - 遵循MVC架构
2. **可复用组件** - React函数式组件
3. **标准化API** - RESTful设计
4. **错误处理** - 完整的try-catch和状态管理
5. **用户体验** - Ant Design确保界面美观

### 扩展建议
- 添加用户认证和授权
- 集成推送通知
- 添加数据导出功能
- 实现用药依从性统计
- 支持多语言

---

## 🚀 下一步行动

1. **部署应用**
   - 使用`node quick-start.js --seed`一键启动
   - 访问http://localhost:3000

2. **测试功能**
   - 创建至少一个用药提醒
   - 查询药物信息（试试"阿司匹林"）
   - 获取智能用药建议

3. **集成优化**
   - 连接实际的用户认证系统
   - 配置生产环境的MongoDB
   - 更新API密钥和配置

4. **功能扩展**
   - 添加更多药物信息
   - 实现推送通知
   - 增加数据统计功能

---

**版本**: 1.0.0  
**最后更新**: 2025年12月19日  
**维护者**: AI Assistant
