// components/Report/Report.jsx
import React, { useState } from 'react';
import { Table, Button, Select, DatePicker, Tag, Row, Col, Statistic } from 'antd';
import { Column } from '@ant-design/charts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import '../assets/css/Management.css';  // Sử dụng CSS từ Management.css

const { RangePicker } = DatePicker;

const mockData = [
    { employee: 'Nguyễn Văn A', service: 'Cắt tóc', amount: 100000, date: '2025-05-01' },
    { employee: 'Trần Thị B', service: 'Massage', amount: 150000, date: '2025-05-01' },
    { employee: 'Lê Quang C', service: 'Cắt tóc', amount: 200000, date: '2025-05-02' },
    { employee: 'Nguyễn Văn A', service: 'Gội đầu', amount: 50000, date: '2025-05-02' },
    { employee: 'Trần Thị B', service: 'Cắt tóc', amount: 120000, date: '2025-05-03' },
];

const employees = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Quang C'];
const services = ['Cắt tóc', 'Massage', 'Gội đầu'];

const Dashboard = () => {
    const [dateRange, setDateRange] = useState([]);
    const [employee, setEmployee] = useState('');
    const [service, setService] = useState('');
    const [filteredData, setFilteredData] = useState(mockData);

    const handleDateChange = (dates) => {
        setDateRange(dates);
        // Lọc theo ngày
        if (dates) {
            const [startDate, endDate] = dates;
            const filtered = mockData.filter(
                (item) => item.date >= startDate && item.date <= endDate
            );
            setFilteredData(filtered);
        }
    };

    const handleEmployeeChange = (value) => {
        setEmployee(value);
        // Lọc theo nhân viên
        const filtered = mockData.filter((item) => item.employee === value);
        setFilteredData(filtered);
    };

    const handleServiceChange = (value) => {
        setService(value);
        // Lọc theo dịch vụ
        const filtered = mockData.filter((item) => item.service === value);
        setFilteredData(filtered);
    };

    const generateReport = () => {
        // Xuất báo cáo Excel
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo');
        XLSX.writeFile(wb, 'BaoCaoDoanhThu.xlsx');
    };

    const generatePDF = () => {
        // Xuất báo cáo PDF
        const doc = new jsPDF();
        doc.text('Báo cáo doanh thu', 20, 20);
        filteredData.forEach((item, index) => {
            doc.text(`${item.employee} - ${item.service} - ${item.amount} VND`, 20, 30 + index * 10);
        });
        doc.save('BaoCaoDoanhThu.pdf');
    };

    const totalRevenue = filteredData.reduce((total, item) => total + item.amount, 0);
    const revenueData = [
        { date: '2025-05-01', amount: 250000 },
        { date: '2025-05-02', amount: 250000 },
        { date: '2025-05-03', amount: 120000 },
    ];

    const columns = [
        { title: 'Nhân viên', dataIndex: 'employee' },
        { title: 'Dịch vụ', dataIndex: 'service' },
        { title: 'Số tiền', dataIndex: 'amount' },
        { title: 'Ngày', dataIndex: 'date' },
    ];

    return (
        <div className="management-container">
            <h2 className="management-header">Báo cáo thống kê</h2>
            <Row gutter={16}>
                <Col span={6}>
                    <Select
                        placeholder="Chọn nhân viên"
                        style={{ width: 200 }}
                        onChange={handleEmployeeChange}
                    >
                        {employees.map((employee, index) => (
                            <Select.Option key={index} value={employee}>
                                {employee}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col span={6}>
                    <Select
                        placeholder="Chọn dịch vụ"
                        style={{ width: 200 }}
                        onChange={handleServiceChange}
                    >
                        {services.map((service, index) => (
                            <Select.Option key={index} value={service}>
                                {service}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col span={12}>
                    <RangePicker onChange={handleDateChange} style={{ width: 300 }} />
                </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
                <h3>Tổng doanh thu</h3>
                <Statistic title="Tổng doanh thu" value={totalRevenue} suffix="VND" />
            </div>

            <div className="ant-column" style={{ marginTop: 24 }}>
                <h3>Thống kê doanh thu theo ngày</h3>
                <Column data={revenueData} xField="date" yField="amount" height={300} />
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                bordered
                pagination={{ pageSize: 5 }}
            />

            <div style={{ marginTop: 24 }}>
                <Button onClick={generateReport} style={{ marginRight: 16 }}>
                    Xuất báo cáo Excel
                </Button>
                <Button onClick={generatePDF}>Xuất báo cáo PDF</Button>
            </div>
        </div>
    );
};

export default Dashboard;
