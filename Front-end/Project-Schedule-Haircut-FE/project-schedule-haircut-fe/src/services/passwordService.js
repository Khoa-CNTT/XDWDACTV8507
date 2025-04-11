// src/services/passwordService.js
import { useDispatch } from 'react-redux';
import {
    requestChangePassword as requestChangePasswordAction,
    changePassword as changePasswordAction,
    clearPasswordState
} from '../stores/slices/passwordSlice';
import { toast } from 'react-toastify';

const usePasswordService = () => {
    const dispatch = useDispatch();

    const requestChangePassword = async (email) => {
        try {
            dispatch(clearPasswordState());
            const result = await dispatch(requestChangePasswordAction(email)).unwrap();
            toast.success('Mã OTP đã được gửi');
            return result;
        } catch (error) {
            toast.error(error.message || 'Lỗi gửi OTP');
            throw error;
        }
    };

    const changePassword = async (data) => {
        try {
            dispatch(clearPasswordState());
            const result = await dispatch(changePasswordAction(data)).unwrap();
            toast.success('Đổi mật khẩu thành công');
            return result;
        } catch (error) {
            toast.error(error.message || 'Đổi mật khẩu thất bại');
            throw error;
        }
    };

    return {
        requestChangePassword,
        changePassword
    };
};

export default usePasswordService;
