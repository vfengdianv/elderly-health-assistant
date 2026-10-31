import React, { useState } from 'react';
import { Input, Card, Button, Typography, Divider, Empty, message, Tag } from 'antd';
import { SearchOutlined, WarningOutlined } from '@ant-design/icons';
import request from '../../api/request';

const { Title, Paragraph, Text } = Typography;

const DrugInfo = () => {
  const [drugName, setDrugName] = useState('');
  const [drugInfo, setDrugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!drugName) return message.warning('请输入药物名称');
    setLoading(true);
    try {
      const response = await request.get(`/api/medication/drug-info?drugName=${drugName}`);
      if (response.data.success) {
        setDrugInfo(response.data.data);
      }
    } catch (error) {
      setDrugInfo(null);
      message.error('未找到该药物信息');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>药物信息查询</Title>
      <div style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
        <Input 
          size="large" 
          placeholder="请输入药物名称（如：阿司匹林）" 
          prefix={<SearchOutlined />} 
          value={drugName}
          onChange={(e) => setDrugName(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Button size="large" type="primary" onClick={handleSearch} loading={loading}>
          查询
        </Button>
      </div>

      {drugInfo ? (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3}>{drugInfo.drugName}</Title>
            <Tag color="blue">{drugInfo.category}</Tag>
          </div>
          <Paragraph><Text strong>活性成分：</Text>{drugInfo.activeIngredient}</Paragraph>
          <Divider />
          
          <Title level={4}>药物描述</Title>
          <Paragraph>{drugInfo.description}</Paragraph>

          <Title level={4}>主治功效</Title>
          <Paragraph>{drugInfo.indications}</Paragraph>

          <Title level={4}>用法用量</Title>
          <Paragraph>{drugInfo.dosageInfo}</Paragraph>

          <div style={{ backgroundColor: '#fffbe6', padding: '16px', borderRadius: '8px', border: '1px solid #ffe58f', marginBottom: '16px' }}>
            <Title level={4} style={{ color: '#faad14' }}><WarningOutlined /> 副作用</Title>
            <Paragraph>{drugInfo.sideEffects}</Paragraph>
          </div>

          <div style={{ backgroundColor: '#fff1f0', padding: '16px', borderRadius: '8px', border: '1px solid #ffa39e', marginBottom: '16px' }}>
            <Title level={4} style={{ color: '#f5222d' }}>禁忌症</Title>
            <Paragraph>{drugInfo.contraindications}</Paragraph>
          </div>

          <Title level={4}>药物相互作用</Title>
          <Paragraph>{drugInfo.interactions}</Paragraph>

          <Divider />
          <Paragraph><Text type="secondary">生产厂家：{drugInfo.manufacturer}</Text></Paragraph>
          <Paragraph><Text type="secondary">储存条件：{drugInfo.storageConditions}</Text></Paragraph>
        </Card>
      ) : (
        !loading && <Empty description="暂无药物信息，请尝试搜索" />
      )}
    </div>
  );
};

export default DrugInfo;
