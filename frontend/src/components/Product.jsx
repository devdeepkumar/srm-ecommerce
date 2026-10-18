import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const Product = ({ product }) => {
  if (!product) return null;

  const discount = Number(product.discount || product.discountPercent || 0);
  const hasDiscount = discount > 0 && discount < 100;
  const mrp = Number(product.price || 0);
  const finalPrice = hasDiscount
    ? Math.round(mrp * (1 - discount / 100))
    : mrp;

    const handleAddtoCart = () => {
      
    }

  return (
    <Link
      to={`/products/${product._id}`}
      key={product._id}
      className="group relative flex flex-col w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1"
    >
      {/* Aspect-Locked Image Container (3:4) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
        <img
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          src={
            product.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80"
          }
          alt={product.name || "Product"}
          loading="lazy"
        />

        {/* Top-Left Discount & Status Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {hasDiscount && (
            <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-amber-600 text-white rounded-md shadow-xs">
              {discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-gray-900 text-amber-300 rounded-md shadow-xs">
              Trending
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-rose-600 flex items-center justify-center shadow-xs transition duration-200">
            <FavoriteBorderIcon sx={{ fontSize: 18 }} />
          </span>
        </div>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold tracking-wider uppercase shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Category / Brand Meta */}
          {product.category && (
            <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 truncate">
              {product.category}
            </p>
          )}

          {/* Product Title (2-line clamped) */}
          <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-amber-700 transition-colors mt-0.5">
            {product.name}
          </h3>

          {/* Rating Pill */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <Rating
              value={Number(product.ratings) || 0}
              precision={0.5}
              readOnly
              size="small"
              sx={{
                "& .MuiRating-iconFilled": { color: "#d97706" },
                fontSize: "0.85rem",
              }}
            />
            <span className="text-[11px] text-gray-400 font-medium">
              ({product.numOfReviews || 0})
            </span>
          </div>
        </div>

        {/* Price Row */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-gray-900">
              ₹{finalPrice.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <>
                <span className="text-[11px] text-gray-400 line-through">
                  ₹{mrp.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] font-bold text-amber-700 hidden sm:inline">
                  ({discount}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Quick Action Icon */}
          <span className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-gray-900 text-gray-700 group-hover:text-amber-300 flex items-center justify-center transition-all duration-200">
            <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Product;
