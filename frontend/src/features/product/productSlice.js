import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all Products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    { keyword = "", page = 1, category = "" , limit } = {},
    { rejectWithValue }
  ) => {
    try {
      let link = `/api/v1/products?page=${page}`;

      if (keyword) {
        link += `&keyword=${encodeURIComponent(keyword)}`;
      }

      if (category) {
        link += `&category=${encodeURIComponent(category)}`;
      }

      if (limit) link += `&limit=${limit}`;

      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Fetch Single Product
export const fetchSingleProduct = createAsyncThunk(
  "products/fetchSingleProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

// create review

export const createReview = createAsyncThunk(
  "products/createReview",
  async ({ id, userComment, userRating }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/v1/product/review`,
        {
          productId: id, 
          rating: userRating, 
          comment: userComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Creating Review Data:", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create review"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product", // Changed from "products" to match store key
  initialState: {
    products: [],
    product: null,
    productCount: 0,
    status: "idle",
    singleProductStatus: "idle",
    error: null,
    resultPerPage: 5,
    totalPages: 0,
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    resetSingleProduct: (state) => {
      state.product = null;
      state.singleProductStatus = "idle";
    },
    clearProductState: (state) => {
      state.products = [];
      state.product = null;
      state.productCount = 0;
      state.status = "idle";
      state.singleProductStatus = "idle";
      state.error = null;
    },
    resetReviewState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // For multiple products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products || [];
        state.productCount = action.payload.productCount || 0;
        state.resultPerPage = action.payload.resultPerPage || 4;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.products = [];
      })

      // For single product
      .addCase(fetchSingleProduct.pending, (state) => {
        state.singleProductStatus = "loading";
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.singleProductStatus = "succeeded";
        state.product = action.payload.product || null;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.singleProductStatus = "failed";
        state.error = action.payload;
      });

    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (state.product && state.product._id === action.meta.arg.id) {
          state.product.reviews = action.payload.reviews;
          state.product.numOfReviews = action.payload.numOfReviews;
          state.product.ratings = action.payload.ratings;
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  removeError,
  resetSingleProduct,
  clearProductState,
  resetReviewState,
} = productSlice.actions;
export default productSlice.reducer;
