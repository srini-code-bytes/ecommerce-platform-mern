import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

const initialState = {
    isLoading: false,
    featureImageList: [],
    error: null,
    limit : 3,
    page : 1,
    totalImages : 0,
    totalPages : 0
}

export const getFeatureImages = createAsyncThunk(
    "/common/getFeatureImages",
    async ({currentPage, limit}) => {
        console.log("**async thunkkkk limit**", limit)
        const response = await axios.get(`http://localhost:8080/api/common/feature-images/get-feature-images?page=${currentPage}&limit=${limit}`);
        console.log(" getFeatureImages ===> response.data", response.data)
        return response.data;
    }
)

export const addFeatureImage = createAsyncThunk(
    "/common/addFeatureImage",
    async (images, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:8080/api/common/feature-images/add-feature-image', { images });
            console.log("** addFeatureImage ** ", response.data)

            if (!response.data.success) {
                return rejectWithValue(response.data.error || "Failed to add the image")
            }
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data || "Server error")
        }
    }
)

export const deleteFeatureImage = createAsyncThunk(
    "/common/deleteFeatureImage",
    async (public_id) => {
        const response = await axios.delete(`http://localhost:8080/api/common/feature-images/delete-feature-image/${public_id}`)
        return response.data;
    }
)

const commonSlice = createSlice({
    name: "commonSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addFeatureImage.pending, (state) => {
                state.isLoading = false;
            })
            .addCase(addFeatureImage.fulfilled, (state, action) => {
                state.isLoading = true;
                const newImages = action.payload.data;
                state.featureImageList = newImages;
                state.isLoading = false;

            })
            .addCase(addFeatureImage.rejected, (state) => {
                state.isLoading = false;
                state.featureImageList = [];
            })
            .addCase(getFeatureImages.pending, (state) => {
                state.isLoading = false;
            })
            .addCase(getFeatureImages.fulfilled, (state, action) => {
                state.isLoading = true;
                const allImages = action.payload.data;
                state.featureImageList = allImages;
                state.isLoading = false;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
                state.totalImages = action.payload.totalImages;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getFeatureImages.rejected, (state) => {
                state.isLoading = false;
                state.featureImageList = [];
            })
            .addCase(deleteFeatureImage.pending, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(deleteFeatureImage.fulfilled, (state, action) => {
                state.isLoading = false;

            })
            .addCase(deleteFeatureImage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to delete the image";
            })
    }
})

export default commonSlice.reducer;

