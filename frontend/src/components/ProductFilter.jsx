import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/product/productSlice"; // Adjust path as needed

const ProductFilter = () => {
   const dispatch = useDispatch();
   const { products, status, error } = useSelector((state) => state.product);


  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  // Fetch all products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Apply filter + sort when products or filters change
  useEffect(() => {
    let updatedProducts = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      updatedProducts = updatedProducts.filter(
        (product) => product.category.toLowerCase() === selectedCategory
      );
    }

    // Sort by price
    if (sortOrder === "lowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [products, selectedCategory, sortOrder]);

  const categories = ["all", "mens", "womens", "kids"]; // adjust as needed

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Sort by Price</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>

      {/* Loading / Error */}
      {status === "loading" && <p>Loading products...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <img
              src={product.image}
              alt={product.name}
              className="h-40 w-full object-contain mb-2"
            />
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-600">₹{product.price}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
