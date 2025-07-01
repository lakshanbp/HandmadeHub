import React, { useEffect, useState } from 'react';
import { FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

interface DecodedToken {
  id: string;
  role: string;
  name: string;
  exp: number;
  artisanStatus: 'none' | 'pending' | 'approved' | 'rejected';
}

interface UserInfo {
  name: string;
  role: string;
  artisanStatus: 'none' | 'pending' | 'approved' | 'rejected';
  id?: string;
}

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
          setUserInfo({ name: decodedToken.name, role: decodedToken.role, artisanStatus: decodedToken.artisanStatus, id: decodedToken.id });
        }
      } catch (error) {
        console.error('Invalid token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserInfo(null);
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${searchQuery.trim()}`);
    }
  };

  return (
    <nav className="navbar-new">
      <div className="navbar-left">
        <a href="/shop" className="nav-link-new">SHOP</a>
        <a href="/our-story" className="nav-link-new">OUR STORY</a>
        <a href="/gift-card" className="nav-link-new">GIFT CARD</a>
        {isLoggedIn && userInfo && userInfo.role === 'artisan' && userInfo.artisanStatus === 'approved' && (
          <>
            <a href="/seller-dashboard" className="nav-link-new">SELLER DASHBOARD</a>
            {userInfo.id && (
              <a href={`/shop/artisan/${userInfo.id}`} className="nav-link-new" target="_blank" rel="noopener noreferrer">MY PUBLIC SHOP</a>
            )}
          </>
        )}
      </div>

      <div className="navbar-center">
        <a href="/" className="navbar-logo-new">Handmade Hub</a>
      </div>

      <div className="navbar-right">
        {isLoggedIn && userInfo ? (
          <>
            <span className="nav-action-new">Hi, {userInfo.name}</span>
            {userInfo.role === 'admin' && (
              <a href="/admin-dashboard" className="nav-action-new">Admin Dashboard</a>
            )}
            {userInfo.role === 'customer' && (
              <a href="/orders" className="nav-action-new">My Orders</a>
            )}
            {userInfo.role === 'artisan' && userInfo.artisanStatus !== 'approved' && (
              <a href="/artisan-request" className="nav-action-new">Artisan Request</a>
            )}
            <button onClick={handleLogout} className="nav-action-new">Log Out</button>
          </>
        ) : (
          <a href="/login" className="nav-action-new">
            {FaUser({})} Log In
          </a>
        )}
        <a href="/search" className="nav-action-new">
          {FaSearch({})} Search
        </a>
        <a href="/cart" className="nav-action-new cart-link">
          {FaShoppingCart({})}
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </a>
      </div>
    </nav>
  );
};

export default Navbar; 