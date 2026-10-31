const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { auth } = require('../middleware/auth');

// AI 助手新接口
router.post('/ask', auth, aiController.askQuestion);                    // 提问
router.get('/conversations', auth, aiController.getConversations);      // 获取对话列表
router.get('/conversations/:id', auth, aiController.getConversation);   // 获取单个对话
router.delete('/conversations/:id', auth, aiController.deleteConversation); // 删除对话

// 旧接口（保持兼容）
router.post('/chat', aiController.chat);                                // 智能问答
router.post('/speech-to-text', aiController.speechToText);             // 语音识别
router.post('/pose-analysis', aiController.poseAnalysis);              // 运动姿势分析

module.exports = router;