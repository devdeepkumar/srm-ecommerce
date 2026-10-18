import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Register user (with avatar)
export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post("/api/v1/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ✅ Login user
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/v1/user/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// ✅3 Getting User Profile
export const fetchUserProfile = createAsyncThunk(
  "user/profile",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/v1/user/profile", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// ✅Logout user

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      const response = await axios.post("/api/v1/user/logout", {
        withCredentials: true, // ✅ corrected spelling
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

// ✅ Update User Profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.put(
        "/api/v1/user/profile/update",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// ✅ Update User Profile
export const updateUserPassword = createAsyncThunk(
  "user/updatePassword",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.put(
        "/api/v1/user/password/update",
        formData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const response = await axios.post("/api/v1/user/password/forgot", {
        email,
      });
      return response.data; // e.g., { message: "Email sent" }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send reset email"
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const response = await axios.put(`/api/v1/user/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      return response.data; // e.g., { message: "Password reset successful", user: {...} }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
    resetUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success ?? true;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        state.error = null;

        //Store in localstorage
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", state.isAuthenticated);
        
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Registration failed. Please try again.";
        state.user = null;
        state.success = false;
        state.isAuthenticated = false;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success ?? true;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        console.log("State", state.user);
        console.log("Login successful:", action.payload.user);

        //Store in localstorage
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", state.isAuthenticated);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Login failed. Please check your credentials.";
        state.user = null;
        state.success = false;
        state.isAuthenticated = false;
      });

    // Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload?.user || null;
        state.isAuthenticated = Boolean(payload?.user);
        state.success = true;
        state.error = null;

        //Store in localstorage
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", state.isAuthenticated);
      })
      .addCase(fetchUserProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to fetch user profile.";
        state.user = null;
        state.isAuthenticated = false; // ✅ Reset this!
        state.success = false;
        
        if (payload?.status === 401) {
          state.isAuthenticated = false;
          state.user = null;
          localStorage.removeItem("user");
          localStorage.removeItem("isAuthenticated");
        }

      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;

         localStorage.removeItem("user");
         localStorage.removeItem("isAuthenticated");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Password
   builder
     .addCase(updateUserPassword.pending, (state) => {
       state.loading = true;
       state.error = null;
       state.success = false;
     })
     .addCase(updateUserPassword.fulfilled, (state, action) => {
       state.loading = false;
       state.success = true;
       state.error = null;
       // Optionally store a message if API returns one
       state.message =
         action.payload?.message || "Password updated successfully";
     })
     .addCase(updateUserPassword.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload;
       state.success = false;
     });
    

    builder
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Password reset email sent successfully";
        // console.log(action.payload.message);
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send reset email";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user || null;
        state.message = action.payload.message;
        state.isAuthenticated = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// export const { removeError, removeSuccess, resetUserState } = userSlice.actions;
// export default userSlice.reducer;

//! or

// Export actions and reducer
const { actions, reducer } = userSlice;
export const { removeError, resetUserState, removeSuccess } = actions;
export default reducer;
