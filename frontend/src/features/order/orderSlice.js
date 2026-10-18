import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Create Order

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, thunkAPI) => {
    try {
      const response = await axios.post("/api/v1/new/order", orderData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // if backend requires cookies / auth
      });
      console.log("Order Data", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

//Get all My Orders
export const getAllMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/v1/user/orders", {
        withCredentials: true, // if backend requires cookies / auth
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);


// Get Single Order
export const getSingleOrder = createAsyncThunk(
  "order/getSingleOrder",
  async (orderId, thunkAPI) => {
    try {
      const response = await axios.get(
        `/api/v1/user/order/${orderId}`,
        {
          withCredentials: true, // if backend requires cookies / auth
        }
      );
      console.log("Single Order Data", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);


const orderSlice = createSlice({
  name: "order",
  initialState: {
    success: false,
    loading: false,
    orders: [],
    order: {},
  },

  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.order = action.payload.order; // Assuming the response contains the created order
        console.log("Order State", state.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.messaage || "Failed to create order";
        console.log(action.payload);
      });
    
    builder
      .addCase(getAllMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders; // Assuming the response contains an array of orders
        // console.log("My Orders", state.orders);
        state.success = action.payload.success; // Assuming the response contains a success flag);
      })
      .addCase(getAllMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      });
    
    builder
      .addCase(getSingleOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order; // Assuming the response contains the order details
        state.success = action.payload.success; // Assuming the response contains a success flag
      })
      .addCase(getSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch order";
      });
  },
});

export const { removeError, removeSuccess } = orderSlice.actions;
export default orderSlice.reducer;
