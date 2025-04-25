import { useDispatch, useSelector } from 'react-redux';
import {
    getCartItems as getCartItemsAction,
    clearCartError,
    updateCartItem,
    removeCartItem,
    addComboToCart,
    addServiceToCart,
    resetAddStatus,
    countCartItems,
} from '../stores/slices/cartSlice';
import { toast } from 'react-toastify';

const useCartService = () => {
    const dispatch = useDispatch();
    const addStatus = useSelector(state => state.cart.addStatus);
    const error = useSelector(state => state.cart.error);
    const countStatus = useSelector(state => state.cart.countStatus);
    const itemCount = useSelector(state => state.cart.itemCount);

    const fetchCartItems = async () => {
        try {
            dispatch(clearCartError());
            const resultAction = await dispatch(getCartItemsAction());

            if (getCartItemsAction.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Lấy danh sách giỏ hàng thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const updateItemQuantity = async (itemId, quantity) => {
        try {
            dispatch(updateCartItem({ id: itemId, quantity }));
            // Nếu cần gọi API để cập nhật trên server, có thể thêm ở đây
            // await axiosClient.put(`/customer/cart-items/${itemId}`, { quantity });
        } catch (error) {
            toast.error('Cập nhật số lượng thất bại');
            throw error;
        }
    };

    const deleteItem = async (itemId) => {
        try {
            dispatch(removeCartItem(itemId));
            // Nếu cần gọi API để xóa trên server, có thể thêm ở đây
            // await axiosClient.delete(`/customer/cart-items/${itemId}`);
        } catch (error) {
            toast.error('Xóa sản phẩm khỏi giỏ hàng thất bại');
            throw error;
        }
    };

    const addCombo = async (comboData) => {
        try {
            dispatch(clearCartError());
            const resultAction = await dispatch(addComboToCart(comboData));

            if (addComboToCart.fulfilled.match(resultAction)) {
                return true;
            } else {
                throw resultAction.payload;
            }
        } catch (error) {
            toast.error(error.message || 'Thêm combo vào giỏ hàng thất bại');
            return false;
        } finally {
            // Reset trạng thái sau 3 giây
            setTimeout(() => dispatch(resetAddStatus()), 3000);
        }
    };

    const addService = async (serviceData) => {
        try {
            dispatch(clearCartError());
            const resultAction = await dispatch(addServiceToCart(serviceData));

            if (addServiceToCart.fulfilled.match(resultAction)) {
                return true;
            } else {
                throw resultAction.payload;
            }
        } catch (error) {
            toast.error(error.message || 'Thêm dịch vụ vào giỏ hàng thất bại');
            return false;
        } finally {
            // Reset trạng thái sau 3 giây
            setTimeout(() => dispatch(resetAddStatus()), 3000);
        }
    };


    const fetchItemCount = async () => {
        try {
            dispatch(clearCartError());
            const resultAction = await dispatch(countCartItems());

            if (countCartItems.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                throw resultAction.payload;
            }
        } catch (error) {
            toast.error(error.message || 'Không thể đếm số lượng item');
            throw error;
        }
    };
    return {
        fetchCartItems,
        updateItemQuantity,
        deleteItem,
        addCombo,
        addService,
        addStatus,
        error,
        fetchItemCount,
        countStatus,
        itemCount
    };
};

export default useCartService;