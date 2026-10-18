import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Title from "./Title";
import Product from "./Product";
import SkeletonCard from "./SkeletonCard";


export default function LatestCollection() {
 
  const { products, status, error } = useSelector((state) => state.product);
  const [latestProducts, setLatestProducts] = useState([]);

 
  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  return (
    <section className="my-12 sm:my-16">
      <div className="text-center py-4">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="w-full max-w-xl mx-auto text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
          Discover our newest arrivals crafted with fine attention to detail and modern elegance.
        </p>
      </div>

      {status === "loading" && !products?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 mt-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : status === "failed" ? (
        <p className="text-center text-gray-400 py-8 text-sm">
          {error || "Unable to load products at this moment."}
        </p>
      ) : latestProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 mt-6">
          {latestProducts.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-8 text-sm">
          No products currently available in this collection.
        </p>
      )}
    </section>
  );
}
