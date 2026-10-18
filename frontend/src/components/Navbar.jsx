import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import logo from "../assets/logo-white-sm.png";
import UserDashboard from "./User/UserDashboard";
import { useSelector } from "react-redux";
import Badge from "@mui/material/Badge";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  let quantity = cartItems?.length || 0;
  const [showDashboardMenu, setShowDashboardMenu] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = search.trim();
    navigate(
      trimmed ? `/products?keyword=${encodeURIComponent(trimmed)}` : "/products"
    );
    setSearch("");
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center gap-4">
          {/* Logo & Brand Name */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0"
            onClick={() => {
              setIsOpen(false);
              setShowDashboardMenu(false);
            }}
          >
            <img className="h-15 object-contain" src={logo} alt="Logo" />
            
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-md mx-4"
          >
            <span className="absolute left-3.5 text-gray-400 flex items-center pointer-events-none">
              <SearchIcon sx={{ fontSize: 18 }} />
            </span>
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
            />
          </form>

          {/* Desktop Navigation Links & Actions */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-5">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    setIsOpen(false);
                    setShowDashboardMenu(false);
                  }}
                  className="text-xs sm:text-sm font-semibold tracking-wide text-gray-600 hover:text-gray-900 transition-colors py-1"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-full transition duration-200"
              aria-label="Cart"
            >
              <Badge
                badgeContent={quantity}
                color="warning"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#d97706",
                    color: "#fff",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    height: 18,
                    minWidth: 18,
                  },
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />
              </Badge>
            </Link>

            {/* User Account / Profile */}
            <div className="relative">
              {isAuthenticated ? (
                <UserDashboard
                  showMenu={showDashboardMenu}
                  setShowMenu={setShowDashboardMenu}
                />
              ) : (
                <Link
                  to="/user/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold tracking-wide transition duration-200"
                >
                  <AccountCircleIcon sx={{ fontSize: 18 }} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu & Cart Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/cart"
              className="p-1.5 text-gray-700 hover:text-amber-600 rounded-full"
              aria-label="Cart"
            >
              <Badge
                badgeContent={quantity}
                color="warning"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#d97706",
                    color: "#fff",
                    fontSize: "0.65rem",
                    height: 16,
                    minWidth: 16,
                  },
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />
              </Badge>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-gray-700 hover:text-gray-900 rounded-lg"
              aria-label="Menu"
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden mt-2 pt-2 border-t border-gray-100">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <span className="absolute left-3.5 top-2.5 text-gray-400 flex items-center pointer-events-none">
              <SearchIcon sx={{ fontSize: 18 }} />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-gray-800 placeholder-gray-400"
            />
          </form>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-white pt-3 pb-2 space-y-1.5 border-t border-gray-100 mt-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 pt-2">
              {isAuthenticated ? (
                <UserDashboard
                  showMenu={showDashboardMenu}
                  setShowMenu={setShowDashboardMenu}
                />
              ) : (
                <Link
                  to="/user/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
