import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchProducts } from '../services/api';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  category: string;
}

const SearchPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const navigate = useNavigate();
  const location = useLocation();

  // Get initial search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  // Fetch products based on search and filters
  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchProducts(searchQuery);
      let filteredProducts = response.data;
      
      // Apply category filter
      if (selectedCategory) {
        filteredProducts = filteredProducts.filter((product: Product) => 
          product.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      
      // Apply price range filter
      if (priceRange.min || priceRange.max) {
        filteredProducts = filteredProducts.filter((product: Product) => {
          const price = product.price;
          const min = priceRange.min ? parseFloat(priceRange.min) : 0;
          const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
          return price >= min && price <= max;
        });
      }
      
      setProducts(filteredProducts);
    } catch (err: any) {
      setError('Failed to search products. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    }
  }, [searchQuery, selectedCategory, priceRange]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch();
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
  };

  const categories = ['Jewelry', 'Home Decor', 'Clothing', 'Art', 'Crafts', 'Accessories'];

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          {/* Search Header */}
          <div style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '12px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h1 style={{ marginBottom: '20px', color: '#333' }}>Search Products</h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '16px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  {FaSearch({ size: 18 })}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  padding: '12px 16px',
                  background: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {FaFilter({ size: 16 })} Filters
              </button>
            </form>

            {/* Filters */}
            {showFilters && (
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0 }}>Filters</h3>
                  <button
                    onClick={clearFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {FaTimes({ size: 14 })} Clear
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Category Filter */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Price Range
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                      <span style={{ alignSelf: 'center' }}>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div>Searching...</div>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
                {error}
              </div>
            ) : searchQuery ? (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <h2>Search Results for "{searchQuery}"</h2>
                  <p style={{ color: '#666' }}>{products.length} products found</p>
                </div>
                
                {products.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <p>No products found matching your search.</p>
                    <p>Try adjusting your search terms or filters.</p>
                  </div>
                ) : (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                    gap: '20px' 
                  }}>
                    {products.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => navigate(`/product/${product._id}`)}
                        style={{
                          border: '1px solid #eee',
                          borderRadius: '8px',
                          padding: '15px',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          background: 'white'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ marginBottom: '10px' }}>
                          {product.images[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '6px'
                              }}
                            />
                          )}
                        </div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#333' }}>
                          {product.name}
                        </h3>
                        <p style={{ 
                          margin: '0 0 8px 0', 
                          fontSize: '14px', 
                          color: '#666',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {product.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'bold', color: '#333' }}>
                            ¥{product.price}
                          </span>
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#888',
                            background: '#f0f0f0',
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            {product.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>Enter a search term to find products.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage; 