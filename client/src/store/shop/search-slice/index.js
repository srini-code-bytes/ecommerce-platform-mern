
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    isLoading : false,
    searchResults: []
}

export const getSearchResults = createAsyncThunk('/search/getSearchResults',
    async (searchTerm) => {

        console.log(" getSearchResults searchTerm===>", searchTerm)

        // const response = await axios.get(`http://localhost:8080/api/shop/search/${searchTerm}`)

        const response = await axios.get(`http://localhost:8080/api/shop/search?searchTerm=${searchTerm}`)

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