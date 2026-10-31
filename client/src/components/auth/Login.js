import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import '../auth/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [form] = Form.useForm();
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');

  const handleLogin = async (values) => {
    try {
      setLocalError('');
      setLocalSuccess('');

      const result = await login(values.username, values.password);

      if (result.success) {
        setLocalSuccess('登录成功！正在跳转...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setLocalError(result.message || '登录失败');
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || '登录失败，请检查网络连接');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" title="登录账户">
        <Spin spinning={isLoading}>
          {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 16 }} />}
          {localError && <Alert message={localError} type="error" showIcon closable style={{ marginBottom: 16 }} />}
          {localSuccess && <Alert message={localSuccess} type="success" showIcon style={{ marginBottom: 16 }} />}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            disabled={isLoading}
          >
            <Form.Item
              label="用户名或邮箱"
              name="username"
              rules={[
                { required: true, message: '请输入用户名或邮箱' },
                { min: 3, message: '用户名至少3个字符' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名或邮箱"
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
                placeholder="请输入密码"
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
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-footer">
            还没有账户？<Link to="/register">立即注册</Link>
          </div>
        </Spin>
      </Card>
    </div>
  );
};

export default Login;
