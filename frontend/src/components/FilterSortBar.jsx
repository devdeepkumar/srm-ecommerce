import React from "react";
import FilterListIcon from "@mui/icons-material/FilterList";

const FilterSortBar = ({
  categories = ["Mens", "Womens", "Kids"],
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4   bg-white rounded-2xl">
      {/* Category Filter */}
      <div className="flex items-center gap-3">
        <span className="text-gray-400 flex items-center">
          <FilterListIcon sx={{ fontSize: 18 }} />
        </span>
        <label htmlFor="category" className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
          Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Option (if provided) */}
      {onSortChange && (
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
            Sort By:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition cursor-pointer"
          >
            <option value="">Recommended</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default FilterSortBar;
