import { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import Title from "./Title";
import Product from "./Product";
import SkeletonCard from "./SkeletonCard";


export default function BestSeller() {
  
  const { products, status, error } = useSelector((state) => state.product);
  const [bestSeller, setBestSeller] = useState([]);



  useEffect(() => {
    if (products && products.length > 0) {
      console.log("Product length",products.length)
      const bestProduct = products.filter((item) => item.isFeatured);
      console.log(" bedds",bestProduct)
      setBestSeller(bestProduct.length > 0 ? bestProduct.slice(0, 5) : products.slice(0, 5));
    }
  }, [products]);



  return (
    <section className="my-12 sm:my-16">
      <div className="text-center py-4">
        <Title text1="BEST" text2="SELLERS" />
        <p className="w-full max-w-xl mx-auto text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
          Our most sought-after designs, loved by customers for their exceptional quality and fit.
        </p>
      </div>

      {status === "loading" && !products?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 sm:gap-6 mt-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : status === "failed" ? (
        <p className="text-center text-gray-400 py-8 text-sm">
          {error || "Unable to load bestsellers at this moment."}
        </p>
      ) : bestSeller.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 sm:gap-6 mt-6">
          {bestSeller.map((item) => (
            <Product key={item.id || item._id} product={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-8 text-sm">
          No bestsellers available yet.
        </p>
      )}
    </section>
  );
}
