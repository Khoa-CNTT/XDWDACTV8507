import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:9090/api/v1';

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
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
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.get(API_URL + '/web/refresh-token', {
                    withCredentials: true
                });

                return axiosClient(originalRequest); // retry request gốc
            } catch (refreshError) {
                window.location.href = '/home'; // hoặc chuyển sang trang login
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error.response?.data || error.message);
    }
);


export default axiosClient;