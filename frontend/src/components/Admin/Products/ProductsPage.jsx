import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// MUI Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LaunchIcon from "@mui/icons-material/Launch";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import StarIcon from "@mui/icons-material/Star";

// Redux actions
import {
  getAdminProducts,
  removeError,
  removeSuccess,
  deleteProduct,
} from "../../../features/admin/adminSlice";

// Components
import Loader from "../../Loader";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, error, success, loading } = useSelector(
    (state) => state.admin
  );

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch products on mount
  useEffect(() => {
    dispatch(getAdminProducts());
  }, [dispatch]);

  // Handle success & error notifications
  useEffect(() => {
    if (success) dispatch(removeSuccess());
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [success, error, dispatch]);

  // Delete product handler
  const handleDelete = (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${name || "this product"}"?`
      )
    ) {
      return;
    }

    dispatch(deleteProduct(id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Product deleted successfully");
        dispatch(removeSuccess());
        dispatch(getAdminProducts());
      } else {
        toast.error("Failed to delete product");
      }
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setStockFilter("all");
    setFeaturedFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Calculate Summary KPI Stats
  const stats = useMemo(() => {
    const list = products || [];
    const total = list.length;
    const inStock = list.filter((p) => p.stock > 10).length;
    const lowStock = list.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = list.filter((p) => p.stock === 0).length;
    const featured = list.filter((p) => Boolean(p.isFeatured)).length;

    return { total, inStock, lowStock, outOfStock, featured };
  }, [products]);

  // KPI Card Active States
  const isTotalActive = stockFilter === "all" && featuredFilter === "all";
  const isInStockActive = stockFilter === "inStock" && featuredFilter === "all";
  const isLowStockActive = stockFilter === "lowStock" && featuredFilter === "all";
  const isOutOfStockActive = stockFilter === "outOfStock" && featuredFilter === "all";
  const isFeaturedActive = featuredFilter === "featured";

  // Quick filter click handler for KPI cards
  const handleKPIClick = (filterType) => {
    setCurrentPage(1);
    if (filterType === "total") {
      setStockFilter("all");
      setFeaturedFilter("all");
    } else if (filterType === "inStock") {
      if (stockFilter === "inStock" && featuredFilter === "all") {
        setStockFilter("all");
      } else {
        setStockFilter("inStock");
        setFeaturedFilter("all");
      }
    } else if (filterType === "lowStock") {
      if (stockFilter === "lowStock" && featuredFilter === "all") {
        setStockFilter("all");
      } else {
        setStockFilter("lowStock");
        setFeaturedFilter("all");
      }
    } else if (filterType === "outOfStock") {
      if (stockFilter === "outOfStock" && featuredFilter === "all") {
        setStockFilter("all");
      } else {
        setStockFilter("outOfStock");
        setFeaturedFilter("all");
      }
    } else if (filterType === "featured") {
      if (featuredFilter === "featured") {
        setFeaturedFilter("all");
      } else {
        setFeaturedFilter("featured");
        setStockFilter("all");
      }
    }
  };

  // Extract unique categories dynamically
  const categoriesList = useMemo(() => {
    const set = new Set();
    (products || []).forEach((p) => {
      if (p.category) set.add(p.category.toLowerCase().trim());
    });
    return Array.from(set);
  }, [products]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...(products || [])];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term) ||
          p._id?.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Stock filter
    if (stockFilter === "inStock") {
      result = result.filter((p) => p.stock > 10);
    } else if (stockFilter === "lowStock") {
      result = result.filter((p) => p.stock > 0 && p.stock <= 10);
    } else if (stockFilter === "outOfStock") {
      result = result.filter((p) => p.stock === 0);
    }

    // Featured filter
    if (featuredFilter === "featured") {
      result = result.filter((p) => Boolean(p.isFeatured));
    } else if (featuredFilter === "standard") {
      result = result.filter((p) => !p.isFeatured);
    }

    // Sorting
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "priceLowHigh") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "priceHighLow") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "stockLowHigh") {
      result.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    } else if (sortBy === "stockHighLow") {
      result.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    } else if (sortBy === "highestRated") {
      result.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
    }

    return result;
  }, [
    products,
    searchTerm,
    selectedCategory,
    stockFilter,
    featuredFilter,
    sortBy,
  ]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading && (!products || products.length === 0)) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto bg-gray-50/50 min-h-screen">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <Inventory2OutlinedIcon className="text-amber-600" sx={{ fontSize: 32 }} />
            <span>Product Inventory</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your store catalog, monitor stock levels, and click any card below to filter.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(getAdminProducts())}
            title="Refresh Products"
            className="p-2.5 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshIcon sx={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/admin/products/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition shadow-md hover:shadow-lg cursor-pointer"
          >
            <AddIcon sx={{ fontSize: 18 }} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Interactive KPI Quick-Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Items Card */}
        <button
          type="button"
          onClick={() => handleKPIClick("total")}
          title="Click to view all items"
          className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group relative overflow-hidden ${
            isTotalActive
              ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/25 shadow-sm"
              : "bg-white border-gray-200/80 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isTotalActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-blue-50 text-blue-700 group-hover:bg-blue-100"
              }`}
            >
              <Inventory2OutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Items
              </span>
              <span className="text-xl font-black text-gray-900">
                {stats.total}
              </span>
            </div>
          </div>
          {isTotalActive && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white shrink-0">
              Active
            </span>
          )}
        </button>

        {/* In Stock Card */}
        <button
          type="button"
          onClick={() => handleKPIClick("inStock")}
          title="Click to view in-stock items"
          className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group relative overflow-hidden ${
            isInStockActive
              ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/25 shadow-sm"
              : "bg-white border-gray-200/80 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isInStockActive
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100"
              }`}
            >
              <CheckCircleOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                In Stock
              </span>
              <span className="text-xl font-black text-emerald-700">
                {stats.inStock}
              </span>
            </div>
          </div>
          {isInStockActive && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0">
              Active
            </span>
          )}
        </button>

        {/* Low Stock Card */}
        <button
          type="button"
          onClick={() => handleKPIClick("lowStock")}
          title="Click to view low-stock items (≤10)"
          className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group relative overflow-hidden ${
            isLowStockActive
              ? "bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/25 shadow-sm"
              : "bg-white border-gray-200/80 hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isLowStockActive
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-50 text-amber-700 group-hover:bg-amber-100"
              }`}
            >
              <WarningAmberOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Low Stock (≤10)
              </span>
              <span className="text-xl font-black text-amber-700">
                {stats.lowStock}
              </span>
            </div>
          </div>
          {isLowStockActive && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-600 text-white shrink-0">
              Active
            </span>
          )}
        </button>

        {/* Out of Stock Card */}
        <button
          type="button"
          onClick={() => handleKPIClick("outOfStock")}
          title="Click to view out-of-stock items"
          className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group relative overflow-hidden ${
            isOutOfStockActive
              ? "bg-rose-50/70 border-rose-500 ring-2 ring-rose-500/25 shadow-sm"
              : "bg-white border-gray-200/80 hover:border-rose-300 hover:shadow-md hover:-translate-y-0.5"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isOutOfStockActive
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 text-rose-700 group-hover:bg-rose-100"
              }`}
            >
              <ErrorOutlineOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Out of Stock
              </span>
              <span className="text-xl font-black text-rose-700">
                {stats.outOfStock}
              </span>
            </div>
          </div>
          {isOutOfStockActive && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white shrink-0">
              Active
            </span>
          )}
        </button>

        {/* Featured Items Card */}
        <button
          type="button"
          onClick={() => handleKPIClick("featured")}
          title="Click to view featured items"
          className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group relative overflow-hidden col-span-2 sm:col-span-1 ${
            isFeaturedActive
              ? "bg-purple-50/70 border-purple-500 ring-2 ring-purple-500/25 shadow-sm"
              : "bg-white border-gray-200/80 hover:border-purple-300 hover:shadow-md hover:-translate-y-0.5"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isFeaturedActive
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-purple-50 text-purple-700 group-hover:bg-purple-100"
              }`}
            >
              <StarIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Featured Items
              </span>
              <span className="text-xl font-black text-purple-700">
                {stats.featured}
              </span>
            </div>
          </div>
          {isFeaturedActive && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-600 text-white shrink-0">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
              <SearchIcon sx={{ fontSize: 20 }} />
            </span>
            <input
              type="text"
              placeholder="Search by product title, category, or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-gray-900 transition placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <ClearIcon sx={{ fontSize: 16 }} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition cursor-pointer capitalize"
            >
              <option value="all">All Categories ({stats.total})</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Stock & Type Filter (Fully synchronized with KPI cards) */}
          <div>
            <select
              value={isFeaturedActive ? "featured" : stockFilter}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "featured") {
                  setFeaturedFilter("featured");
                  setStockFilter("all");
                } else {
                  setFeaturedFilter("all");
                  setStockFilter(val);
                }
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition cursor-pointer"
            >
              <option value="all">Status: All ({stats.total})</option>
              <option value="inStock">In Stock (&gt;10) ({stats.inStock})</option>
              <option value="lowStock">Low Stock (≤10) ({stats.lowStock})</option>
              <option value="outOfStock">Out of Stock (0) ({stats.outOfStock})</option>
              <option value="featured">Featured Items ({stats.featured})</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="stockLowHigh">Stock: Low to High</option>
              <option value="stockHighLow">Stock: High to Low</option>
              <option value="highestRated">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Filter Pills / Status Line */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              Showing <strong className="text-gray-900">{filteredProducts.length}</strong> of{" "}
              <strong className="text-gray-900">{products.length}</strong> products
            </span>

            {/* Active KPI Badge Pills */}
            {isInStockActive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircleOutlinedIcon sx={{ fontSize: 13 }} />
                <span>In Stock ({stats.inStock})</span>
                <button
                  onClick={() => setStockFilter("all")}
                  className="hover:text-emerald-950 cursor-pointer ml-0.5"
                  title="Remove filter"
                >
                  <ClearIcon sx={{ fontSize: 13 }} />
                </button>
              </span>
            )}

            {isLowStockActive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <WarningAmberOutlinedIcon sx={{ fontSize: 13 }} />
                <span>Low Stock (≤10) ({stats.lowStock})</span>
                <button
                  onClick={() => setStockFilter("all")}
                  className="hover:text-amber-950 cursor-pointer ml-0.5"
                  title="Remove filter"
                >
                  <ClearIcon sx={{ fontSize: 13 }} />
                </button>
              </span>
            )}

            {isOutOfStockActive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                <ErrorOutlineOutlinedIcon sx={{ fontSize: 13 }} />
                <span>Out of Stock ({stats.outOfStock})</span>
                <button
                  onClick={() => setStockFilter("all")}
                  className="hover:text-rose-950 cursor-pointer ml-0.5"
                  title="Remove filter"
                >
                  <ClearIcon sx={{ fontSize: 13 }} />
                </button>
              </span>
            )}

            {isFeaturedActive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                <StarIcon sx={{ fontSize: 13 }} />
                <span>Featured Items ({stats.featured})</span>
                <button
                  onClick={() => setFeaturedFilter("all")}
                  className="hover:text-purple-950 cursor-pointer ml-0.5"
                  title="Remove filter"
                >
                  <ClearIcon sx={{ fontSize: 13 }} />
                </button>
              </span>
            )}

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="hover:text-blue-950 cursor-pointer ml-0.5"
                  title="Remove category filter"
                >
                  <ClearIcon sx={{ fontSize: 13 }} />
                </button>
              </span>
            )}

            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
                <span>Search: &ldquo;{searchTerm}&rdquo;</span>
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:text-gray-950 cursor-pointer ml-0.5"
                  title="Clear search"
                >
                  <ClearIcon sx={{ fontSize: 13 }} />
                </button>
              </span>
            )}

            {(searchTerm ||
              selectedCategory !== "all" ||
              stockFilter !== "all" ||
              featuredFilter !== "all" ||
              sortBy !== "newest") && (
              <button
                onClick={handleResetFilters}
                className="text-amber-700 hover:text-amber-900 font-semibold underline ml-1 cursor-pointer flex items-center gap-1"
              >
                <ClearIcon sx={{ fontSize: 14 }} />
                <span>Reset all</span>
              </button>
            )}
          </div>

          {/* Items Per Page */}
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {paginatedProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <FilterListIcon sx={{ fontSize: 32 }} />
            </div>
            <h3 className="text-base font-bold text-gray-800">
              No matching products found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              Try adjusting your search keywords, clearing your category filter, or resetting all criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {paginatedProducts.map((product) => {
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock <= 10;

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-amber-50/20 transition-colors group"
                    >
                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                            <img
                              src={
                                product.images?.[0]?.url ||
                                "https://placehold.co/100x120?text=No+Img"
                              }
                              alt={product.name}
                              className="w-full h-full object-cover object-top"
                              loading="lazy"
                            />
                            {product.isFeatured && (
                              <span
                                title="Featured Product"
                                className="absolute bottom-0 right-0 bg-amber-500 text-white p-0.5 rounded-tl-md"
                              >
                                <StarIcon sx={{ fontSize: 10 }} />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <Link
                              to={`/admin/products/${product._id}`}
                              className="font-bold text-gray-900 hover:text-amber-600 transition block truncate"
                              title={product.name}
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] text-gray-400 font-mono block">
                              ID: {product._id?.slice(-8)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-gray-100 text-gray-700">
                          {product.category || "General"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {product.discount > 0 ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span>
                                ₹{Math.round(product.price * (1 - product.discount / 100)).toLocaleString("en-IN")}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded-md">
                                {product.discount}% OFF
                              </span>
                            </div>
                            <span className="text-[11px] text-gray-400 font-normal line-through block">
                              MRP ₹{Number(product.price || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ) : (
                          <span>₹{Number(product.price || 0).toLocaleString("en-IN")}</span>
                        )}
                      </td>

                      {/* Stock Status Badge */}
                      <td className="py-3.5 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Low: {product.stock} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            In Stock ({product.stock})
                          </span>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-semibold text-gray-700">
                          <StarIcon sx={{ fontSize: 16 }} className="text-amber-500" />
                          <span>{Number(product.ratings || 0).toFixed(1)}</span>
                          <span className="text-gray-400 text-xs">
                            ({product.numOfReviews || 0})
                          </span>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-gray-500 text-xs">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Storefront Link */}
                          <Link
                            to={`/products/${product._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition"
                            title="View on Storefront"
                          >
                            <LaunchIcon sx={{ fontSize: 18 }} />
                          </Link>

                          {/* Admin Details */}
                          <Link
                            to={`/admin/products/${product._id}`}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Product Details"
                          >
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                          </Link>

                          {/* Edit */}
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition"
                            title="Edit Listing"
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() =>
                              handleDelete(product._id, product.name)
                            }
                            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Product"
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <div>
              Showing{" "}
              <strong className="text-gray-900">{startIndex + 1}</strong> to{" "}
              <strong className="text-gray-900">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </strong>{" "}
              of <strong className="text-gray-900">{totalItems}</strong> entries
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold hover:bg-gray-50 transition disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>

              {/* Page numbers (condensed) */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Only show around current page
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= safeCurrentPage - 1 &&
                    pageNum <= safeCurrentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                        safeCurrentPage === pageNum
                          ? "bg-gray-900 text-white shadow-xs"
                          : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === safeCurrentPage - 2 ||
                  pageNum === safeCurrentPage + 2
                ) {
                  return (
                    <span key={pageNum} className="px-1 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold hover:bg-gray-50 transition disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
