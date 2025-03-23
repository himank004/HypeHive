import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import OrderSummary from "./components/OrderSummary";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, []); // Removed unnecessary dependency

  // Fetch cart items only if the user is logged in
  useEffect(() => {
    if (user) getCartItems();
  }, [user]); // Ensured dependency safety

  // Show loading spinner while checking authentication
  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Optimized Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-green-800/40 to-transparent" />

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />

          {/* Auth Routes */}
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
          <Route path="/purchase-success" element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />} />
          <Route path="/purchase-cancel" element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />} />

          {/* Checkout Route */}
          <Route path="/checkout" element={user ? <OrderSummary /> : <Navigate to="/login" />} />

          {/* Admin/Seller Route */}
          <Route
            path="/admin-dashboard"
            element={
              user?.role === "admin" || user?.role === "seller" ? <AdminPage /> : <Navigate to="/" />
            }
          />
        </Routes>
        <Footer />
      </div>

      <Toaster />
    </div>
  );
}

export default App;
