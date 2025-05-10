import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

// Async thunk để gửi tin nhắn đến chatbot
export const sendChatMessage = createAsyncThunk(
    'ai/sendMessage',
    async (message, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/web/chatbot/ask', {
                message: typeof message === 'string' ? message : JSON.stringify(message)
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk để xác nhận đặt lịch
export const confirmBooking = createAsyncThunk(
    'ai/confirmBooking',
    async (bookingDetails, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/web/chatbot/confirm-booking', bookingDetails);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const aiSlice = createSlice({
    name: 'ai',
    initialState: {
        messages: [], // Lưu trữ các tin nhắn giữa người dùng và chatbot
        isLoading: false, // Trạng thái loading
        error: null, // Lưu trữ lỗi nếu có
        bookingInfo: null // Lưu thông tin đặt lịch
    },
    reducers: {
        clearMessages: (state) => {
            state.messages = [];
            state.bookingInfo = null;
        },
        addMessage: (state, action) => {
            state.messages.push({
                ...action.payload,
                id: Date.now(),
                timestamp: new Date().toISOString()
            });
        },
        setBookingInfo: (state, action) => {
            state.bookingInfo = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý trạng thái pending
            .addMatcher(
                (action) =>
                    action.type.endsWith('/pending') &&
                    ['ai/sendMessage', 'ai/confirmBooking'].some((type) =>
                        action.type.startsWith(type)
                    ),
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            // Xử lý trạng thái fulfilled
            .addMatcher(
                (action) =>
                    action.type.endsWith('/fulfilled') &&
                    ['ai/sendMessage', 'ai/confirmBooking'].some((type) =>
                        action.type.startsWith(type)
                    ),
                (state, action) => {
                    state.isLoading = false;

                    // Nếu là phản hồi từ chatbot
                    if (action.type === 'ai/sendMessage/fulfilled') {
                        state.messages.push({
                            text: action.payload,
                            isBot: true,
                            isError: false,
                            id: Date.now(),
                            timestamp: new Date().toISOString()
                        });
                    }

                    // Nếu là xác nhận đặt lịch
                    if (action.type === 'ai/confirmBooking/fulfilled') {
                        state.bookingInfo = action.payload;
                        state.messages.push({
                            text: action.payload.confirmation,
                            isBot: true,
                            isError: false,
                            id: Date.now(),
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            )
            // Xử lý trạng thái rejected
            .addMatcher(
                (action) =>
                    action.type.endsWith('/rejected') &&
                    ['ai/sendMessage', 'ai/confirmBooking'].some((type) =>
                        action.type.startsWith(type)
                    ),
                (state, action) => {
                    state.isLoading = false;
                    state.messages.push({
                        text: action.payload?.message || 'Đã xảy ra lỗi',
                        isBot: true,
                        isError: true,
                        id: Date.now(),
                        timestamp: new Date().toISOString()
                    });
                }
            );
    }
});

export const { clearMessages, addMessage, setBookingInfo } = aiSlice.actions;
export default aiSlice.reducer;