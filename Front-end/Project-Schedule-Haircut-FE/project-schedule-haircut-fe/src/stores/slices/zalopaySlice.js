import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const createZaloPayPayment = createAsyncThunk(
    'zalopay/createPayment',
    async ({ amount, description, orderReferenceId }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/customer/zalopay/create', {
                amount,
                description,
                orderReferenceId
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
    paymentData: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

const zalopaySlice = createSlice({
    name: 'zalopay',
    initialState,
    reducers: {
        resetZaloPayState: () => initialState,
        setZaloPayStatus: (state, action) => {
            state.status = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createZaloPayPayment.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createZaloPayPayment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.paymentData = action.payload;
            })
            .addCase(createZaloPayPayment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { resetZaloPayState, setZaloPayStatus } = zalopaySlice.actions;
export default zalopaySlice.reducer;
