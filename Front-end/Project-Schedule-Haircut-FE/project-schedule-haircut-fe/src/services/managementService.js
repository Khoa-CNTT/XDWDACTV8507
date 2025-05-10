import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCustomers,
    fetchServices,
    fetchCombos,
    clearManagementError
} from '../stores/slices/managementSlice';
import { toast } from 'react-toastify';

const useManagementService = () => {
    const dispatch = useDispatch();
    const managementState = useSelector((state) => state.management);

    const getCustomers = async () => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(fetchCustomers());

            if (fetchCustomers.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Failed to fetch customers';
                throw new Error(errorMsg);
            }
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const getServices = async () => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(fetchServices());

            if (fetchServices.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Failed to fetch services';
                throw new Error(errorMsg);
            }
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const getCombos = async () => {
        try {
            dispatch(clearManagementError());
            const resultAction = await dispatch(fetchCombos());

            if (fetchCombos.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Failed to fetch combos';
                throw new Error(errorMsg);
            }
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    return {
        getCustomers,
        getServices,
        getCombos,
        managementState,
    };
};

export default useManagementService;