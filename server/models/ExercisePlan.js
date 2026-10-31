const mongoose = require('mongoose');

// 运动计划 MongoDB Schema
const ExercisePlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planDate: {
    type: Date,
    required: true
  },
  activityType: {
    type: String,
    enum: ['散步', '跑步', '游泳', '骑行', '太极拳', '瑜伽', '健身', '其他'],
    required: true
  },
  duration: {
    type: Number, // 分钟
    required: true,
    min: 1
  },
  distance: {
    type: Number, // 公里
    default: 0
  },
  caloriesBurned: {
    type: Number, // 消耗热量
    default: 0
  },
  intensity: {
    type: String,
    enum: ['低', '中', '高'],
    default: '中'
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新 updatedAt
ExercisePlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// 创建索引以提高查询性能
ExercisePlanSchema.index({ userId: 1, planDate: -1 });

module.exports = mongoose.model('ExercisePlan', ExercisePlanSchema);