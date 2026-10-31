import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Input,
  Button,
  List,
  Avatar,
  message,
  Spin,
  Empty,
  Space,
  Divider,
  Modal,
  Tooltip
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  DeleteOutlined,
  HistoryOutlined,
  PlusOutlined
} from '@ant-design/icons';
import request from '../../api/request';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import './AIAssistant.css';

const { TextArea } = Input;

const AIAssistant = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>加载中...</div>;
  }

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (showHistory) {
      fetchConversations();
    }
  }, [showHistory]);

  // 获取对话历史列表
  const fetchConversations = async () => {
    try {
      const response = await request.get('/api/ai/conversations');
      if (response.data.success) {
        setConversations(response.data.data.conversations);
      }
    } catch (error) {
      message.error('获取对话历史失败');
    }
  };

  // 加载历史对话
  const loadConversation = async (id) => {
    try {
      const response = await request.get(`/api/ai/conversations/${id}`);
      if (response.data.success) {
        const conv = response.data.data;
        setMessages(conv.messages);
        setConversationId(conv._id);
        setShowHistory(false);
        message.success('对话加载成功');
      }
    } catch (error) {
      message.error('加载对话失败');
    }
  };

  // 删除对话
  const deleteConversation = async (id) => {
    try {
      const response = await request.delete(`/api/ai/conversations/${id}`);
      if (response.data.success) {
        message.success('删除成功');
        fetchConversations();
        if (conversationId === id) {
          // 如果删除的是当前对话，清空消息
          setMessages([]);
          setConversationId(null);
        }
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 开始新对话
  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setInputValue('');
    message.success('已开始新对话');
  };

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim()) {
      message.warning('请输入问题');
      return;
    }

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    // 添加用户消息到界面
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await request.post('/api/ai/ask', {
        question: inputValue,
        conversationId: conversationId
      });

      if (response.data.success) {
        const { answer, conversationId: newConvId } = response.data.data;
        
        // 更新对话 ID
        if (!conversationId) {
          setConversationId(newConvId);
        }

        // 添加 AI 回复
        const aiMessage = {
          role: 'assistant',
          content: answer,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'AI 回答失败，请稍后重试');
      // 移除用户消息
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  // 快捷问题
  const quickQuestions = [
    '高血压患者饮食要注意什么？',
    '老年人适合做哪些运动？',
    '如何预防骨质疏松？',
    '糖尿病患者可以吃什么水果？'
  ];

  const handleQuickQuestion = (question) => {
    setInputValue(question);
  };

  return (
    <div className="ai-assistant-container">
      <Card
        title={
          <Space>
            <RobotOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <span>AI 健康助手</span>
          </Space>
        }
        extra={
          <Space>
            <Tooltip title="新对话">
              <Button 
                icon={<PlusOutlined />} 
                onClick={startNewConversation}
              >
                新对话
              </Button>
            </Tooltip>
            <Tooltip title="历史对话">
              <Button 
                icon={<HistoryOutlined />} 
                onClick={() => setShowHistory(true)}
              >
                历史
              </Button>
            </Tooltip>
          </Space>
        }
        className="ai-assistant-card"
      >
        {/* 消息列表 */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <p>您好！我是您的健康助手 🤖</p>
                  <p>您可以向我咨询用药、饮食、运动等健康问题</p>
                  <Divider>快捷问题</Divider>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {quickQuestions.map((q, index) => (
                      <Button
                        key={index}
                        type="dashed"
                        block
                        onClick={() => handleQuickQuestion(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </Space>
                </div>
              }
            />
          ) : (
            <List
              dataSource={messages}
              renderItem={(msg, index) => (
                <div
                  key={index}
                  className={`message-item ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <div className="message-avatar">
                    <Avatar
                      icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                      style={{
                        backgroundColor: msg.role === 'user' ? '#1890ff' : '#52c41a'
                      }}
                    />
                  </div>
                  <div className="message-content">
                    <div className="message-bubble">
                      <div className="message-text">{msg.content}</div>
                      <div className="message-time">
                        {dayjs(msg.timestamp).format('HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="input-container">
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="请输入您的健康问题..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            disabled={!inputValue.trim()}
            size="large"
          >
            发送
          </Button>
        </div>
      </Card>

      {/* 历史对话弹窗 */}
      <Modal
        title="历史对话"
        open={showHistory}
        onCancel={() => setShowHistory(false)}
        footer={null}
        width={600}
      >
        <List
          dataSource={conversations}
          renderItem={(conv) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  onClick={() => loadConversation(conv._id)}
                >
                  加载
                </Button>,
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: '确认删除',
                      content: '确定要删除这个对话吗？',
                      onOk: () => deleteConversation(conv._id)
                    });
                  }}
                >
                  删除
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<RobotOutlined />} />}
                title={conv.title}
                description={
                  <Space direction="vertical" size="small">
                    <div>{conv.lastMessage}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {conv.messageCount} 条消息 · {dayjs(conv.updatedAt).format('YYYY-MM-DD HH:mm')}
                    </div>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default AIAssistant;
