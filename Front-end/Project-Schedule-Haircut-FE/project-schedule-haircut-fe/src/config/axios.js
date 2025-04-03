import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
    baseURL: 'http://localhost:9090/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Thêm dòng này để hỗ trợ cookie
});

// Xử lý request
axiosClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý response
axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Xử lý khi hết phiên đăng nhập
                    window.location.href = '/home';
                    break;
                case 403:
                    console.error('Bạn không có quyền truy cập');
                    break;
                default:
                    console.error('Lỗi API:', error.response.data);
            }
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

export default axiosClient;