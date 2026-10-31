// 数据库初始化脚本 - 添加示例药物信息
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DrugInfo = require('../models/DrugInfo');

// 示例药物数据
const drugDataList = [
  {
    drugName: '阿司匹林',
    category: '抗血栓药',
    activeIngredient: '乙酰水杨酸',
    description: '阿司匹林是一种常见的解热镇痛药，也用于预防血栓形成。',
    indications: '用于缓解轻度至中度疼痛，如头痛、牙痛、肌肉痛；预防心肌梗塞和卒中。',
    dosageInfo: '一般为300-500mg，每日3-4次，饭后服用。',
    sideEffects: '可能出现胃部不适、消化不良、皮疹等。',
    contraindications: '对乙酰水杨酸过敏、消化性溃疡患者禁用。',
    interactions: '与其他抗凝血药物同时使用可能增加出血风险。',
    storageConditions: '密封保存，避免高温和潮湿环境。',
    manufacturer: '多个品牌生产'
  },
  {
    drugName: '降压灵',
    category: '降压药',
    activeIngredient: '各种降压成分',
    description: '降压灵是一种中成药，用于降低血压。',
    indications: '用于治疗高血压。',
    dosageInfo: '一般为1-2粒，每日2-3次，饭后服用。',
    sideEffects: '可能出现头晕、疲劳等。',
    contraindications: '对其成分过敏者禁用。',
    interactions: '与其他降压药同时使用需遵医嘱。',
    storageConditions: '密封保存，避免高温和潮湿环境。',
    manufacturer: '中医药品生产企业'
  },
  {
    drugName: '复合维生素B',
    category: '维生素类',
    activeIngredient: '维生素B1、B2、B6、B12等',
    description: '复合维生素B是一种补充B族维生素的营养补充剂。',
    indications: '用于补充B族维生素，改善疲劳、增进食欲。',
    dosageInfo: '一般为1-2片，每日1次，饭后服用。',
    sideEffects: '较少，可能出现轻微皮肤过敏。',
    contraindications: '对B族维生素过敏者禁用。',
    interactions: '与其他维生素补充剂同时使用需咨询医生。',
    storageConditions: '密封保存，避免高温和潮湿环境。',
    manufacturer: '多个品牌生产'
  },
  {
    drugName: '钙补充剂',
    category: '矿物质类',
    activeIngredient: '钙',
    description: '钙补充剂用于预防和治疗钙缺乏症。',
    indications: '用于补充钙，预防骨质疏松症。',
    dosageInfo: '一般为500-1000mg，每日1-2次，饭后服用。',
    sideEffects: '可能出现便秘、胃部不适。',
    contraindications: '对钙过敏者禁用。',
    interactions: '与某些药物可能影响吸收，需咨询医生。',
    storageConditions: '密封保存，避免高温和潮湿环境。',
    manufacturer: '多个品牌生产'
  },
  {
    drugName: '人参',
    category: '滋补品',
    activeIngredient: '人参皂苷等有效成分',
    description: '人参是一种传统的滋补品，用于增强体质。',
    indications: '用于缓解疲劳、增强免疫力、改善睡眠。',
    dosageInfo: '一般为3-6克，每日1-2次，用热水浸泡或煎服。',
    sideEffects: '敏感体质可能出现兴奋、失眠。',
    contraindications: '高血压患者应谨慎使用，对人参过敏者禁用。',
    interactions: '避免与某些药物同时使用。',
    storageConditions: '阴凉干燥处保存。',
    manufacturer: '天然采集或种植'
  }
];

// 连接MongoDB并添加数据
async function seedDatabase() {
  try {
    // 连接MongoDB
    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/elderly_health_assistant';
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB连接成功');

    // 清空现有数据
    await DrugInfo.deleteMany({});
    console.log('已清空现有药物数据');

    // 插入示例数据
    const result = await DrugInfo.insertMany(drugDataList);
    console.log(`成功添加 ${result.length} 条药物信息`);

    // 显示已添加的数据
    const allDrugs = await DrugInfo.find({});
    console.log('\n已添加的药物列表:');
    allDrugs.forEach((drug, index) => {
      console.log(`${index + 1}. ${drug.drugName}`);
    });

    // 断开连接
    await mongoose.disconnect();
    console.log('\nMongoDB连接已断开');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

// 执行初始化
seedDatabase();
