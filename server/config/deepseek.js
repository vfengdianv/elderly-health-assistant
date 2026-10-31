// DeepSeek API配置

const deepseekConfig = {
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1',
  model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  temperature: process.env.DEEPSEEK_TEMPERATURE || 0.7,
  maxTokens: process.env.DEEPSEEK_MAX_TOKENS || 1000
};

module.exports = deepseekConfig;