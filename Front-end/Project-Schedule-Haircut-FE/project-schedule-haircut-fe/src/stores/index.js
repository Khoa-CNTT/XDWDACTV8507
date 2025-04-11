import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import employeeReducer from './slices/employeeSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        categories: categoryReducer,
        employees: employeeReducer,
    },
});

export default store;