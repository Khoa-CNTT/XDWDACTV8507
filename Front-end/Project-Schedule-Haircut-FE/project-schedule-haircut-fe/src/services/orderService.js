// src/services/orderService.js
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearOrderState } from '../stores/slices/orderSlice';
import { toast } from 'react-toastify';

const useOrderService = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const order = async (orderData) => {
        try {
            dispatch(clearOrderState());
            const resultAction = await dispatch(createOrder(orderData));

            if (createOrder.fulfilled.match(resultAction)) {
                toast.success(resultAction.payload);

                navigate('/home');
            } else {
                const errorMsg =
                    resultAction.payload ||
                    'Đặt lịch thất bại, vui lòng thử lại.';
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.log(error);

            toast.error(error.message);
            throw error;
        }
    };

    return { order };
};

export default useOrderService;
