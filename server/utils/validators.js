// 数据验证器

// 验证用户数据
const validateUser = (userData) => {
  const errors = [];
  
  if (!userData.username || userData.username.trim().length === 0) {
    errors.push('用户名不能为空');
  }
  
  if (!userData.password || userData.password.length < 6) {
    errors.push('密码长度不能少于6位');
  }
  
  if (!userData.name || userData.name.trim().length === 0) {
    errors.push('姓名不能为空');
  }
  
  if (!userData.age || userData.age <= 0) {
    errors.push('年龄必须大于0');
  }
  
  return errors;
};

// 验证健康档案数据
const validateHealthProfile = (profileData) => {
  const errors = [];
  
  if (!profileData.userId) {
    errors.push('用户ID不能为空');
  }
  
  if (profileData.height && (profileData.height <= 0 || profileData.height > 300)) {
    errors.push('身高数据不合法');
  }
  
  if (profileData.weight && (profileData.weight <= 0 || profileData.weight > 500)) {
    errors.push('体重数据不合法');
  }
  
  return errors;
};

// 验证用药提醒数据
const validateMedication = (medicationData) => {
  const errors = [];
  
  if (!medicationData.userId) {
    errors.push('用户ID不能为空');
  }
  
  if (!medicationData.medicationName || medicationData.medicationName.trim().length === 0) {
    errors.push('药物名称不能为空');
  }
  
  if (!medicationData.dosage || medicationData.dosage.trim().length === 0) {
    errors.push('药物剂量不能为空');
  }
  
  return errors;
};

module.exports = {
  validateUser,
  validateHealthProfile,
  validateMedication
};