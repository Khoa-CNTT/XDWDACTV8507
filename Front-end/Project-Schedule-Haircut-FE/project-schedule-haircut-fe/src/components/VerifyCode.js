import React, { useState } from 'react';
import '../assets/css/VerifyCode.css';

const VerifyCodeForm = ({ onVerify, onBack, email }) => {
    const [code, setCode] = useState('');

    React.useEffect(() => {
        return () => {
            setCode('');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onVerify(code); // callback khi nhấn xác thực
    };

    return (
        <div className="verify-container">
            <button className="close-button" onClick={onBack}>×</button>
            <h2>NHẬP MÃ XÁC THỰC</h2>
            <p className="verify-description">
                Chúng tôi đã gửi mã xác thực đến email <strong>{email}</strong>. Vui lòng kiểm tra và nhập mã bên dưới.
            </p>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nhập mã xác thực"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="verify-input"
                />
                <button type="submit" className="verify-button">Xác thực</button>
            </form>

            <div className="back-login">
                <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>
                    Quay lại
                </a>
            </div>
        </div>
    );
};

export default VerifyCodeForm;
