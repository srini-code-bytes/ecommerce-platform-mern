

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice"
import shopAddressSlice from "./shop/address-slice"
import shopOrderSlice from "./shop/order-slice"
import adminOrderSlice from "./admin/order-slice"
import shopSearchSlice from "./shop/search-slice"
import shopReviewSlice from "./shop/review-slice"
import commonFeatureSlice from "./common-slice"
import AllUsersSlice from "./admin/user-slice"
import forgotPasswordSlice from "./forgot-password-slice";

export const store = configureStore({
  //Combine reducers into a global reducer
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    adminAllUsers: AllUsersSlice,
    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    adminOrder: adminOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    commonFeature: commonFeatureSlice,
    forgotPassword: forgotPasswordSlice
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
