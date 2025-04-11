import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/ForgotPassword.css';
import usePasswordService from '../services/passwordService';

const ForgotPasswordForm = ({ onClose, onBackToLogin, onGoToVerify, setEmail }) => {
    const [localEmail, setLocalEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { requestChangePassword } = usePasswordService();

    React.useEffect(() => {
        return () => {
            setLocalEmail('');
            setError('');
        };
    }, []);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra email
        if (!localEmail) {
            setError('Vui lòng nhập địa chỉ email');
            return;
        }

        if (!validateEmail(localEmail)) {
            setError('Email không hợp lệ');
            return;
        }

        // Nếu email hợp lệ
        try {
            setLoading(true);
            setError('');

            await requestChangePassword(localEmail);
            setEmail(localEmail);
            // onGoToVerify();
        } catch (err) {
            setError(err?.response?.data?.message || 'Gửi mã xác thực thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-container">
            <button className="close-button" onClick={onClose}>×</button>
            <h2>QUÊN MẬT KHẨU</h2>
            <p className="forgot-description">Vui lòng nhập địa chỉ email bạn đã đăng ký trên Bossbarber.</p>

            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <input
                    type="email"
                    placeholder="Nhập email"
                    value={localEmail}
                    onChange={(e) => {
                        setLocalEmail(e.target.value);
                        setError(''); // Clear error khi người dùng bắt đầu nhập
                    }}
                    required
                />
            </div>

            <button className="send-button" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
            </button>

            <div className="back-login">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onBackToLogin();
                    }}
                >
                    Quay lại đăng nhập
                </a>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;