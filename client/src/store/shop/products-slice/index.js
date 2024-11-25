
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  isLoading: false,
  productList: [],
};

// fetchAllFilteredProducts - since shopping page
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    console.log("fetchAllFilteredProducts ====>", fetchAllFilteredProducts)
    const result = await axios.get(
      "http://localhost:8080/api/shop/products/get"
    );
    console.log("result===>", result);
    return result?.data.data;
  }
);

const shoppingProductsSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true
    }).addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        console.log("shoppingProductsSlice fulfilled action.payload", action.payload);
        state.isLoading = true,
        state.productList = action.payload;
    }).addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        console.log("shoppingProductsSlice rejected action.payload", action.payload)
        state.isLoading = false,
        state.productList = [];
    })
  },
});

export default shoppingProductsSlice.reducer