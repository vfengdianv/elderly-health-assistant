import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Tabs, message, Empty, Spin, ConfigProvider } from 'antd';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import request from '../../api/request';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const ExerciseTracker = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>加载中...</div>;
  }
  const [stats, setStats] = useState(null);
  const [plans, setPlans] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B9D', '#C44569', '#FFA502', '#26A69A'];

  // 获取统计数据
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await request.get('/api/exercise/stats', {
        params: {
          startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
          endDate: dayjs().add(7, 'day').format('YYYY-MM-DD') // 包含未来一周的计划统计
        }
      });
      if (response.data.success) {
        setStats(response.data.data);
        // 处理活动类型数据为图表格式
        if (response.data.data.activityStats) {
          const activityChartData = Object.entries(response.data.data.activityStats).map(([name, data]) => ({
            name,
            value: data.calories
          }));
          setActivityData(activityChartData);
        }
      }
    } catch (error) {
      message.error('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取计划数据用于生成趋势图
  const fetchPlans = async () => {
    try {
      const response = await request.get('/api/exercise/plans', {
        params: {
          startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
          endDate: dayjs().format('YYYY-MM-DD')
        }
      });
      if (response.data.success) {
        const plansData = response.data.data || [];
        setPlans(plansData);
        generateChartData(plansData);
      }
    } catch (error) {
      console.error('获取计划失败:', error);
    }
  };

  // 生成图表数据
  const generateChartData = (plansData) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
      last7Days.push({
        date,
        displayDate: dayjs(date).format('MM-DD'),
        duration: 0,
        calories: 0
      });
    }

    // 合并计划数据
    plansData.forEach(plan => {
      const planDate = dayjs(plan.planDate).format('YYYY-MM-DD');
      const dayData = last7Days.find(d => d.date === planDate);
      if (dayData) {
        dayData.duration += plan.duration || 0;
        dayData.calories += plan.caloriesBurned || 0;
      }
    });

    setChartData(last7Days);
  };

  useEffect(() => {
    fetchStats();
    fetchPlans();
  }, []);

  // AI 运动建议功能已移除，统一由全局 AI 助手提供

  // 计算完成率
  const completionRate = stats ? ((stats.completedPlans || 0) / (stats.totalPlans || 1) * 100).toFixed(0) : 0;

  return (
    <div style={{ padding: '20px' }}>
      <Spin spinning={loading}>
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="本月计划数"
                value={stats?.totalPlans || 0}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="完成数"
                value={stats?.completedPlans || 0}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总热量消耗"
                value={stats?.totalCalories || 0}
                suffix="卡"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="完成率"
                value={completionRate}
                suffix="%"
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        <Tabs
          items={[
            {
              key: '1',
              label: '趋势分析',
              children: (
                <div>
                  {/* 时长趋势图 */}
                  <Card style={{ marginBottom: '20px' }}>
                    <h3>最近 7 天运动时长趋势</h3>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="displayDate" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => value + ' 分钟'}
                            labelFormatter={(label) => '时长'}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="duration"
                            stroke="#1890ff"
                            name="运动时长 (分钟)"
                            strokeWidth={2}
                            dot={{ fill: '#1890ff', r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="暂无数据" />
                    )}
                  </Card>

                  {/* 热量消耗趋势 */}
                  <Card>
                    <h3>最近 7 天热量消耗趋势</h3>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="displayDate" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => value + ' 卡'}
                            labelFormatter={(label) => '热量'}
                          />
                          <Legend />
                          <Bar
                            dataKey="calories"
                            fill="#52c41a"
                            name="热量消耗 (卡)"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="暂无数据" />
                    )}
                  </Card>
                </div>
              )
            },
            {
              key: '2',
              label: '活动分析',
              children: (
                <div>
                  {/* 活动类型分布 */}
                  <Card>
                    <h3>活动类型热量分布</h3>
                    {activityData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={activityData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, value }) => `${name} (${value}卡)`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {activityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => value + ' 卡'} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Empty description="暂无数据" />
                    )}
                  </Card>

                  {/* 活动统计详情 */}
                  <Card style={{ marginTop: '20px' }}>
                    <h3>活动类型详细统计</h3>
                    {stats?.activityStats && Object.keys(stats.activityStats).length > 0 ? (
                      <Row gutter={[16, 16]}>
                        {Object.entries(stats.activityStats).map(([activity, data]) => (
                          <Col span={6} key={activity}>
                            <Card style={{ backgroundColor: '#fafafa' }}>
                              <div style={{ textAlign: 'center' }}>
                                <h4>{activity}</h4>
                                <Statistic
                                  value={data.count}
                                  suffix="次"
                                  valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                                />
                                <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                                  <div>时长: {data.duration} 分钟</div>
                                  <div>热量: {data.calories} 卡</div>
                                </div>
                              </div>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <Empty description="暂无数据" />
                    )}
                  </Card>
                </div>
              )
            },
            {
              key: '3',
              label: '最近活动',
              children: (
                <Card>
                  <h3>最近 5 条运动记录</h3>
                  {plans.length > 0 ? (
                    <div>
                      {plans.slice(0, 5).map((plan, index) => (
                        <Card
                          key={index}
                          style={{
                            marginBottom: '15px',
                            backgroundColor: plan.completed ? '#f6ffed' : '#fffbe6'
                          }}
                          size="small"
                        >
                          <Row gutter={16}>
                            <Col span={4}>
                              <div style={{ fontSize: '12px', color: '#999' }}>
                                {dayjs(plan.planDate).format('YYYY-MM-DD')}
                              </div>
                              <div style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '5px' }}>
                                {plan.activityType}
                              </div>
                            </Col>
                            <Col span={16}>
                              <Row gutter={16}>
                                <Col span={6}>
                                  <Statistic
                                    title="时长"
                                    value={plan.duration}
                                    suffix="分钟"
                                    valueStyle={{ fontSize: '14px' }}
                                  />
                                </Col>
                                <Col span={6}>
                                  <Statistic
                                    title="距离"
                                    value={plan.distance ? plan.distance.toFixed(1) : 0}
                                    suffix="公里"
                                    valueStyle={{ fontSize: '14px' }}
                                  />
                                </Col>
                                <Col span={6}>
                                  <Statistic
                                    title="热量"
                                    value={plan.caloriesBurned}
                                    suffix="卡"
                                    valueStyle={{ fontSize: '14px', color: '#faad14' }}
                                  />
                                </Col>
                                <Col span={6}>
                                  <div style={{ fontSize: '12px', marginBottom: '5px' }}>强度</div>
                                  <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
                                    {plan.intensity}
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={4} style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '24px' }}>
                                {plan.completed ? '✅' : '⏳'}
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Empty description="暂无运动记录" />
                  )}
                </Card>
              )
            }
          ]}
        />
      </Spin>

    </div>
  );
};

export default ExerciseTracker;
