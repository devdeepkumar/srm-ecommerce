import { useSearchParams, Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import {
  createOrder,
  removeError,
  removeSuccess,
} from "../../features/order/orderSlice";
import { toast } from "react-toastify";
import { clearCart } from "../../features/cart/cartSlice";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const orderCreatedRef = useRef(false);
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { success, error } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  const amountData = JSON.parse(sessionStorage.getItem("amountData") || "{}");

  const paymentMethod =
    reference && reference !== "cod" ? "Paid" : "Cash on Delivery";

  useEffect(() => {
    if (
      !orderCreatedRef.current &&
      shippingInfo?.address &&
      cartItems.length > 0 &&
      user?._id &&
      amountData?.subtotal &&
      reference &&
      paymentMethod
    ) {
      const orderData = {
        shippingInfo: {
          address: shippingInfo.address,
          houseNo: shippingInfo.houseNo || "",
          landMark: shippingInfo.landMark || shippingInfo.landmark || "",
          city: shippingInfo.city,
          state: shippingInfo.state,
          country: shippingInfo.country,
          postalCode: shippingInfo.postalCode,
          phoneNo: shippingInfo.phone,
        },
        orderItems: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "https://image.com",
          product: item.id,
        })),
        user: user._id,
        paymentInfo: {
          id: reference,
          status: paymentMethod,
        },
        itemsPrice: amountData.subtotal,
        taxPrice: amountData.gst,
        shippingPrice: amountData.shippingCost,
        totalPrice: amountData.total,
      };

      dispatch(createOrder(orderData));
      orderCreatedRef.current = true;
    }
  }, [
    reference,
    shippingInfo,
    cartItems,
    user,
    amountData,
    paymentMethod,
    dispatch,
  ]);

  useEffect(() => {
    if (success) {
      toast.success("Order placed successfully");
      dispatch(clearCart());
      sessionStorage.removeItem("amountData");
      dispatch(removeSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error("Order not placed");
      console.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <CheckCircleIcon sx={{ fontSize: 44 }} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          {reference === "cod" ? "Order Placed Successfully" : "Payment Successful"}
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
          Thank you for shopping with us! We have received your order and will start processing it right away.
        </p>

        {reference && (
          <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600">
            Reference / Transaction ID:{" "}
            <span className="font-bold text-gray-900 block mt-0.5">{reference}</span>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Link
            to="/user/orders"
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition shadow-md hover:shadow-lg"
          >
            <span>View My Orders</span>
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Link>
          <Link
            to="/"
            className="block w-full border border-gray-200 hover:bg-gray-50 text-gray-700 py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
