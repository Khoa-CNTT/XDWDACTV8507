// src/services/authService.js
import { useDispatch } from 'react-redux';
import { login as loginAction, logout as logoutAction, clearError, register as registerAction } from '../stores/slices/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const useAuthService = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const login = async (credentials) => {
        try {
            dispatch(clearError());
            const resultAction = await dispatch(loginAction(credentials));

            if (loginAction.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.response?.data?.message
                    || resultAction.payload?.message
                    || 'Đăng nhập thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            dispatch(clearError());
            const resultAction = await dispatch(logoutAction());

            if (logoutAction.fulfilled.match(resultAction)) {
                toast.success('Đăng xuất thành công');

                navigate('/home');
                return true;
            } else {
                throw resultAction.payload;
            }
        } catch (error) {
            throw new Error(error.message || 'Đăng xuất thất bại');
        }
    };

    const register = async (userData) => {
        try {
            dispatch(clearError());
            await dispatch(registerAction(userData)).unwrap();
            toast.success('Đăng ký thành công');
            navigate('/home');
        } catch (error) {
            throw error;
        }
    };

    return {
        login,
        logout,
        register
    };
};

export default useAuthService;