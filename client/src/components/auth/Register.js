import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Spin, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import '../auth/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  const [form] = Form.useForm();
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');

  const handleRegister = async (values) => {
    try {
      setLocalError('');
      setLocalSuccess('');

      // 验证密码一致性
      if (values.password !== values.passwordConfirm) {
        setLocalError('两次输入的密码不一致');
        return;
      }

      const result = await register(values);

      if (result.success) {
        setLocalSuccess('注册成功！正在跳转到首页...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setLocalError(result.message || '注册失败');
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || '注册失败，请检查网络连接');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" title="创建新账户">
        <Spin spinning={isLoading}>
          {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 16 }} />}
          {localError && <Alert message={localError} type="error" showIcon closable style={{ marginBottom: 16 }} />}
          {localSuccess && <Alert message={localSuccess} type="success" showIcon style={{ marginBottom: 16 }} />}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegister}
            disabled={isLoading}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                size="large"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="请输入邮箱地址"
                size="large"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码（至少6个字符）"
                size="large"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item
              label="确认密码"
              name="passwordConfirm"
              rules={[
                { required: true, message: '请再次输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请再次输入密码"
                size="large"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item
              label="名字"
              name="firstName"
            >
              <Input
                placeholder="请输入名字（可选）"
                size="large"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item
              label="年龄"
              name="age"
            >
              <Input
                type="number"
                placeholder="请输入年龄（可选）"
                size="large"
                disabled={isLoading}
                min={0}
                max={150}
              />
            </Form.Item>

            <Form.Item
              label="性别"
              name="gender"
              initialValue="其他"
            >
              <Select size="large" disabled={isLoading}>
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
                placeholder="请输入联系电话（可选）"
                size="large"
                disabled={isLoading}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isLoading}
              >
                注册
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-footer">
            已有账户？<Link to="/login">立即登录</Link>
          </div>
        </Spin>
      </Card>
    </div>
  );
};

export default Register;
