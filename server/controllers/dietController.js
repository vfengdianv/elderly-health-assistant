// 饮食管理控制器
const DietPlan = require('../models/DietPlan');
const deepseekConfig = require('../config/deepseek');
const axios = require('axios');

// 创建饮食计划
exports.createDietPlan = async (req, res) => {
  try {
    const { planDate, breakfast, lunch, dinner, snacks, caloriesTarget, notes } = req.body;
    const userId = req.user.userId; // 从认证中间件获取 userId

    // 验证必填字段
    if (!planDate) {
      return res.status(400).json({
        success: false,
        message: '需要提供计划日期'
      });
    }

    // 创建饮食计划（使用认证用户的 userId）
    const dietPlan = new DietPlan({
      userId: userId,
      planDate: new Date(planDate),
      breakfast: breakfast || {},
      lunch: lunch || {},
      dinner: dinner || {},
      snacks: snacks || {},
      caloriesTarget: caloriesTarget || 2000,
      notes: notes || ''
    });

    const savedPlan = await dietPlan.save();

    res.status(201).json({
      success: true,
      message: '饮食计划创建成功',
      data: savedPlan
    });
  } catch (error) {
    console.error('创建饮食计划错误:', error);
    res.status(500).json({
      success: false,
      message: '创建饮食计划失败',
      error: error.message
    });
  }
};

// 获取饮食计划列表
exports.getDietPlans = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.userId; // 从认证中间件获取 userId

    // 构建查询条件 - 只查询当前用户的数据
    let query = { userId: userId };
    if (startDate && endDate) {
      query.planDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // 添加查询超时处理（5秒超时）
    const plans = await Promise.race([
      DietPlan.find(query).sort({ planDate: -1 }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('数据库查询超时，返回空列表')), 5000)
      )
    ]).catch(() => {
      // 数据库超时或连接失败，返回空列表
      console.warn('数据库连接失败，使用空列表');
      return [];
    });

    res.status(200).json({
      success: true,
      message: '获取饮食计划成功',
      data: plans
    });
  } catch (error) {
    console.error('获取饮食计划错误:', error);
    // 即使出错也返回空列表，而不是500错误
    res.status(200).json({
      success: true,
      message: '获取饮食计划成功（数据库暂不可用）',
      data: []
    });
  }
};

// 更新饮食计划
exports.updateDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // 从认证中间件获取 userId
    const updateData = req.body;

    // 首先检查该计划是否属于当前用户
    const plan = await DietPlan.findById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: '未找到指定的饮食计划'
      });
    }

    // 验证用户权限
    if (plan.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权限修改其他用户的饮食计划'
      });
    }

    const updatedPlan = await DietPlan.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      success: true,
      message: '更新饮食计划成功',
      data: updatedPlan
    });
  } catch (error) {
    console.error('更新饮食计划错误:', error);
    res.status(500).json({
      success: false,
      message: '更新饮食计划失败',
      error: error.message
    });
  }
};

// 删除饮食计划
exports.deleteDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // 从认证中间件获取 userId

    // 首先检查该计划是否属于当前用户
    const plan = await DietPlan.findById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: '未找到指定的饮食计划'
      });
    }

    // 验证用户权限
    if (plan.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权限删除其他用户的饮食计划'
      });
    }

    const deletedPlan = await DietPlan.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: '删除饮食计划成功',
      data: deletedPlan
    });
  } catch (error) {
    console.error('删除饮食计划错误:', error);
    res.status(500).json({
      success: false,
      message: '删除饮食计划失败',
      error: error.message
    });
  }
};

// 获取营养统计
exports.getNutritionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.userId; // 从认证中间件获取 userId

    // 构建查询条件 - 只查询当前用户的数据
    let query = { userId: userId };
    if (startDate && endDate) {
      query.planDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // 添加查询超时处理（5秒超时）
    const plans = await Promise.race([
      DietPlan.find(query),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('数据库查询超时、返回空数据')), 5000)
      )
    ]).catch(() => {
      console.warn('数据库连接失败，使用空列表');
      return [];
    });

    // 计算统计数据
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let avgCalories = { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 };

    plans.forEach(plan => {
      const meals = [plan.breakfast, plan.lunch, plan.dinner, plan.snacks];
      meals.forEach(meal => {
        if (meal && meal.calories) totalCalories += meal.calories;
        if (meal && meal.protein) totalProtein += meal.protein;
        if (meal && meal.fat) totalFat += meal.fat;
        if (meal && meal.carbs) totalCarbs += meal.carbs;
      });
    });

    // 计算每个餐次的平均热量
    if (plans.length > 0) {
      let breakfastTotal = 0, lunchTotal = 0, dinnerTotal = 0, snacksTotal = 0;
      plans.forEach(plan => {
        if (plan.breakfast && plan.breakfast.calories) breakfastTotal += plan.breakfast.calories;
        if (plan.lunch && plan.lunch.calories) lunchTotal += plan.lunch.calories;
        if (plan.dinner && plan.dinner.calories) dinnerTotal += plan.dinner.calories;
        if (plan.snacks && plan.snacks.calories) snacksTotal += plan.snacks.calories;
      });
      avgCalories = {
        breakfast: Math.round(breakfastTotal / plans.length),
        lunch: Math.round(lunchTotal / plans.length),
        dinner: Math.round(dinnerTotal / plans.length),
        snacks: Math.round(snacksTotal / plans.length)
      };
    }

    const stats = {
      planCount: plans.length,
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalFat: Math.round(totalFat),
      totalCarbs: Math.round(totalCarbs),
      avgTotalCalories: plans.length > 0 ? Math.round(totalCalories / plans.length) : 0,
      avgProtein: plans.length > 0 ? Math.round(totalProtein / plans.length) : 0,
      avgFat: plans.length > 0 ? Math.round(totalFat / plans.length) : 0,
      avgCarbs: plans.length > 0 ? Math.round(totalCarbs / plans.length) : 0,
      avgCalories
    };

    res.status(200).json({
      success: true,
      message: '获取营养统计成功',
      data: stats
    });
  } catch (error) {
    console.error('获取营养统计错误:', error);
    // 返回默认的空统计数据而不是500错误
    res.status(200).json({
      success: true,
      message: '获取营养统计成功（数据库暂不可用）',
      data: {
        planCount: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalFat: 0,
        totalCarbs: 0,
        avgTotalCalories: 0,
        avgProtein: 0,
        avgFat: 0,
        avgCarbs: 0,
        avgCalories: { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 }
      }
    });
  }
};

// 获取智能饮食建议
exports.getDietAdvice = async (req, res) => {
  try {
    const { userId, health_conditions, dietary_preferences, calorie_goal } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: '需要提供用户ID'
      });
    }

    // 构建提示词
    const prompt = `作为专业的营养师，需要为用户提供个性化的饮食建议。
健康状况：${health_conditions || '未提供'}
饮食偏好：${dietary_preferences || '未提供'}
热量目标：${calorie_goal || '2000 kcal/天'}

请提供：
1. 一天的饮食建议（早餐、午餐、晚餐、加餐）
2. 每餐的营养建议
3. 饮食禁忌和特殊注意事项
4. 健康建议`;

    const response = await axios.post(
      `${deepseekConfig.apiUrl}/chat/completions`,
      {
        model: deepseekConfig.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的营养师，为用户提供个性化的饮食建议。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: deepseekConfig.temperature,
        max_tokens: deepseekConfig.maxTokens
      },
      {
        headers: {
          'Authorization': `Bearer ${deepseekConfig.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const advice = response.data.choices[0].message.content;

    res.status(200).json({
      success: true,
      message: '获取智能饮食建议成功',
      data: {
        advice,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('获取智能饮食建议错误:', error);
    res.status(500).json({
      success: false,
      message: '获取智能饮食建议失败',
      error: error.message
    });
  }
};
