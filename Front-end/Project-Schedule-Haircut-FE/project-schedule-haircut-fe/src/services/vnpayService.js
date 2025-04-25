import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    createVnPayPayment as createPaymentAction,
    handlePaymentReturn as handleReturnAction,
    clearVnPayState,
    resetPaymentResult
} from '../stores/slices/vnpaySlice';
import { toast } from 'react-toastify';

const useVnPayService = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const createPayment = async (amount, orderInfo) => {
        try {
            dispatch(clearVnPayState());
            const resultAction = await dispatch(createPaymentAction({ amount, orderInfo }));

            if (createPaymentAction.fulfilled.match(resultAction)) {
                // Kiểm tra URL có tồn tại không
                const paymentUrl = resultAction.payload?.data;
                if (!paymentUrl) {
                    throw new Error('Không nhận được URL thanh toán từ hệ thống');
                }

                window.location.assign(paymentUrl);
                return true;
            } else {
                const errorMsg = resultAction.payload?.message || 'Tạo thanh toán thất bại';
                toast.error(errorMsg);
                throw new Error(errorMsg);
            }
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi thanh toán');
            throw error;
        }
    };

    const handlePaymentReturn = async (queryParams) => {
        try {
            dispatch(resetPaymentResult());
            const resultAction = await dispatch(handleReturnAction(queryParams));

            if (handleReturnAction.fulfilled.match(resultAction)) {
                const result = resultAction.payload;
                if (result.code === '00') {
                    toast.success('Thanh toán thành công');
                    navigate('/booking-history'); // Or your success page
                } else {
                    toast.error(result.message || 'Thanh toán không thành công');
                    navigate('/booking-history'); // Or your failure page
                }
                return result;
            } else {
                throw resultAction.payload;
            }
        } catch (error) {
            toast.error(error.message || 'Xử lý thanh toán thất bại');
            navigate('/booking-history');
            throw error;
        }
    };

    return {
        createPayment,
        handlePaymentReturn,
        clearVnPayState
    };
};

export default useVnPayService;