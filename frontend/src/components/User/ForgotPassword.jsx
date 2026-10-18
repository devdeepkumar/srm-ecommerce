import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  removeError,
  removeSuccess,
} from "../../features/user/userSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, message } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
    setEmail("");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(message || "Password reset email sent successfully");
      dispatch(removeSuccess());
      navigate("/user/login");
    }
  }, [success, message, navigate, dispatch]);

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[75vh]">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-10 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-900 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <MailOutlineIcon sx={{ fontSize: 26 }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
            Enter your registered email address and we'll send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-3.5 px-4 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending Link..." : "Send Reset Link"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-xs sm:text-sm text-center text-gray-500">
          Remember your password?{" "}
          <Link to="/user/login" className="font-bold text-gray-900 hover:text-amber-600 transition underline ml-1">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
