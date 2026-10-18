import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Loader";
import {
  removeError,
  removeSuccess,
  updateProduct,
  ViewProduct,
} from "../../../features/admin/adminSlice";
import { toast } from "react-toastify";

// MUI Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StarIcon from "@mui/icons-material/Star";

const availableSizes = [
  "NB", "0-3M", "3-6M", "6-9M", "9-12M", "12M", "18M", "24M",
  "2T", "3T", "4T", "5T",
  "XS (4-5)", "S (6-7)", "M (8-9)", "L (10-12)", "XL (14-16)",
  "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL",
];

const availableColors = [
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#000000" },
  { name: "Gray", hex: "#808080" },
  { name: "Silver", hex: "#c0c0c0" },
  { name: "Red", hex: "#ff0000" },
  { name: "Maroon", hex: "#800000" },
  { name: "Orange", hex: "#ffa500" },
  { name: "Yellow", hex: "#ffff00" },
  { name: "Beige", hex: "#f5f5dc" },
  { name: "Olive", hex: "#808000" },
  { name: "Dark Green", hex: "#008000" },
  { name: "Bright Green", hex: "#28a745" },
  { name: "Teal", hex: "#008080" },
  { name: "Cyan", hex: "#00ffff" },
  { name: "Royal Blue", hex: "#0066ff" },
  { name: "Blue", hex: "#0000ff" },
  { name: "Navy", hex: "#000080" },
  { name: "Purple", hex: "#800080" },
  { name: "Magenta", hex: "#ff00ff" },
  { name: "Pink", hex: "#ffc0cb" },
  { name: "Hot Pink", hex: "#ff69b4" },
  { name: "Brown", hex: "#a52a2a" },
  { name: "Chocolate", hex: "#d2691e" },
  { name: "Peach", hex: "#ffdab9" },
  { name: "Lavender", hex: "#e6e6fa" },
];

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: 0,
    category: "mens",
    stock: 0,
    isFeatured: false,
    sizes: [],
    colors: [],
    images: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear stale success/error state on mount
  useEffect(() => {
    dispatch(removeSuccess());
    dispatch(removeError());
    if (id) {
      dispatch(ViewProduct(id));
    }
  }, [id, dispatch]);

  // Sync redux product into local state
  useEffect(() => {
    if (product && product._id === id) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price ?? "",
        discount: product.discount ?? 0,
        category: (product.category || "mens").toLowerCase(),
        stock: product.stock ?? 0,
        isFeatured: Boolean(product.isFeatured),
        sizes: Array.isArray(product.sizes) ? product.sizes : [],
        colors: Array.isArray(product.colors) ? product.colors : [],
        images: Array.isArray(product.images) ? product.images : [],
      });
    }
  }, [product, id]);

  // Handle inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Toggle size
  const toggleSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // Toggle color
  const toggleColor = (colorHex) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorHex)
        ? prev.colors.filter((c) => c !== colorHex)
        : [...prev.colors, colorHex],
    }));
  };

  // Handle new images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  // Handle submit with .unwrap() to prevent accidental redirect loop
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (formData.price === "" || Number(formData.price) < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("discount", Number(formData.discount) || 0);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("isFeatured", formData.isFeatured);

      formData.sizes.forEach((s) => data.append("sizes", s));
      formData.colors.forEach((c) => data.append("colors", c));

      newImages.forEach((file) => {
        data.append("images", file);
      });

      await dispatch(updateProduct({ id, updatedProduct: data })).unwrap();
      toast.success("Product updated successfully!");
      dispatch(removeSuccess());
      navigate("/admin/products");
    } catch (err) {
      toast.error(err || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !formData.name) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6  mx-auto min-h-screen">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center"
            title="Back to products list"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <EditIcon className="text-amber-600" sx={{ fontSize: 24 }} />
              <span>Edit Product</span>
            </h1>
            <p className="text-xs text-gray-400">
              Product ID: <span className="font-mono">{id}</span>
            </p>
          </div>
        </div>

        <Link
          to={`/products/${id}`}
          target="_blank"
          className="text-xs font-semibold text-amber-700 hover:underline hidden sm:inline"
        >
          View on Storefront ↗
        </Link>
      </div>

      {/* Main Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Product Name */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Product Title *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Classic Cotton Crewneck T-Shirt"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition cursor-pointer capitalize"
            >
              <option value="mens">Mens</option>
              <option value="womens">Womens</option>
              <option value="kids">Kids</option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Product Price / MRP (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 1000"
              min="0"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              required
            />
          </div>

          {/* Discount Percentage */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Discount (%)
              </label>
              <span className="text-[11px] text-gray-400 font-medium">
                0 = No discount
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="99"
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition pr-10"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">
                %
              </span>
            </div>
            {formData.price && (
              <div className="mt-1">
                {Number(formData.discount) > 0 ? (
                  <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/80 rounded-lg px-2.5 py-1.5">
                    Final Selling Price: <span className="font-bold">₹{Math.round(Number(formData.price) * (1 - Number(formData.discount) / 100)).toLocaleString("en-IN")}</span>{" "}
                    (Discount: -₹{Math.round((Number(formData.price) * Number(formData.discount)) / 100).toLocaleString("en-IN")}, MRP: ₹{Number(formData.price).toLocaleString("en-IN")})
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-500">
                    Selling Price: ₹{Number(formData.price).toLocaleString("en-IN")} (Regular price, no discount badge)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="e.g. 50"
              min="0"
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              required
            />
          </div>

          {/* Featured Item Toggle (CRITICAL FIX) */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <label
              htmlFor="isFeatured"
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                formData.isFeatured
                  ? "bg-purple-50/60 border-purple-400 ring-2 ring-purple-500/20"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    formData.isFeatured
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <StarIcon sx={{ fontSize: 18 }} />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block">
                    Featured Product
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    Show on homepage carousels & featured list
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Write a clear, appealing description for customers..."
              className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition resize-y"
            />
          </div>
        </div>

        {/* Sizes Selection */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            Available Sizes ({formData.sizes.length} selected)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((size) => {
              const isSelected = formData.sizes.includes(size);
              return (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                    isSelected
                      ? "bg-gray-900 text-white border-gray-900 shadow-xs"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Colors Selection */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            Available Colors ({formData.colors.length} selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((c) => {
              const isSelected = formData.colors.includes(c.hex);
              return (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => toggleColor(c.hex)}
                  title={c.name}
                  className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer relative ${
                    isSelected
                      ? "ring-2 ring-amber-500 ring-offset-2 scale-110 border-gray-900"
                      : "border-gray-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        </div>

        {/* Images Section */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
            Product Images
          </label>

          {/* Current Images */}
          {formData.images?.length > 0 && (
            <div>
              <span className="text-[11px] text-gray-400 block mb-2 font-medium">
                Current Images ({formData.images.length})
              </span>
              <div className="flex gap-3 flex-wrap">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-xs relative bg-gray-50"
                  >
                    <img
                      src={img.url}
                      alt={`Product thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/80x100?text=No+Img";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Newly selected image previews */}
          {previewImages.length > 0 && (
            <div>
              <span className="text-[11px] text-amber-700 block mb-2 font-semibold">
                New Uploads (will replace existing images):
              </span>
              <div className="flex gap-3 flex-wrap">
                {previewImages.map((url, idx) => (
                  <div
                    key={`new-${idx}`}
                    className="w-20 h-24 rounded-xl overflow-hidden border-2 border-amber-500 shadow-xs relative bg-gray-50"
                  >
                    <img
                      src={url}
                      alt="New preview"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File input */}
          <div className="mt-2">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold cursor-pointer transition">
              <CloudUploadIcon sx={{ fontSize: 18 }} />
              <span>Choose New Images (Max 5)</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <span className="text-[11px] text-gray-400 block mt-1">
              Leave empty to keep existing images.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-5 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition cursor-pointer"
          >
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
