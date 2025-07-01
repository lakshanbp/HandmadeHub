import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
  category?: string;
}

interface Artisan {
  _id: string;
  name: string;
  email: string;
  artisanStatus: string;
  bio?: string;
  portfolioLink?: string;
  instagram?: string;
  bannerImage?: string;
  logoImage?: string;
  storeColor?: string;
  storeAnnouncement?: string;
}

const categoryImages: Record<string, string> = {
  Jewelry: '/images/image_3.jpg',
  'Home Decor': '/images/image_4.jpg',
  Clothing: '/images/image_6.jpg',
  Art: '/images/image_8.jpg',
  Crafts: '/images/image_1.jpg',
  Accessories: '/images/image_2.jpg',
};

const categoryLabels: Record<string, string> = {
  Jewelry: 'Shop Jewelry',
  'Home Decor': 'Shop Home Decor',
  Clothing: 'Shop Clothing',
  Art: 'Shop Art',
  Crafts: 'Shop Crafts',
  Accessories: 'Shop Accessories',
};

const ShopPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`/api/users/artisan/${id}`)
      .then(res => {
        setArtisan(res.data.artisan);
        // Fetch products for this artisan
        axios.get(`/api/products?artisan=${id}`)
          .then(prodRes => {
            setProducts(prodRes.data);
            setLoading(false);
          })
          .catch(() => {
            setError('Failed to load products for this artisan.');
            setLoading(false);
          });
      })
      .catch(() => {
        setError('Artisan not found or failed to load.');
        setLoading(false);
      });
  }, [id]);

  // Group products by category
  const productsByCategory: Record<string, Product[]> = {};
  products.forEach(product => {
    const cat = product.category || 'Other';
    if (!productsByCategory[cat]) productsByCategory[cat] = [];
    productsByCategory[cat].push(product);
  });

  if (loading) return <div style={{ padding: 32 }}>Loading artisan shop...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>{error}</div>;
  if (!artisan) return <div style={{ padding: 32 }}>Artisan not found.</div>;

  return (
    <>
      <Navbar />
      <div style={{
        maxWidth: 1100,
        margin: '32px auto',
        padding: 0,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        border: artisan.storeColor ? `3px solid ${artisan.storeColor}` : undefined
      }}>
        {artisan.bannerImage && (
          <div style={{ width: '100%', height: 180, background: '#eee', position: 'relative' }}>
            <img src={artisan.bannerImage} alt="Banner" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
            {artisan.logoImage && (
              <img src={artisan.logoImage} alt="Logo" style={{ position: 'absolute', left: 32, bottom: -30, width: 80, height: 80, borderRadius: '50%', border: '4px solid #fff', background: '#fff', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
            )}
          </div>
        )}
        <div style={{ padding: 24, paddingTop: artisan.bannerImage ? 48 : 24 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: artisan.storeColor || '#222' }}>{artisan.name}'s Shop</h1>
          <p style={{ color: '#555', marginBottom: 8 }}>Email: {artisan.email}</p>
          <p style={{ color: '#888', marginBottom: 24 }}>Status: {artisan.artisanStatus}</p>
          {artisan.storeAnnouncement && (
            <div style={{ background: artisan.storeColor || '#f9f9f9', color: '#333', padding: '12px 18px', borderRadius: 6, marginBottom: 18, fontWeight: 500, fontSize: 16 }}>
              <span role="img" aria-label="announcement">📢</span> {artisan.storeAnnouncement}
            </div>
          )}
          {artisan.bio && (
            <p style={{ color: '#444', marginBottom: 12 }}><strong>About:</strong> {artisan.bio}</p>
          )}
          {artisan.portfolioLink && (
            <p style={{ marginBottom: 8 }}>
              <strong>Portfolio:</strong> <a href={artisan.portfolioLink} target="_blank" rel="noopener noreferrer">{artisan.portfolioLink}</a>
            </p>
          )}
          {artisan.instagram && (
            <p style={{ marginBottom: 8 }}>
              <strong>Instagram:</strong> <a href={artisan.instagram.startsWith('http') ? artisan.instagram : `https://instagram.com/${artisan.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer">{artisan.instagram}</a>
            </p>
          )}
          <h2 style={{ fontSize: '1.3rem', margin: '32px 0 16px 0' }}>Products by {artisan.name}</h2>
          {/* Category Card Section */}
          {!selectedCategory && (
            <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
              {Object.keys(productsByCategory).map(category => (
                <div
                  key={category}
                  style={{
                    background: '#fff',
                    borderRadius: 20,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    width: 270,
                    cursor: 'pointer',
                    transition: 'box-shadow 0.18s',
                    textAlign: 'center',
                    marginBottom: 12
                  }}
                >
                  <img
                    src={categoryImages[category] || '/images/image_1.jpg'}
                    alt={category}
                    style={{
                      width: '100%',
                      height: 160,
                      objectFit: 'cover',
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20
                    }}
                  />
                  <div style={{ padding: '24px 0 18px 0' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#222', marginBottom: 6 }}>{category}</div>
                    <div style={{ color: '#888', fontSize: '1.08rem' }}>{categoryLabels[category] || `Shop ${category}`}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Products Grid for Selected Category */}
          {selectedCategory && (
            <>
              <button
                style={{ marginBottom: 24, background: 'none', border: 'none', color: '#1976d2', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                onClick={() => setSelectedCategory(null)}
              >
                ← Back to Categories
              </button>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, marginTop: 8 }}>
                {productsByCategory[selectedCategory].map(product => (
                  <div
                    key={product._id}
                    style={{
                      background: '#fff6f6',
                      borderRadius: '32px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      padding: '32px 18px 18px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      minHeight: 320,
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/200'}
                      alt={product.name}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: '18px',
                        marginBottom: 24,
                        boxShadow: '0 1px 6px rgba(0,0,0,0.07)'
                      }}
                    />
                    <h3 style={{
                      fontSize: '1.18rem',
                      fontWeight: 700,
                      margin: 0,
                      textAlign: 'center',
                      letterSpacing: '0.5px',
                      color: '#222',
                      marginBottom: 8
                    }}>{product.name}</h3>
                    <div style={{ color: '#333', fontWeight: 600, marginBottom: 8, fontSize: '1.08rem' }}>${product.price.toFixed(2)}</div>
                    <p style={{ color: '#666', fontSize: 14, textAlign: 'center', margin: 0 }}>{product.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ShopPage; 