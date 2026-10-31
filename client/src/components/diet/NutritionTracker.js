import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  message,
  Spin,
  Space,
  Tag,
  Progress,
  Divider,
  Empty,
  Alert
} from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import request from '../../api/request';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';

const NutritionTracker = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>加载中...</div>;
  }
  const [stats, setStats] = useState(null);
  const [advices, setAdvices] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  // 获取营养统计
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await request.get('/api/diet/nutrition-stats');
      setStats(response.data.data);
    } catch (error) {
      message.error('获取营养统计失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 获取饮食计划列表
  const fetchPlans = async () => {
    try {
      const response = await request.get('/api/diet/plans');
      const plans = response.data.data || [];
      setPlans(plans);
      
      // 为图表準备数据
      const data = plans.slice(0, 7).map(plan => ({
        date: dayjs(plan.planDate).format('MM-DD'),
        breakfast: plan.breakfast?.calories || 0,
        lunch: plan.lunch?.calories || 0,
        dinner: plan.dinner?.calories || 0,
        snacks: plan.snacks?.calories || 0
      }));
      setChartData(data);
    } catch (error) {
      message.error('获取饮食计划失败: ' + (error.response?.data?.message || error.message));
    }
  };

  // 获取AI建议
  const fetchDietAdvice = async () => {
    try {
      setAdviceLoading(true);
      const response = await request.post('/api/diet/advice', {
        userId: user._id,
        recentStats: stats,
        userGoals: ''
      });
      setAdvices([response.data.data]);
      message.success('AI建议已获取');
    } catch (error) {
      message.error('AI建议获取失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setAdviceLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPlans();
  }, []);

  if (loading) {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  // 镜闍最近一个计划
  const latestPlan = plans[0];

  // 早餐午餐晚餐热量预预总计
  const mealCalories = [
    { name: '早餐', value: stats?.avgCalories?.breakfast || 0, color: '#1890ff' },
    { name: '午餐', value: stats?.avgCalories?.lunch || 0, color: '#52c41a' },
    { name: '晚餐', value: stats?.avgCalories?.dinner || 0, color: '#faad14' },
    { name: '加餐', value: stats?.avgCalories?.snacks || 0, color: '#f5222d' }
  ];

  return (
    <div className="nutrition-tracker">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 顶部操作按钮 */}
        <div>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              fetchStats();
              fetchPlans();
            }}
            loading={loading}
          >
            刷新数据
          </Button>
          <Button
            type="primary"
            onClick={fetchDietAdvice}
            loading={adviceLoading}
            style={{ marginLeft: '8px' }}
          >
            获取AI建议
          </Button>
        </div>

        {/* 统计数据卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="平均日热量"
                value={stats?.avgTotalCalories || 0}
                suffix="kcal"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="平均蛋白质"
                value={(stats?.avgProtein || 0).toFixed(2)}
                suffix="g"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="平均脂肪"
                value={(stats?.avgFat || 0).toFixed(2)}
                suffix="g"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="平均碳水"
                value={(stats?.avgCarbs || 0).toFixed(2)}
                suffix="g"
              />
            </Card>
          </Col>
        </Row>

        {/* 最近计划信息 */}
        {latestPlan && (
          <Card title="最近计划">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="早餐热量"
                  value={latestPlan.breakfast?.calories || 0}
                  suffix="kcal"
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="午餐热量"
                  value={latestPlan.lunch?.calories || 0}
                  suffix="kcal"
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="晚餐热量"
                  value={latestPlan.dinner?.calories || 0}
                  suffix="kcal"
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="加餐热量"
                  value={latestPlan.snacks?.calories || 0}
                  suffix="kcal"
                />
              </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <div>
                  <h4>热量达成褏率</h4>
                  <Progress
                    percent={Math.round(
                      ((latestPlan.breakfast?.calories || 0 +
                        latestPlan.lunch?.calories || 0 +
                        latestPlan.dinner?.calories || 0 +
                        latestPlan.snacks?.calories || 0) /
                        latestPlan.caloriesTarget) *
                        100
                    )}
                    status={((latestPlan.breakfast?.calories || 0 +
                      latestPlan.lunch?.calories || 0 +
                      latestPlan.dinner?.calories || 0 +
                      latestPlan.snacks?.calories || 0) > latestPlan.caloriesTarget ? 'exception' : 'success')}
                  />
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <h4>目标热量: {latestPlan.caloriesTarget} kcal</h4>
              </Col>
            </Row>
          </Card>
        )}

        {/* 热量趋势图 */}
        {chartData.length > 0 && (
          <Card title="最近 7 天热量趋势">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="breakfast" stroke="#1890ff" name="早餐" />
                <Line type="monotone" dataKey="lunch" stroke="#52c41a" name="午餐" />
                <Line type="monotone" dataKey="dinner" stroke="#faad14" name="晚餐" />
                <Line type="monotone" dataKey="snacks" stroke="#f5222d" name="加餐" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* 顯餮分布 */}
        {mealCalories.some(m => m.value > 0) && (
          <Card title="各餐次热量比例">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mealCalories.filter(m => m.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}kcal`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mealCalories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* AI建议 */}
        {advices.length > 0 && (
          <Card title="AI饮食建议">
            <Space direction="vertical" style={{ width: '100%' }}>
              {advices.map((advice, index) => (
                <Alert
                  key={index}
                  message={advice.title || 'AI建议'}
                  description={advice.content || advice}
                  type="info"
                  showIcon
                />
              ))}
            </Space>
          </Card>
        )}

        {/* 空态提示 */}
        {plans.length === 0 && <Empty description="暂无饮食计划数据" />}
      </Space>
    </div>
  );
};

export default NutritionTracker;