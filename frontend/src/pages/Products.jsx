import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  fetchProducts,
  removeError,
} from "../features/product/productSlice.js";

import SkeletonCard from "../components/SkeletonCard";
import NoProductFound from "../components/NoProductFound";
import FilterSortBar from "../components/FilterSortBar";
import Pagination from "../components/Pagination";
import Product from "../components/Product";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { products, status, error, totalPages } =
    useSelector((state) => state.product);

  // Extract query params
  const query = new URLSearchParams(location.search);
  const keyword = query.get("keyword") || "";
  const category = query.get("category") || "";
  const pageFromURL = parseInt(query.get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(pageFromURL);

  // Keep currentPage in sync with URL
  useEffect(() => {
    const urlPage =
      parseInt(new URLSearchParams(location.search).get("page")) || 1;
    setCurrentPage(urlPage);
  }, [location.search]);

  // Prevent "Page X Not Found" if filtered results have fewer pages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      const updatedQuery = new URLSearchParams(location.search);
      updatedQuery.set("page", totalPages);
      navigate(`?${updatedQuery.toString()}`, { replace: true });
    }
  }, [totalPages, currentPage, location.search, navigate]);

  // Fetch products based on query
  useEffect(() => {
    dispatch(fetchProducts({ keyword, category, page: currentPage }));
  }, [dispatch, keyword, category, currentPage]);

  // Handle error display
  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [status, error, dispatch]);

  // Page change handler
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      const newQuery = new URLSearchParams(location.search);
      if (page === 1) newQuery.delete("page");
      else newQuery.set("page", page);
      navigate(`?${newQuery.toString()}`);
    }
  };

  // Category change handler
  const onCategoryChange = (cat) => {
    const newQuery = new URLSearchParams(location.search);
    if (cat) newQuery.set("category", cat);
    else newQuery.delete("category");

    newQuery.delete("page");
    navigate(`?${newQuery.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 min-h-[75vh]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between mb-8 sm:mb-4 items-start sm:items-center gap-4 p-4 sm:p-2 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="mb-6 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {category
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`
              : "All Products"}
          </h1>
          {keyword && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Search results for:{" "}
              <span className="font-semibold text-gray-800">"{keyword}"</span>
            </p>
          )}
        </div>

        <FilterSortBar
          selectedCategory={category}
          onCategoryChange={onCategoryChange}
        />
      </div>

      {/* Product Grid / Loading Skeleton / Empty State */}
      {status === "loading" ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <NoProductFound keyword={keyword} />
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default Products;
