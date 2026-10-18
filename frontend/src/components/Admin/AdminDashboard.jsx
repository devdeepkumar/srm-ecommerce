import { Card, CardContent } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";


import { fetchAllOrders, fetchUsers, getAdminProducts } from "../../features/admin/adminSlice";
import Loader from "../Loader";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ get data from redux
  const { orders } = useSelector((state) => state.admin);
  const { users } = useSelector((state) => state.admin);
  const { products } = useSelector((state) => state.admin);
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  // ✅ fetch all data on load
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("You are not logged in. Please login.");
      navigate("/admin/login");
    }
    dispatch(getAdminProducts());
    dispatch(fetchUsers());
    dispatch(fetchAllOrders());
  }, [dispatch, loading, isAuthenticated, navigate]);

  // ✅ calculate totals (only Delivered orders)
  const totalRevenue = useMemo(() => {
    return orders
      ?.filter((order) => order.orderStatus === "Delivered")
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  }, [orders]);

  // ✅ group sales by month for chart (only Delivered orders)
  const salesData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const grouped = {};

    orders
      ?.filter((order) => order.orderStatus === "Delivered")
      .forEach((order) => {
        const monthIndex = new Date(order.createdAt).getMonth();
        const month = months[monthIndex];
        grouped[month] = (grouped[month] || 0) + order.totalPrice;
      });

    return months.map((m) => ({ month: m, sales: grouped[m] || 0 }));
  }, [orders]);

  if (loading) return <Loader />;
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">📊 Dashboard</h1>
      <p className="text-gray-600">Overview of your e-commerce performance</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Orders */}
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="flex items-center p-6 space-x-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <ShoppingCartIcon fontSize="large" />
            </div>
            <div>
              <p className="text-gray-600">Orders</p>
              <h2 className="text-2xl font-bold">{orders?.length || 0}</h2>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="flex items-center p-6 space-x-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <AttachMoneyIcon fontSize="large" />
            </div>
            <div>
              <p className="text-gray-600">Revenue</p>
              <h2 className="text-2xl font-bold">
                ₹{totalRevenue.toLocaleString()}
              </h2>
            </div>
          </CardContent>
        </Card>

        {/* Users */}
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="flex items-center p-6 space-x-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <PeopleIcon fontSize="large" />
            </div>
            <div>
              <p className="text-gray-600">Users</p>
              <h2 className="text-2xl font-bold">{users?.length || 0}</h2>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="flex items-center p-6 space-x-4">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <Inventory2Icon fontSize="large" />
            </div>
            <div>
              <p className="text-gray-600">Products</p>
              <h2 className="text-2xl font-bold">{products?.length || 0}</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="shadow-lg rounded-2xl mt-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">📈 Monthly Sales</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#1976d2" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
