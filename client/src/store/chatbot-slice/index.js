import axiosInstance from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  reply: "",
  error: null,
  usage: {
    prompt: 0,
    completion: 0,
    total: 0,
  },
};

const getGrokReply = createAsyncThunk(
  "/chatbot/getGrokReply",
  async (userMessage, { rejectValue }) => {
    try {
      const response = await axiosInstance.post("/chatbot/chat/handleGroqReply", userMessage);
      return response.data; 
    } catch (e) {
      console.error("Error in getGrokReply:", e);
      return rejectValue(
        e.response?.data || "Failed to fetch reply from Groq API"
      );
    }
  }
);

const chatbotSlice = createSlice({
    name : "chatbot",
    initialState,
    reducers : {},
    extraReducers: (builder) => {
        builder
            .addCase(getGrokReply.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getGrokReply.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reply = action.payload.reply || "";
                state.usage = action.payload.usage || initialState.usage;
            })
            .addCase(getGrokReply.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch reply from Groq API";
            });
    }

})

export { getGrokReply };
export default chatbotSlice.reducer;