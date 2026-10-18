import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/product/productSlice";
import userReducer from "../features/user/userSlice";
import cartReducer from "../features/cart/cartSlice";
import orderSlice from "../features/order/orderSlice"
import adminSlice from "../features/admin/adminSlice";




export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderSlice,
    admin: adminSlice
  },
});
