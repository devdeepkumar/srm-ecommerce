import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  loginUser,
  removeError,
  removeSuccess,
} from "../../../features/user/userSlice";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const AdminLogin = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/admin/dashboard";

  const { error, success } = useSelector((state) => state.user);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();
      const { email, password } = user;

      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }

      dispatch(loginUser({ email, password }));
    },
    [dispatch, user]
  );

  useEffect(() => {
    if (success) {
      toast.success("Login successful");
      dispatch(removeSuccess());
      navigate(redirect);
    }
  }, [success, redirect, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      setUser({ email: "", password: "" });
    }
  }, [success]);

  return (
    <div className="login-container container mx-auto px-4 py-8 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-xl border border-gray-200 rounded-lg p-6 max-w-md w-full mx-auto flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-blue-900 text-center mb-4">
          Admin Login
        </h2>

        <form className="space-y-4 w-full" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={user.email}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 shadow-md rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleInputChange}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={user.password}
              placeholder="Enter your password"
              className="w-full p-2 pr-10 border shadow-md border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleInputChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center px-1 text-gray-600 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 shadow-md cursor-pointer text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>


        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
