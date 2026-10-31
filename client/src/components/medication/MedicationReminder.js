import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, message, Space, Popconfirm, ConfigProvider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import request from '../../api/request';
import dayjs from 'dayjs';
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const MedicationReminder = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [form] = Form.useForm();

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const response = await request.get('/api/medication/reminders');
      if (response.data.success) {
        setReminders(response.data.data);
      }
    } catch (error) {
      message.error('获取用药提醒失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleAdd = () => {
    setEditingReminder(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingReminder(record);
    form.setFieldsValue({
      ...record,
      startTime: dayjs(record.startTime),
      endTime: record.endTime ? dayjs(record.endTime) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await request.delete(`/api/medication/reminders/${id}`);
      if (response.data.success) {
        message.success('删除成功');
        fetchReminders();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        startTime: values.startTime.format('YYYY-MM-DD'),
        endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : null,
      };

      if (editingReminder) {
        await request.put(`/api/medication/reminders/${editingReminder._id}`, payload);
        message.success('更新成功');
      } else {
        await request.post('/api/medication/reminders', payload);
        message.success('添加成功');
      }
      setIsModalVisible(false);
      fetchReminders();
    } catch (error) {
      message.error('保存失败');
    }
  };

  const columns = [
    { title: '药物名称', dataIndex: 'medicationName', key: 'medicationName' },
    { title: '剂量', dataIndex: 'dosage', key: 'dosage' },
    { title: '频次', dataIndex: 'frequency', key: 'frequency' },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', render: (text) => dayjs(text).format('YYYY-MM-DD') },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record._id)}>
            <Button icon={<DeleteOutlined />} danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>我的用药计划</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加用药提醒
        </Button>
      </div>
      <Table columns={columns} dataSource={reminders} rowKey="_id" loading={loading} />

      <Modal
        title={editingReminder ? "编辑用药提醒" : "添加用药提醒"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="medicationName" label="药物名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dosage" label="剂量 (如: 100mg)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="frequency" label="频次 (如: 每日三次)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="startTime" label="开始日期" rules={[{ required: true }]}>
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="请选择日期"
              format="YYYY年MM月DD日"
            />
          </Form.Item>
          <Form.Item name="endTime" label="结束日期">
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="请选择日期"
              format="YYYY年MM月DD日"
            />
          </Form.Item>
          <Form.Item name="instructions" label="备注说明">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicationReminder;
