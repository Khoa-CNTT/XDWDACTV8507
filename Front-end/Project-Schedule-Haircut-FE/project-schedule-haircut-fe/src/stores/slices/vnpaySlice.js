import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const createVnPayPayment = createAsyncThunk(
    'vnpay/createPayment',
    async ({ amount, orderInfo }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/customer/vnpay/create', {
                params: {
                    amount: amount * 100, // Convert to VND
                    orderInfo
                }
            });

            return response.data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message,
                code: error.response?.data?.code || 'UNKNOWN_ERROR'
            });
        }
    }
);

const initialState = {
    paymentUrl: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    paymentData: null
};

const vnpaySlice = createSlice({
    name: 'vnpay',
    initialState,
    reducers: {
        resetVnPayState: () => initialState,
        setPaymentStatus: (state, action) => {
            state.status = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createVnPayPayment.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createVnPayPayment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paymentUrl = action.payload.data;
                state.paymentData = action.payload;
            })
            .addCase(createVnPayPayment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetVnPayState, setPaymentStatus } = vnpaySlice.actions;
export default vnpaySlice.reducer;