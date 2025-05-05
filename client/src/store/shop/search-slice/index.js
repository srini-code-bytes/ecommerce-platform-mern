
import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading : false,
    searchResults: []
}

export const getSearchResults = createAsyncThunk('/search/getSearchResults',
    async (searchTerm) => {

        console.log(" getSearchResults searchTerm===>", searchTerm)

        const response = await axiosInstance.get(`/shop/search?searchTerm=${searchTerm}`)

        console.log(" getSearchResults response===>", response)
        return response.data;

    })

const shoppingSearchSlice = createSlice({
    name: 'shoppingSearchSlice',
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