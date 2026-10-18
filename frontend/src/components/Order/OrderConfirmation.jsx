import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CheckoutPath from "../CheckoutPath";
import SecurityIcon from "@mui/icons-material/Security";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  const total = cartItems.reduce(
    (acc, item) => acc + (item.price || 100) * item.quantity,
    0
  );
  const gst = total * 0.18;
  const shippingCost = total > 1000 ? 0 : 50;
  const subtotal = Math.ceil(total + shippingCost + gst);

  const handleProceedToPayment = () => {
    const amountData = {
      total,
      gst,
      shippingCost,
      subtotal,
    };
    sessionStorage.setItem("amountData", JSON.stringify(amountData));
    navigate("/order/payment");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl min-h-[75vh]">
      <CheckoutPath currentStep={1} />

      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 my-6">
        Review Your Order
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Delivery Address + Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                Delivery Address
              </h2>
              <Link
                to="/shipping"
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 underline"
              >
                Change Address
              </Link>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">{shippingInfo?.fullName}</p>
              <p>
                {[
                  shippingInfo?.houseNo,
                  shippingInfo?.address,
                  shippingInfo?.landMark || shippingInfo?.landmark
                    ? `Near ${shippingInfo.landMark || shippingInfo.landmark}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p>
                {shippingInfo?.city}, {shippingInfo?.state} - {shippingInfo?.postalCode}
              </p>
              <p className="text-gray-500 pt-1">Phone: {shippingInfo?.phone}</p>
            </div>
          </div>

          {/* Cart Items Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100 mb-4">
              Items in Order ({cartItems.length})
            </h2>
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item, idx) => (
                <li
                  key={`${item.id}-${idx}`}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-lg border border-gray-100"
                    />
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Size: <span className="font-medium text-gray-700">{item.size}</span> | Qty: {item.quantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 text-right">
                    ₹{item.price * item.quantity}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] lg:sticky top-24 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100">
            Payment Summary
          </h2>

          <div className="space-y-3 text-xs sm:text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-gray-900">
                ₹{total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%):</span>
              <span className="font-semibold text-gray-900">
                ₹{gst.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className={`font-semibold ${shippingCost === 0 ? "text-emerald-600" : "text-gray-900"}`}>
                {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-bold text-gray-900">
              <span>Total Payable:</span>
              <span className="text-lg text-gray-900">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <button
            onClick={handleProceedToPayment}
            className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-4 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
          >
            Proceed to Payment
          </button>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-gray-400 text-xs">
            <SecurityIcon sx={{ fontSize: 16 }} />
            <span>Encrypted & Secure Transaction</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
