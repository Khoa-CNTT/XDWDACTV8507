import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { UserOutlined, TeamOutlined, ScheduleOutlined, ShoppingOutlined, TransactionOutlined, PieChartOutlined } from '@ant-design/icons';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import biểu tượng mặt trời và mặt trăng
import '../assets/css/AdminHome.css';
import Dashboard from '../components/Dashboard';
import ServiceManagement from '../components/ServiceManagement';
import CustomerManagement from '../components/CustomerManagement';
import StaffManagement from '../components/StaffManagement';
import ScheduleManagement from '../components/ScheduleManagement';
import TransactionManagement from '../components/TransactionManagement';

const { Header, Content, Sider } = Layout;

const AdminHome = () => {
    const [theme, setTheme] = useState('dark'); // State để quản lý theme

    useEffect(() => {
        // Thay đổi class của thẻ <html> dựa trên theme
        document.documentElement.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark')); // Chuyển đổi giữa theme sáng và tối
    };

    const menuItems = [
        {
            key: '1',
            icon: <PieChartOutlined />,
            label: <Link to="/admin">Báo cáo thống kê</Link>,
        },
        {
            key: '2',
            icon: <UserOutlined />,
            label: <Link to="/admin/customers">Khách hàng</Link>,
        },
        {
            key: '3',
            icon: <TeamOutlined />,
            label: <Link to="/admin/staff">Nhân viên</Link>,
        },
        {
            key: '4',
            icon: <ScheduleOutlined />,
            label: <Link to="/admin/schedules">Lịch trình</Link>,
        },
        {
            key: '5',
            icon: <ShoppingOutlined />,
            label: <Link to="/admin/services">Dịch vụ</Link>,
        },
        {
            key: '6',
            icon: <TransactionOutlined />,
            label: <Link to="/admin/transactions">Giao dịch</Link>,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible theme={theme}>
                <div className="admin-logo">
                    <h2 style={{ color: theme === 'dark' ? '#fff' : '#000', textAlign: 'center' }}>
                        Trang quản trị BossBarber
                    </h2>
                </div>
                <Menu theme={theme} defaultSelectedKeys={['1']} mode="inline" items={menuItems} />
            </Sider>

            <Layout className="site-layout">
                <Header className="admin-header">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button className="theme-toggle-button" onClick={toggleTheme}>
                            {theme === 'dark' ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
                        </button>
                    </div>
                </Header>
                <Content className="admin-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="customers" element={<CustomerManagement />} />
                        <Route path="staff" element={<StaffManagement />} />
                        <Route path="schedules" element={<ScheduleManagement />} />
                        <Route path="services" element={<ServiceManagement />} />
                        <Route path="transactions" element={<TransactionManagement />} />
                    </Routes>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminHome;