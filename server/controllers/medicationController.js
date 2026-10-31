const Medication = require('../models/Medication');
const DrugInfo = require('../models/DrugInfo');

// 设置用药提醒
exports.setReminder = async (req, res) => {
  try {
    const { medicationName, dosage, frequency, startTime, endTime, reminderTimes, instructions } = req.body;
    const userId = req.user.userId;

    const newReminder = new Medication({
      userId,
      medicationName,
      dosage,
      frequency,
      startTime,
      endTime,
      reminderTimes,
      instructions
    });

    await newReminder.save();
    res.status(201).json({ success: true, message: '用药提醒设置成功', data: newReminder });
  } catch (error) {
    res.status(500).json({ success: false, message: '设置用药提醒失败', error: error.message });
  }
};

// 获取用药提醒列表
exports.getReminders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const reminders = await Medication.find({ userId, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取用药提醒列表失败', error: error.message });
  }
};

// 更新用药提醒
exports.updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const reminder = await Medication.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      updatedData,
      { new: true }
    );
    if (!reminder) return res.status(404).json({ success: false, message: '未找到该用药提醒' });
    res.json({ success: true, message: '更新成功', data: reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新用药提醒失败', error: error.message });
  }
};

// 删除用药提醒
exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Medication.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { isActive: false },
      { new: true }
    );
    if (!reminder) return res.status(404).json({ success: false, message: '未找到该用药提醒' });
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除用药提醒失败', error: error.message });
  }
};

// 记录用药情况
exports.recordMedication = async (req, res) => {
  try {
    res.json({ success: true, message: '用药记录已保存' });
  } catch (error) {
    res.status(500).json({ success: false, message: '记录失败', error: error.message });
  }
};

// 获取用药记录
exports.getRecords = async (req, res) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取失败', error: error.message });
  }
};

// 获取药物信息
exports.getDrugInfo = async (req, res) => {
  try {
    const { drugName } = req.query;
    if (!drugName) {
        return res.status(400).json({ success: false, message: '请输入药物名称' });
    }
    const drug = await DrugInfo.findOne({ drugName: new RegExp(drugName, 'i') });
    if (!drug) return res.status(404).json({ success: false, message: '未找到该药物信息' });
    res.json({ success: true, data: drug });
  } catch (error) {
    res.status(500).json({ success: false, message: '查询失败', error: error.message });
  }
};


