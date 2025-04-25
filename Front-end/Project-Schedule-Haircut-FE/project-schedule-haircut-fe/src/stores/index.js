import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import employeeReducer from './slices/employeeSlice';
import passwordReducer from './slices/passwordSlice';
import profileReducer from './slices/profileSlice';
import menuItemsReducer from './slices/menuItemsSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import bookedReducer from './slices/bookedSlice';
import actionFormReducer from './slices/actionFormSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
        categories: categoryReducer,
        employees: employeeReducer,
        password: passwordReducer,
        profile: profileReducer,
        menuItems: menuItemsReducer,
        cart: cartReducer,
        order: orderReducer,
        booked: bookedReducer,
        actionForm: actionFormReducer,
    },
});

export default store;