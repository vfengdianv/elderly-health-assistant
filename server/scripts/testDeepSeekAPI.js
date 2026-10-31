// 测试 DeepSeek API 连接
const axios = require('axios');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

async function testDeepSeekAPI() {
  console.log('测试 DeepSeek API 连接...\n');
  console.log('API URL:', DEEPSEEK_API_URL);
  console.log('API Key:', DEEPSEEK_API_KEY.substring(0, 10) + '...\n');

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: '你好' }
        ],
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ API 调用成功！');
    console.log('响应状态:', response.status);
    console.log('AI 回复:', response.data.choices[0].message.content);
    console.log('\n配置正确，可以正常使用！');
  } catch (error) {
    console.error('❌ API 调用失败！\n');
    
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误信息:', error.response.statusText);
      console.error('错误详情:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 404) {
        console.error('\n可能的原因：');
        console.error('1. API 端点地址错误');
        console.error('2. DeepSeek API 地址已更新');
        console.error('\n建议：检查 DeepSeek 官方文档获取最新 API 地址');
      } else if (error.response.status === 401 || error.response.status === 403) {
        console.error('\n可能的原因：');
        console.error('1. API 密钥无效或已过期');
        console.error('2. API 密钥权限不足');
        console.error('\n建议：检查 DeepSeek 控制台获取新的 API 密钥');
      }
    } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      console.error('连接超时');
      console.error('\n可能的原因：');
      console.error('1. 网络连接问题');
      console.error('2. 防火墙阻止连接');
    } else {
      console.error('错误:', error.message);
    }
  }
}

testDeepSeekAPI();
