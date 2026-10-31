const ExercisePlan = require('../models/ExercisePlan');
const { callDeepSeekAPI } = require('../config/deepseek');

// 创建运动计划
exports.createPlan = async (req, res) => {
  try {
    const { planDate, activityType, duration, distance, intensity, notes } = req.body;
    const userId = req.user.userId;
    
    console.log('正在创建运动计划:', { 
      userId, 
      userIdType: typeof userId,
      planDate, 
      activityType, 
      duration 
    });

    // 验证必需字段
    if (!planDate || !activityType || !duration) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数: planDate, activityType, duration',
        error_code: 'MISSING_REQUIRED_FIELDS'
      });
    }
    
    // 确保日期格式正确
    const dateObj = new Date(planDate);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: '日期格式不正确',
        error_code: 'INVALID_DATE'
      });
    }

    // 根据强度计算消耗的热量
    const intensityMap = { '低': 4, '中': 6, '高': 8 };
    const dur = parseInt(duration);
    const caloriesBurned = Math.round(dur * (intensityMap[intensity] || 6));
    
    const plan = new ExercisePlan({
      userId,
      planDate: dateObj,
      activityType,
      duration: dur,
      distance: distance ? parseFloat(distance) : 0,
      intensity: intensity || '中',
      caloriesBurned,
      notes: notes || ''
    });
    
    const savedPlan = await plan.save();
    console.log('运动计划创建成功:', savedPlan._id);
    
    res.status(201).json({
      success: true,
      message: '运动计划创建成功',
      data: savedPlan
    });
  } catch (error) {
    console.error('创建运动计划错误详情:', error);
    res.status(500).json({
      success: false,
      message: '创建运动计划失败: ' + error.message,
      error_code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// 获取运动计划列表
exports.getPlans = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.userId;
    const dbStatus = ExercisePlan.db.readyState;
    
    let query = { userId: userId };
    if (startDate && endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.planDate = {
        $gte: new Date(startDate),
        $lte: end
      };
    }

    console.log('正在获取运动计划:', { 
      userId, 
      userIdType: typeof userId,
      dbState: dbStatus === 1 ? '已连接' : '未连接(' + dbStatus + ')',
      query 
    });
    
    // 执行查询，增加超时保护
    const plans = await ExercisePlan.find(query).sort({ planDate: -1 }).maxTimeMS(5000);
    
    // 同时查询数据库中所有该 collection 的记录以排查
    const allPlans = await ExercisePlan.find({}).limit(5);
    console.log(`数据库中共有 ${allPlans.length} 条运动计划（样本）`);
    if (allPlans.length > 0) {
      console.log('样本记录的 userId 类型和值:', {
        sampleUserId: allPlans[0].userId,
        sampleUserIdType: typeof allPlans[0].userId,
        isObjectId: allPlans[0].userId.constructor.name
      });
    }
    
    console.log(`用户 ${userId} 的查询结果: ${plans.length} 条计划`);
    
    res.status(200).json({
      success: true,
      message: '获取运动计划成功',
      data: plans
    });
  } catch (error) {
    console.error('获取运动计划错误详情:', error);
    res.status(500).json({
      success: false,
      message: '获取运动计划失败: ' + error.message,
      error_code: 'GET_PLANS_ERROR'
    });
  }
};

// 更新运动计划
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { activityType, duration, distance, intensity, completed, notes } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '缺少计划 ID',
        error_code: 'MISSING_PLAN_ID'
      });
    }
    
    // 首先检查该计划是否属于当前用户
    const plan = await ExercisePlan.findById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: '运动计划不存在',
        error_code: 'PLAN_NOT_FOUND'
      });
    }

    // 验证用户权限
    if (plan.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权限修改其他用户的运动计划',
        error_code: 'PERMISSION_DENIED'
      });
    }
    
    // 重新计算热量
    const intensityMap = { '低': 4, '中': 6, '高': 8 };
    const updatedData = {
      activityType,
      duration: duration ? parseInt(duration) : undefined,
      distance: distance ? parseFloat(distance) : undefined,
      intensity,
      completed: completed !== undefined ? completed : undefined,
      notes
    };
    
    // 去除 undefined 值
    Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);
    
    // 如果更新了 duration 或 intensity，重新计算热量
    if (updatedData.duration || updatedData.intensity) {
      const d = updatedData.duration || plan.duration;
      const i = updatedData.intensity || plan.intensity;
      updatedData.caloriesBurned = Math.round(d * (intensityMap[i] || 6));
    }
    
    const updatedPlan = await ExercisePlan.findByIdAndUpdate(id, updatedData, { new: true });
    
    res.status(200).json({
      success: true,
      message: '运动计划更新成功',
      data: updatedPlan
    });
  } catch (error) {
    console.error('更新运动计划错误:', error);
    res.status(500).json({
      success: false,
      message: '更新运动计划失败: ' + error.message,
      error_code: 'UPDATE_PLAN_ERROR'
    });
  }
};

// 删除运动计划
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '缺少计划 ID',
        error_code: 'MISSING_PLAN_ID'
      });
    }
    
    const plan = await ExercisePlan.findById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: '运动计划不存在',
        error_code: 'PLAN_NOT_FOUND'
      });
    }

    if (plan.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权限删除其他用户的运动计划',
        error_code: 'PERMISSION_DENIED'
      });
    }
    
    await ExercisePlan.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: '运动计划删除成功'
    });
  } catch (error) {
    console.error('删除运动计划错误:', error);
    res.status(500).json({
      success: false,
      message: '删除运动计划失败: ' + error.message,
      error_code: 'DELETE_PLAN_ERROR'
    });
  }
};

// 获取运动统计
exports.getExerciseStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.userId; // 从认证中间件获取 userId
    
    let query = { userId: userId };
    if (startDate && endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.planDate = {
        $gte: new Date(startDate),
        $lte: end
      };
    }
    
    // 使用 Promise.race() 实现 5 秒超时防护
    const plans = await Promise.race([
      ExercisePlan.find(query),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('数据库查询超时')), 5000)
      )
    ]).catch(() => {
      console.warn('数据库连接失败，返回空统计');
      return [];
    });
    
    // 计算统计数据
    const totalPlans = plans.length;
    const completedPlans = plans.filter(p => p.completed).length;
    const totalCalories = plans.reduce((sum, p) => sum + (p.caloriesBurned || 0), 0);
    const totalDuration = plans.reduce((sum, p) => sum + (p.duration || 0), 0);
    const totalDistance = plans.reduce((sum, p) => sum + (p.distance || 0), 0);
    
    // 按活动类型统计
    const activityStats = {};
    plans.forEach(plan => {
      if (!activityStats[plan.activityType]) {
        activityStats[plan.activityType] = { count: 0, calories: 0, duration: 0 };
      }
      activityStats[plan.activityType].count += 1;
      activityStats[plan.activityType].calories += plan.caloriesBurned || 0;
      activityStats[plan.activityType].duration += plan.duration || 0;
    });
    
    const stats = {
      totalPlans,
      completedPlans,
      completionRate: totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0,
      totalCalories: Math.round(totalCalories),
      totalDuration,
      totalDistance: Math.round(totalDistance * 10) / 10,
      avgCalories: totalPlans > 0 ? Math.round(totalCalories / totalPlans) : 0,
      avgDuration: totalPlans > 0 ? Math.round(totalDuration / totalPlans) : 0,
      activityStats
    };
    
    res.status(200).json({
      success: true,
      message: '获取运动统计成功',
      data: stats
    });
  } catch (error) {
    console.error('获取运动统计错误:', error);
    res.status(200).json({
      success: true,
      message: '获取运动统计成功（数据库暂不可用）',
      data: {
        totalPlans: 0,
        completedPlans: 0,
        completionRate: 0,
        totalCalories: 0,
        totalDuration: 0,
        totalDistance: 0,
        avgCalories: 0,
        avgDuration: 0,
        activityStats: {}
      }
    });
  }
};

