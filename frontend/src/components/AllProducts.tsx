import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import Navbar from './Navbar';
import './AllProducts.css';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get('q');
    setLoading(true);
    fetchProducts(searchQuery || undefined)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, [location.search]);

  if (loading) return (
    <>
      <Navbar />
      <div className="product-list-loading">Loading products...</div>
    </>
  );
  if (error) return (
    <>
      <Navbar />
      <div className="product-list-error">❗ {error}</div>
    </>
  );

  return (
    <>
      <Navbar />
      <section ref={sectionRef} className="all-products-container">
        <div className="all-products-header">
          <h2>All Products</h2>
          <span>{products.length} products</span>
        </div>
        <div className="all-products-grid">
          {products.map((product, index) => (
            <div 
              key={product._id} 
              className="product-card-new"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="product-image-wrapper">
                {product.images[0] && <img src={product.images[0]} alt={product.name} className="product-image-primary" />}
                {product.images[1] && <img src={product.images[1]} alt={product.name} className="product-image-secondary" />}
                <div className="new-in-tag">New In</div>
              </div>
              <div className="product-info-new">
                <h3>{product.name}</h3>
                <p>¥{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AllProducts; 