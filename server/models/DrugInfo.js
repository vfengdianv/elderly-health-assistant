const mongoose = require('mongoose');

const drugInfoSchema = new mongoose.Schema({
  drugName: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  indications: String,
  dosageInfo: String,
  sideEffects: String,
  contraindications: String,
  interactions: String,
  storageConditions: String,
  manufacturer: String,
  category: String,
  activeIngredient: String
}, {
  timestamps: true
});

module.exports = mongoose.model('DrugInfo', drugInfoSchema);
