import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch product before adding to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      const product = data.product;

      const discount = Number(product.discount || product.discountPercent || 0);
      const mrp = Number(product.price || 0);
      const finalPrice =
        discount > 0 && discount < 100
          ? Math.round(mrp * (1 - discount / 100))
          : mrp;

      return {
        id: product._id,
        name: product.name,
        price: finalPrice,
        originalPrice: mrp,
        discount,
        stock: product.stock,
        category: product.category,
        size: product.size || "M",
        image: product.images?.[0]?.url,
        quantity,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart item"
      );
    }
  }
);

const initialState = {
  cartItems: Array.isArray(JSON.parse(localStorage.getItem("cartItems")))
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  loading: false,
  error: null,
  success: false,
  message: null,
  shippingInfo: JSON.parse(localStorage.getItem("shippingInfo")) || {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removeMessage: (state) => {
      state.message = null;
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) =>
            item.id !== action.payload.id || item.size !== action.payload.size
          );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    updateItemQuantity: (state, action) => {
      const { id, size, quantity } = action.payload;
      const item = state.cartItems.find(
        (item) => item.id === id && item.size === size
      );

      if (item && quantity > 0 && quantity <= item.stock) {
        item.quantity = quantity;
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
      state.message = "Shipping details saved";
    },

    // ✅ Fully reset cart & localStorage
    clearCart: (state) => {
      state.cartItems = [];
      state.shippingInfo = {};
      state.success = false;
      state.message = null;
      state.error = null;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingInfo");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const newItem = action.payload;
        state.message = `${newItem.quantity} ${newItem.name} added to cart`;

        const existingItem = state.cartItems.find(
          (item) => item.id === newItem.id && item.size === newItem.size
        );
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          state.cartItems.push(newItem);
        }

        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add item to cart";
        state.success = false;
      });
  },
});

export const {
  removeError,
  removeMessage,
  removeItemFromCart,
  updateItemQuantity,
  saveShippingInfo,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
