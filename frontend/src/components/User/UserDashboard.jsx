import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserProfile, logoutUser, removeSuccess } from "../../features/user/userSlice";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Loader from "../Loader";

const UserDashboard = ({ showMenu, setShowMenu }) => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu, setShowMenu]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logout Successful");
      dispatch(removeSuccess());
      navigate("/user/login");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Logout failed");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 py-1 pl-1 pr-2 rounded-full hover:bg-gray-50 border border-gray-200 transition duration-200 cursor-pointer text-left focus:outline-none"
        aria-label="Account menu"
      >
        <img
          src={
            user?.avatar?.url ||
            "https://res.cloudinary.com/demo/image/upload/sample.jpg"
          }
          alt={user?.name || "User"}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 object-cover"
        />
        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-semibold text-gray-800 leading-tight max-w-[80px] truncate">
            {user?.name || "Account"}
          </span>
        </div>
        <KeyboardArrowDownIcon
          sx={{ fontSize: 16 }}
          className={`text-gray-400 transition-transform duration-200 ${
            showMenu ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Account Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50 animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
            <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">
              {user?.email}
            </p>
            <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              {user?.role === "admin" || user?.role === "superadmin" ? "Admin" : "Customer"}
            </span>
          </div>

          <div className="py-1">
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <button
                className="w-full px-4 py-2 text-left text-xs sm:text-sm font-medium text-purple-700 hover:bg-purple-50 flex items-center gap-2.5 transition cursor-pointer"
                onClick={() => {
                  setShowMenu(false);
                  navigate("/admin/dashboard");
                }}
              >
                <DashboardOutlinedIcon sx={{ fontSize: 18 }} />
                <span>Admin Dashboard</span>
              </button>
            )}

            {(user?.role === "user") && (
              <button
              className="w-full px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-700 flex items-center gap-2.5 transition cursor-pointer"
              onClick={() => {
                setShowMenu(false);
                navigate("/user/orders");
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
              <span>My Orders</span>
            </button>
            )}

            

            <button
              className="w-full px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-amber-700 flex items-center gap-2.5 transition cursor-pointer"
              onClick={() => {
                setShowMenu(false);
                navigate("/user/profile");
              }}
            >
              <PersonOutlineOutlinedIcon sx={{ fontSize: 18 }} />
              <span>View Profile</span>
            </button>
          </div>

          <div className="pt-1 border-t border-gray-100">
            <button
              className="w-full px-4 py-2 text-left text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition cursor-pointer"
              onClick={() => {
                setShowMenu(false);
                handleLogout();
              }}
            >
              <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {loading && <Loader />}
    </div>
  );
};

export default UserDashboard;
