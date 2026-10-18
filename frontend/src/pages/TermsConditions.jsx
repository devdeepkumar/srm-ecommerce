import { Link } from "react-router-dom";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SupportOutlinedIcon from "@mui/icons-material/SupportOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TermsConditions = () => {
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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 mb-3 shadow-xs">
          <DescriptionOutlinedIcon sx={{ fontSize: 28 }} />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-lg mx-auto">
          Please read these terms carefully before making purchases or using our digital commerce services.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <BalanceOutlinedIcon className="text-slate-700 mb-2" />
          <h2 className="font-bold text-sm text-gray-900">Legal Agreement</h2>
          <p className="text-xs text-gray-500 mt-1">Binding agreement between user and Shree RamJanki Vastralaya</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <ReceiptLongOutlinedIcon className="text-slate-700 mb-2" />
          <h2 className="font-bold text-sm text-gray-900">Fair Pricing & GST</h2>
          <p className="text-xs text-gray-500 mt-1">All catalog prices are inclusive of applicable Indian GST</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center">
          <SupportOutlinedIcon className="text-slate-700 mb-2" />
          <h2 className="font-bold text-sm text-gray-900">Consumer Rights</h2>
          <p className="text-xs text-gray-500 mt-1">Protected under Consumer Protection (E-Commerce) Rules</p>
        </div>
      </div>

      {/* Terms Sections */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-10 space-y-8">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-700"></span>
            1. Acceptance of Terms
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            By visiting, accessing, or purchasing from <strong>Shree RamJanki Vastralaya (SRM Store)</strong>, you agree to be bound by these Terms & Conditions and our associated policies (including our <Link to="/privacy-policy" className="text-slate-900 font-semibold underline">Privacy Policy</Link>, <Link to="/shipping-policy" className="text-slate-900 font-semibold underline">Shipping Policy</Link>, and <Link to="/return-policy" className="text-slate-900 font-semibold underline">Return Policy</Link>).
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-700"></span>
            2. User Account & Security
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            When you register on our store, you are responsible for maintaining the confidentiality of your credentials, password, and account access. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized breach.
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-700"></span>
            3. Product Display, Color Accuracy & Pricing
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We make every effort to display true colors, textiles, and intricate embroidery accurately on screen. However, slight variations may occur due to photography lighting or individual monitor screen calibrations. All prices displayed are in Indian Rupees (INR) and are inclusive of GST.
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-700"></span>
            4. Order Acceptance & Cancellation
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We reserve the right to decline or cancel any order for reasons including non-availability of fabric, inaccurate pricing listings, or failed payment authorizations. In case of cancellation after payment debited, full refund will be credited back automatically.
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-700"></span>
            5. Intellectual Property & Governing Law
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            All content on this site including photography, logo, brand mark, texts, and styling are the intellectual property of Shree RamJanki Vastralaya. These Terms are governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the competent courts in India.
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-100 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-700"></span>
            6. Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            If you have any questions or clarifications regarding our Terms & Conditions, please write to us at <Link to="/contact" className="text-slate-900 font-semibold underline">legal@srmvastralaya.com</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
