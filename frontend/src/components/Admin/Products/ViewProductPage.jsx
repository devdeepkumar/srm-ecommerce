import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ViewProduct,
  deleteProduct,
  removeError,
  removeSuccess,
} from "../../../features/admin/adminSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../Loader";

// MUI Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import LaunchIcon from "@mui/icons-material/Launch";

const ViewProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.admin);

  // Fetch product on mount & clear stale notifications
  useEffect(() => {
    dispatch(removeSuccess());
    dispatch(removeError());
    if (id) dispatch(ViewProduct(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  // Delete product handler
  const handleDelete = () => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${product?.name || "this product"}"?`
      )
    )
      return;

    dispatch(deleteProduct(id))
      .unwrap()
      .then(() => {
        toast.success("Product deleted successfully");
        dispatch(removeSuccess());
        navigate("/admin/products");
      })
      .catch((err) => {
        toast.error(err || "Failed to delete product");
      });
  };

  if (loading || !product) return <Loader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6  mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/products")}
            className="p-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center"
            title="Back to products list"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Product Overview
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              ID: {product._id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={`/products/${product._id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 transition"
          >
            <LaunchIcon sx={{ fontSize: 16 }} />
            <span>Storefront</span>
          </Link>

          <Link
            to={`/admin/products/edit/${product._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-xs"
          >
            <EditIcon sx={{ fontSize: 16 }} />
            <span>Edit</span>
          </Link>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Card */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-8">
        {/* Images Gallery */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Product Media ({product.images?.length || 0})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {product?.images?.length > 0 ? (
              product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-3/4 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-xs relative group"
                >
                  <img
                    src={img.url}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/200x250?text=No+Img";
                    }}
                  />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-gray-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Primary
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No images uploaded</p>
            )}
          </div>
        </div>

        {/* Product Info & Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          {/* Main Info (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {product.category || "General"}
                </span>
                {product.isFeatured && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    <StarIcon sx={{ fontSize: 13 }} />
                    <span>Featured Item</span>
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {product.name}
              </h2>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description || "No description provided."}
            </p>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Sizes Available
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Colors Available
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c, idx) => (
                    <span
                      key={idx}
                      className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics (1 col) */}
          <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Retail Price
                </span>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl font-black text-gray-900 tracking-tight">
                      ₹{product.discount > 0
                        ? Math.round(product.price * (1 - product.discount / 100)).toLocaleString("en-IN")
                        : Number(product.price || 0).toLocaleString("en-IN")}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                  {product.discount > 0 && (
                    <span className="text-xs text-gray-400 line-through block">
                      MRP ₹{Number(product.price || 0).toLocaleString("en-IN")} (Discount: -₹{Math.round((product.price * product.discount) / 100).toLocaleString("en-IN")})
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Inventory Status
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    product.stock === 0
                      ? "bg-rose-100 text-rose-800"
                      : product.stock <= 10
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      product.stock === 0
                        ? "bg-rose-500"
                        : product.stock <= 10
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span>
                    {product.stock === 0
                      ? "Out of Stock"
                      : `${product.stock} units in stock`}
                  </span>
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Customer Ratings
                </span>
                <div className="flex items-center gap-1.5">
                  <StarIcon className="text-amber-500" sx={{ fontSize: 18 }} />
                  <span className="text-base font-extrabold text-gray-900">
                    {Number(product.ratings || 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({product.numOfReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200/60 text-[11px] text-gray-400 space-y-0.5">
              <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
              <p>Last Modified: {new Date(product.updatedAt || product.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage;
