// 测试多个可能的 DeepSeek API 端点
const axios = require('axios');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key';

const endpoints = [
  'https://api.deepseek.com/chat/completions',
  'https://api.deepseek.com/v1/chat/completions',
  'https://api.deepseek.com/completions',
  'https://api.deepseek.com/v1/completions'
];

async function testEndpoint(url) {
  console.log(`\n测试端点: ${url}`);
  console.log('='.repeat(60));
  
  try {
    const response = await axios.post(
      url,
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

    console.log('✅ 成功！');
    console.log('响应状态:', response.status);
    console.log('AI 回复:', response.data.choices[0].message.content);
    return true;
  } catch (error) {
    console.log('❌ 失败');
    if (error.response) {
      console.log('状态码:', error.response.status);
      console.log('错误信息:', error.response.statusText);
      console.log('错误数据:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('错误:', error.message);
      console.log('错误代码:', error.code);
    }
    return false;
  }
}

async function testAll() {
  console.log('开始测试所有可能的 API 端点...\n');
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    if (success) {
      console.log(`\n🎉 找到可用的端点: ${endpoint}`);
      break;
    }
  }
  
  console.log('\n测试完成！');
}

testAll();
