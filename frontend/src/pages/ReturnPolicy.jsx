import { Link } from "react-router-dom";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CachedIcon from "@mui/icons-material/Cached";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ReturnPolicy = () => {
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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 mb-3 shadow-xs">
          <AssignmentReturnOutlinedIcon sx={{ fontSize: 28 }} />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
          Return & Exchange Policy
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Shop with complete confidence. 7-Day doorstep pickup, hassle-free exchanges, and swift refunds.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <CachedIcon className="text-emerald-600 mb-2" />
          <h2 className="font-bold text-sm text-gray-900">7-Day Window</h2>
          <p className="text-xs text-gray-500 mt-1">From the day the parcel is marked delivered</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <CheckCircleOutlineIcon className="text-emerald-600 mb-2" />
          <h2 className="font-bold text-sm text-gray-900">Free Doorstep Pickup</h2>
          <p className="text-xs text-gray-500 mt-1">No reverse shipping charges on genuine issues</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <AssignmentReturnOutlinedIcon className="text-emerald-600 mb-2" />
          <h2 className="font-bold text-sm text-gray-900">Instant Refund Credit</h2>
          <p className="text-xs text-gray-500 mt-1">Processed within 48h of quality verification</p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-10 space-y-8">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            1. 7-Day Hassle-Free Returns
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            At <strong>Shree RamJanki Vastralaya</strong>, we strive to make every shopping experience delightful. If you are not completely satisfied with your apparel fit, color, or fabric, you may initiate a return or exchange request within <strong>7 calendar days</strong> from the delivery date.
          </p>
        </section>

        {/* Eligibility Check Do's and Don'ts */}
        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            2. Return Eligibility Guidelines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircleOutlineIcon sx={{ fontSize: 18 }} /> Eligible for Return
              </h3>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
                <li>Unworn, unwashed, and odor-free garments</li>
                <li>Original brand tags and security seals attached</li>
                <li>Items in original protective polybag or cloth pouch</li>
                <li>Manufacturing faults or incorrect size dispatched</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <HighlightOffIcon sx={{ fontSize: 18 }} /> Not Eligible for Return
              </h3>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
                <li>Items altered, stitched, or tailored by customer</li>
                <li>Products with removed tags, perfumes, or stains</li>
                <li>Final clearance items marked non-returnable</li>
                <li>Requests submitted beyond the 7-day period</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            3. How to Initiate a Return or Exchange
          </h2>
          <ol className="text-xs sm:text-sm text-gray-600 space-y-2 list-decimal pl-5 leading-relaxed">
            <li>Visit your account <Link to="/user/orders" className="text-emerald-700 font-semibold underline">My Orders</Link> section.</li>
            <li>Select the order and tap on <strong>Return / Exchange</strong>.</li>
            <li>Select the reason for return and upload a photo if reporting a defect or damage.</li>
            <li>Our courier partner will schedule reverse pickup at your address within 24 to 48 hours.</li>
          </ol>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            4. Refund Processing Timelines
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Once your returned item arrives at our fulfillment facility and clears our quality inspection:
          </p>
          <ul className="text-xs sm:text-sm text-gray-600 space-y-1.5 list-disc pl-5">
            <li><strong>Prepaid Orders (Cards, NetBanking, Razorpay, Stripe):</strong> Refund will be credited directly to the original payment source within <strong>3-5 banking days</strong>.</li>
            <li><strong>Cash on Delivery (COD) Orders:</strong> Our team will initiate an instant UPI or NEFT transfer directly to your verified bank account details within <strong>24-48 hours</strong> of verification.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            5. Need Assistance?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Our customer care specialists are available Monday to Saturday, 10:00 AM – 7:00 PM IST. Reach out via <Link to="/contact" className="text-emerald-700 font-semibold underline">Contact Support</Link> or call <strong>+91 98765 43210</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicy;
