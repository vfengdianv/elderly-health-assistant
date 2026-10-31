const mongoose = require('mongoose');

// 对话记录 Schema
const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: '新对话'
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时自动更新 updatedAt
ConversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// 创建索引优化查询
ConversationSchema.index({ userId: 1, createdAt: -1 });

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
