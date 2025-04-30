import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  productList: [],
  page: 1,
  hasMore: true,
  status: 'idle'
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      "http://localhost:8080/api/admin/products/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async (page) => {
    const limit = 8;
    const result = await axios.get(
      `http://localhost:8080/api/admin/products/get?page=${page}&limit=${limit}`
    );
    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    console.log("id====>", typeof id, id)
    const result = await axios.put(
      `http://localhost:8080/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:8080/api/admin/products/delete/${id}`
    );
    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    incrementPage(state) {
      state.page += 1;
    },
    resetProducts(state) {
      state.productList = [];
      state.page = 1;
      state.hasMore = true;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.productList.push(...action.payload.products);
        state.hasMore = action.payload.hasMore;
        state.status = 'success';
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export const { incrementPage, resetProducts } = AdminProductsSlice.actions;
export default AdminProductsSlice.reducer;
