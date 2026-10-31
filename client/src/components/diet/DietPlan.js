import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Space,
  Table,
  message,
  Modal,
  Tabs,
  Card,
  Row,
  Col,
  Divider,
  Statistic,
  ConfigProvider
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import request from '../../api/request';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const DietPlan = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>加载中...</div>;
  }

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [stats, setStats] = useState(null);

  // 获取饮食计划列表
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await request.get('/api/diet/plans');
      setPlans(response.data.data || []);
    } catch (error) {
      message.error('获取饮食计划失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 获取营养统计
  const fetchStats = async () => {
    try {
      const response = await request.get('/api/diet/nutrition-stats');
      setStats(response.data.data);
    } catch (error) {
      message.error('获取营养统计失败: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    if (user) {
      fetchPlans();
      fetchStats();
    }
  }, [user]);

  // 创建或更新饮食计划
  const handleSubmit = async (values) => {
    try {
      const payload = {
        planDate: values.planDate.toISOString(),
        breakfast: values.breakfast || {},
        lunch: values.lunch || {},
        dinner: values.dinner || {},
        snacks: values.snacks || {},
        caloriesTarget: values.caloriesTarget || 2000,
        notes: values.notes
      };

      if (editingId) {
        // 更新
        await request.put(`/api/diet/plans/${editingId}`, payload);
        message.success('饮食计划更新成功');
      } else {
        // 创建
        await request.post('/api/diet/plans', payload);
        message.success('饮食计划创建成功');
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchPlans();
      fetchStats();
    } catch (error) {
      message.error('操作失败: ' + error.message);
    }
  };

  // 编辑饮食计划
  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue({
      planDate: dayjs(record.planDate),
      breakfast: record.breakfast,
      lunch: record.lunch,
      dinner: record.dinner,
      snacks: record.snacks,
      caloriesTarget: record.caloriesTarget,
      notes: record.notes
    });
    setIsModalVisible(true);
  };

  // 删除饮食计划
  const handleDelete = async (id) => {
    Modal.confirm({
      title: '删除饮食计划',
      content: '确定要删除此饮食计划吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await request.delete(`/api/diet/plans/${id}`);
          message.success('饮食计划删除成功');
          fetchPlans();
          fetchStats();
        } catch (error) {
          message.error('删除失败: ' + error.message);
        }
      }
    });
  };

  // 新增计划
  const handleAddNew = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 表格列配置
  const columns = [
    {
      title: '计划日期',
      dataIndex: 'planDate',
      key: 'planDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD')
    },
    {
      title: '早餐',
      dataIndex: ['breakfast', 'description'],
      key: 'breakfast',
      width: 150,
      ellipsis: true
    },
    {
      title: '午餐',
      dataIndex: ['lunch', 'description'],
      key: 'lunch',
      width: 150,
      ellipsis: true
    },
    {
      title: '晚餐',
      dataIndex: ['dinner', 'description'],
      key: 'dinner',
      width: 150,
      ellipsis: true
    },
    {
      title: '热量目标',
      dataIndex: 'caloriesTarget',
      key: 'caloriesTarget',
      render: (cal) => `${cal} kcal`
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDelete(record._id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  const mealNameMap = {
    'breakfast': '早餐',
    'lunch': '午餐',
    'dinner': '晚餐',
    'snacks': '加餐'
  };

  const mealForm = (mealName) => {
    const displayName = mealNameMap[mealName] || mealName;
    return (
      <Form.Item name={mealName}>
        <Form.Item label={`${displayName} - 描述`} name={[mealName, 'description']} noStyle>
          <Input placeholder={`请输入${displayName}描述`} />
        </Form.Item>
        <Form.Item label="热量 (kcal)" name={[mealName, 'calories']} noStyle>
          <InputNumber min={0} placeholder="热量" />
        </Form.Item>
        <Form.Item label="蛋白质 (g)" name={[mealName, 'protein']} noStyle>
          <InputNumber min={0} placeholder="蛋白质" />
        </Form.Item>
        <Form.Item label="脂肪 (g)" name={[mealName, 'fat']} noStyle>
          <InputNumber min={0} placeholder="脂肪" />
        </Form.Item>
        <Form.Item label="碳水 (g)" name={[mealName, 'carbs']} noStyle>
          <InputNumber min={0} placeholder="碳水" />
        </Form.Item>
      </Form.Item>
    );
  };

  return (
    <div className="diet-plan">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* 饮食计划管理标签页 */}
        <Tabs.TabPane tab="饮食计划管理" key="1">
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
              新增计划
            </Button>

            <Table
              columns={columns}
              dataSource={plans}
              loading={loading}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条`
              }}
            />
          </Space>
        </Tabs.TabPane>

        {/* 营养统计标签页 */}
        <Tabs.TabPane tab="营养统计" key="2">
          {stats ? (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="总热量"
                    value={stats.totalCalories || 0}
                    suffix="kcal"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="平均蛋白质"
                    value={(stats.avgProtein || 0).toFixed(2)}
                    suffix="g"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="平均脂肪"
                    value={(stats.avgFat || 0).toFixed(2)}
                    suffix="g"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="平均碳水"
                    value={(stats.avgCarbs || 0).toFixed(2)}
                    suffix="g"
                  />
                </Card>
              </Col>
            </Row>
          ) : (
            <p>加载统计数据中...</p>
          )}
        </Tabs.TabPane>
      </Tabs>

      {/* 创建/编辑模态框 */}
      <Modal
        title={editingId ? '编辑饮食计划' : '新增饮食计划'}
        open={isModalVisible}
        onOk={form.submit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="计划日期"
            name="planDate"
            rules={[{ required: true, message: '请选择计划日期' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="请选择日期"
              format="YYYY年MM月DD日"
            />
          </Form.Item>

          <Divider>早餐</Divider>
          {mealForm('breakfast')}

          <Divider>午餐</Divider>
          {mealForm('lunch')}

          <Divider>晚餐</Divider>
          {mealForm('dinner')}

          <Divider>加餐</Divider>
          {mealForm('snacks')}

          <Form.Item
            label="热量目标 (kcal)"
            name="caloriesTarget"
            initialValue={2000}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="备注" name="notes">
            <Input.TextArea rows={3} placeholder="输入任何备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DietPlan;