import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/FloatingWidgets.css';
import botImg from '../assets/image/bot.jpg';
import barberImg from '../assets/image/barber.png';
import { FaArrowUp, FaTimes, FaPaperPlane, FaCut, FaCalendarAlt } from 'react-icons/fa';
import CountService from './CountService';
import { useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import useAIService from '../services/aiService';
import { toast } from 'react-toastify';

const ChatBox = ({ onClose }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [activeFeature, setActiveFeature] = useState(null);
    const [bookingStep, setBookingStep] = useState(0);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const {
        sendMessage,
        bookAppointment,
        messages,
        isLoading,
        clearChatHistory
    } = useAIService();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeFeature]);

    const handleSend = async () => {
        try {
            if (!inputMessage.trim()) return;

            // Thêm tin nhắn người dùng vào UI ngay lập tức
            sendMessage({
                text: inputMessage,
                isBot: false,
                isError: false
            }, false);

            let response;

            if (activeFeature === 'booking') {
                // Xử lý từng bước đặt lịch
                if (bookingStep === 0) {
                    // Bước 1: Xác nhận dịch vụ
                    response = await bookAppointment({
                        service: inputMessage,
                        step: 'service'
                    });
                    setBookingStep(1);
                } else if (bookingStep === 1) {
                    // Bước 2: Xác nhận ngày
                    response = await bookAppointment({
                        date: inputMessage,
                        step: 'date'
                    });
                    setBookingStep(2);
                } else if (bookingStep === 2) {
                    // Bước 3: Xác nhận giờ
                    response = await bookAppointment({
                        time: inputMessage,
                        step: 'time'
                    });
                    setBookingStep(3);
                } else {
                    // Bước 4: Ghi chú và hoàn tất
                    response = await bookAppointment({
                        notes: inputMessage,
                        step: 'complete'
                    });
                    setActiveFeature(null);
                    setBookingStep(0);
                }
            } else {
                // Chat thông thường hoặc gợi ý kiểu tóc
                response = await sendMessage({
                    message: inputMessage,
                    context: activeFeature
                });
            }

            setInputMessage('');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleQuickAction = (action) => {
        setActiveFeature(action);
        setInputMessage('');
        setBookingStep(0);
        inputRef.current.focus();

        let message = '';
        switch (action) {
            case 'hairstyle':
                message = "Hãy mô tả khuôn mặt và kiểu tóc hiện tại của bạn (ví dụ: 'Mặt tròn, tóc dày và xoăn')";
                break;
            case 'booking':
                message = "Bạn muốn đặt dịch vụ nào? (Vui lòng chọn hoặc nhập tên dịch vụ)";
                break;
            case 'services':
                message = "Dưới đây là các dịch vụ của chúng tôi:";
                break;
            default:
                message = "Tôi có thể giúp gì cho bạn?";
        }

        // Thêm tin nhắn hướng dẫn
        sendMessage({
            text: message,
            isBot: true,
            isError: false
        }, false);
    };

    const renderQuickActions = () => (
        <div className="quick-actions">
            <button
                onClick={() => handleQuickAction('hairstyle')}
                className={activeFeature === 'hairstyle' ? 'active' : ''}
            >
                <FaCut /> Gợi ý kiểu tóc
            </button>
            <button
                onClick={() => handleQuickAction('booking')}
                className={activeFeature === 'booking' ? 'active' : ''}
            >
                <FaCalendarAlt /> Đặt lịch
            </button>
            <button
                onClick={() => handleQuickAction('services')}
                className={activeFeature === 'services' ? 'active' : ''}
            >
                <FaCut /> Xem dịch vụ
            </button>
        </div>
    );

    const renderBookingProgress = () => {
        const steps = [
            { label: "1. Chọn dịch vụ", completed: bookingStep > 0 },
            { label: "2. Chọn ngày", completed: bookingStep > 1 },
            { label: "3. Chọn giờ", completed: bookingStep > 2 },
            { label: "4. Hoàn tất", completed: bookingStep > 3 }
        ];

        return (
            <div className="booking-progress">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`step ${step.completed ? 'completed' :
                            bookingStep === index ? 'active' : ''}`}
                    >
                        {step.label}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="chat-box">
            <div className="chat-header">
                <h3>Trợ lý BarberPro</h3>
                <div className="header-actions">
                    <button
                        className="clear-btn"
                        onClick={clearChatHistory}
                        title="Xóa lịch sử chat"
                    >
                        Xóa
                    </button>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes size={16} />
                    </button>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-container ${msg.isBot ? 'bot' : 'user'}`}
                    >
                        {msg.isBot && (
                            <img
                                src={botImg}
                                alt="Bot avatar"
                                className="message-avatar"
                            />
                        )}

                        {!msg.isBot && (
                            <img
                                src={barberImg}
                                alt="User avatar"
                                className="message-avatar"
                            />
                        )}

                        <div className={`message ${msg.isError ? 'error' : ''}`}>
                            <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message-container bot">
                        <img
                            src={botImg}
                            alt="Bot avatar"
                            className="message-avatar"
                        />
                        <div className="message loading">
                            <SyncLoader size={6} color="#333" speedMultiplier={0.5} />
                            <span>Đang trả lời...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {activeFeature === 'booking' && renderBookingProgress()}
            {renderQuickActions()}

            <div className="chat-input">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                        activeFeature === 'hairstyle' ? "Mô tả khuôn mặt/kiểu tóc..." :
                            activeFeature === 'booking' ?
                                (bookingStep === 0 ? "Nhập tên dịch vụ..." :
                                    bookingStep === 1 ? "Nhập ngày (dd/mm/yyyy)..." :
                                        bookingStep === 2 ? "Nhập giờ (hh:mm)..." :
                                            "Ghi chú thêm (nếu có)...") :
                                "Nhập tin nhắn..."
                    }
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} disabled={isLoading}>
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

const FloatingWidgets = () => {
    const [showChat, setShowChat] = useState(false);
    const navigate = useNavigate();

    const scrollToTop = () => {
        const startingY = window.scrollY;
        const duration = 1000; // Thời gian cuộn (ms)
        const startTime = performance.now();

        const easeOutQuad = (t) => t * (2 - t); // Hàm easing để giảm tốc dần

        const animateScroll = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            window.scrollTo(0, startingY * (1 - easeOutQuad(progress)));

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };

    const handleBarberClick = () => {
        navigate('/cart');
    };

    return (
        <div className="floating-widgets">
            {showChat && <ChatBox onClose={() => setShowChat(false)} />}

            <div className="circle-btn arrow" onClick={scrollToTop}>
                <FaArrowUp color="white" size={20} />
            </div>

            <div
                className="circle-btn"
                onClick={() => setShowChat(!showChat)}
            >
                <img src={botImg} alt="Chatbot" />
            </div>

            <div
                className="circle-btn outline"
                onClick={handleBarberClick}
            >
                <img src={barberImg} alt="Barber" />
                <CountService />
            </div>
        </div>
    );
};

export default FloatingWidgets;