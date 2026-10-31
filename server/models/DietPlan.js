// 饮食计划模型
const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planDate: {
    type: Date,
    required: true
  },
  breakfast: {
    description: String,
    calories: Number,
    protein: Number,
    fat: Number,
    carbs: Number
  },
  lunch: {
    description: String,
    calories: Number,
    protein: Number,
    fat: Number,
    carbs: Number
  },
  dinner: {
    description: String,
    calories: Number,
    protein: Number,
    fat: Number,
    carbs: Number
  },
  snacks: {
    description: String,
    calories: Number,
    protein: Number,
    fat: Number,
    carbs: Number
  },
  caloriesTarget: {
    type: Number,
    default: 2000
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

dietPlanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

module.exports = DietPlan;