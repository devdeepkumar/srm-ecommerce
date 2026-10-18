import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { removeError, removeSuccess, updateUserPassword } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const { oldPassword, newPassword, confirmNewPassword } = formData;
  const { success, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    dispatch(updateUserPassword(formData));

    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success.message || "Password updated successfully!");
      dispatch(removeSuccess());
      navigate("/user/profile");
    }
  }, [success, dispatch, navigate]);

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[75vh]">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-900 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <LockResetOutlinedIcon sx={{ fontSize: 26 }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Change Password
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Choose a secure password to protect your account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleFormSubmit} autoComplete="off">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={oldPassword}
              required
              onChange={handleInputChange}
              placeholder="Enter current password"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              required
              onChange={handleInputChange}
              placeholder="Enter new password"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              required
              onChange={handleInputChange}
              placeholder="Confirm new password"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-3.5 px-4 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
