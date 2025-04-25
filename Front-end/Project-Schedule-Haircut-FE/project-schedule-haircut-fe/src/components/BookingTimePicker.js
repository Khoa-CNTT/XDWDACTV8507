import React from 'react';
import '../assets/css/BookingTimePicker.css';

const timeSlots = [
    '9:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00'
];

const BookingTimePicker = ({ time, setTime, onNext, onBack }) => {
    return (
        <div className="booking-step">
            <h2>4. Chọn giờ</h2>

            <div className="time-slots">
                {timeSlots.map(slot => (
                    <button
                        key={slot}
                        className={`time-slot ${time === slot ? 'active' : ''}`}
                        onClick={() => setTime(slot)}
                    >
                        {slot}
                    </button>
                ))}
            </div>

            {time && (
                <div className="selected-time">
                    Bạn đã chọn: <strong>{time}</strong>
                </div>
            )}

            <div className="navigation-buttons">
                <button className="nav-button back-button" onClick={onBack}>
                    Quay lại
                </button>
                <button
                    className="nav-button next-button"
                    onClick={onNext}
                    disabled={!time}
                >
                    Tiếp theo
                </button>
            </div>
        </div>
    );
};

export default BookingTimePicker;