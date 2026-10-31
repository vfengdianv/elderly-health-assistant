import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Alert, Spin, Select, Tabs, Divider, Statistic, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user, updateProfile, changePassword, isLoading, fetchCurrentUser } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        age: user.age || null,
        gender: user.gender || '其他',
        phone: user.phone || ''
      });
    }
  }, [user, form]);

  // 处理资料更新
  const handleUpdateProfile = async (values) => {
    try {
      setError('');
      setSuccess('');

      const result = await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        age: values.age,
        gender: values.gender,
        phone: values.phone
      });

      if (result.success) {
        setSuccess('个人资料已更新');
        // 刷新用户信息
        await fetchCurrentUser();
      } else {
        setError(result.message || '更新失败');
      }
    } catch (err) {
      setError(err.response?.data?.message || '更新失败，请检查网络连接');
    }
  };

  // 处理修改密码
  const handleChangePassword = async (values) => {
    try {
      setError('');
      setSuccess('');

      // 验证新密码一致性
      if (values.newPassword !== values.confirmPassword) {
        setError('新密码输入不一致');
        return;
      }

      const result = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });

      if (result.success) {
        setSuccess('密码已更新，请妥善保管');
        passwordForm.resetFields();
      } else {
        setError(result.message || '修改密码失败');
      }
    } catch (err) {
      setError(err.response?.data?.message || '修改密码失败，请检查网络连接');
    }
  };

  if (!user) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} />;
  }

  const profileContent = (
    <Card>
      <Spin spinning={isLoading}>
        {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 16 }} />}
        {success && <Alert message={success} type="success" showIcon closable style={{ marginBottom: 16 }} />}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            label="用户名"
            name="username"
          >
            <Input
              prefix={<UserOutlined />}
              disabled
            />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
          >
            <Input
              prefix={<MailOutlined />}
              disabled
            />
          </Form.Item>

          <Form.Item
            label="名字"
            name="firstName"
          >
            <Input placeholder="请输入名字" />
          </Form.Item>

          <Form.Item
            label="姓氏"
            name="lastName"
          >
            <Input placeholder="请输入姓氏" />
          </Form.Item>

          <Form.Item
            label="年龄"
            name="age"
          >
            <Input type="number" placeholder="请输入年龄" min={0} max={150} />
          </Form.Item>

          <Form.Item
            label="性别"
            name="gender"
          >
            <Select>
              <Select.Option value="男">男</Select.Option>
              <Select.Option value="女">女</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="联系电话"
            name="phone"
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="请输入联系电话"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
            >
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );

  const passwordContent = (
    <Card>
      <Spin spinning={isLoading}>
        {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 16 }} />}
        {success && <Alert message={success} type="success" showIcon closable style={{ marginBottom: 16 }} />}

        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[
              { required: true, message: '请输入原密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入原密码"
            />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入新密码"
            />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            rules={[
              { required: true, message: '请再次输入新密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入新密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
            >
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );

  const infoContent = (
    <Card>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="用户名"
            value={user.username}
            prefix={<UserOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="邮箱"
            value={user.email}
            prefix={<MailOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="年龄"
            value={user.age || '未设置'}
            prefix={<CalendarOutlined />}
          />
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="性别"
            value={user.gender || '未设置'}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="联系电话"
            value={user.phone || '未设置'}
            prefix={<PhoneOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="账户状态"
            value={user.isActive ? '正常' : '已禁用'}
            valueStyle={{ color: user.isActive ? '#52c41a' : '#ff4d4f' }}
          />
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col span={12}>
          <Statistic
            title="注册时间"
            value={new Date(user.createdAt).toLocaleDateString('zh-CN')}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="最后更新"
            value={new Date(user.updatedAt).toLocaleDateString('zh-CN')}
          />
        </Col>
      </Row>
    </Card>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Card title="用户个人资料" style={{ marginBottom: 16 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'info',
              label: '基本信息',
              children: infoContent
            },
            {
              key: 'profile',
              label: '编辑资料',
              children: profileContent
            },
            {
              key: 'password',
              label: '修改密码',
              children: passwordContent
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default UserProfile;
