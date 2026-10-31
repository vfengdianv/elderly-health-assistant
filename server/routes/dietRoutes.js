const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');
const { auth } = require('../middleware/auth');

// 所有饮食相关的 API 都需要认证
// 创建饮食计划
router.post('/plans', auth, dietController.createDietPlan);

// 获取饮食计划列表
router.get('/plans', auth, dietController.getDietPlans);

// 更新饮食计划
router.put('/plans/:id', auth, dietController.updateDietPlan);

// 删除饮食计划
router.delete('/plans/:id', auth, dietController.deleteDietPlan);

// 获取营养统计数据
router.get('/nutrition-stats', auth, dietController.getNutritionStats);

// 获取AI饮食建议
router.post('/advice', auth, dietController.getDietAdvice);

module.exports = router;