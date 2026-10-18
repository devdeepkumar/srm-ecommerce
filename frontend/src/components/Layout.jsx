
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";


const Layout = () => {
  return (
    <>
      <Navbar />
      <main
        style={{ minHeight: "calc(100vh - 100px)" }}
        className="min-h-screen "
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
