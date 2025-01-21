

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice"
import shopAddressSlice from "./shop/address-slice"
import shopOrderSlice from "./shop/order-slice"
import adminOrderSlice from "./admin/order-slice"


export const store = configureStore({


  //Combine reducers into a global reducer
  reducer: {
    auth: authReducer,
    adminProducts: adminProductsSlice,
    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    adminOrder: adminOrderSlice
  },
  devTools : process.env.NODE_ENV !== 'production'
});

export default store;
