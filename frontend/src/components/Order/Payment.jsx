import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import CheckoutPath from "../CheckoutPath";

// Material UI Icons
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SecurityIcon from "@mui/icons-material/Security";

const Payment = () => {
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [selectedPayment, setSelectedPayment] = useState("");
  const amountData = JSON.parse(sessionStorage.getItem("amountData")) || {
    subtotal: 0,
  };

  // Redirect if user not logged in or missing shipping info
  useEffect(() => {
    if (!isAuthenticated) navigate("/user/login?redirect=/payment");
    if (!shippingInfo?.address) navigate("/shipping");
  }, [isAuthenticated, shippingInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    if (selectedPayment === "Cash on Delivery") {
      navigate("/paymentSuccess?reference=cod");
      return;
    }

    if (selectedPayment === "Stripe") {
      navigate("/stripeCheckout");
      return;
    }

    if (selectedPayment === "RazorPay") {
      try {
        // Create order
        const { data: orderData } = await axios.post(
          "/api/v1/payment/order",
          { amount: Number(amountData.subtotal), currency: "INR" },
          { withCredentials: true }
        );

        // Get key
        const { data: keyData } = await axios.get("/api/v1/payment/getKey", {
          withCredentials: true,
        });

        // Load Razorpay SDK
        const scriptLoaded = await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
        if (!scriptLoaded) {
          toast.error("Failed to load Razorpay SDK");
          return;
        }

        // Configure Razorpay
        const options = {
          key: keyData.key,
          amount: Number(amountData.subtotal) * 100,
          currency: orderData.currency,
          name: "Shree RamJanki Vastralaya",
          description: "Order Payment",
          order_id: orderData.order.id,
          handler: async (response) => {
            try {
              const { data } = await axios.post(
                "/api/v1/payment/verify",
                response,
                { withCredentials: true }
              );
              if (data.success) {
                window.location.href = `/paymentSuccess?reference=${data.reference}`;
              } else {
                toast.error("Payment verification failed");
              }
            } catch (error) {
              console.log("Payment verification error:", error);
              toast.error(
                error.response?.data?.message ||
                  "Payment failed during verification"
              );
            }
          },
          prefill: {
            name: user?.name || "Customer",
            email: user?.email || "customer@example.com",
            contact: shippingInfo?.phone || "9999999999",
          },
          theme: { color: "#111827" },
        };

        new window.Razorpay(options).open();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Payment failed. Try again."
        );
      }
    }
  };

  const paymentOptions = [
    {
      name: "Cash on Delivery",
      label: "Cash on Delivery (COD)",
      desc: "Pay in cash at the time of doorstep delivery",
      icon: <AttachMoneyIcon className="text-emerald-600" />,
    },
    {
      name: "RazorPay",
      label: "Online Payment (UPI, Cards, NetBanking)",
      desc: "Instant and secure payment via Razorpay",
      icon: <AccountBalanceWalletIcon className="text-amber-600" />,
    },
    {
      name: "Stripe",
      label: "Credit / Debit Card (Stripe)",
      desc: "Pay with international or domestic cards",
      icon: <CreditCardIcon className="text-indigo-600" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[75vh]">
      <CheckoutPath currentStep={2} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6 sm:p-10 mt-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Select Payment Method
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-8">
          Choose your preferred method to complete this order securely.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {paymentOptions.map((method) => (
            <label
              key={method.name}
              className={`flex items-start p-4.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedPayment === method.name
                  ? "border-gray-900 bg-gray-50/70 ring-1 ring-gray-900"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/30"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.name}
                checked={selectedPayment === method.name}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="accent-gray-900 mt-1 mr-3.5"
              />
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-white border border-gray-100 shadow-xs shrink-0">
                  {method.icon}
                </div>
                <div>
                  <span className="font-semibold text-sm text-gray-900 block">
                    {method.label}
                  </span>
                  <span className="text-xs text-gray-500 block mt-0.5">
                    {method.desc}
                  </span>
                </div>
              </div>
            </label>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-4 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
            >
              {selectedPayment === "Cash on Delivery"
                ? `Place Order • ₹${amountData.subtotal.toLocaleString("en-IN")}`
                : `Pay Now • ₹${amountData.subtotal.toLocaleString("en-IN")}`}
            </button>
          </div>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-gray-400 text-xs">
            <SecurityIcon sx={{ fontSize: 16 }} />
            <span>256-Bit SSL Encrypted Payment</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
