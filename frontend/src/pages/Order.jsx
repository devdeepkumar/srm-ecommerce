import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllMyOrders } from "../features/order/orderSlice";
import Loader from "../components/Loader";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Order = () => {
  const { orders, success, loading } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllMyOrders());
  }, [dispatch, success]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl min-h-[75vh]">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        My Orders
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 mb-8">
        Track your previous orders and check delivery status.
      </p>

      {orders && orders.length > 0 ? (
        <div className="space-y-5">
          {orders.map((order) => {
            const statusColor =
              order.orderStatus === "Delivered"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : order.orderStatus === "Processing"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-sky-50 text-sky-700 border-sky-200";

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 p-5 sm:p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b border-gray-100 gap-2">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      Order ID: <span className="text-gray-600 font-mono font-normal">#{order._id}</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Placed on: {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}
                    >
                      ● {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="py-4 space-y-3">
                  {order.orderItems?.slice(0, 2).map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3.5"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-16 object-cover rounded-xl border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <p className="font-bold text-xs sm:text-sm text-gray-900">
                        ₹{item.quantity * item.price}
                      </p>
                    </div>
                  ))}

                  {order.orderItems?.length > 2 && (
                    <p className="text-xs text-gray-500 pt-1 font-medium">
                      + {order.orderItems.length - 2} more item{order.orderItems.length - 2 > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* Order Summary Footer */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">Delivering to:</span>{" "}
                    {order.shippingInfo?.address}, {order.shippingInfo?.city}
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <p className="font-bold text-sm sm:text-base text-gray-900">
                      Total: ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => navigate(`/user/order/${order._id}`)}
                      className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Orders State */
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mb-4">
            <ShoppingBagOutlinedIcon sx={{ fontSize: 32 }} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            No orders found
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-sm">
            You haven't placed any orders yet. Discover our catalog and find something you love!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold tracking-wide transition shadow-sm"
          >
            <span>Start Shopping</span>
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Order;
