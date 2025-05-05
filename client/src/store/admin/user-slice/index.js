
import axiosInstance from '@/api/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    usersList: [],
    isLoading: false,
    error: null
}

export const getAllUsers = createAsyncThunk(
    "/users/getAllUsers",
    async () => {
      const result = await axiosInstance.get(
        "/admin/users/get-all-users"
      );
      return result?.data;
    }
  );

const AllUsersSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        console.log(action.payload.users);
        state.isLoading = false;
        state.usersList = action.payload.users;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.usersList = [];
        state.error = action.payload || "Failed to fetch users";
      });
  },
});

export default AllUsersSlice.reducer;