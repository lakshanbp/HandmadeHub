import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import apiClient from '../services/api';
import { FaInstagram, FaGlobe } from 'react-icons/fa';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
}

interface Artisan {
  _id: string;
  name: string;
  email: string;
  artisanStatus: string;
  bio?: string;
  portfolioLink?: string;
  instagram?: string;
  profileImage?: string;
}

const MyStorePage: React.FC = () => {
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get('/users/me')
      .then(res => {
        const user = res.data;
        if (user.role !== 'artisan' || user.artisanStatus !== 'approved') {
          setError('You must be an approved artisan to view this page.');
          setLoading(false);
          return;
        }
        setArtisan(user);
        return apiClient.get(`/products?artisan=${user._id}`);
      })
      .then(res => {
        if (res && res.data) setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load your store information.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="store-card"><div className="store-loading">Loading your store...</div></div>;
  if (error) return <div className="store-card"><div className="store-error">{error}</div></div>;
  if (!artisan) return <div className="store-card"><div className="store-error">No artisan profile found.</div></div>;

  return (
    <>
      <Navbar />
      <div className="store-hero" style={{ background: 'linear-gradient(120deg, #f7e7c6 60%, #fffbe9 100%)' }}>
        <div className="store-hero-content">
          {artisan.profileImage && (
            <img src={artisan.profileImage} alt="Profile" className="store-profile-img" />
          )}
          <div className="store-hero-info">
            <h1 className="store-title">{artisan.name}'s Shop</h1>
            {artisan.bio && <p className="store-bio">{artisan.bio}</p>}
            <div className="store-links">
              {artisan.portfolioLink && (
                <a href={artisan.portfolioLink} target="_blank" rel="noopener noreferrer" title="Portfolio" className="store-link-icon">{FaGlobe({})}</a>
              )}
              {artisan.instagram && (
                <a href={artisan.instagram.startsWith('http') ? artisan.instagram : `https://instagram.com/${artisan.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" title="Instagram" className="store-link-icon">{FaInstagram({})}</a>
              )}
            </div>
            <div className="store-status">Status: <span>{artisan.artisanStatus}</span></div>
            <div className="store-email">Email: <span>{artisan.email}</span></div>
          </div>
        </div>
      </div>
      <div className="store-card">
        <h2 className="store-section-title">Products</h2>
        {products.length === 0 ? (
          <p className="store-empty">You have not added any products yet.</p>
        ) : (
          <div className="store-product-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-img-wrap">
                  <img src={product.images[0] || 'https://via.placeholder.com/200'} alt={product.name} className="product-img" />
                  <div className="product-price">${product.price.toFixed(2)}</div>
                </div>
                <h3 className="product-title">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyStorePage; 