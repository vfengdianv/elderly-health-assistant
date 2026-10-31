const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { auth } = require('../middleware/auth');

// 所有运动相关的 API 都需要认证
// 运动计划 CRUD
router.post('/plans', auth, exerciseController.createPlan);
router.get('/plans', auth, exerciseController.getPlans);
router.put('/plans/:id', auth, exerciseController.updatePlan);
router.delete('/plans/:id', auth, exerciseController.deletePlan);

// 运动统计
router.get('/stats', auth, exerciseController.getExerciseStats);

module.exports = router;