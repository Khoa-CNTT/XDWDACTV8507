import { useDispatch, useSelector } from 'react-redux';
import {
    sendChatMessage,
    confirmBooking,
    clearMessages,
    addMessage
} from '../stores/slices/aiSlice';
import { toast } from 'react-toastify';

const useAIService = () => {
    const dispatch = useDispatch();
    const { messages, isLoading, bookingInfo } = useSelector(state => state.ai);

    // Gửi tin nhắn đến chatbot
    const sendMessage = async (message) => {
        try {
            // Thêm tin nhắn người dùng vào lịch sử
            dispatch(addMessage({
                text: message,
                isBot: false,
                isError: false
            }));

            // Gửi tin nhắn đến chatbot
            const resultAction = await dispatch(sendChatMessage(message));

            if (sendChatMessage.fulfilled.match(resultAction)) {
                return resultAction.payload; // Trả về phản hồi từ chatbot
            } else {
                throw new Error(resultAction.payload?.message || 'Gửi tin nhắn thất bại');
            }
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    // Xác nhận đặt lịch
    const bookAppointment = async (bookingDetails) => {
        try {
            const resultAction = await dispatch(confirmBooking(bookingDetails));

            if (confirmBooking.fulfilled.match(resultAction)) {
                return resultAction.payload; // Trả về thông tin xác nhận đặt lịch
            } else {
                throw new Error(resultAction.payload?.message || 'Đặt lịch thất bại');
            }
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    // Xóa lịch sử tin nhắn
    const clearChatHistory = () => {
        dispatch(clearMessages());
    };

    return {
        sendMessage,
        bookAppointment,
        clearChatHistory,
        messages,
        isLoading,
        bookingInfo
    };
};

export default useAIService;