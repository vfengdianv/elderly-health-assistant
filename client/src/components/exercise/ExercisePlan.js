import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Modal, Select, DatePicker, InputNumber, Card, Row, Col, Statistic, message, Tabs, Space, ConfigProvider } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import request from '../../api/request';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const ExercisePlan = () => {
  const { user } = useAuth(); // 从认证上下文获取当前用户
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState({
    totalPlans: 0,
    completedPlans: 0,
    totalCalories: 0,
    avgCalories: 0
  });
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');

  // 活动类型选项
  const activityTypes = ['散步', '跑步', '游泳', '骑行', '太极拳', '瑜伽', '健身', '其他'];
  const intensityTypes = ['低', '中', '高'];

  // 获取运动计划列表
  const fetchPlans = async () => {
    setLoading(true);
    try {
      // 默认获取所有计划
      const response = await request.get('/api/exercise/plans');
      console.log('API 返回的运动计划数据:', response.data);
      if (response.data.success) {
        setPlans(response.data.data || []);
      } else {
        message.error(response.data.message || '获取计划失败');
      }
    } catch (error) {
      console.error('获取计划请求失败:', error);
      message.error('获取运动计划失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 获取运动统计
  const fetchStats = async () => {
    try {
      // 默认获取所有统计数据
      const response = await request.get('/api/exercise/stats');
      if (response.data.success) {
        setStats(response.data.data || {
          totalPlans: 0,
          completedPlans: 0,
          totalCalories: 0,
          avgCalories: 0
        });
      }
    } catch (error) {
      console.error('获取统计失败:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPlans();
      fetchStats();
    }
  }, [user]);

  // 打开模态框
  const showModal = (record = null) => {
    if (record) {
      setEditingId(record._id);
      form.setFieldsValue({
        planDate: dayjs(record.planDate),
        activityType: record.activityType,
        duration: record.duration,
        distance: record.distance || 0,
        intensity: record.intensity,
        notes: record.notes
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async (values) => {
    setLoading(true);
    console.log('提交运动计划表单:', values);
    try {
      const planData = {
        planDate: values.planDate ? values.planDate.toISOString() : null,
        activityType: values.activityType,
        duration: values.duration,
        distance: values.distance || 0,
        intensity: values.intensity || '中',
        notes: values.notes || ''
      };
      
      console.log('发送 Payload:', planData);

      if (editingId) {
        const response = await request.put(`/api/exercise/plans/${editingId}`, planData);
        console.log('更新响应:', response.data);
        if (response.data.success) {
          message.success('运动计划更新成功');
          setIsModalVisible(false);
          form.resetFields();
          // 确保数据刷新完成后再关闭 Modal
          await fetchPlans();
          await fetchStats();
        } else {
          message.error(response.data.message || '更新失败');
        }
      } else {
        const response = await request.post('/api/exercise/plans', planData);
        console.log('创建响应:', response.data);
        if (response.data.success) {
          message.success('运动计划创建成功');
          setIsModalVisible(false);
          form.resetFields();
          // 确保数据刷新完成后再关闭 Modal
          console.log('即将刷新列表...');
          await fetchPlans();
          await fetchStats();
          console.log('列表刷新完成');
        } else {
          message.error(response.data.message || '创建失败');
        }
      }
    } catch (error) {
      console.error('运动计划操作失败:', error);
      const errorMsg = error.response?.data?.message || error.message;
      message.error('操作失败: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 删除计划
  const handleDelete = async (id) => {
    Modal.confirm({
      title: '删除运动计划',
      content: '确定要删除这条运动计划吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await request.delete(`/api/exercise/plans/${id}`);
          if (response.data.success) {
            message.success('运动计划删除成功');
            fetchPlans();
            fetchStats();
          } else {
            message.error(response.data.message || '删除失败');
          }
        } catch (error) {
          message.error('删除失败: ' + (error.response?.data?.message || error.message));
        }
      }
    });
  };

  // 标记完成
  const handleMarkComplete = async (record) => {
    try {
      const response = await request.put(`/api/exercise/plans/${record._id}`, {
        completed: !record.completed
      });
      if (response.data.success) {
        message.success(record.completed ? '已取消完成' : '已标记完成');
        fetchPlans();
        fetchStats();
      }
    } catch (error) {
      message.error('操作失败: ' + error.message);
    }
  };

  // 表格列配置
  if (!user) {
    return <div>加载中...</div>;
  }

  const columns = [
    {
      title: '日期',
      dataIndex: 'planDate',
      key: 'planDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => new Date(a.planDate) - new Date(b.planDate),
      width: 120
    },
    {
      title: '活动类型',
      dataIndex: 'activityType',
      key: 'activityType',
      width: 100
    },
    {
      title: '时长 (分钟)',
      dataIndex: 'duration',
      key: 'duration',
      width: 100
    },
    {
      title: '距离 (公里)',
      dataIndex: 'distance',
      key: 'distance',
      render: (distance) => distance ? distance.toFixed(2) : '-',
      width: 100
    },
    {
      title: '强度',
      dataIndex: 'intensity',
      key: 'intensity',
      width: 80
    },
    {
      title: '热量消耗',
      dataIndex: 'caloriesBurned',
      key: 'caloriesBurned',
      render: (cal) => `${cal} 卡`,
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'completed',
      key: 'completed',
      render: (completed) => completed ? '✅ 已完成' : '⏳ 进行中',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => handleMarkComplete(record)}
          >
            {record.completed ? '取消' : '完成'}
          </Button>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: '1',
            label: '运动计划管理',
            children: (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                  >
                    新建计划
                  </Button>
                </div>

                <Table
                  columns={columns}
                  dataSource={plans}
                  loading={loading}
                  rowKey="_id"
                  pagination={{ pageSize: 10 }}
                />
              </div>
            )
          },
          {
            key: '2',
            label: '运动统计',
            children: (
              <div>
                <Row gutter={16}>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="总计划数"
                        value={stats.totalPlans || 0}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="已完成"
                        value={stats.completedPlans || 0}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="总热量消耗"
                        value={stats.totalCalories || 0}
                        suffix="卡"
                        valueStyle={{ color: '#faad14' }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="平均热量"
                        value={stats.avgCalories || 0}
                        suffix="卡"
                        valueStyle={{ color: '#f5222d' }}
                      />
                    </Card>
                  </Col>
                </Row>
                
                <Card style={{ marginTop: '20px' }}>
                  <h3>活动类型统计</h3>
                  {stats.activityStats && Object.keys(stats.activityStats).length > 0 ? (
                    <div>
                      {Object.entries(stats.activityStats).map(([activity, data]) => (
                        <div key={activity} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                          <strong>{activity}</strong>
                          <div style={{ marginTop: '8px', fontSize: '12px' }}>
                            <span style={{ marginRight: '20px' }}>次数: {data.count}</span>
                            <span style={{ marginRight: '20px' }}>时长: {data.duration} 分钟</span>
                            <span>热量: {data.calories} 卡</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>暂无统计数据</p>
                  )}
                </Card>
              </div>
            )
          }
        ]}
      />

      {/* 创建/编辑模态框 */}
      <Modal
        title={editingId ? '编辑运动计划' : '新建运动计划'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText="保存"
        cancelText="取消"
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="计划日期"
            name="planDate"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="请选择日期"
              format="YYYY年MM月DD日"
            />
          </Form.Item>

          <Form.Item
            label="活动类型"
            name="activityType"
            rules={[{ required: true, message: '请选择活动类型' }]}
          >
            <Select placeholder="请选择活动类型">
              {activityTypes.map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="时长 (分钟)"
            name="duration"
            rules={[{ required: true, message: '请输入时长' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入时长" />
          </Form.Item>

          <Form.Item
            label="距离 (公里)"
            name="distance"
          >
            <InputNumber min={0} step={0.1} style={{ width: '100%' }} placeholder="可选: 输入距离" />
          </Form.Item>

          <Form.Item
            label="强度"
            name="intensity"
            rules={[{ required: true, message: '请选择强度' }]}
          >
            <Select placeholder="请选择强度">
              {intensityTypes.map(intensity => (
                <Select.Option key={intensity} value={intensity}>{intensity}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="备注"
            name="notes"
          >
            <Input.TextArea rows={3} placeholder="可选: 添加备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExercisePlan;
