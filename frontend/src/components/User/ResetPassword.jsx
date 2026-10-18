import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeError, removeSuccess, resetPassword } from "../../features/user/userSlice";
import { toast } from "react-toastify";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

const ResetPassword = () => {
  const { token } = useParams();
  const { error, success, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    dispatch(resetPassword({ password, confirmPassword, token }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Password reset successfully! Please login.");
      dispatch(removeSuccess());
      navigate("/user/login");
    }
  }, [success, navigate, dispatch]);

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[75vh]">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-10 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-900 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <LockResetOutlinedIcon sx={{ fontSize: 26 }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Enter your new password below to reset your access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-3.5 px-4 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-xs sm:text-sm text-center text-gray-500">
          Back to{" "}
          <Link to="/user/login" className="font-bold text-gray-900 hover:text-amber-600 transition underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
