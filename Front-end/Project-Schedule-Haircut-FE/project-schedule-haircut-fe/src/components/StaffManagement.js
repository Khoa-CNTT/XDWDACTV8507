// StaffManagement.jsx
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import '../assets/css/Management.css';

// Mock data for staff
const mockStaffs = [
    {
        id: 1,
        fullName: 'Nguyễn Thị X',
        phone: '0987123456',
        email: 'x.nguyen@example.com',
        employeeType: 'HAIR_STYLIST_STAFF',
        isDeleted: false
    },
    {
        id: 2,
        fullName: 'Trần Văn Y',
        phone: '0912876543',
        email: 'y.tran@example.com',
        employeeType: 'SPA_STAFF',
        isDeleted: false
    },
    {
        id: 3,
        fullName: 'Lê Thị Z',
        phone: '0978654321',
        email: 'z.le@example.com',
        employeeType: 'HAIR_STYLIST_STAFF',
        isDeleted: true
    }
];

const employeeTypes = [
    { value: 'HAIR_STYLIST_STAFF', label: 'Thợ cắt tóc' },
    { value: 'SPA_STAFF', label: 'Nhân viên spa' },
];

const StaffManagement = () => {
    const [staffs, setStaffs] = useState(mockStaffs);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();

    const handleToggleStatus = (id) => {
        setStaffs(staffs.map(staff =>
            staff.id === id ? { ...staff, isDeleted: !staff.isDeleted } : staff
        ));
        message.success('Cập nhật trạng thái thành công');
    };

    const handleDelete = (id) => {
        setStaffs(staffs.filter(staff => staff.id !== id));
        message.success('Xóa nhân viên thành công');
    };

    const handleFormSubmit = () => {
        form.validateFields().then(values => {
            if (editingId) {
                // Update existing staff
                setStaffs(staffs.map(staff =>
                    staff.id === editingId ? { ...staff, ...values } : staff
                ));
                message.success('Cập nhật thành công');
            } else {
                // Add new staff
                const newStaff = {
                    id: Math.max(...staffs.map(s => s.id), 0) + 1,
                    ...values,
                    isDeleted: false
                };
                setStaffs([...staffs, newStaff]);
                message.success('Thêm mới thành công');
            }
            setIsModalVisible(false);
            form.resetFields();
        }).catch(() => {
            message.error('Vui lòng điền đầy đủ thông tin');
        });
    };

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Vị trí',
            dataIndex: 'employeeType',
            key: 'position',
            render: type => employeeTypes.find(t => t.value === type)?.label
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Trạng thái',
            key: 'isDeleted',
            render: (_, record) => (
                <Tag color={record.isDeleted ? 'red' : 'green'}>
                    {record.isDeleted ? 'Đã khóa' : 'Hoạt động'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            form.setFieldsValue({
                                fullName: record.fullName,
                                phone: record.phone,
                                email: record.email,
                                employeeType: record.employeeType
                            });
                            setEditingId(record.id);
                            setIsModalVisible(true);
                        }}
                    />
                    <Button
                        icon={record.isDeleted ? <UnlockOutlined /> : <LockOutlined />}
                        onClick={() => handleToggleStatus(record.id)}
                    />
                    <Popconfirm
                        title="Xác nhận xóa vĩnh viễn?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="management-container">
            <div className="management-header">
                <h2>Quản lý Nhân viên</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        form.resetFields();
                        setEditingId(null);
                        setIsModalVisible(true);
                    }}
                >
                    Thêm nhân viên
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={staffs}
                rowKey="id"
                bordered
                pagination={{ pageSize: 8 }}
            />

            <Modal
                title={editingId ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
                visible={isModalVisible}
                onOk={handleFormSubmit}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="fullName"
                        label="Họ tên"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="employeeType"
                        label="Vị trí"
                        rules={[{ required: true }]}
                    >
                        <Select options={employeeTypes} />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, pattern: /^[0-9]{10}$/ }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ type: 'email', required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    {!editingId && (
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default StaffManagement;