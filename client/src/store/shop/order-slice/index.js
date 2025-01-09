import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";




const initialState = {
    approvalURL: null,
    isLoading: false,
    orderId: null
}

export const createNewOrder = createAsyncThunk('/order/createNewOrder',
    async (orderData) => {

        const response = await axios.post('http://localhost:8080/api/shop/order/create', orderData)

        return response.data;

    })

export const capturePayment = createAsyncThunk('/order/capturePayment',
    async ( {payerId, paymentId, orderId}) => {
        const response = await axios.post('http://localhost:8080/api/shop/order/capture', { payerId, paymentId, orderId })

        return response.data;

    })

const shoppingOrderSlice = createSlice({
    name: 'shoppingOrderSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createNewOrder.pending, (state) => {
            state.isLoading = true;
        }).addCase(createNewOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.approvalURL = action.payload.approvalURL
            state.orderId = action.payload.orderId
            sessionStorage.setItem(
                "currentOrderId",
                JSON.stringify(action.payload.orderId)
            )
        }).addCase(createNewOrder.rejected, (state) => {
            state.isLoading = false;
            state.approvalURL = null;
            state.orderId = null;
        })
    },



});

export default shoppingOrderSlice.reducer;