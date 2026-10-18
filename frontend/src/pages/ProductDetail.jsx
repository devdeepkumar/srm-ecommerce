import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";

import Loader from "../components/Loader";
import RelatedProduct from "../components/RelatedProduct";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  createReview,
  fetchSingleProduct,
  removeError,
  resetReviewState,
} from "../features/product/productSlice";
import { addItemToCart, removeMessage } from "../features/cart/cartSlice";

const fallbackSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const fallbackColors = ["#000000", "#dc2626", "#2563eb", "#16a34a", "#ca8a04"];

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [mainImage, setMainImage] = useState("");

  const { product, singleProductStatus, error } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.user);
  const {
    loading: cartLoading,
    error: cartError,
    success: cartSuccess,
    message,
  } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
    return () => dispatch(removeError());
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      if (product.images?.length > 0) {
        setMainImage(product.images[0].url);
      }
      const availableSizes =
        product.sizes && product.sizes.length > 0
          ? product.sizes
          : fallbackSizes;
      setSelectedSize((prev) =>
        availableSizes.length > 0 && !prev ? availableSizes[0] : prev
      );

      const availableColors =
        product.colors && product.colors.length > 0
          ? product.colors
          : fallbackColors;
      setSelectedColor((prev) =>
        availableColors.length > 0 && !prev ? availableColors[0] : prev
      );
    }
  }, [product]);

  useEffect(() => {
    if (singleProductStatus === "failed" && error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [singleProductStatus, error, dispatch]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!userComment || userRating === 0) {
      return toast.error("Please provide a rating and comment.");
    }

    try {
      const resultAction = await dispatch(
        createReview({ id, userComment, userRating })
      );

      // Check if fulfilled
      if (createReview.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload.message);

        // Clear form fields after success
        setUserComment("");
        setUserRating(0);
        dispatch(resetReviewState());
        dispatch(fetchSingleProduct(id));
      } else {
        toast.error(resultAction.payload || "Failed to submit review");
        dispatch(resetReviewState());
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Something went wrong while submitting review");
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      toast.error("This product is currently out of stock.");
      return;
    }
    dispatch(addItemToCart({ id: product._id, quantity }));
    setQuantity(1);
  };

  useEffect(() => {
    if (cartError) {
      toast.error(cartError);
      dispatch(removeError());
    }
    if (cartSuccess) {
      toast.success(message || "Added to cart successfully!");
      dispatch(removeMessage());
    }
  }, [cartError, message, cartSuccess, dispatch]);

  if (singleProductStatus === "loading" || !product) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader />
      </div>
    );
  }

  const sizesToRender =
    product.sizes && product.sizes.length > 0 ? product.sizes : fallbackSizes;
  const colorsToRender =
    product.colors && product.colors.length > 0 ? product.colors : fallbackColors;

  const discountPercent = Number(product.discount || product.discountPercent || 0);
  const hasDiscount = discountPercent > 0 && discountPercent < 100;
  const mrp = Number(product.price || 0);
  const finalPrice = hasDiscount
    ? Math.round(mrp * (1 - discountPercent / 100))
    : mrp;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
      {/* Top Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-amber-600 transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-amber-600 transition">
            Products
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="capitalize hover:text-amber-600 transition font-medium"
              >
                {product.category}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main Grid: Images & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Sticky Image Gallery */}
        <div className="lg:col-span-5 lg:sticky top-24 self-start space-y-3">
          {/* Main Hero Image */}
          <div className="w-full h-[380px] sm:h-[440px] overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] relative group">
            <img
              src={mainImage || product.images?.[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
            {product.category && (
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                {product.category}
              </span>
            )}
            {hasDiscount && (
              <span className="absolute top-3 right-3 bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images?.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
              {product.images.map((img, index) => {
                const isActive = (mainImage || product.images[0]?.url) === img?.url;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setMainImage(img?.url)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      isActive
                        ? "border-amber-600 ring-2 ring-amber-500/20 shadow-sm"
                        : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img?.url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Product Details & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div>
            {/* Category Pill */}
            {product.category && (
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full inline-block">
                {product.category} Collection
              </span>
            )}

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4 mt-3">
              <Rating
                name="read-only"
                value={product.ratings}
                precision={0.1}
                readOnly
                size="large"
              />
              <span className="text-sm font-medium text-gray-600">
                ({product.numOfReviews} reviews)
              </span>
            </div>

            {/* Price Row */}
            <div className="mt-5 p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                ₹{finalPrice.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span className="text-base text-gray-400 line-through">
                  MRP ₹{mrp.toLocaleString("en-IN")}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                  Save {discountPercent}% (₹{(mrp - finalPrice).toLocaleString("en-IN")})
                </span>
              )}
              <span className="text-[11px] text-gray-500 w-full mt-1">
                Inclusive of all taxes • Free express shipping on orders above ₹999
              </span>
            </div>

            {/* Stock Availability */}
            <div className="mt-4">
              {product.stock === 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  In Stock ({product.stock} units available)
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 mt-5 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Select Size
                </span>
                <span className="text-xs text-amber-700 font-semibold">
                  Standard Sizing Chart
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {sizesToRender.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-11 h-11 px-3.5 rounded-xl text-xs sm:text-sm font-bold border transition duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-gray-900 text-amber-300 border-gray-900 shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Swatches */}
            {colorsToRender.length > 0 && (
              <div className="mt-5">
                <span className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide block mb-2.5">
                  Select Shade / Color
                </span>
                <div className="flex gap-3">
                  {colorsToRender.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform duration-200 cursor-pointer ${
                          isSelected
                            ? "scale-115 border-gray-900 ring-2 ring-amber-500 shadow-sm"
                            : "border-gray-300 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Counter & Add to Cart */}
            {product.stock > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Counter */}
                <div className="flex items-center justify-between border border-gray-200 rounded-2xl px-2 py-1.5 bg-gray-50 w-full sm:w-36">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-white rounded-xl transition font-bold disabled:opacity-40 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="font-bold text-gray-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) => Math.min(product.stock, prev + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-white rounded-xl transition font-bold disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gray-900 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition duration-200 cursor-pointer disabled:opacity-60"
                >
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />
                  <span>
                    {cartLoading
                      ? "Adding to Bag..."
                      : `Add to Cart • ₹${(product.price * quantity).toLocaleString("en-IN")}`}
                  </span>
                </button>
              </div>
            )}

            {/* 4 Trust Badges */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
                <LocalShippingOutlinedIcon sx={{ fontSize: 20 }} className="text-amber-700" />
                <span className="text-[11px] font-bold text-gray-800">Free Express</span>
                <span className="text-[10px] text-gray-400">Pan-India delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
                <ShieldOutlinedIcon sx={{ fontSize: 20 }} className="text-amber-700" />
                <span className="text-[11px] font-bold text-gray-800">100% Genuine</span>
                <span className="text-[10px] text-gray-400">Direct artisan craft</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
                <AssignmentReturnOutlinedIcon sx={{ fontSize: 20 }} className="text-amber-700" />
                <span className="text-[11px] font-bold text-gray-800">7-Day Returns</span>
                <span className="text-[10px] text-gray-400">Hassle-free pickup</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
                <VerifiedOutlinedIcon sx={{ fontSize: 20 }} className="text-amber-700" />
                <span className="text-[11px] font-bold text-gray-800">Secure Payment</span>
                <span className="text-[10px] text-gray-400">RBI SSL Gateway</span>
              </div>
            </div>

            {/* Submit Review Section */}
            <div className="mt-12 border-t pt-8">
              <h3 className="text-2xl font-bold mb-4">Submit Your Review</h3>
              <form
                onSubmit={handleReviewSubmit}
                className="space-y-4 max-w-full"
              >
                <div>
                  <label
                    htmlFor="user-rating"
                    className="block font-semibold mb-1"
                  >
                    Your Rating:
                  </label>
                  <Rating
                    id="user-rating"
                    name="user-rating"
                    value={userRating}
                    onChange={(e, newValue) => setUserRating(newValue)}
                    size="large"
                  />
                </div>
                <div>
                  <label
                    htmlFor="user-comment"
                    className="block font-semibold mb-1"
                  >
                    Your Comment:
                  </label>
                  <textarea
                    id="user-comment"
                    rows="4"
                    className="w-full border rounded p-2"
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Write your review here..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            </div>

            {/* Display Reviews */}
            <div className="mt-10">
              <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {product.reviews.length === 0 ? (
                  <p className="text-gray-500">No reviews yet. Be the first!</p>
                ) : (
                  product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border p-4 rounded shadow-sm bg-white flex justify-between"
                    >
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <Rating
                          value={review.rating}
                          precision={0.5}
                          readOnly
                          size="large"
                        />
                        <p className="text-gray-600 mt-1">{review.comment}</p>
                      </div>
                      {user && user._id === review.user.toString() && (
                        <div className="flex flex-col justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setUserRating(review.rating);
                              setUserComment(review.comment);
                            }}
                            className="text-blue-600 cursor-pointer flex items-center gap-2"
                          >
                            <EditIcon fontSize="small" /> Edit
                          </button>
                          <button
                            type="button"
                            className="text-red-600 cursor-pointer flex items-center gap-2"
                          >
                            <DeleteIcon fontSize="small" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {product && (
        <section className="mt-16 sm:mt-24 pt-12 border-t border-gray-200">
          <RelatedProduct category={product.category} id={product._id} />
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
