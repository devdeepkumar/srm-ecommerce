import React from "react";
import { Link } from "react-router-dom";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const NoProductFound = ({ keyword }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-center max-w-lg mx-auto my-8">
      <div className="w-20 h-20 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mb-5">
        <SearchOffOutlinedIcon sx={{ fontSize: 38 }} />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">
        No Products Found
      </h2>

      {keyword ? (
        <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed max-w-sm">
          We couldn't find any matches for "
          <span className="font-semibold text-gray-800">{keyword}</span>". <br />
          Please check your spelling or try searching with different keywords.
        </p>
      ) : (
        <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed max-w-sm">
          No items match your selected filter criteria. Try adjusting your filters or explore other categories.
        </p>
      )}

      <Link
        to="/products"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold tracking-wide transition shadow-sm"
      >
        <span>View All Products</span>
        <ArrowForwardIcon sx={{ fontSize: 16 }} />
      </Link>
    </div>
  );
};

export default NoProductFound;
