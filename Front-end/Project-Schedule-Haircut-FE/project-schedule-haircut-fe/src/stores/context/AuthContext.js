import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth } from '../slices/authSlice';
import axiosClient from '../../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const reduxDispatch = useDispatch();
    const { user: reduxUser, isAuthenticated } = useSelector(state => state.auth);

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(reduxUser);

    useEffect(() => {
        // Cập nhật user context mỗi khi redux thay đổi
        setUser(reduxUser);
    }, [reduxUser]);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const accessToken = getCookie('accessToken');
                const refreshToken = getCookie('refreshToken');

                // Nếu không có refreshToken thì người dùng chưa đăng nhập
                if (!refreshToken) {
                    setLoading(false);
                    return;
                }

                if (!accessToken) {
                    // Có refreshToken nhưng không có accessToken => gọi refresh
                    const res = await axiosClient.get('/web/refresh-token');
                    console.log('Refresh token thành công:', res);

                    if (res?.username) {
                        reduxDispatch(initializeAuth({
                            username: res.username,
                            isAuthenticated: true
                        }));
                    }
                } else {
                    // Có accessToken => đăng nhập bình thường
                    const username = getCookie('username');
                    reduxDispatch(initializeAuth({
                        username: username || '',
                        isAuthenticated: true
                    }));
                }
            } catch (error) {
                console.log("Không thể refresh ban đầu:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        checkLogin();
    }, [reduxDispatch]);

    // Hàm đọc cookie
    const getCookie = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
        return null;
    };

    return (
        <AuthContext.Provider value={{
            user,
            username: user?.username || '',
            isAuthenticated,
            loading,
            dispatch: reduxDispatch
        }}>
            {loading ? <div>Đang kiểm tra đăng nhập...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
