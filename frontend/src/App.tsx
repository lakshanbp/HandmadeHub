import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/SellerDashboard';
import LoginPage from './pages/LoginPage';
import ProductDetails from './pages/ProductDetails';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import AdminUsers from './pages/AdminUsers';
import ArtisanRequestsPage from './pages/ArtisanRequestsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminProductManagement from './pages/AdminProductManagement';
import AdminOrdersPage from './pages/AdminOrdersPage';
import OurStoryPage from './pages/OurStoryPage';
import GiftCardPage from './pages/GiftCardPage';
import ShopPage from './pages/ShopPage';
import ArtisanRequestPage from './pages/ArtisanRequestPage';
import SearchPage from './pages/SearchPage';
import AllProducts from './components/AllProducts';
import MyStorePage from './pages/MyStorePage';
import CategoryPage from "./pages/CategoryPage";
import AllProductsByCategory from "./pages/AllProductsByCategory";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import OrderLookup from "./components/OrderLookup";
import ArtisanOrdersPage from './pages/ArtisanOrdersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop/artisan/:id" element={<ShopPage />} />
        <Route path="/shop" element={<AllProducts />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/artisan-requests" element={<ArtisanRequestsPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/our-story" element={<OurStoryPage />} />
        <Route path="/gift-card" element={<GiftCardPage />} />
        <Route path="/admin/products" element={<AdminProductManagement />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/artisan-request" element={<ArtisanRequestPage />} />
        <Route path="/my-store" element={<MyStorePage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/all-products" element={<AllProductsByCategory />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/orders" element={<OrderTrackingPage />} />
        <Route path="/order/:id" element={<OrderDetailsPage />} />
        <Route path="/track-order" element={<OrderLookup />} />
        <Route path="/artisan-orders" element={<ArtisanOrdersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
