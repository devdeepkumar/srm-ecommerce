import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // optional

export default function AuthLayout() {
  return (
    <>
      <Navbar /> {/* You can remove this line if you want no navbar too */}
      <main style={{ minHeight: "calc(100vh - 100px)" }} className="flex items-center">
      <Outlet />
      </main>
    </>
  );
}
