import { useDispatch, useSelector } from 'react-redux';
import { staffLogin, staffLogout, clearStaffError, fetchBookingStats, fetchHourlyAppointments, fetchPendingConfirmations, cancelAppointment, confirmAppointment } from '../stores/slices/staffSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const useStaffService = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const staffSelector = useSelector((state) => state.staff);

    const login = async (credentials) => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(staffLogin(credentials));

            if (staffLogin.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.response?.data?.message
                    || resultAction.payload?.message
                    || 'Đăng nhập nhân viên thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(staffLogout());

            if (staffLogout.fulfilled.match(resultAction)) {
                toast.success('Đăng xuất thành công');
                window.location.reload();
                return true;
            } else {
                throw resultAction.payload;
            }
        } catch (error) {
            throw new Error(error.message || 'Đăng xuất nhân viên thất bại');
        }
    };

    const getStats = async () => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(fetchBookingStats());
            console.log(resultAction);

            if (fetchBookingStats.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Lỗi khi lấy thống kê';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const getHourlyAppointments = async () => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(fetchHourlyAppointments());

            if (fetchHourlyAppointments.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Lỗi khi lấy lịch theo giờ';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const getPendingConfirmations = async () => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(fetchPendingConfirmations());

            if (fetchPendingConfirmations.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Lỗi khi lấy danh sách chờ xác nhận';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const confirm = async (appointmentId) => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(confirmAppointment(appointmentId));

            if (confirmAppointment.fulfilled.match(resultAction)) {
                // Tự động refresh data sau khi thành công
                getPendingConfirmations();
                getStats();
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload || 'Xác nhận lịch hẹn thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const cancel = async (appointmentId) => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(cancelAppointment(appointmentId));

            if (cancelAppointment.fulfilled.match(resultAction)) {
                // Tự động refresh data sau khi thành công
                getPendingConfirmations();
                getStats();
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload || 'Hủy lịch hẹn thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    return {
        login,
        logout,
        getStats,
        getHourlyAppointments,
        getPendingConfirmations,
        confirmAppointment: confirm,
        cancelAppointment: cancel,
        staffSelector
    };
};

export default useStaffService;
