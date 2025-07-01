import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import './ProductListSection.css';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  // Assuming the second image for hover is the second in the array
}

const ProductListSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchProducts()
      .then(res => {
        setProducts(res.data.slice(0, 4)); // Take first 4 for the main display
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="product-list-loading">Loading products...</div>;
  if (error) return <div className="product-list-error">❗ {error}</div>;

  return (
    <section ref={sectionRef} className="product-list-container">
      <div className="product-list-header">
        <h2>SHOP OUR FRESH NEW ITEMS</h2>
        <a href="/shop" className="view-all-link">VIEW ALL NEW ITEMS</a>
      </div>
      <div className="product-grid-new">
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
  );
};

export default ProductListSection; 