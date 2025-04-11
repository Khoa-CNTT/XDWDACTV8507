import React, { useState } from 'react';
import '../assets/css/Login.css'; // Import your CSS file for styling
import useAuthService from '../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../stores/slices/authSlice';


const LoginForm = ({ onClose, onSwitchToRegister, onSwitchToForgotPassword }) => {
    const [credentials, setCredentials] = useState({
        userName: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthService();
    const dispatch = useDispatch();

    React.useEffect(() => {
        return () => {
            setCredentials({ userName: '', password: '' });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await login(credentials);
            if (user?.username) {
                dispatch(initializeAuth({
                    username: user.username,
                    isAuthenticated: true,
                }));

                toast.success('Đăng nhập thành công!');
                onClose();
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <button className="close-button" onClick={onClose}>×</button>
            <h2>ĐĂNG NHẬP</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <span className="icon">
                        <FontAwesomeIcon icon={faUser} />
                    </span>
                    <input
                        type="text"
                        name="userName"
                        placeholder="Username"
                        value={credentials.userName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <span className="icon">
                        <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <a
                    href="#"
                    className="forgot-password"
                    onClick={(e) => {
                        e.preventDefault();
                        onSwitchToForgotPassword();
                    }}
                >
                    Quên mật khẩu?
                </a>
                <button
                    type="submit"
                    className="login-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>

            <div className="register-link">
                Bạn chưa có tài khoản?{' '}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onSwitchToRegister();
                    }}
                >
                    Đăng ký ngay
                </a>
            </div>
        </div>
    );
};

export default LoginForm;