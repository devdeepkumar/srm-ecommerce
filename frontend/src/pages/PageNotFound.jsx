import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const PageNotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md w-full bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <span className="text-7xl sm:text-8xl font-black text-gray-200 tracking-tighter block mb-2 font-mono">
          404
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-8 leading-relaxed">
          The page you are looking for might have been moved, removed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs sm:text-sm font-semibold tracking-wide uppercase transition shadow-sm"
          >
            <span>Back to Home</span>
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
