

import ImageSlider from "../components/ImageSlider";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../features/product/productSlice";
import { useEffect } from "react";




const Home = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts({ limit: 50 }));
  }, [dispatch]);
  
  return (
    <>
      <ImageSlider />
      <main className="container mx-auto px-4 py-8">
        <LatestCollection />
        <BestSeller />
        <OurPolicy />
      </main>
     
    </>
  );
};

export default Home;
