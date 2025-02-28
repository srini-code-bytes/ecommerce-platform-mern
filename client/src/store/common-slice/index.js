import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


const initialState = {
    isLoading: false,
    featureImageList: [],
    error: null
}

export const getFeatureImages = createAsyncThunk(
    "/common/getFeatureImages",
    async () => {
        const response = await axios.get('http://localhost:8080/api/common/feature-images/get-feature-images');
        return response.data;
    }
)

export const addFeatureImage = createAsyncThunk(
    "/common/addFeatureImage",
    async (image) => {
        const response = await axios.post('http://localhost:8080/api/common/feature-images/add-feature-image', { image });
        return response.data;
    }
)

export const deleteFeatureImage = createAsyncThunk(
    "/common/deleteFeatureImage",
    async (imageId) => {
        const response = await axios.delete(`http://localhost:8080/api/common/feature-images/delete-feature-image/${imageId}`)
        return response.data;
    }
)

const commonSlice = createSlice({
    name: "commonSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFeatureImages.pending, (state) => {
                state.isLoading = false;
            })
            .addCase(getFeatureImages.fulfilled, (state, action) => {
                state.isLoading = true;
                state.featureImageList = action.payload.data;
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
                console.log("**deleteFeatureImage.fulfilled action.payload**", action.payload)
                state.isLoading = false;
                if (action.payload) {
                    state.featureImageList = state.featureImageList.filter((image) => image.id !== action.payload.id);
                }
            })
            .addCase(deleteFeatureImage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to delete the image";
            })
    }
})

export default commonSlice.reducer;

