const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const { auth } = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

router.post('/reminders', medicationController.setReminder);
router.get('/reminders', medicationController.getReminders);
router.put('/reminders/:id', medicationController.updateReminder);
router.delete('/reminders/:id', medicationController.deleteReminder);

router.post('/records', medicationController.recordMedication);
router.get('/records', medicationController.getRecords);

router.get('/drug-info', medicationController.getDrugInfo);

module.exports = router;
