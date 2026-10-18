import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("You are not logged in. Please login.");
      navigate("/user/login");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] max-w-md w-full text-center">
        {/* Avatar */}
        <div className="relative inline-block mx-auto mb-4">
          <img
            src={
              user.avatar?.url ||
              "https://res.cloudinary.com/demo/image/upload/sample.jpg"
            }
            alt={user.name || "Profile"}
            className="w-28 h-28 rounded-full border-4 border-gray-100 shadow-sm object-cover"
          />
          <span className="absolute bottom-1 right-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            {user.role || "Member"}
          </span>
        </div>

        {/* User Info */}
        <h2 className="text-xl font-bold text-gray-900 mt-2">{user.name}</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{user.email}</p>

        {user.createdAt && (
          <p className="text-xs text-gray-400 mt-1">
            Member since {new Date(user.createdAt).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-2.5">
          <button
            onClick={() => navigate("/user/orders")}
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition shadow-sm cursor-pointer"
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
            <span>My Orders & Tracking</span>
          </button>
          <button
            onClick={() => navigate("/user/profile/update")}
            className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => navigate("/user/password/update")}
            className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            <LockResetOutlinedIcon sx={{ fontSize: 18 }} />
            <span>Change Password</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
