import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenu = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '登出',
      onClick: handleLogout
    }
  ];

  return (
    <header className="app-header">
      <h1>老年人健康智能助手</h1>
      <nav>
        <ul>
          <li><Link to="/">首页</Link></li>
          {user ? (
            <>
              <li style={{ marginLeft: 'auto' }}>
                <Dropdown menu={{ items: userMenu }} trigger="click">
                  <Space style={{ cursor: 'pointer' }}>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span>{user.username}</span>
                  </Space>
                </Dropdown>
              </li>
            </>
          ) : (
            <>
              <li style={{ marginLeft: 'auto' }}><Link to="/login">登录</Link></li>
              <li><Link to="/register">注册</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;