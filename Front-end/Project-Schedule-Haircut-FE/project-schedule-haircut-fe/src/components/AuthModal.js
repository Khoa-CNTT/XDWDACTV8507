import React, { useState } from 'react';
import '../assets/css/AuthModal.css';
import LoginForm from './Login';
import RegisterForm from './Register';
import ForgotPasswordForm from './ForgotPassword';
import VerifyCodeForm from './VerifyCode';

const AuthModal = ({ onClose }) => {
    const [currentForm, setCurrentForm] = useState('login');
    const [transition, setTransition] = useState(false);
    const [email, setEmail] = useState('');
    const [formResetKey, setFormResetKey] = useState(Date.now());

    const resetAllForms = () => {
        setEmail('');
        setFormResetKey(Date.now());
    };

    const handleSwitchForm = (form) => {
        setTransition(true);
        setTimeout(() => {
            setCurrentForm(form);
            setTransition(false);
            resetAllForms();
        }, 300);
    };

    const handleCloseModal = () => {
        resetAllForms();
        onClose();
    };

    return (
        <div className="auth-modal-container">

            <div className={`auth-form ${currentForm === 'login' ? 'active' : transition ? 'left' : 'right'}`}>
                <LoginForm
                    key={formResetKey}
                    onClose={handleCloseModal}
                    onSwitchToRegister={() => handleSwitchForm('register')}
                    onSwitchToForgotPassword={() => handleSwitchForm('forgot')}
                />
            </div>

            <div className={`auth-form ${currentForm === 'register' ? 'active' : transition ? 'right' : 'left'}`}>
                <RegisterForm
                    key={formResetKey}
                    onClose={handleCloseModal}
                    onSwitchToLogin={() => handleSwitchForm('login')}
                />
            </div>

            <div className={`auth-form ${currentForm === 'forgot' ? 'active' : transition ? 'right' : 'left'}`}>
                <ForgotPasswordForm
                    key={formResetKey}
                    onClose={handleCloseModal}
                    onBackToLogin={() => handleSwitchForm('login')}
                    onGoToVerify={() => handleSwitchForm('verify')}
                    email={email}
                    setEmail={setEmail}
                />
            </div>

            <div className={`auth-form ${currentForm === 'verify' ? 'active' : transition ? 'right' : 'left'}`}>
                <VerifyCodeForm
                    key={formResetKey}
                    onVerify={(code) => {
                        console.log("Mã xác thực nhập:", code);
                    }}
                    onBack={() => handleSwitchForm('login')}
                    email={email}
                />
            </div>

        </div>
    );
};

export default AuthModal;