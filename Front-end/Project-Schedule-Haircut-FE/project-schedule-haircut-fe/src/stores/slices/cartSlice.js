import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const getCartItems = createAsyncThunk(
    'cart/getCartItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/customer/cart-items');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addComboToCart = createAsyncThunk(
    'cart/addCombo',
    async (comboData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/web/add/combo', comboData);
            console.log(response);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addServiceToCart = createAsyncThunk(
    'cart/addService',
    async (serviceData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/web/add/service', serviceData);
            console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const countCartItems = createAsyncThunk(
    'cart/countItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/web/count-item');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        loading: false,
        error: null,
        lastUpdated: null,
        totalPrice: 0,
        totalTime: 0,
        addStatus: 'idle',
        itemCount: 0,
        countStatus: 'idle',
    },
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        },
        resetAddStatus: (state) => {
            state.addStatus = 'idle';
            state.error = null;
        },
        resetCountStatus: (state) => {
            state.countStatus = 'idle';
        },
        clearCartItems: (state) => {
            state.items = [];
            state.totalPrice = 0;
            state.totalTime = 0;
            state.lastUpdated = null;
        },
        updateCartItem: (state, action) => {
            const { id, quantity } = action.payload;
            const itemIndex = state.items.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                state.items[itemIndex].quantity = quantity;
                state.totalPrice = state.items.reduce((sum, item) =>
                    sum + (item.price * item.quantity), 0);
                state.totalTime = state.items.reduce((sum, item) =>
                    sum + (item.haircutTime * item.quantity), 0);
            }
        },
        removeCartItem: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter(item => item.id !== id);
            state.totalPrice = state.items.reduce((sum, item) =>
                sum + (item.price * item.quantity), 0);
            state.totalTime = state.items.reduce((sum, item) =>
                sum + (item.haircutTime * item.quantity), 0);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCartItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                    state.totalPrice = action.payload.reduce((sum, item) =>
                        sum + (item?.price || 0), 0);
                    state.totalTime = action.payload.reduce((sum, item) =>
                        sum + (item?.haircutTime || 0), 0);
                } else {
                    state.items = [];
                    state.totalPrice = 0;
                    state.totalTime = 0;
                }
                state.lastUpdated = new Date().toISOString();
                state.error = null;
            })
            .addCase(getCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Không thể lấy danh sách giỏ hàng';
            })
            .addCase(addComboToCart.pending, (state) => {
                state.addStatus = 'loading';
                state.error = null;
            })
            .addCase(addComboToCart.fulfilled, (state) => {
                state.addStatus = 'succeeded';
            })
            .addCase(addComboToCart.rejected, (state, action) => {
                state.addStatus = 'failed';
                state.error = action.payload || 'Thêm combo vào giỏ hàng thất bại';
            })
            .addCase(addServiceToCart.pending, (state) => {
                state.addStatus = 'loading';
                state.error = null;
            })
            .addCase(addServiceToCart.fulfilled, (state) => {
                state.addStatus = 'succeeded';
            })
            .addCase(addServiceToCart.rejected, (state, action) => {
                state.addStatus = 'failed';
                state.error = action.payload || 'Thêm dịch vụ vào giỏ hàng thất bại';
            })

            .addCase(countCartItems.pending, (state) => {
                state.countStatus = 'loading';
            })
            .addCase(countCartItems.fulfilled, (state, action) => {
                state.countStatus = 'succeeded';
                state.itemCount = action.payload;
            })
            .addCase(countCartItems.rejected, (state, action) => {
                state.countStatus = 'failed';
                state.error = action.payload || 'Đếm số lượng item thất bại';
            });
    }
});

// Đảm bảo export tất cả actions cần thiết
export const {
    clearCartError,
    clearCartItems,
    updateCartItem,
    removeCartItem,
    resetAddStatus,
    resetCountStatus,
} = cartSlice.actions;

export default cartSlice.reducer;