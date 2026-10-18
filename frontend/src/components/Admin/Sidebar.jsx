import { NavLink, Link, useNavigate } from "react-router-dom";
import { logoutUser, removeSuccess } from "../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// Icons
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const menu = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Inventory2OutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 20 }} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />,
    },
  ];

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logout Successful");
      dispatch(removeSuccess());
      navigate("/");
    } catch (error) {
      toast.error(error?.message || "Logout failed");
    }
  };

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 p-5 h-screen flex flex-col justify-between border-r border-gray-800">
      {/* Top Brand & Menu */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="pb-4 border-b border-gray-800">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block mb-0.5">
            Admin Workspace
          </span>
          <h2 className="text-lg font-black text-white tracking-tight">
            SRM Vastralaya
          </h2>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Live Storefront Link */}
        <div className="pt-2">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-amber-400 hover:bg-gray-800/40 transition"
          >
            <StorefrontOutlinedIcon sx={{ fontSize: 18 }} />
            <span>View Live Store</span>
          </Link>
        </div>
      </div>

      {/* Bottom User Info & Logout */}
      <div className="pt-4 border-t border-gray-800 space-y-3">
        {user && (
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-500 font-bold flex items-center justify-center text-xs shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {user.name || "Administrator"}
              </span>
              <span className="text-[10px] text-gray-500 capitalize block truncate">
                {user.role || "admin"}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-rose-900/50 text-rose-400 hover:text-white hover:bg-rose-600/80 transition-colors text-xs font-semibold cursor-pointer"
        >
          <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
