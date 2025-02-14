import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    isLoading: false,
    reviews: []
}

export const addProductReview = createAsyncThunk('/review/addProductReview',
    async (reviewData) => {
        console.log("reviewData", reviewData)

        const response = await axios.post(`http://localhost:8080/api/shop/review/add-review`, reviewData)

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