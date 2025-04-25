import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../assets/css/PaymentReturn.css';

const PaymentReturn = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const status = searchParams.get('status');
    const responseCode = searchParams.get('vnp_ResponseCode');
    const transactionStatus = searchParams.get('vnp_TransactionStatus');
    const amount = searchParams.get('vnp_Amount');

    useEffect(() => {
        if (status === 'success') {
            console.log('Thanh toán thành công!');
        } else if (status === 'failure') {
            console.log('Thanh toán thất bại!');
        } else if (status === 'error') {
            console.log('Có lỗi xảy ra trong quá trình thanh toán!');
        }
    }, [status]);

    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <div className="payment-return-container">
            <h1>Kết quả thanh toán</h1>
            {status === 'success' && (
                <div className="payment-success">
                    <p>Thanh toán thành công!</p>
                    <p>Số tiền: {amount / 100} VND</p>
                    <button onClick={handleGoHome}>Quay về trang chủ</button>
                </div>
            )}
            {status === 'failure' && (
                <div className="payment-failure">
                    <p>Thanh toán thất bại!</p>
                    <p>Mã phản hồi: {responseCode}</p>
                    <p>Trạng thái giao dịch: {transactionStatus}</p>
                    <button onClick={handleGoHome}>Quay về trang chủ</button>
                </div>
            )}
            {status === 'error' && (
                <div className="payment-error">
                    <p>Đã xảy ra lỗi trong quá trình thanh toán!</p>
                    <button onClick={handleGoHome}>Quay về trang chủ</button>
                </div>
            )}
        </div>
    );
};

export default PaymentReturn;