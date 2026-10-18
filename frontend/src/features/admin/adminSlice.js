import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ----------------- Async Thunk -----------------
export const getAdminProducts = createAsyncThunk(
  "admin/getAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/products", {
        withCredentials: true,
      });

      // console.log("Fetched products:", data);
      return data.products; // assuming API returns { products: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

//Create Product or addproduct
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/v1/admin/product/create",
        productData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // send cookies
        }
      );

      console.log("Product created:", data);
      return data.product; // assuming API returns { product: {...} }
    } catch (error) {
      console.log("Error creating product:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

// View Product
export const ViewProduct = createAsyncThunk(
  "admin/ViewProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      console.log("Fetched product:", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

//Update Product

//Create Product or addproduct
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, updatedProduct }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/v1/admin/product/${id}`,
        updatedProduct,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // send cookies
        }
      );

      console.log("Product updated data:", data);
      return data.product; // assuming API returns { product: {...} }
    } catch (error) {
      console.log("Error updating product:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to product update"
      );
    }
  }
);

//Delete Product
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/product/${id}`, {
        withCredentials: true, // send cookies
      });
      console.log("Product deleted:", data);
      return data; // assuming API returns { success: true, message: "Product deleted" }
    } catch (error) {
      console.log("Error deleting product:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);


// Fetch All Users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/users", {
        withCredentials: true,
      });

      console.log("Fetched users:", data);
      return data.users; // 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const viewUser = createAsyncThunk(
  "admin/viewUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/user/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

export const changeUserRole = createAsyncThunk(
  "admin/changeUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        "/api/v1/admin/user/change-role", // your API endpoint
        { userId, role },
        { withCredentials: true }
      );
      return data; // updated user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update role"
      );
    }
  }
);



export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/user/${id}`, {
        withCredentials: true, // send cookies
      });
      console.log("User deleted:", data);
      return data; // assuming API returns { success: true, message: "Product deleted" }
    } catch (error) {
      console.log("Error deleting user:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// Fetch All Orders
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders", // also make the type plural for consistency
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/orders", { // add "/" to start path
        withCredentials: true,
      });

      console.log("Fetched Orders:", data);
      return data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);



export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/v1/admin/order/${orderId}`,
        { status },
        { withCredentials: true }
      );
      return data.order; // updated order
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);
// ----------------- Slice -----------------
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    product: {},
    users: [],
    user: {},
    orders: [],
    loading: false,
    error: null,
    success: false,
    statusUpdateLoading: false,
  },
  reducers: {
    removeSuccess: (state) => {
      state.success = false;
    },
    removeError: (state) => {
      state.error = null;
    },
    clearStatusUpdateLoading: (state) => {
      state.statusUpdateLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.product);
        state.success = true;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    builder
      .addCase(ViewProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ViewProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product; // assuming API returns { product: {...} }
        state.error = null;
        // console.log("Product details fetched:", action.payload);
      })
      .addCase(ViewProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.product = action.payload.product;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = state.products.filter(
          (product) => product._id !== action.meta.arg
        );
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    builder
      .addCase(viewUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(viewUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(changeUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user; // assuming API returns { user: {...} }
        state.error = null;
        console.log("User role updated:", action.payload.user);
      })
      .addCase(changeUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users = state.users.filter(
          (user) => user._id !== action.meta.arg
        );
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
    
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        state.success = "Order status updated successfully";
        
        // Update the specific order in the state
        const updatedOrder = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { removeSuccess, removeError,clearStatusUpdateLoading  } = adminSlice.actions;
export default adminSlice.reducer;
