

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null,
  error: null,
  limit: 0,
  page: 0,
  totalOrders: 0,
  totalPages: 0
}

export const getAllOrdersForAdmin = createAsyncThunk('/orders/getAllOrdersByUserId',
  async ({ currentPage, limit }) => {
    console.log("getAllOrdersForAdmin currentPage && limit", currentPage, limit)
    const response = await axios.get(`http://localhost:8080/api/admin/orders/get?page=${currentPage}&limit=${limit}`)
    return response.data;
  })

export const getOrderDetailsForAdmin = createAsyncThunk(
  '/orders/getOrderDetailsForAdmin',
  async (id) => {
    try {
      console.log("Fetching details for ID:", id);
      const response = await axios.get(
        `http://localhost:8080/api/admin/orders/details/${id}`
      );
      console.log("API response:", response);
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  '/orders/updateOrderStatus',
  async ({ id, orderStatus }) => {
    console.log("updateOrderStatus id====>", id);
    console.log("updateOrderStatus orderStatus====>", orderStatus);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/admin/orders/update-order/${id}`, {
        orderStatus
      }
      );
      console.log("updateOrderStatus API response:", response);
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  }
);

const adminOrderSlice = createSlice({
  name: 'adminOrderSlice',
  initialState,
  reducers: {
    resetOrderDetailsForAdmin: (state) => {
      state.orderDetails = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllOrdersForAdmin.pending, (state) => {
      state.isLoading = true;
    }).addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      const allOrders = action.payload.data;
      state.orderList = allOrders;
      state.isLoading = false;
      state.totalOrders = action.payload.totalOrders;
      state.totalPages = action.payload.totalPages;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
    }).addCase(getAllOrdersForAdmin.rejected, (state, action) => {
      state.isLoading = false;
      state.orderList = []
      state.error = action.payload || "Failed to fetch all orders";
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

export const resetOrderDetailsForAdmin = adminOrderSlice.actions;

export default adminOrderSlice.reducer;