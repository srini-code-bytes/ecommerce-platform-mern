import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice'
import adminProductsReducer from './admin/products-slice';


export const store = configureStore({
    //Combine reducers into a global reducer
    reducer : {
        auth : authReducer,
        adminProducts: adminProductsReducer
    },
});

export default store;