import { useDispatch } from 'react-redux';
import {
    fetchProfile,
    clearProfileError,
} from '../stores/slices/profileSlice';
import { toast } from 'react-toastify';

const useProfileService = () => {
    const dispatch = useDispatch();

    const getProfile = async (username) => {
        try {
            dispatch(clearProfileError());
            const resultAction = await dispatch(fetchProfile(username));

            if (fetchProfile.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.response?.data?.message
                    || resultAction.payload?.message
                    || 'Lấy thông tin thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi lấy thông tin người dùng');
            throw error;
        }
    };

    return {
        getProfile,
    };
};

export default useProfileService;
