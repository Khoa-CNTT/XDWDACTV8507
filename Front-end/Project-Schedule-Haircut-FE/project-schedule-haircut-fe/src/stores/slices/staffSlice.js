import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const staffLogin = createAsyncThunk(
    'staff/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/web/login', credentials);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const staffLogout = createAsyncThunk(
    'staff/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/web/logout');
            return response;
        } catch (error) {
            console.error("API error:", error);
            return rejectWithValue(error);
        }
    }
);

export const fetchBookingStats = createAsyncThunk(
    'staff/fetchBookingStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/employee/booking-stats');
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchHourlyAppointments = createAsyncThunk(
    'staff/fetchHourlyAppointments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/employee/appointments-by-hour');
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchPendingConfirmations = createAsyncThunk(
    'staff/fetchPendingConfirmations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/employee/appointments-confirmation');
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const confirmAppointment = createAsyncThunk(
    'staff/confirmAppointment',
    async (appointmentId, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put('/employee/action-order', {
                orderId: appointmentId,
                status: 1
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi xác nhận');
        }
    }
);

export const cancelAppointment = createAsyncThunk(
    'staff/cancelAppointment',
    async (appointmentId, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put('/employee/action-order', {
                orderId: appointmentId,
                status: -1
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi hủy lịch');
        }
    }
);

const staffSlice = createSlice({
    name: 'staff',
    initialState: {
        staff: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        bookingStats: null,
        hourlyAppointments: [],
        pendingConfirmations: [],
    },
    reducers: {
        clearStaff: (state) => {
            state.staff = null;
            state.isAuthenticated = false;
        },
        clearStaffError: (state) => {
            state.error = null;
        },
        initializeStaff: (state, action) => {
            state.staff = { username: action.payload.username };
            state.isAuthenticated = action.payload.isAuthenticated;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(staffLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(staffLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = action.payload.staff;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(staffLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            .addCase(staffLogout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(staffLogout.fulfilled, (state) => {
                state.loading = false;
                state.staff = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(staffLogout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchBookingStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookingStats.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingStats = action.payload;
            })
            .addCase(fetchBookingStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchHourlyAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHourlyAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.hourlyAppointments = action.payload;
            })
            .addCase(fetchHourlyAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchPendingConfirmations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPendingConfirmations.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingConfirmations = action.payload;
            })
            .addCase(fetchPendingConfirmations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(confirmAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingConfirmations = state.pendingConfirmations.filter(
                    appt => appt.id !== action.meta.arg
                );
            })
            .addCase(confirmAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(cancelAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingConfirmations = state.pendingConfirmations.filter(
                    appt => appt.id !== action.meta.arg
                );
            })
            .addCase(cancelAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearStaff, clearStaffError, initializeStaff } = staffSlice.actions;

export default staffSlice.reducer;
