import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

// Async thunks
export const fetchCustomers = createAsyncThunk(
    'management/fetchCustomers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/admin/customers');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchServices = createAsyncThunk(
    'management/fetchServices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/admin/services');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchCombos = createAsyncThunk(
    'management/fetchCombos',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/admin/combos');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    customers: [],
    services: [],
    combos: [],
    loading: false,
    error: null
};

const managementSlice = createSlice({
    name: 'management',
    initialState,
    reducers: {
        clearManagementError: (state) => {
            state.error = null;
        },
        resetManagementState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            // Customers
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload;
            })

            // Services
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })

            // Combos
            .addCase(fetchCombos.fulfilled, (state, action) => {
                state.loading = false;
                state.combos = action.payload;
            })

            // Common loading
            .addMatcher(
                (action) =>
                    action.type.endsWith('/pending') &&
                    ['management/fetchCustomers', 'management/fetchServices', 'management/fetchCombos'].some((type) =>
                        action.type.startsWith(type)
                    ),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            // Common error handling
            .addMatcher(
                (action) =>
                    action.type.endsWith('/rejected') &&
                    ['management/fetchCustomers', 'management/fetchServices', 'management/fetchCombos'].some((type) =>
                        action.type.startsWith(type)
                    ),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload || 'An error occurred';
                }
            );
    }
});

export const { clearManagementError, resetManagementState } = managementSlice.actions;
export default managementSlice.reducer;