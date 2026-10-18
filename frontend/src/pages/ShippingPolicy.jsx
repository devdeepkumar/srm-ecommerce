import { Link } from "react-router-dom";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl min-h-[75vh]">
      {/* Back to Home Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 mb-3 shadow-xs">
          <LocalShippingOutlinedIcon sx={{ fontSize: 28 }} />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Fast, secure, and reliable doorstep delivery across all 28 states and union territories in India.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <AccessTimeOutlinedIcon className="text-amber-600 mb-2" />
          <h2 className="font-bold text-sm text-gray-900">24-48h Dispatch</h2>
          <p className="text-xs text-gray-500 mt-1">Orders processed rapidly on all business days</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <LocationOnOutlinedIcon className="text-amber-600 mb-2" />
          <h2 className="font-bold text-sm text-gray-900">25,000+ Pin Codes</h2>
          <p className="text-xs text-gray-500 mt-1">Extensive Pan-India courier reach</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <VerifiedUserOutlinedIcon className="text-amber-600 mb-2" />
          <h2 className="font-bold text-sm text-gray-900">100% Insured Transit</h2>
          <p className="text-xs text-gray-500 mt-1">Tamper-evident, protective packaging</p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-10 space-y-8">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            1. Shipping Rates & Free Delivery
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We are pleased to offer <strong>Free Standard Shipping</strong> on all domestic orders valued at <strong>₹999 or above</strong>. For orders totaling below ₹999, a flat shipping and handling fee of <strong>₹50</strong> will be applied automatically at checkout.
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            2. Estimated Delivery Timelines
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            All orders are dispatched from our central distribution hubs within 24 to 48 hours of order confirmation. Average delivery timelines based on regional locations are:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-700">
                  <th className="py-2.5 px-4 font-semibold">Location</th>
                  <th className="py-2.5 px-4 font-semibold">Estimated Transit Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-gray-900">Metro Cities (Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad)</td>
                  <td className="py-2.5 px-4">2 – 4 Business Days</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-gray-900">Tier 2 & Tier 3 Cities</td>
                  <td className="py-2.5 px-4">4 – 6 Business Days</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-gray-900">North-East, J&K, Remote Pin Codes</td>
                  <td className="py-2.5 px-4">6 – 8 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            3. Order Tracking
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            As soon as your shipment is picked up by our logistics partner (Blue Dart, Delhivery, DTDC, Xpressbees), a unique tracking Airway Bill (AWB) number and direct tracking URL will be sent to your registered email address and mobile number. You can also monitor your active order status anytime under <Link to="/user/orders" className="text-amber-600 font-semibold underline">My Orders</Link>.
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            4. Cash on Delivery (COD) Verification
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            For Cash on Delivery orders, our verification desk may perform an automated SMS or phone confirmation before dispatch. Please keep exact cash ready at the time of delivery, or pay via digital UPI directly to the delivery personnel's handheld terminal.
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            5. Damaged or Tampered Parcels
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            If the outer courier parcel appears damaged, opened, or tampered with at the time of receipt, please refuse delivery and immediately contact our care team at <Link to="/contact" className="text-amber-600 font-semibold underline">support@srmvastralaya.com</Link> with photos.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
