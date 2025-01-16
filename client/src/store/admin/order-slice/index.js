

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";




const initialState = {
    isLoading: false,
    orderList: [],
    orderDetails: null
}

export const getAllOrdersForAdmin = createAsyncThunk('/orders/getAllOrdersByUserId',
    async () => {
        const response = await axios.get("http://localhost:8080/api/admin/orders/get")

        return response.data;

    })

export const getOrderDetailsForAdmin = createAsyncThunk('/orders/getOrderDetails',
    async (id) => {
        const response = await axios.get(`http://localhost:8080/api/admin/orders/details/${id}`)

        return response.data;

    })

const adminOrderSlice = createSlice({
    name: 'adminOrderSlice',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getAllOrdersForAdmin.pending, (state) => {
            state.isLoading = true;
        }).addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderList = action.payload.data;

        }).addCase(getAllOrdersForAdmin.rejected, (state) => {
            state.isLoading = false;
            state.orderList = []
        }).addCase(getOrderDetailsForAdmin.pending, (state) => {
            state.isLoading = true;
        }).addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderDetails = action.payload.data;

        }).addCase(getOrderDetailsForAdmin.rejected, (state) => {
            state.isLoading = false;
            state.orderDetails = null;
        })
    },



});

export default adminOrderSlice.reducer;