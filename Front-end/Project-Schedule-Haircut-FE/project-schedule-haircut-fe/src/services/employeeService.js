import { useDispatch } from 'react-redux';
import {
    fetchAllEmployees as fetchAllEmployeesAction,
    clearError
} from '../stores/slices/employeeSlice';
import { toast } from 'react-toastify';
const useEmployeeService = () => {
    const dispatch = useDispatch();
    const getEmployees = async () => {
        try {
            dispatch(clearError());
            const resultAction = await dispatch(fetchAllCategoriesAction());

            if (fetchAllCategoriesAction.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                throw resultAction.payload;
            }
        } catch (error) {
            console.log(error);

            toast.error('Lỗi khi tải danh sách nhân viên');
            throw error;
        }
    };

    return { getEmployees };
};

export default useEmployeeService;