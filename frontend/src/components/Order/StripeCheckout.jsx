import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SecurityIcon from "@mui/icons-material/Security";
import CheckoutPath from "../CheckoutPath";

const StripeCheckout = () => {
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [processing, setProcessing] = useState(false);

  const amountData = JSON.parse(sessionStorage.getItem("amountData") || "{}");

  useEffect(() => {
    if (!isAuthenticated) navigate("/user/login?redirect=/stripeCheckout");
    if (!shippingInfo?.address) navigate("/shipping");
  }, [isAuthenticated, shippingInfo, navigate]);

  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 2) {
      setExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setExpiry(val);
    }
  };

  const handlePay = (e) => {
    e.preventDefault();

    if (!cardNumber || !expiry || !cvc || !nameOnCard) {
      toast.error("Please fill in all card details");
      return;
    }

    if (cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Please enter a valid 16-digit card number");
      return;
    }

    if (cvc.length < 3) {
      toast.error("Please enter a valid 3-digit CVC");
      return;
    }

    setProcessing(true);

    // Simulate card payment verification and redirect to paymentSuccess
    setTimeout(() => {
      setProcessing(false);
      const mockRef = `stripe_tx_${Date.now()}`;
      navigate(`/paymentSuccess?reference=${mockRef}`);
    }, 1200);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl min-h-[75vh]">
      <CheckoutPath currentStep={2} />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 sm:p-10 mt-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <CreditCardIcon sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Card Payment (Stripe)
            </h1>
            <p className="text-xs text-gray-400">
              Total Payable: <span className="font-bold text-gray-900">₹{amountData.subtotal || 0}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Name on Card
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-indigo-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength="19"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-indigo-500 rounded-xl p-3 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                maxLength="5"
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-indigo-500 rounded-xl p-3 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                CVC / CVV
              </label>
              <input
                type="password"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength="4"
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-indigo-500 rounded-xl p-3 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-4 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              {processing ? "Processing Payment..." : `Pay ₹${amountData.subtotal || 0}`}
            </button>
          </div>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-gray-400 text-xs">
            <SecurityIcon sx={{ fontSize: 16 }} />
            <span>256-Bit SSL Encrypted by Stripe</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StripeCheckout;
