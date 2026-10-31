import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

dayjs.locale('zh-cn');

// 导入页面组件
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserProfile from './components/auth/UserProfile';
import ExercisePlan from './components/exercise/ExercisePlan';
import ExerciseTracker from './components/exercise/ExerciseTracker';
import MedicationReminder from './components/medication/MedicationReminder';
import DrugInfo from './components/medication/DrugInfo';
import DietPlan from './components/diet/DietPlan';
import NutritionTracker from './components/diet/NutritionTracker';
import AIAssistant from './components/ai/AIAssistant';

// 主页面组件
const MainPage = ({ currentPage, setCurrentPage }) => {
  const renderContent = () => {
    switch(currentPage) {
      case 'home':
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '28px', color: '#1890ff', marginBottom: '10px' }}>欢迎使用老年人健康智能助手</h2>
              <p style={{ fontSize: '16px', color: '#666' }}>您的健康管理好帮手，陪伴您每一天</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '40px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                padding: '30px', 
                borderRadius: '12px', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onClick={() => setCurrentPage('ai-assistant')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>🤖 AI智能助手</h3>
                <p style={{ opacity: 0.9 }}>24小时在线，为您解答健康疑问</p>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
                padding: '30px', 
                borderRadius: '12px', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onClick={() => setCurrentPage('medication-reminder')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>💊 用药管理</h3>
                <p style={{ opacity: 0.9 }}>准时提醒，安全用药</p>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
                padding: '30px', 
                borderRadius: '12px', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onClick={() => setCurrentPage('diet')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>🥗 饮食管理</h3>
                <p style={{ opacity: 0.9 }}>科学营养，健康饮食</p>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
                padding: '30px', 
                borderRadius: '12px', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onClick={() => setCurrentPage('exercise')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>🏃 运动指导</h3>
                <p style={{ opacity: 0.9 }}>科学运动，活力常在</p>
              </div>
            </div>

            <div style={{ 
              marginTop: '50px', 
              padding: '30px', 
              background: '#f0f5ff', 
              borderRadius: '12px',
              border: '1px solid #d6e4ff'
            }}>
              <h3 style={{ color: '#1890ff', marginBottom: '15px', fontSize: '20px' }}>💡 温馨提示</h3>
              <ul style={{ color: '#666', lineHeight: '2', paddingLeft: '20px' }}>
                <li>每天记得按时服药，保持良好的用药习惯</li>
                <li>合理膳食，营养均衡，多吃蔬菜水果</li>
                <li>适量运动，增强体质，保持身心愉悦</li>
                <li>有任何健康疑问，随时咨询AI助手</li>
              </ul>
            </div>
          </div>
        );
      case 'ai-assistant':
        return <AIAssistant />;
      case 'medication-reminder':
        return <MedicationReminder />;
      case 'drug-info':
        return <DrugInfo />;
      case 'diet':
        return (
          <>
            <div style={{ marginBottom: '30px' }}>
              <DietPlan />
            </div>
            <div>
              <NutritionTracker />
            </div>
          </>
        );
      case 'exercise':
        return (
          <>
            <div style={{ marginBottom: '30px' }}>
              <ExercisePlan />
            </div>
            <div>
              <ExerciseTracker />
            </div>
          </>
        );
      default:
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '28px', color: '#1890ff', marginBottom: '10px' }}>欢迎使用老年人健康智能助手</h2>
              <p style={{ fontSize: '16px', color: '#666' }}>您的健康管理好帮手，陪伴您每一天</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '40px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                padding: '30px', 
                borderRadius: '12px', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onClick={() => setCurrentPage('ai-assistant')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>🤖 AI智能助手</h3>
                <p style={{ opacity: 0.9 }}>24小时在线，为您解答健康疑问</p>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
                padding: '30px', 
                borderRadius: '12px', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onClick={() => setCurrentPage('medication-reminder')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>💊 用药管理</h3>
                <p style={{ opacity: 0.9 }}>准时提醒，安全用药</p>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
                padding: '30px', 
                borderRadius: '12px', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onClick={() => setCurrentPage('diet')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>🥗 饮食管理</h3>
                <p style={{ opacity: 0.9 }}>科学营养，健康饮食</p>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
                padding: '30px', 
                borderRadius: '12px', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onClick={() => setCurrentPage('exercise')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>🏃 运动指导</h3>
                <p style={{ opacity: 0.9 }}>科学运动，活力常在</p>
              </div>
            </div>

            <div style={{ 
              marginTop: '50px', 
              padding: '30px', 
              background: '#f0f5ff', 
              borderRadius: '12px',
              border: '1px solid #d6e4ff'
            }}>
              <h3 style={{ color: '#1890ff', marginBottom: '15px', fontSize: '20px' }}>💡 温馨提示</h3>
              <ul style={{ color: '#666', lineHeight: '2', paddingLeft: '20px' }}>
                <li>每天记得按时服药，保持良好的用药习惯</li>
                <li>合理膳食，营养均衡，多吃蔬菜水果</li>
                <li>适量运动，增强体质，保持身心愉悦</li>
                <li>有任何健康疑问，随时咨询AI助手</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="main-container">
        <Sidebar onPageChange={setCurrentPage} />
        <main className="content">
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = React.useState('home');

  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* 公开路由 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 受保护路由 */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainPage currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* 其他路由重定向到首页 */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <MainPage currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
