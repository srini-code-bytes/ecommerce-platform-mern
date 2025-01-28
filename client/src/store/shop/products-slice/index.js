
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  isLoading: false,
  productList: [],
  productDetails : null
};

// fetchAllFilteredProducts - since shopping page
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({filterParams, sortParams}) => {
    console.log("fetchAllFilteredProducts ====>", fetchAllFilteredProducts)

    const query = new URLSearchParams({
      ...filterParams,
      sortBy : sortParams

    })
    
    console.log("**fetchAllFilteredProducts query====>", query)
    const result = await axios.get(
      `http://localhost:8080/api/shop/products/get?${query}`
    );
    console.log("result===>", result);
    return result?.data.data;
  }
);

// to fetch the product details 
export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    console.log("fetchProductDetails ====>", fetchProductDetails)
    
    const result = await axios.get(
      `http://localhost:8080/api/shop/products/get/${id}`
    );
    console.log("result===>", result);
    return result?.data;
  }
);

const shoppingProductsSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null
    }
  },
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
    builder.addCase(fetchProductDetails.pending, (state, action) => {
      state.isLoading = true
  }).addCase(fetchProductDetails.fulfilled, (state, action) => {
      state.isLoading = true,
      state.productDetails = action.payload.data;
  }).addCase(fetchProductDetails.rejected, (state, action) => {
      state.isLoading = false,
      state.productDetails = null;
  })
  },
});

export const {setProductDetails} = shoppingProductsSlice.actions;

export default shoppingProductsSlice.reducer