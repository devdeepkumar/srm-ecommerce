import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import Loader from "./components/Loader";

// Core Pages (Keep main landing page eager for instantaneous first paint)
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

// Lazy-loaded Pages (Loaded on-demand to optimize bundle size & initial load speed)
const Service = lazy(() => import("./pages/Service"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const ReturnPolicy = lazy(() => import("./pages/ReturnPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

// User / Account Pages
const Register = lazy(() => import("./components/User/Register"));
const Login = lazy(() => import("./components/User/Login"));
const ForgotPassword = lazy(() => import("./components/User/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/User/ResetPassword"));
const Profile = lazy(() => import("./components/User/Profile"));
const EditProfile = lazy(() => import("./components/User/EditProfile"));
const ChangePassword = lazy(() => import("./components/User/ChangePassword"));

// Checkout & Order Pages
const Shipping = lazy(() => import("./components/Order/Shipping"));
const OrderConfirmation = lazy(() => import("./components/Order/OrderConfirmation"));
const Payment = lazy(() => import("./components/Order/Payment"));
const StripeCheckout = lazy(() => import("./components/Order/StripeCheckout"));
const PaymentSuccess = lazy(() => import("./components/Order/PaymentSuccess"));
const Order = lazy(() => import("./pages/Order"));
const OrderDetails = lazy(() => import("./components/Order/OrderDetails"));

// Admin Pages (Isolated to prevent heavy admin dependencies like XLSX & Recharts in user bundle)
const AdminLayout = lazy(() => import("./components/Admin/AdminLayout"));
const AdminLogin = lazy(() => import("./components/Admin/Users/AdminLogin"));
const AdminDashboard = lazy(() => import("./components/Admin/AdminDashboard"));
const ProductsPage = lazy(() => import("./components/Admin/Products/ProductsPage"));
const CreateProductPage = lazy(() => import("./components/Admin/Products/CreateProductPage"));
const EditProductPage = lazy(() => import("./components/Admin/Products/EditProductPage"));
const ViewProductPage = lazy(() => import("./components/Admin/Products/ViewProductPage"));
const UsersPage = lazy(() => import("./components/Admin/Users/UsersPage"));
const ViewUser = lazy(() => import("./components/Admin/Users/ViewUser"));
const OrdersPage = lazy(() => import("./components/Admin/Orders/OrdersPage"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Main Layout for public pages (with Navbar & Footer) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products/search/:keyword" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/services" element={<Service />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsConditions />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/paymentSuccess" element={<PaymentSuccess />} />

            {/* Protected Customer Pages */}
            <Route element={<ProtectedRoute />}>
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/profile/update" element={<EditProfile />} />
              <Route path="/user/password/update" element={<ChangePassword />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/order/confirmation" element={<OrderConfirmation />} />
              <Route path="/order/payment" element={<Payment />} />
              <Route path="/stripeCheckout" element={<StripeCheckout />} />
              <Route path="/user/orders" element={<Order />} />
              <Route path="/user/order/:id" element={<OrderDetails />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* Auth Layout (without Footer) */}
          <Route element={<AuthLayout />}>
            <Route path="/user/register" element={<Register />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/password/forgot" element={<ForgotPassword />} />
            <Route
              path="/user/password/reset/:token"
              element={<ResetPassword />}
            />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/create" element={<CreateProductPage />} />
            <Route path="products/:id" element={<ViewProductPage />} />
            <Route path="products/edit/:id" element={<EditProductPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users/:id" element={<ViewUser />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
