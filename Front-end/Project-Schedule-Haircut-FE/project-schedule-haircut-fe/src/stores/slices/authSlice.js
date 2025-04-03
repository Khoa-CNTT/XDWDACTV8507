// src/stores/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/web/login', credentials);

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/web/logout');

            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
    },
    reducers: {
        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearAuth, clearError, initializeAuth } = authSlice.actions;

export default authSlice.reducer;