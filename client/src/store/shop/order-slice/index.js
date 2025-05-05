import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    approvalURL: null,
    isLoading: false,
    orderId: null,
    orderList: [],
    orderDetails: null
}

export const createNewOrder = createAsyncThunk('/order/createNewOrder',
    async (orderData) => {

        const response = await axiosInstance.post('/shop/order/create', orderData)

        return response.data;

    })

export const capturePayment = createAsyncThunk('/order/capturePayment',
    async ({ payerId, paymentId, orderId }) => {
        const response = await axiosInstance.post('/shop/order/capture', { payerId, paymentId, orderId })

        return response.data;

    })

export const getAllOrdersByUserId = createAsyncThunk('/order/getAllOrdersByUserId',
    async (userId) => {
        const response = await axiosInstance.get(`/shop/order/list/${userId}`)

        return response.data;

    })

export const getOrderDetails = createAsyncThunk('/order/getOrderDetails',
    async (id) => {
        console.log("Inside getOrderDetails=====>")
        const response = await axiosInstance.get(`/shop/order/details/${id}`)

        console.log("response=====>", response)

        return response.data;

    })

const shoppingOrderSlice = createSlice({
    name: 'shoppingOrderSlice',
    initialState,
    reducers: { // Why in reducer?
        resetOrderDetails : (state) => {
            state.orderDetails = null
        }
    },
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
        }).addCase(getAllOrdersByUserId.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderList = action.payload.data;
 
        }).addCase(getAllOrdersByUserId.rejected, (state) => {
            state.isLoading = false;
            state.orderList = []
        }).addCase(getOrderDetails.pending, (state) => {
            state.isLoading = true;
        }).addCase(getOrderDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderDetails = action.payload.data;
 
        }).addCase(getOrderDetails.rejected, (state) => {
            state.isLoading = false;
            state.orderDetails = null;
        })
    },



});

export const resetOrderDetails = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;