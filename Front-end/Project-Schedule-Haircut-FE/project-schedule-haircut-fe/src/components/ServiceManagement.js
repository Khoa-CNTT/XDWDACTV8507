import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Space,
    Image,
    Input,
    Select,
    message,
    Popconfirm,
    Modal,
    Form,
    InputNumber,
    Spin,
    Tag
} from 'antd';
import {
    UploadOutlined,
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import '../assets/css/ServiceManagement.css';
import useManagementService from '../services/managementService';

const { Search } = Input;
const { Option } = Select;

const ServiceManagement = () => {
    const { getServices, getCombos, managementState } = useManagementService();
    const [services, setServices] = useState([]);
    const [combos, setCombos] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [viewMode, setViewMode] = useState('service');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [servicesData, combosData] = await Promise.all([
                getServices(),
                getCombos()
            ]);
            setServices(servicesData);
            setCombos(combosData);
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu: ' + error.message);
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleCategoryFilter = (value) => {
        setSelectedCategory(value);
    };

    const handleDelete = (id) => {
        if (viewMode === 'service') {
            setServices(prev => prev.filter(item => item.id !== id));
            message.success('Xóa dịch vụ thành công');
        } else {
            setCombos(prev => prev.filter(item => item.id !== id));
            message.success('Xóa combo thành công');
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const openEditModal = (record) => {
        setEditingItem(record);
        form.setFieldsValue({
            name: record.name,
            price: record.price,
            ...(viewMode === 'service' && {
                haircutTime: record.haircutTime,
                category: record.category?.name,
            }),
            ...(viewMode === 'combo' && {
                services: record.services,
            }),
            image: record.image,
        });
        setIsModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();

            if (viewMode === 'service') {
                if (editingItem) {
                    // Update service
                    setServices(services.map(item =>
                        item.id === editingItem.id
                            ? {
                                ...item,
                                ...values,
                                category: {
                                    id: item.category.id,
                                    name: values.category
                                }
                            }
                            : item
                    )
                    );
                    message.success('Cập nhật dịch vụ thành công');
                } else {
                    // Add new service
                    const newService = {
                        id: Math.max(...services.map(s => s.id), 0) + 1,
                        ...values,
                        category: {
                            id: values.category === 'HAIRCUT' ? 1 : 2,
                            name: values.category
                        }
                    };
                    setServices([...services, newService]);
                    message.success('Thêm dịch vụ mới thành công');
                }
            } else {
                if (editingItem) {
                    // Update combo
                    setCombos(combos.map(item =>
                        item.id === editingItem.id
                            ? { ...item, ...values }
                            : item
                    ));
                    message.success('Cập nhật combo thành công');
                } else {
                    // Add new combo
                    const newCombo = {
                        id: Math.max(...combos.map(c => c.id), 0) + 1,
                        ...values
                    };
                    setCombos([...combos, newCombo]);
                    message.success('Thêm combo mới thành công');
                }
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const filteredServices = services.filter(service => {
        const matchName = service.name.toLowerCase().includes(searchText.toLowerCase());
        const matchCategory = selectedCategory
            ? service.category?.name === selectedCategory
            : true;
        return matchName && matchCategory;
    });

    const filteredCombos = combos.filter(combo => {
        return combo.name.toLowerCase().includes(searchText.toLowerCase());
    });

    const serviceColumns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            render: (image) => <Image src={image} width={80} />,
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: (price) => price.toLocaleString('vi-VN') + ' đ',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Thời gian (phút)',
            dataIndex: 'haircutTime',
            render: (time) => `${time} phút`,
            sorter: (a, b) => a.haircutTime - b.haircutTime,
        },
        {
            title: 'Danh mục',
            dataIndex: ['category', 'name'],
            render: (category) => (
                <Tag color={category === 'HAIRCUT' ? 'blue' : 'purple'}>
                    {category}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                    />
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const comboColumns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            render: (image) => <Image src={image} width={80} />,
        },
        {
            title: 'Tên combo',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: (price) => price.toLocaleString('vi-VN') + ' đ',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Dịch vụ bao gồm',
            dataIndex: 'services',
            render: (servicesIds) => (
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {servicesIds.map(id => {
                        const service = services.find(s => s.id === id);
                        return (
                            <Tag key={id} color="cyan" style={{ marginBottom: 4 }}>
                                {service?.name || `Dịch vụ #${id}`}
                            </Tag>
                        );
                    })}
                </div>
            ),
        },
        {
            title: 'Thao tác',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                    />
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
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
                <h2>Quản lý Dịch vụ {viewMode === 'combo' && 'và Combo'}</h2>
                <Space>
                    <Input.Search
                        placeholder="Tìm kiếm..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        onSearch={handleSearch}
                        allowClear
                        disabled={managementState.loading}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openAddModal}
                        disabled={managementState.loading}
                    >
                        Thêm mới
                    </Button>
                </Space>
            </div>

            <Space style={{ marginBottom: 16 }}>
                <Select
                    value={viewMode}
                    onChange={setViewMode}
                    style={{ width: 200 }}
                    disabled={managementState.loading}
                >
                    <Option value="service">Dịch vụ</Option>
                    <Option value="combo">Combo</Option>
                </Select>

                {viewMode === 'service' && (
                    <Select
                        placeholder="Tất cả danh mục"
                        allowClear
                        style={{ width: 200 }}
                        onChange={handleCategoryFilter}
                        disabled={managementState.loading}
                    >
                        <Option value="HAIRCUT">Cắt tóc</Option>
                        <Option value="SPA">Spa & Chăm sóc</Option>
                    </Select>
                )}
            </Space>

            <Spin spinning={managementState.loading}>
                <Table
                    columns={viewMode === 'service' ? serviceColumns : comboColumns}
                    dataSource={viewMode === 'service' ? filteredServices : filteredCombos}
                    rowKey="id"
                    bordered
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: false,
                        showTotal: (total) => `Tổng ${total} mục`
                    }}
                    scroll={{ x: true }}
                />
            </Spin>

            <Modal
                title={editingItem ? `Chỉnh sửa ${viewMode === 'service' ? 'dịch vụ' : 'combo'}` : `Thêm ${viewMode === 'service' ? 'dịch vụ' : 'combo'} mới`}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={() => setIsModalOpen(false)}
                okText={editingItem ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Hủy"
                confirmLoading={managementState.loading}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder={`Nhập tên ${viewMode === 'service' ? 'dịch vụ' : 'combo'}`} />
                    </Form.Item>

                    <Form.Item
                        label="Giá (VNĐ)"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    {viewMode === 'service' && (
                        <>
                            <Form.Item
                                label="Thời gian thực hiện (phút)"
                                name="haircutTime"
                                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
                            >
                                <InputNumber style={{ width: '100%' }} min={5} max={180} />
                            </Form.Item>

                            <Form.Item
                                label="Danh mục"
                                name="category"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select placeholder="Chọn danh mục">
                                    <Option value="HAIRCUT">Cắt tóc</Option>
                                    <Option value="SPA">Spa & Chăm sóc</Option>
                                </Select>
                            </Form.Item>
                        </>
                    )}

                    {viewMode === 'combo' && (
                        <Form.Item
                            label="Dịch vụ bao gồm"
                            name="services"
                            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 dịch vụ!' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Chọn dịch vụ"
                                optionFilterProp="children"
                                showSearch
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {services.map(service => (
                                    <Option key={service.id} value={service.id}>
                                        {service.name} - {service.price.toLocaleString('vi-VN')}đ
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Hình ảnh"
                        name="image"
                        rules={[{ required: true, message: 'Vui lòng tải ảnh lên!' }]}
                    >
                        <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ServiceManagement;