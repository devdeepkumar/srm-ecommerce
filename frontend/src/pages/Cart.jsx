import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeItemFromCart,
  updateItemQuantity,
} from "../features/cart/cartSlice";
import { toast } from "react-toastify";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SecurityIcon from "@mui/icons-material/Security";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  const total = cartItems.reduce(
    (acc, item) => acc + (item.price || 100) * item.quantity,
    0
  );
  const gst = total * 0.18;
  const shippingCost = total > 1000 ? 0 : 50;
  const subtotal = total + shippingCost + gst;

  const handleQuantityChange = (item, newQty) => {
    if (newQty >= 1 && newQty <= item.stock) {
      dispatch(
        updateItemQuantity({ id: item.id, size: item.size, quantity: newQty })
      );
    }
  };

  const handleRemove = (item) => {
    dispatch(removeItemFromCart({ id: item.id, size: item.size }));
    toast.success(`${item.quantity} ${item.name} removed from cart`);
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/shipping");
    } else {
      navigate("/user/login?redirect=/shipping");
      toast.error("Please login to proceed to checkout");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 min-h-[75vh]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Shopping Bag ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
        </h1>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <ShoppingBagOutlinedIcon sx={{ fontSize: 40 }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Your bag is empty
            </h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              Explore our collections and add your favorite pieces to your shopping bag.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold tracking-wide transition shadow-sm"
            >
              <span>Explore Products</span>
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.size || index}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] gap-4"
                >
                  {/* Image & Item Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl border border-gray-100 shrink-0"
                    />
                    <div className="space-y-1">
                      {item.category && (
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          {item.category}
                        </p>
                      )}
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="text-xs text-gray-500">
                          Size: <span className="font-medium text-gray-700">{item.size}</span>
                        </p>
                      )}
                      {item.price && (
                        <div className="flex items-baseline gap-2 pt-1 flex-wrap">
                          <p className="text-sm sm:text-base font-bold text-gray-900">
                            ₹{Number(item.price).toLocaleString("en-IN")}
                          </p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{Number(item.originalPrice).toLocaleString("en-IN")}
                            </span>
                          )}
                          {item.discount > 0 && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {item.discount}% off
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white transition text-sm font-bold"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs sm:text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white transition text-sm font-bold"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item)}
                      className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                      aria-label="Remove item"
                      title="Remove item"
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Price Summary Box */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] lg:sticky top-24 space-y-5">
              <h2 className="text-base font-bold uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100">
                Price Details
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total (Before GST)</span>
                  <span className="font-semibold text-gray-900">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span className="font-semibold text-gray-900">
                    ₹{gst.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className={`font-semibold ${shippingCost === 0 ? "text-emerald-600" : "text-gray-900"}`}>
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <p className="text-[11px] text-amber-600 font-medium bg-amber-50 p-2 rounded-lg">
                    Add ₹{(1000 - total).toFixed(0)} more to get FREE delivery!
                  </p>
                )}

                <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-lg text-gray-900">
                    ₹{Math.ceil(subtotal).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
              >
                Proceed to Checkout
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-gray-400 text-xs">
                <SecurityIcon sx={{ fontSize: 16 }} />
                <span>100% Safe & Secure Checkout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
