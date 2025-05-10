// services/vnpayService.js
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createVnPayPayment } from '../stores/slices/vnpaySlice';
// import { updateBookingStatus } from '../stores/slices/bookingSlice';
import { toast } from 'react-toastify';

const useVnPayService = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlePaymentResult = useCallback((queryParams) => {
        const status = queryParams.get('status');
        const amount = queryParams.get('vnp_Amount');
        const responseCode = queryParams.get('vnp_ResponseCode');
        const transactionId = queryParams.get('vnp_TransactionNo');

        if (status === 'success' && responseCode === '00') {
            toast.success(`Thanh toán thành công ${(amount / 100).toLocaleString()}₫`);
            navigate('/payment-return', {
                state: {
                    amount: amount / 100,
                    transactionId
                }
            });
        } else {
            navigate('/booking-failure', {
                state: {
                    errorCode: responseCode,
                    message: 'Thanh toán thất bại'
                }
            });
        }
    }, [navigate]);


    const extractBookingId = (orderInfo) => {
        const match = orderInfo.match(/#(\d+)/);
        return match ? match[1] : null;
    };

    const initiatePayment = useCallback(async (amount, bookingId) => {
        try {
            const orderInfo = `Payment for booking #${bookingId}`;
            const result = await dispatch(createVnPayPayment({
                amount: amount,
                orderInfo
            })).unwrap();
            console.log(result);

            if (result) {
                window.location.href = result;
            } else {
                throw new Error('Không nhận được URL thanh toán');
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khởi tạo thanh toán');
            throw error;
        }
    }, [dispatch]);

    return {
        handlePaymentResult,
        initiatePayment
    };
};

export default useVnPayService;