
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    isLoading : false,
    searchResults: []
}

export const getSearchResults = createAsyncThunk('/search/getSearchResults',
    async (keyword) => {

        const response = await axios.get(`http://localhost:8080/api/shop/search/${keyword}`)

        return response.data;

    })

const shoppingSearchSlice = createSlice({
    name: 'shoppingSearchSlice',
    initialState,
    reducers: { 
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

export default shoppingSearchSlice.reducer;