import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice'


export const store = configureStore({
    //Combine reducers into a global reducer
    reducer : {
        auth : authReducer
    },
});