# 用药智能功能模块使用指南

## 功能概述

用药智能模块包含以下三个核心功能：

### 1. 用药提醒 (Medication Reminder)
用于管理和设置个人的用药计划和提醒。

**功能特性：**
- 添加新的用药计划
- 设置用药时间和频次
- 获取用药提醒列表
- 编辑和删除用药计划

**API端点：**
- POST `/api/medication/reminders` - 创建用药提醒
- GET `/api/medication/reminders?userId=xxx` - 获取用药提醒列表
- PUT `/api/medication/reminders/:id` - 更新用药提醒
- DELETE `/api/medication/reminders/:id` - 删除用药提醒
- POST `/api/medication/records` - 记录用药情况
- GET `/api/medication/records?userId=xxx` - 获取用药记录

**前端组件：**
`src/components/medication/MedicationReminder.js`

### 2. 药物信息查询 (Drug Information)
用于查询药物的详细信息，包括主治功效、副作用、禁忌症等。

**功能特性：**
- 按药物名称搜索
- 查看完整的药物信息
- 副作用和禁忌症提示
- 药物相互作用信息

**API端点：**
- GET `/api/medication/drug-info?drugName=xxx` - 查询药物信息

**前端组件：**
`src/components/medication/DrugInfo.js`

### 3. 智能用药建议 (Medication Advice)
利用DeepSeek AI生成个性化的用药建议。

**功能特性：**
- 基于症状生成建议
- 考虑慢性疾病和当前用药
- 安全提示和警告
- 实时生成由AI驱动的建议

**API端点：**
- POST `/api/medication/advice` - 获取智能用药建议

**前端组件：**
`src/components/medication/MedicationAdvice.js`

## 快速开始

### 1. 安装依赖

**前端依赖安装：**
```bash
cd client
npm install
```

**后端依赖安装：**
```bash
cd server
npm install
```

### 2. 数据库初始化

在启动后端服务之前，需要初始化药物数据库：

```bash
cd server
# 使用完整的Node路径（如果系统未配置Node）
D:\Node\node.exe scripts/seedDrugData.js
```

该脚本会：
- 连接MongoDB数据库
- 清空现有药物数据
- 插入5种示例药物（阿司匹林、降压灵、复合维生素B、钙补充剂、人参）
- 显示已添加的药物列表

### 3. 启动应用

**启动后端服务：**
```bash
cd server
D:\Node\node.exe server.js
# 或使用npm
npm start
```

后端将运行在 `http://localhost:5000`

**启动前端应用：**
```bash
cd client
npm start
```

前端将运行在 `http://localhost:3000`

## API使用示例

### 示例1：创建用药提醒

```bash
POST /api/medication/reminders
Content-Type: application/json

{
  "userId": "user123",
  "medicationName": "阿司匹林",
  "dosage": "100mg",
  "frequency": "早餐后",
  "startTime": "2025-12-19",
  "endTime": "2026-12-19",
  "reminderTimes": ["08:00", "20:00"],
  "instructions": "饭后服用，不可与其他药物混用"
}
```

**响应：**
```json
{
  "success": true,
  "message": "用药提醒设置成功",
  "data": {
    "_id": "...",
    "userId": "user123",
    "medicationName": "阿司匹林",
    ...
  }
}
```

### 示例2：查询药物信息

```bash
GET /api/medication/drug-info?drugName=阿司匹林
```

**响应：**
```json
{
  "success": true,
  "message": "获取药物信息成功",
  "data": {
    "_id": "...",
    "drugName": "阿司匹林",
    "category": "抗血栓药",
    "indications": "用于缓解轻度至中度疼痛...",
    "sideEffects": "可能出现胃部不适...",
    ...
  }
}
```

### 示例3：获取智能用药建议

```bash
POST /api/medication/advice
Content-Type: application/json

{
  "userId": "user123",
  "symptoms": "头痛、失眠",
  "chronicDiseases": "高血压、糖尿病",
  "currentMedications": "降压灵、阿司匹林"
}
```

**响应：**
```json
{
  "success": true,
  "message": "获取智能用药建议成功",
  "data": {
    "advice": "根据您的症状和健康状况，建议...",
    "generatedAt": "2025-12-19T10:00:00Z"
  }
}
```

## 数据库架构

### Medication Schema (MongoDB)

```javascript
{
  userId: ObjectId,              // 用户ID
  medicationName: String,        // 药物名称
  dosage: String,                // 用药量
  frequency: String,             // 用药频次
  startTime: Date,               // 开始时间
  endTime: Date,                 // 结束时间
  instructions: String,          // 使用说明
  sideEffects: String,           // 副作用
  isActive: Boolean,             // 是否激活
  reminderTimes: [String],       // 提醒时间列表
  createdAt: Date,               // 创建时间
  updatedAt: Date                // 更新时间
}
```

### DrugInfo Schema (MongoDB)

```javascript
{
  drugName: String,              // 药物名称（唯一）
  description: String,           // 药物描述
  indications: String,           // 主治功效
  dosageInfo: String,            // 用法用量
  sideEffects: String,           // 副作用
  contraindications: String,     // 禁忌症
  interactions: String,          // 药物相互作用
  storageConditions: String,     // 储存条件
  manufacturer: String,          // 生产厂家
  category: String,              // 药物类别
  activeIngredient: String,      // 活性成分
  createdAt: Date,               // 创建时间
  updatedAt: Date                // 更新时间
}
```

## 前端导航

在侧边栏中，用药模块的导航项包括：

- **用药提醒** - 管理用药计划和提醒
- **药物信息** - 查询药物详细信息
- **智能建议** - 获取AI生成的用药建议

## 常见问题

### Q: DeepSeek API调用失败
A: 检查`.env`文件中的`DEEPSEEK_API_KEY`是否正确配置，确保API密钥有效。

### Q: MongoDB连接错误
A: 确保MongoDB服务已启动。如果MongoDB未运行，可以：
1. 安装MongoDB本地版本，或
2. 使用MongoDB Atlas云服务（修改MONGODB_URI）

### Q: 数据库初始化脚本失败
A: 确保：
1. MongoDB服务运行正常
2. `.env`文件中的MONGODB_URI配置正确
3. 运行脚本时在server目录中

## 未来改进方向

- [ ] 集成推送通知提醒用药时间
- [ ] 支持语音识别输入症状
- [ ] 药物相互作用自动检查
- [ ] 用药依从性统计分析
- [ ] 与医生的远程咨询功能
- [ ] 多语言支持

## 许可证

MIT License

## 支持

如有任何问题或建议，请联系开发团队。
