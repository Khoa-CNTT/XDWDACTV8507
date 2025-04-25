import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const createVnPayPayment = createAsyncThunk(
    'vnpay/createPayment',
    async ({ amount, orderInfo }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/customer/payment/create-payment', {
                params: { amount, orderInfo }
            });

            // Thêm console.log để debug
            console.log('VNPay response:', response.data);

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const handlePaymentReturn = createAsyncThunk(
    'vnpay/paymentReturn',
    async (queryParams, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/customer/payment/payment-return', {
                params: queryParams
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const vnpaySlice = createSlice({
    name: 'vnpay',
    initialState: {
        paymentUrl: null,
        paymentResult: null,
        loading: false,
        error: null
    },
    reducers: {
        clearVnPayState: (state) => {
            state.paymentUrl = null;
            state.paymentResult = null;
            state.error = null;
        },
        resetPaymentResult: (state) => {
            state.paymentResult = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Payment
            .addCase(createVnPayPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVnPayPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentUrl = action.payload.data;
            })
            .addCase(createVnPayPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle Payment Return
            .addCase(handlePaymentReturn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(handlePaymentReturn.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentResult = action.payload;
            })
            .addCase(handlePaymentReturn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearVnPayState, resetPaymentResult } = vnpaySlice.actions;
export default vnpaySlice.reducer;