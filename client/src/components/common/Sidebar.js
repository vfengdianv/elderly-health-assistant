import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Avatar, Dropdown, Space, Divider } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, HomeOutlined, RobotOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onPageChange }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigation = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <a href="/profile">个人资料</a>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <a href="/settings">设置</a>
      </Menu.Item>
      <Divider style={{ margin: '8px 0' }} />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        登出
      </Menu.Item>
    </Menu>
  );

  return (
    <aside className="app-sidebar">
      <div style={{ padding: '16px', borderBottom: '1px solid #e8e8e8', marginBottom: '16px' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space>
              <Avatar size="large" icon={<UserOutlined />} />
              <div>
                <div style={{ fontWeight: 'bold' }}>{user.username}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{user.email}</div>
              </div>
            </Space>
            <Dropdown menu={{ items: [
              { key: 'profile', icon: <UserOutlined />, label: '个人资料', onClick: () => navigate('/profile') },
              { key: 'logout', icon: <LogoutOutlined />, label: '登出', onClick: handleLogout }
            ] }} trigger="click">
              <a href="#" onClick={e => e.preventDefault()} style={{ color: '#1890ff' }}>\u2228</a>
            </Dropdown>
          </div>
        )}
      </div>

      <ul>
        <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('home'); }}><HomeOutlined /> 首页</a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('ai-assistant'); }}><RobotOutlined /> AI助手</a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('medication-reminder'); }}>用药提醒</a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('drug-info'); }}>药物信息</a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('diet'); }}>饮食管理</a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('exercise'); }}>运动指导</a></li>
        <li><a href="/profile">个人资料</a></li>
      </ul>

      <Divider style={{ margin: '16px 0' }} />

      <div style={{ padding: '0 16px', textAlign: 'center' }}>
        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ color: '#ff4d4f', fontSize: '14px' }}>
          <LogoutOutlined /> 登出
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;