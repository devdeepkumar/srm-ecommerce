import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  fetchAllOrders,
  removeError,
  removeSuccess,
  updateOrderStatus,
  clearStatusUpdateLoading,
} from "../../../features/admin/adminSlice";
import Loader from "../../Loader";
import OrderDetailsModal from "./OrderDetailsModal";

// MUI Icons
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error, success, statusUpdateLoading } = useSelector(
    (state) => state.admin
  );

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
    if (success) {
      dispatch(removeSuccess());
    }
  }, [error, success, dispatch]);

  useEffect(() => {
    if (statusUpdateLoading === false && updatingOrderId) {
      setUpdatingOrderId(null);
      dispatch(clearStatusUpdateLoading());
    }
  }, [statusUpdateLoading, updatingOrderId, dispatch]);

  // KPI counts
  const stats = useMemo(() => {
    const list = orders || [];
    const total = list.length;
    const processing = list.filter((o) => o.orderStatus === "Processing").length;
    const shipped = list.filter((o) => o.orderStatus === "Shipped").length;
    const delivered = list.filter((o) => o.orderStatus === "Delivered").length;
    const cancelled = list.filter((o) => o.orderStatus === "Cancelled").length;
    return { total, processing, shipped, delivered, cancelled };
  }, [orders]);

  // KPI card click handler
  const handleKPIClick = (status) => {
    setCurrentPage(1);
    if (status === "all") {
      setStatusFilter("all");
    } else if (statusFilter === status) {
      setStatusFilter("all"); // Toggle off
    } else {
      setStatusFilter(status);
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = [...(orders || [])];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((o) => o.orderStatus === statusFilter);
    }

    // Date range filter
    if (dateRange !== "all") {
      const today = new Date();
      const startDate = new Date();
      if (dateRange === "today") {
        startDate.setHours(0, 0, 0, 0);
      } else if (dateRange === "week") {
        startDate.setDate(today.getDate() - 7);
      } else if (dateRange === "month") {
        startDate.setMonth(today.getMonth() - 1);
      }
      result = result.filter((o) => new Date(o.createdAt) >= startDate);
    }

    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o._id.toLowerCase().includes(term) ||
          o.user?.name?.toLowerCase().includes(term) ||
          o.user?.email?.toLowerCase().includes(term) ||
          o.orderStatus.toLowerCase().includes(term)
      );
    }

    // Sorting
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "priceHighLow") {
      result.sort((a, b) => (b.totalPrice || 0) - (a.totalPrice || 0));
    } else if (sortBy === "priceLowHigh") {
      result.sort((a, b) => (a.totalPrice || 0) - (b.totalPrice || 0));
    }

    return result;
  }, [orders, statusFilter, dateRange, search, sortBy]);

  // Pagination calculation
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const resetFilters = () => {
    setStatusFilter("all");
    setDateRange("all");
    setSearch("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus })
      ).unwrap();
      toast.success(`Order updated to "${newStatus}"`);
      // Update selected order in modal if open
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      toast.error(err || "Failed to update order status");
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const exportOrdersToExcel = () => {
    if (!orders || orders.length === 0) {
      toast.info("No orders available to export");
      return;
    }

    const worksheetData = [
      [
        "Order ID",
        "Customer Name",
        "Customer Email",
        "Items Count",
        "Total Price (INR)",
        "Status",
        "Date",
      ],
      ...orders.map((order) => [
        order._id,
        order.user?.name || "Guest",
        order.user?.email || "No email",
        order.orderItems?.length || 0,
        order.totalPrice || 0,
        order.orderStatus,
        new Date(order.createdAt).toLocaleDateString("en-IN"),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 20 },
      { wch: 30 },
      { wch: 12 },
      { wch: 18 },
      { wch: 15 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `srm_orders_${Date.now()}.xlsx`);

    toast.success("Orders exported to Excel successfully!");
  };

  if (loading && (!orders || orders.length === 0)) return <Loader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBagOutlinedIcon className="text-amber-600" sx={{ fontSize: 32 }} />
            <span>Orders Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track customer orders, manage shipping fulfillment, and export records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => dispatch(fetchAllOrders())}
            className="p-2.5 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Refresh Orders"
          >
            <RefreshIcon sx={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={exportOrdersToExcel}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition shadow-md hover:shadow-lg cursor-pointer"
          >
            <FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Interactive KPI Quick-Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Orders */}
        <button
          type="button"
          onClick={() => handleKPIClick("all")}
          className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
            statusFilter === "all"
              ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/25 shadow-sm"
              : "bg-white border-gray-200/80 hover:border-blue-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-blue-50 text-blue-700 group-hover:bg-blue-100"
              }`}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Orders
              </span>
              <span className="text-xl font-black text-gray-900">
                {stats.total}
              </span>
            </div>
          </div>
          {statusFilter === "all" && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">
              Active
            </span>
          )}
        </button>

        {/* Processing */}
        <button
          type="button"
          onClick={() => handleKPIClick("Processing")}
          className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
            statusFilter === "Processing"
              ? "bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/25 shadow-sm"
              : "bg-white border-gray-200/80 hover:border-amber-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                statusFilter === "Processing"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-50 text-amber-700 group-hover:bg-amber-100"
              }`}
            >
              <HourglassEmptyOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Processing
              </span>
              <span className="text-xl font-black text-amber-700">
                {stats.processing}
              </span>
            </div>
          </div>
          {statusFilter === "Processing" && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-600 text-white">
              Active
            </span>
          )}
        </button>

        {/* Shipped */}
        <button
          type="button"
          onClick={() => handleKPIClick("Shipped")}
          className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
            statusFilter === "Shipped"
              ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/25 shadow-sm"
              : "bg-white border-gray-200/80 hover:border-blue-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                statusFilter === "Shipped"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-blue-50 text-blue-700 group-hover:bg-blue-100"
              }`}
            >
              <LocalShippingOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Shipped
              </span>
              <span className="text-xl font-black text-blue-700">
                {stats.shipped}
              </span>
            </div>
          </div>
          {statusFilter === "Shipped" && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">
              Active
            </span>
          )}
        </button>

        {/* Delivered */}
        <button
          type="button"
          onClick={() => handleKPIClick("Delivered")}
          className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
            statusFilter === "Delivered"
              ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/25 shadow-sm"
              : "bg-white border-gray-200/80 hover:border-emerald-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                statusFilter === "Delivered"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100"
              }`}
            >
              <CheckCircleOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Delivered
              </span>
              <span className="text-xl font-black text-emerald-700">
                {stats.delivered}
              </span>
            </div>
          </div>
          {statusFilter === "Delivered" && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
              <SearchIcon sx={{ fontSize: 20 }} />
            </span>
            <input
              type="text"
              placeholder="Search by Order ID, customer name, email, or status..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-gray-900 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <ClearIcon sx={{ fontSize: 16 }} />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Status: All ({stats.total})</option>
              <option value="Processing">Processing ({stats.processing})</option>
              <option value="Shipped">Shipped ({stats.shipped})</option>
              <option value="Delivered">Delivered ({stats.delivered})</option>
              <option value="Cancelled">Cancelled ({stats.cancelled})</option>
            </select>
          </div>

          {/* Date Range Dropdown */}
          <div>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Date: All Time</option>
              <option value="today">Date: Today</option>
              <option value="week">Date: Last 7 Days</option>
              <option value="month">Date: Last 30 Days</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="priceHighLow">Amount: High to Low</option>
              <option value="priceLowHigh">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Filter Pills / Status Line */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              Showing <strong className="text-gray-900">{filteredOrders.length}</strong> of{" "}
              <strong className="text-gray-900">{orders.length}</strong> orders
            </span>

            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="hover:text-amber-950 cursor-pointer ml-0.5"
                >
                  <ClearIcon sx={{ fontSize: 13 }} />
                </button>
              </span>
            )}

            {dateRange !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Range: {dateRange}
                <button
                  onClick={() => setDateRange("all")}
                  className="hover:text-blue-950 cursor-pointer ml-0.5"
                >
                  <ClearIcon sx={{ fontSize: 13 }} />
                </button>
              </span>
            )}

            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
                Search: &ldquo;{search}&rdquo;
                <button
                  onClick={() => setSearch("")}
                  className="hover:text-gray-950 cursor-pointer ml-0.5"
                >
                  <ClearIcon sx={{ fontSize: 13 }} />
                </button>
              </span>
            )}

            {(statusFilter !== "all" || dateRange !== "all" || search || sortBy !== "newest") && (
              <button
                onClick={resetFilters}
                className="text-amber-700 hover:text-amber-900 font-semibold underline ml-1 cursor-pointer"
              >
                Reset all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {paginatedOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <ShoppingBagOutlinedIcon sx={{ fontSize: 32 }} />
            </div>
            <h3 className="text-base font-bold text-gray-800">No orders match criteria</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              Try adjusting your date range, status, or search keywords.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status & Stage</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {paginatedOrders.map((order) => {
                  const isUpdating = updatingOrderId === order._id;

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-amber-50/20 transition-colors group"
                    >
                      {/* Order ID */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="font-mono font-bold text-gray-900 hover:text-amber-700 transition cursor-pointer"
                          title="Click to view full details"
                        >
                          #{order._id.slice(-8)}
                        </button>
                        <span className="text-[11px] text-gray-400 block">
                          {order.paymentInfo?.status === "succeeded" || order.paidAt
                            ? "Paid Online"
                            : "COD / Pending"}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block truncate">
                          {order.user?.name || "Guest Customer"}
                        </span>
                        <span className="text-[11px] text-gray-500 block truncate">
                          {order.user?.email || "No email"}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {order.orderItems?.[0]?.image ? (
                            <img
                              src={order.orderItems[0].image}
                              alt="item"
                              className="w-9 h-11 object-cover rounded-lg border border-gray-200 bg-gray-50 shrink-0"
                              onError={(e) => {
                                e.target.src = "https://placehold.co/40x50?text=No+Img";
                              }}
                            />
                          ) : (
                            <div className="w-9 h-11 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 shrink-0">
                              Pkg
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-gray-800 block text-xs">
                              {order.orderItems?.length || 0} items
                            </span>
                            <span className="text-[10px] text-gray-400 truncate block max-w-xs">
                              {order.orderItems?.[0]?.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-black text-gray-900 text-sm">
                        ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            disabled={isUpdating}
                            className={`rounded-xl px-2.5 py-1 text-xs font-bold border focus:outline-none cursor-pointer transition ${
                              order.orderStatus === "Delivered"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : order.orderStatus === "Shipped"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : order.orderStatus === "Cancelled"
                                ? "bg-rose-50 text-rose-800 border-rose-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          {isUpdating && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-gray-500 text-xs">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-amber-700 hover:bg-amber-50 transition cursor-pointer"
                          title="View Order Details"
                        >
                          <VisibilityIcon sx={{ fontSize: 18 }} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <div>
              Showing <strong className="text-gray-900">{startIndex + 1}</strong> to{" "}
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

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
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
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold hover:bg-gray-50 transition disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={handleStatusChange}
          isLoading={statusUpdateLoading}
        />
      )}
    </div>
  );
};

export default OrdersPage;
