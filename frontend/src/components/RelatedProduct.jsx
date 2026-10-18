import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/product/productSlice";
import Product from "./Product";
import Title from "./Title";

const RelatedProduct = ({ category, id }) => {
  const [related, setRelated] = useState([]);
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products?.length > 0 && category && id) {
      const relatedItems = products
        .filter((item) => item.category?.toLowerCase() === category?.toLowerCase() && item._id !== id)
        .slice(0, 4);
      setRelated(relatedItems);
    }
  }, [products, category, id]);

  if (!related.length) return null;

  return (
    <section className="my-14 sm:my-20" aria-label="Related Products">
      <div className="text-center mb-6">
        <Title text1="SIMILAR" text2="PRODUCTS" />
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          More selections from our {category} collection that you might like.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {related.map((product) => (
          <Product key={product._id || product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProduct;
