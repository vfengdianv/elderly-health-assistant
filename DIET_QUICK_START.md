# 饮食智能模块 - 快速开始指南

**模块**: 饮食智能管理 v1.0.0  
**日期**: 2025年12月19日

---

## 🚀 一键启动

```bash
# 进入项目根目录
cd elderly-health-assistant

# 启动应用（自动启动前后端）
node quick-start.js
```

访问前端应用: **http://localhost:3000**

---

## 📱 使用流程

### 步骤1: 进入饮食管理页面
1. 打开浏览器访问 http://localhost:3000
2. 在左侧菜单点击 **"饮食管理"**

### 步骤2: 创建饮食计划
1. 点击 **"新增计划"** 按钮
2. 填写表单：
   - 选择计划日期
   - 输入四餐详细营养数据：
     - **早餐**: 描述、热量、蛋白质、脂肪、碳水
     - **午餐**: 同上
     - **晚餐**: 同上
     - **加餐**: 同上
   - 设置热量目标（默认2000 kcal）
   - 添加备注（可选）
3. 点击 **"确定"** 提交

### 步骤3: 查看营养统计
1. 在 **"饮食计划管理"** 标签页查看所有计划
2. 点击 **"营养统计"** 标签页查看：
   - 平均日热量
   - 平均蛋白质、脂肪、碳水
   - 统计数据实时更新

### 步骤4: 追踪营养摄入
1. 点击页面下方的 **"营养追踪"** 部分
2. 查看：
   - **最近计划**: 最新饮食计划的详情
   - **热量趋势图**: 最近7天的热量变化
   - **餐次分布**: 各餐次热量占比饼图
   - **热量进度**: 达成目标的进度条

### 步骤5: 获取AI建议
1. 点击 **"获取AI建议"** 按钮
2. 系统调用DeepSeek AI生成个性化建议
3. 建议显示在页面下方的 **"AI饮食建议"** 卡片中

---

## 🔌 API 接口速查表

### 创建饮食计划
```bash
POST /api/diet/plans
Content-Type: application/json

{
  "planDate": "2025-12-19",
  "breakfast": {
    "description": "牛奶加麦片",
    "calories": 300,
    "protein": 10,
    "fat": 8,
    "carbs": 45
  },
  "lunch": {...},
  "dinner": {...},
  "snacks": {...},
  "caloriesTarget": 2000,
  "notes": "清淡饮食"
}
```

**响应成功 (201)**:
```json
{
  "success": true,
  "message": "饮食计划创建成功",
  "data": {
    "_id": "67630f1c9c8e6d4b8c2e5a10",
    "userId": "default-user",
    "planDate": "2025-12-19T00:00:00.000Z",
    "breakfast": {...},
    "createdAt": "2025-12-19T11:30:45.123Z"
  }
}
```

### 获取计划列表
```bash
GET /api/diet/plans
# 可选参数: ?startDate=2025-12-01&endDate=2025-12-31
```

**响应成功 (200)**:
```json
{
  "success": true,
  "message": "获取饮食计划成功",
  "data": [
    {
      "_id": "67630f1c9c8e6d4b8c2e5a10",
      "userId": "default-user",
      "planDate": "2025-12-19T00:00:00.000Z",
      "breakfast": {...},
      "lunch": {...},
      "dinner": {...},
      "snacks": {...},
      "caloriesTarget": 2000,
      "notes": "清淡饮食",
      "createdAt": "2025-12-19T11:30:45.123Z",
      "updatedAt": "2025-12-19T11:30:45.123Z"
    }
  ]
}
```

### 更新计划
```bash
PUT /api/diet/plans/{planId}
Content-Type: application/json

{
  "lunch": {
    "description": "米饭加红烧肉",
    "calories": 350,
    "protein": 20,
    "fat": 15,
    "carbs": 40
  }
}
```

### 删除计划
```bash
DELETE /api/diet/plans/{planId}
```

### 获取营养统计
```bash
GET /api/diet/nutrition-stats
# 可选参数: ?startDate=2025-12-01&endDate=2025-12-31
```

**响应成功 (200)**:
```json
{
  "success": true,
  "message": "获取营养统计成功",
  "data": {
    "planCount": 5,
    "totalCalories": 10000,
    "totalProtein": 250,
    "totalFat": 150,
    "totalCarbs": 1250,
    "avgTotalCalories": 2000,
    "avgProtein": 50,
    "avgFat": 30,
    "avgCarbs": 250,
    "avgCalories": {
      "breakfast": 300,
      "lunch": 600,
      "dinner": 700,
      "snacks": 400
    }
  }
}
```

### 获取AI建议
```bash
POST /api/diet/advice
Content-Type: application/json

{
  "recentStats": {
    "avgTotalCalories": 2000,
    "avgProtein": 50,
    "avgFat": 30,
    "avgCarbs": 250
  },
  "userGoals": ""
}
```

**响应成功 (200)**:
```json
{
  "success": true,
  "message": "获取AI建议成功",
  "data": "您的营养摄入基本均衡。建议增加绿色蔬菜的摄入，以提高膳食纤维含量..."
}
```

---

## 📂 核心文件位置

| 文件/目录 | 说明 |
|---------|------|
| `server/models/DietPlan.js` | 数据模型（MongoDB Schema） |
| `server/controllers/dietController.js` | 业务逻辑（6个核心函数） |
| `server/routes/dietRoutes.js` | API 路由配置 |
| `client/src/components/diet/DietPlan.js` | 计划管理组件 |
| `client/src/components/diet/NutritionTracker.js` | 追踪统计组件 |
| `client/src/App.js` | 主应用（路由集成） |
| `client/src/components/common/Sidebar.js` | 导航菜单 |

---

## ⚙️ 环境配置

### 前端依赖
```json
{
  "axios": "^1.6.0",        // HTTP 客户端
  "dayjs": "^1.11.10",      // 日期处理
  "antd": "^5.10.0",        // UI 组件库
  "recharts": "^2.10.0",    // 图表库
  "react": "^18.2.0"        // React 框架
}
```

### 后端依赖
```json
{
  "express": "^4.18.2",     // Web 框架
  "mongodb": "^5.8.1",      // MongoDB 驱动
  "mongoose": "^7.5.0",     // ODM
  "axios": "^1.6.0",        // HTTP 客户端
  "cors": "^2.8.5"          // CORS 中间件
}
```

---

## 🔧 常见问题解决

### 问题1: 提交计划时 400 错误
**原因**: 可能是因为没有提供必需的日期字段  
**解决**: 确保在表单中选择了计划日期

### 问题2: AI 建议无法获取
**原因**: 可能是 DeepSeek API 未配置或网络问题  
**解决**: 
1. 检查 `server/.env` 中是否配置了 `DEEPSEEK_API_KEY`
2. 确保网络连接正常
3. 检查后端控制台是否有错误日志

### 问题3: 图表无法显示
**原因**: Recharts 库未安装或数据为空  
**解决**:
1. 运行 `npm install recharts --legacy-peer-deps`
2. 确保已创建至少一个饮食计划
3. 刷新浏览器页面

### 问题4: 数据无法保存到数据库
**原因**: MongoDB 未配置或应用配置使用默认用户  
**解决**:
1. 目前应用支持无数据库运行（使用内存存储）
2. 配置 MongoDB 后修改 `server/.env` 中的 `MONGODB_URI`
3. 重新启动应用

---

## 📊 数据模型详解

### DietPlan Schema

```javascript
{
  userId: String,                    // 用户ID (默认: 'default-user')
  planDate: Date,                    // 计划日期 ⭐ 必需
  
  breakfast: {
    description: String,             // 食物描述
    calories: Number,                // 热量 (kcal)
    protein: Number,                 // 蛋白质 (g)
    fat: Number,                     // 脂肪 (g)
    carbs: Number                    // 碳水化合物 (g)
  },
  
  lunch: {...},                      // 午餐 (同 breakfast)
  dinner: {...},                     // 晚餐 (同 breakfast)
  snacks: {...},                     // 加餐 (同 breakfast)
  
  caloriesTarget: Number,            // 目标热量 (默认: 2000)
  notes: String,                     // 备注信息
  
  createdAt: Date,                   // 创建时间 (自动)
  updatedAt: Date                    // 更新时间 (自动)
}
```

---

## 🎯 功能对应 API 映射

| 前端操作 | HTTP 方法 | API 端点 | 后端函数 |
|---------|---------|--------|---------|
| 新增计划 | POST | `/api/diet/plans` | `createDietPlan()` |
| 查看计划列表 | GET | `/api/diet/plans` | `getDietPlans()` |
| 编辑计划 | PUT | `/api/diet/plans/:id` | `updateDietPlan()` |
| 删除计划 | DELETE | `/api/diet/plans/:id` | `deleteDietPlan()` |
| 查看统计 | GET | `/api/diet/nutrition-stats` | `getNutritionStats()` |
| 获取AI建议 | POST | `/api/diet/advice` | `getDietAdvice()` |

---

## 💡 性能优化建议

1. **减少 API 调用**: 在列表获取时同时获取统计数据，而不是分别调用
2. **缓存统计数据**: 使用浏览器 localStorage 缓存统计数据，减少后端压力
3. **分页查询**: 计划列表使用分页，而不是一次性加载所有数据
4. **图表数据截取**: 只展示最近 7-30 天的数据，而不是全部历史数据
5. **防止重复提交**: 表单提交时禁用提交按钮，防止双击导致重复提交

---

## 🚀 下一步行动

### 短期（本周）
- [ ] 在浏览器中测试所有功能
- [ ] 创建 5-10 个示例饮食计划
- [ ] 验证 AI 建议生成功能
- [ ] 检查图表显示效果

### 中期（下周）
- [ ] 实现用户认证系统
- [ ] 配置 MongoDB 数据库
- [ ] 添加数据验证和错误处理
- [ ] 优化 UI 和交互体验

### 长期（2周后）
- [ ] 实现食材库功能
- [ ] 添加营养配方推荐
- [ ] 实现用药提醒推送
- [ ] 开发移动端适配

---

**快速参考版本**: 1.0.0  
**最后更新**: 2025年12月19日  
**维护者**: AI Assistant
