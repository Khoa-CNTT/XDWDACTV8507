// components/Management/ScheduleManagement.jsx
import React, { useState } from 'react';
import { Select, Button, TimePicker, message, List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../assets/css/Management.css';

const ScheduleManagement = () => {
    const staffMembers = [
        { id: 1, name: 'Nhân viên A' },
        { id: 2, name: 'Nhân viên B' },
        { id: 3, name: 'Nhân viên C' },
    ];

    // Dữ liệu giả thời gian của từng nhân viên
    const [staffTimes, setStaffTimes] = useState({
        1: ['08:00', '14:00'],
        2: ['09:00', '15:30'],
        3: ['10:00'],
    });

    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);


    // Giới hạn giờ: disable giờ <8 hoặc >17
    const disabledHours = () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            if (i < 8 || i > 17) {
                hours.push(i);
            }
        }
        return hours;
    };

    // Cho phép phút: chỉ 0 và 30, disable các phút khác
    const disabledMinutes = (selectedHour) => {
        const allowed = [0, 30];
        const disabled = [];
        for (let i = 0; i < 60; i++) {
            if (!allowed.includes(i)) {
                disabled.push(i);
            }
        }
        return disabled;
    };
    const handleAddTime = () => {
        if (!selectedStaff) {
            message.warning('Vui lòng chọn nhân viên');
            return;
        }
        if (!selectedTime) {
            message.warning('Vui lòng chọn giờ làm');
            return;
        }

        const newTime = selectedTime.format('HH:mm');
        // Check trùng
        if (staffTimes[selectedStaff]?.includes(newTime)) {
            message.warning('Giờ làm đã tồn tại');
            return;
        }

        // Thêm giờ vào danh sách
        setStaffTimes(prev => ({
            ...prev,
            [selectedStaff]: [...(prev[selectedStaff] || []), newTime]
        }));
        message.success('Đã thêm giờ làm');
        setSelectedTime(null);
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h2>Quản lý Lịch trình (Dữ liệu giả)</h2>
                <div style={{ display: 'flex', gap: 16 }}>
                    <Select
                        placeholder="Chọn nhân viên"
                        style={{ width: 200 }}
                        value={selectedStaff}
                        onChange={setSelectedStaff}
                        options={staffMembers.map(staff => ({
                            value: staff.id,
                            label: staff.name,
                        }))}
                    />
                    <TimePicker
                        format="HH:mm"
                        value={selectedTime}
                        onChange={setSelectedTime}
                        disabledHours={disabledHours}
                        disabledMinutes={disabledMinutes}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddTime}
                    >
                        Thêm giờ làm
                    </Button>
                </div>
            </div>

            <div style={{ marginTop: 24 }}>
                <h3>
                    Giờ làm của{' '}
                    {staffMembers.find(s => s.id === selectedStaff)?.name || '...'}
                </h3>
                {selectedStaff ? (
                    <List
                        bordered
                        dataSource={staffTimes[selectedStaff] || []}
                        renderItem={time => <List.Item>{time}</List.Item>}
                        locale={{ emptyText: 'Chưa có giờ làm' }}
                        style={{ maxWidth: 200 }}
                    />
                ) : (
                    <p>Vui lòng chọn nhân viên để xem giờ làm</p>
                )}
            </div>
        </div>
    );
};

export default ScheduleManagement;
