import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }) => {
    const token = Cookies.get('accessToken');
    const [redirect, setRedirect] = useState(false);
    const hasWarned = useRef(false); // Dùng ref để không reset khi re-render

    useEffect(() => {
        if (!token && !hasWarned.current) {
            toast.warn('Bạn cần đăng nhập để truy cập giỏ hàng');
            hasWarned.current = true; // Đánh dấu đã toast
            setTimeout(() => {
                setRedirect(true);
            }, 1000);
        }
    }, [token]);

    if (!token && redirect) {
        return <Navigate to="/home" />;
    }

    if (!token) return null;

    return children;
};

export default PrivateRoute;
