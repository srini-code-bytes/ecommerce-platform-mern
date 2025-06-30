import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  message: ""
};

export const forgotPassword = createAsyncThunk(
  "/auth/forgotpassword",
  async (formData) => {
    try {
      const response = await axiosInstance.post(
        "/auth/forgot-password",
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      throw error;
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "/auth/verifyotp",
  async (formData) => {
    try {
      const response = await axiosInstance.post(
        "/auth/verify-otp",
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in verifyOtp:", error);
      throw error;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "/auth/resetPassword",
  async (formData) => {
    try {
      const response = await axiosInstance.post(
        "/auth/reset-password",
        formData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in resetPassword:", error);
      throw error;
    }
  }
);

// Create a slice for the forgot password state
const forgotPasswordSlice = createSlice({
  name: "forgot-password",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        console.log("** action.payload forgotPassword.fulfilled **", action.payload);
        state.isLoading = false;
        state.message = action.payload.message || "OTP sent to your email";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload || "Failed to send OTP. Please try again later.";
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        console.log("** action.payload verifyOtp.fulfilled **", action.payload);
        state.isLoading = false;
        state.message = action.payload.message || "OTP verified successfully";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        console.log("** verifyOtp.rejected **");
        console.log("** action.error.message verifyOtp.rejected **", action.error.message); // undefined
        state.isLoading = false;
        state.message = "Invalid or expired OTP. Please try again.";
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        console.log("** action.payload resetPassword.fulfilled **", action.payload);
        state.isLoading = false;
        state.message = action.payload.message || "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload || "Failed to reset password. Please try again later.";
      });
  },
});

export default forgotPasswordSlice.reducer;
