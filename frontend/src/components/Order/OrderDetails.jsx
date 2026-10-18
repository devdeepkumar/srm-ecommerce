import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleOrder } from "../../features/order/orderSlice";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import TimelineIcon from "@mui/icons-material/Timeline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import Loader from "../Loader";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getSingleOrder(id));
  }, [dispatch, id]);

  if (loading || !order) {
    return <Loader />;
  }

  const statusColor =
    order.orderStatus === "Delivered"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : order.orderStatus === "Processing"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-sky-50 text-sky-700 border-sky-200";

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl min-h-[75vh]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-8 border-b border-gray-100 gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Order #{order._id}
            </h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${statusColor}`}
            >
              ● {order.orderStatus}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition"
          >
            <TimelineIcon sx={{ fontSize: 16 }} />
            <span>Track</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition"
          >
            <CancelOutlinedIcon sx={{ fontSize: 16 }} />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition"
          >
            <PictureAsPdfOutlinedIcon sx={{ fontSize: 16 }} />
            <span>Invoice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Left Column (2/3): Info + Items */}
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
              <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} className="text-amber-600" />
              <span>Delivery Details</span>
            </h2>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">{order.user?.name || "Customer"}</p>
              <p>
                {[
                  order.shippingInfo?.houseNo,
                  order.shippingInfo?.address,
                  order.shippingInfo?.landMark || order.shippingInfo?.landmark
                    ? `Near ${order.shippingInfo.landMark || order.shippingInfo.landmark}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p>
                {order.shippingInfo?.city}, {order.shippingInfo?.state},{" "}
                {order.shippingInfo?.country} - {order.shippingInfo?.postalCode}
              </p>
              <p className="text-gray-500 pt-1">Contact: {order.shippingInfo?.phoneNo}</p>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
              <PaymentOutlinedIcon sx={{ fontSize: 18 }} className="text-emerald-600" />
              <span>Payment Details</span>
            </h2>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p>
                <span className="text-gray-400">Payment Reference:</span>{" "}
                <span className="font-mono font-medium text-gray-800">{order.paymentInfo?.id || "N/A"}</span>
              </p>
              <p>
                <span className="text-gray-400">Status:</span>{" "}
                <span className={`font-semibold ${order.paymentInfo?.status === "Paid" ? "text-emerald-600" : "text-rose-600"}`}>
                  {order.paymentInfo?.status === "Paid" ? "Paid" : "Pending / Cash on Delivery"}
                </span>
              </p>
              {order.paymentInfo?.status === "Paid" && order.paidAt && (
                <p className="text-xs text-gray-400 pt-0.5">
                  Paid on {new Date(order.paidAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100 mb-2">
              Items Ordered ({order.orderItems?.length || 0})
            </h2>
            <div className="divide-y divide-gray-100">
              {order?.orderItems?.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-xl border border-gray-100"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 text-right">
                    ₹{item.quantity * item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Summary Card */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] md:sticky top-24 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100">
            Price Breakdown
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Items Total:</span>
              <span className="font-semibold text-gray-900">₹{order.itemsPrice || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes / GST:</span>
              <span className="font-semibold text-gray-900">₹{order.taxPrice || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="font-semibold text-gray-900">
                {order.shippingPrice === 0 ? "FREE" : `₹${order.shippingPrice || 0}`}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-bold text-gray-900">
              <span>Grand Total:</span>
              <span className="text-lg">₹{order.totalPrice || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
