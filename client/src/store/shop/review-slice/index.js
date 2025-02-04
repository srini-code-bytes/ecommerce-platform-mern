


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
}

export const addProductReview = createAsyncThunk('/review/addProductReview',
    async (reviewData) => {

        const response = await axios.post(`http://localhost:8080/api/shop/review/add-review`,reviewData)

        return response.data;

    }
)

export const getProductReviews = createAsyncThunk('/review/getProductReviews',
        async (productId) => {
    
            const response = await axios.get(`http://localhost:8080/api/shop/review/${productId}`)
    
            return response.data;
    
        }
)

const shoppingReviewSlice = createSlice({
    name: 'shoppingReviewSlice',
    initialState,
    reducers: { 
        resetSearchResults  : (state) => {
            state.searchResults = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSearchResults.pending, (state) => {
            state.isLoading = true;
        }).addCase(getSearchResults.fulfilled, (state, action) => {
            state.isLoading = false;
            state.searchResults = action.payload.data;
        }).addCase(getSearchResults.rejected, (state) => {
            state.isLoading = false;
            state.searchResults = []
        })
    },
});

export const { resetSearchResults } = shoppingSearchSlice.actions;

export default shoppingSearchSlice.reducer;