import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  productList: [],
  page: 1,
  hasMore: true,
  status: "idle",
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axiosInstance.post(
      "/admin/products/add",
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
    const result = await axiosInstance.get(
      `/admin/products/get?page=${page}&limit=${limit}`
    );
    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    console.log("formData inside editProduct ====>", typeof formData, formData);
    console.log("id====>", typeof id, id);
    const result = await axiosInstance.put(
      `/admin/products/edit/${id}`,
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
    const result = await axiosInstance.delete(`/admin/products/delete/${id}`);
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
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.productList.push(...action.payload.products);
        state.hasMore = action.payload.hasMore;
        state.status = "success";
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(editProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.productList.findIndex(
          (product) => product._id === action.payload.data._id
        );
        console.log("index ====>", index);
        console.log("action.payload ====>", action.payload.data);
        if (index !== -1) {
          state.productList[index] = action.payload.data;
        }
        state.status = "success";
      })
      .addCase(editProduct.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        console.log("deleteProduct action.payload ====>", action.payload);
        state.productList = state.productList.filter(
          (product) => product._id !== action.payload.data._id
        );
        state.status = "success";
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { incrementPage, resetProducts } = AdminProductsSlice.actions;
export default AdminProductsSlice.reducer;
