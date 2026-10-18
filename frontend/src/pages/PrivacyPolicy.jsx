import { Link } from "react-router-dom";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PrivacyPolicy = () => {
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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 mb-3 shadow-xs">
          <SecurityOutlinedIcon sx={{ fontSize: 28 }} />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Last updated: October 2026. Your privacy and personal data security are of utmost importance to us.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <LockOutlinedIcon className="text-indigo-600 mb-2" />
          <h2 className="font-bold text-sm text-gray-900">256-Bit SSL Security</h2>
          <p className="text-xs text-gray-500 mt-1">End-to-end encrypted communication</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <VisibilityOffOutlinedIcon className="text-indigo-600 mb-2" />
          <h2 className="font-bold text-sm text-gray-900">Zero Data Selling</h2>
          <p className="text-xs text-gray-500 mt-1">We never sell personal information to third parties</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <GavelOutlinedIcon className="text-indigo-600 mb-2" />
          <h2 className="font-bold text-sm text-gray-900">DPDP Act Compliant</h2>
          <p className="text-xs text-gray-500 mt-1">Full compliance with Indian data regulations</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-10 space-y-8">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            1. Overview & Commitment
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            This Privacy Policy describes how <strong>Shree RamJanki Vastralaya (SRM Store)</strong> collects, uses, protects, and discloses personal information obtained from customers using our website and mobile platforms. By accessing or shopping with us, you agree to the practices outlined in this policy.
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            2. Personal Information We Collect
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            When you create an account, place an order, or browse our platform, we may collect the following data:
          </p>
          <ul className="text-xs sm:text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li><strong>Contact Details:</strong> Full name, email address, phone number, and delivery pin code.</li>
            <li><strong>Delivery Addresses:</strong> Complete recipient address for dispatch and courier handover.</li>
            <li><strong>Transaction & Order History:</strong> Products purchased, quantities, billing receipts, and payment method used.</li>
            <li><strong>Device & Session Data:</strong> IP address, browser type, and operating system for security and fraud prevention.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            3. Payment Security & Tokenization
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We <strong>never</strong> store raw debit/credit card numbers, expiry dates, or CVV codes on our servers. All financial transactions are securely processed through RBI-licensed payment gateways (Razorpay, Stripe) with Level 1 PCI-DSS compliance and multi-factor authentication (OTP/3D Secure).
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            4. How We Use Your Information
          </h2>
          <ul className="text-xs sm:text-sm text-gray-600 space-y-1.5 list-disc pl-5">
            <li>To fulfill, pack, ship, and deliver your orders accurately.</li>
            <li>To send automated SMS/Email shipment tracking and delivery status alerts.</li>
            <li>To assist with customer support inquiries, returns, and refunds.</li>
            <li>To protect against fraudulent transactions and ensure system security.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            5. Your Rights & Data Choices
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            You maintain the right to view, correct, or request deletion of your account profile at any time via your <Link to="/user/profile" className="text-indigo-600 font-semibold underline">Profile Settings</Link>. For any data inquiries or grievance redressal, contact our designated Grievance Officer at <Link to="/contact" className="text-indigo-600 font-semibold underline">privacy@srmvastralaya.com</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
