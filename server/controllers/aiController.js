// AI智能助手控制器
const axios = require('axios');
const Conversation = require('../models/Conversation');

// DeepSeek API 配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

// 本地备用回复函数（当 DeepSeek API 不可用时）
function generateLocalResponse(question) {
  const q = question.toLowerCase();
  
  // 关键词匹配
  if (q.includes('高血压') || q.includes('血压')) {
    return '关于高血压的建议：\n\n1. 饮食方面：减少食盐摄入，多吃新鲜蔬菜水果\n2. 运动方面：每天适度散步30分钟\n3. 用药方面：请严格遵医嘱服药，定期监测血压\n\n⚠️ 建议您咨询专业医生获取个性化方案。';
  }
  
  if (q.includes('糖尿病') || q.includes('血糖')) {
    return '关于糖尿病的建议：\n\n1. 饮食控制：选择低升糖指数食物，控制碗水化合物摄入\n2. 适度运动：每周运动5次，每次30分钟\n3. 监测血糖：定期检测空腹和餐后血糖\n\n⚠️ 请在医生指导下管理糖尿病。';
  }
  
  if (q.includes('运动') || q.includes('锻炼')) {
    return '适合老年人的运动建议：\n\n1. 散步：每天散步30-45分钟，有助于心血管健康\n2. 太极拳：提高平衡能力，缓解关节疼痛\n3. 游泳：低冲击性运动，适合关节不好的老人\n\n⚠️ 运动前请咨询医生，根据自身情况调整。';
  }
  
  if (q.includes('饮食') || q.includes('吃') || q.includes('营养')) {
    return '老年人饮食建议：\n\n1. 均衡饮食：每天摄入多种蔬菜水果\n2. 优质蛋白：鱼、肉、蛋、豆类轮流吃\n3. 补充钟质：多吃乳制品，预防骨质疏松\n4. 多喝水：每天饮水1500-2000ml\n\n⚠️ 具体饮食计划请咨询营养师。';
  }
  
  if (q.includes('用药') || q.includes('药物')) {
    return '用药安全建议：\n\n1. 遵医嘱：严格按照医生开具的剂量和时间服药\n2. 不自行停药：即使症状好转也不可擅自停药\n3. 注意互相作用：告知医生所有在服药物\n4. 定期复识：及时反馈用药效果和不良反应\n\n⚠️ 如有不适请立即就医。';
  }
  
  // 默认回复
  return `您好！我是您的健康助手。

关于您的问题“${question}”，我建议：

1. 咨询专业医生获取个性化建议
2. 保持良好的生活习惯（规律作息、均衡饮食、适度运动）
3. 定期体检，关注身体变化

⚠️ 此建议仅供参考，具体问题请咨询专业医疗人员。

（注：AI 服务暂时不可用，以上为本地备用回复）`;
}

// 系统提示词 - 针对老年人健康助手定制
const SYSTEM_PROMPT = `你是一位专业的老年人健康助手，具备以下特点：

1. **专业知识**：精通用药管理、营养饮食、运动健康等领域
2. **沟通风格**：温和、耐心、易懂，使用简单明了的语言
3. **安全第一**：涉及疾病诊断和用药时，必须建议咨询专业医生
4. **实用建议**：提供具体可操作的健康建议

你的任务：
- 回答老年人关于健康、用药、饮食、运动的问题
- 提供安全、实用的健康建议
- 对于严重健康问题，建议就医
- 保持友好、鼓励的态度

回答要求：
- 简洁明了，避免专业术语
- 分点列出建议时使用序号
- 涉及用药必须强调遵医嘱
- 200字以内为佳`;

// AI 问答接口
exports.askQuestion = async (req, res) => {
  try {
    const { question, conversationId } = req.body;
    const userId = req.user.userId;

    if (!question || !question.trim()) {
      return res.status(400).json({ 
        success: false,
        message: '问题不能为空', 
        error_code: 'MISSING_QUESTION' 
      });
    }

    // 查找或创建对话
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: '对话不存在',
          error_code: 'CONVERSATION_NOT_FOUND'
        });
      }
    } else {
      // 创建新对话
      conversation = new Conversation({
        userId,
        title: question.substring(0, 30) + (question.length > 30 ? '...' : ''),
        messages: []
      });
    }

    // 添加用户消息
    conversation.messages.push({
      role: 'user',
      content: question,
      timestamp: new Date()
    });

    // 构建对话历史（最近10条）
    const recentMessages = conversation.messages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // 调用 DeepSeek API
    let aiAnswer;
    try {
      console.log('正在调用 DeepSeek API...');
      console.log('API URL:', DEEPSEEK_API_URL);
      console.log('API Key:', DEEPSEEK_API_KEY.substring(0, 15) + '...');
      console.log('请求数据:', JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT.substring(0, 50) + '...' },
          ...recentMessages
        ]
      }, null, 2));
      
      const deepseekResponse = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: DEEPSEEK_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...recentMessages
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30秒超时
        }
      );
      console.log('✅ API 调用成功！响应状态:', deepseekResponse.status);
      aiAnswer = deepseekResponse.data.choices[0].message.content;
    } catch (apiError) {
      // DeepSeek API 不可用时的降级处理
      console.warn('DeepSeek API 不可用，使用本地备用回复');
      console.error('API 错误详情:', {
        message: apiError.message,
        code: apiError.code,
        status: apiError.response?.status,
        data: apiError.response?.data
      });
      aiAnswer = generateLocalResponse(question);
    }

    // 添加 AI 回复
    conversation.messages.push({
      role: 'assistant',
      content: aiAnswer,
      timestamp: new Date()
    });

    // 保存对话
    await conversation.save();

    res.status(200).json({ 
      success: true,
      message: 'AI 回答成功',
      data: {
        conversationId: conversation._id,
        question: question,
        answer: aiAnswer,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('AI 问答错误:', error.message);
    console.error('API URL:', DEEPSEEK_API_URL);
    console.error('错误详情:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      code: error.code
    });
    
    // 处理不同类型的错误
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({ 
        success: false,
        message: 'AI 服务响应超时，请稍后重试', 
        error_code: 'AI_TIMEOUT' 
      });
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(500).json({
        success: false,
        message: 'AI 服务配置错误，请检查 API 密钥',
        error_code: 'AI_AUTH_ERROR'
      });
    }

    if (error.response?.status === 404) {
      return res.status(500).json({
        success: false,
        message: 'AI 服务端点不存在，请检查 API 地址配置',
        error_code: 'AI_ENDPOINT_ERROR'
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'AI 服务暂时不可用，请稍后重试', 
      error_code: 'INTERNAL_SERVER_ERROR' 
    });
  }
};

// 获取对话历史列表
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('title messages createdAt updatedAt')
      .lean();

    // 为每个对话添加消息数量和最后一条消息
    const conversationsWithInfo = conversations.map(conv => ({
      _id: conv._id,
      title: conv.title,
      messageCount: conv.messages.length,
      lastMessage: conv.messages[conv.messages.length - 1]?.content.substring(0, 50) + '...',
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt
    }));

    const total = await Conversation.countDocuments({ userId });

    res.status(200).json({
      success: true,
      message: '获取对话列表成功',
      data: {
        conversations: conversationsWithInfo,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('获取对话列表错误:', error);
    res.status(500).json({ 
      success: false,
      message: '获取对话列表失败', 
      error_code: 'INTERNAL_SERVER_ERROR' 
    });
  }
};

// 获取单个对话详情
exports.getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const conversation = await Conversation.findOne({ _id: id, userId });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: '对话不存在',
        error_code: 'CONVERSATION_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: '获取对话详情成功',
      data: conversation
    });

  } catch (error) {
    console.error('获取对话详情错误:', error);
    res.status(500).json({ 
      success: false,
      message: '获取对话详情失败', 
      error_code: 'INTERNAL_SERVER_ERROR' 
    });
  }
};

// 删除对话
exports.deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const conversation = await Conversation.findOne({ _id: id, userId });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: '对话不存在',
        error_code: 'CONVERSATION_NOT_FOUND'
      });
    }

    await Conversation.deleteOne({ _id: id, userId });

    res.status(200).json({
      success: true,
      message: '删除对话成功'
    });

  } catch (error) {
    console.error('删除对话错误:', error);
    res.status(500).json({ 
      success: false,
      message: '删除对话失败', 
      error_code: 'INTERNAL_SERVER_ERROR' 
    });
  }
};

// 旧的接口保持兼容

// 智能问答 (旧接口)
exports.chat = (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ 
        message: '缺少问题参数', 
        error_code: 'MISSING_QUESTION' 
      });
    }
    
    const simulatedResponse = `关于“${question}”的问题，建议您咨询专业的医疗人员获取最准确的信息。`;
    
    res.status(200).json({ 
      message: '问答成功', 
      data: {
        question: question,
        answer: simulatedResponse,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('智能问答错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误', 
      error_code: 'INTERNAL_SERVER_ERROR' 
    });
  }
};

// 语音识别
exports.speechToText = (req, res) => {
  try {
    res.status(200).json({ 
      message: '语音识别成功', 
      data: {
        text: '模拟识别的语音文本内容',
        confidence: 0.95,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('语音识别错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误', 
      error_code: 'INTERNAL_SERVER_ERROR' 
    });
  }
};

// 运动姿势分析
exports.poseAnalysis = (req, res) => {
  try {
    res.status(200).json({ 
      message: '姿势分析成功', 
      data: {
        feedback: '您的运动姿势基本正确，建议保持背部挺直，动作幅度可以适当加大。',
        score: 85,
        suggestions: [
          '保持背部挺直',
          '适当加大动作幅度',
          '注意呼吸节奏'
        ],
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('运动姿势分析错误:', error);
    res.status(500).json({ 
      message: '服务器内部错误', 
      error_code: 'INTERNAL_SERVER_ERROR' 
    });
  }
};