// src/services/authService.js
import { useDispatch } from 'react-redux';
import { login as loginAction, logout as logoutAction, clearError } from '../stores/slices/authSlice';
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
                throw resultAction.payload;
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
            console.error('Logout failed:', error);
            throw error;
        }
    };

    return {
        login,
        logout
    };
};

export default useAuthService;