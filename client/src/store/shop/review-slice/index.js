import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    reviews: []
}

export const addProductReview = createAsyncThunk('/review/addProductReview',
    async (reviewData) => {
        console.log("reviewData", reviewData)
        const response = await axiosInstance.post(`/shop/review/add-review`, reviewData)
        return response.data;

    }
)

export const getProductReviews = createAsyncThunk('/review/getProductReviews',
    async (productId) => {
        const response = await axiosInstance.get(`/shop/review/${productId}`)
        return response.data;
    }
)

const shoppingReviewSlice = createSlice({
    name: 'shoppingReviewSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProductReviews.pending, (state) => {
            state.isLoading = true;
        }).addCase(getProductReviews.fulfilled, (state, action) => {
            state.isLoading = false;
            state.reviews = action.payload.data;
        }).addCase(getProductReviews.rejected, (state) => {
            state.isLoading = false;
            state.reviews = []
        })
    },
});

export default shoppingReviewSlice.reducer;