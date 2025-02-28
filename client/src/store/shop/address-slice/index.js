
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
    isLoading: false,
    addressList: [],
}

export const addNewAddress = createAsyncThunk(
    '/address/addNewAddress',
    async (formData) => {
        const response = await axios.post('http://localhost:8080/api/shop/address/add-address', formData);

        return response.data;
    }
)

export const fetchAllAddresses = createAsyncThunk(
    '/address/fetchAllAddresses',
    async (userId) => {
        const response = await axios.get(`http://localhost:8080/api/shop/address/get-address/${userId}`);

        return response.data;
    }
)

export const editAddress = createAsyncThunk(
    '/address/editAddress',
    async ({userId, addressId, formData}) => {
        const response = await axios.put(`http://localhost:8080/api/shop/address/edit-address/${userId}/${addressId}`, formData);

        return response.data;
    }
)

export const deleteAddress = createAsyncThunk(
    'address/deleteAddress',
    async ({userId, addressId}) => {
        const response = await axios.delete(`http://localhost:8080/api/shop/address/delete-address/${userId}/${addressId}`);

        return response.data;
    }
)

// Slice
const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addNewAddress.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(addNewAddress.fulfilled, (state, action) => {
            state.isLoading = false;
            // state.addressList = action.payload.data;
        })
        builder.addCase(addNewAddress.rejected, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(fetchAllAddresses.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(fetchAllAddresses.fulfilled, (state, action) => {
            state.isLoading = false;
            state.addressList = action.payload.data;
        })
        builder.addCase(fetchAllAddresses.rejected, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(editAddress.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(editAddress.fulfilled, (state, action) => {
            state.isLoading = false;
            // state.addressList = action.payload.data;
        })
        builder.addCase(editAddress.rejected, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(deleteAddress.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(deleteAddress.fulfilled, (state, action) => {
            state.isLoading = false;
            state.addressList = action.payload.data;
        })
        builder.addCase(deleteAddress.rejected, (state, action) => {
            state.isLoading = false;
        })
    }

})

export default addressSlice.reducer;
