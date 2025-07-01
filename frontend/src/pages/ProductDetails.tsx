import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchReviewsByProduct, fetchRelatedProducts, submitReview } from '../services/api';
import Navbar from '../components/Navbar';
import './ProductDetails.css';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaBolt, FaUserCircle, FaStar, FaRegStar, FaCheckCircle } from 'react-icons/fa';

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  images: string[];
  category?: string;
  artisan?: { _id: string; name: string; email?: string };
}

interface Review {
  _id: string;
  customer: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface DecodedToken {
  id: string;
  role: string;
  name: string;
}

const accent = '#efd1a1';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('info');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Image gallery state
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProductById(id)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
        // Fetch related products by category
        if (res.data.category) {
          fetchRelatedProducts(res.data.category, res.data._id).then(setRelated);
        }
      })
      .catch(() => {
        setError('Failed to load product');
        setLoading(false);
      });
    // Fetch reviews
    fetchReviewsByProduct(id)
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity });
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({ ...product, quantity });
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      setReviewError('Please provide a rating and a comment.');
      return;
    }
    if (!id) return;

    submitReview(id, { rating, comment })
      .then((res: { data: Review }) => {
        setReviews([res.data, ...reviews]);
        setRating(0);
        setComment('');
        setReviewError('');
      })
      .catch(() => {
        setReviewError('You need to be logged in to post a review.');
      });
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  if (loading) return <div style={{ padding: 32 }}>Loading product...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>{error}</div>;
  if (!product) return <div style={{ padding: 32 }}>Product not found.</div>;

  return (
    <>
      <Navbar />
      <div style={{ background: '#fafafa', minHeight: '100vh', padding: '2rem 0' }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 32,
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 4px 32px rgba(239,209,161,0.13)',
          padding: 32,
        }}>
          {/* Left: Image Gallery */}
          <div style={{ flex: '1 1 350px', minWidth: 320 }}>
            <img
              src={product.images && product.images[mainImgIdx] ? product.images[mainImgIdx] : 'https://via.placeholder.com/400'}
              alt={product.name}
              style={{ width: '100%', borderRadius: 18, objectFit: 'cover', boxShadow: '0 2px 12px #efd1a1' }}
            />
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img || 'https://via.placeholder.com/60'}
                    alt={product.name + ' thumb'}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: mainImgIdx === idx ? `2px solid ${accent}` : '2px solid #eee',
                      cursor: 'pointer',
                      boxShadow: mainImgIdx === idx ? `0 2px 8px ${accent}` : undefined
                    }}
                    onClick={() => setMainImgIdx(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div style={{ flex: '2 1 400px', minWidth: 320 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <span style={{ background: accent, color: '#7c5a1e', fontWeight: 700, borderRadius: 8, padding: '6px 18px', fontSize: 22 }}>${product.price.toFixed(2)}</span>
              {/* Stock badge example: <span style={{ color: '#388e3c', fontWeight: 600 }}>In Stock</span> */}
            </div>
            <p style={{ color: '#444', fontSize: 18, marginBottom: 18 }}>{product.description}</p>

            {/* Artisan Info */}
            {product.artisan && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, background: '#fff8ec', borderRadius: 10, padding: '10px 16px' }}>
                {FaUserCircle({ size: 38, color: "#bfa16b" })}
                <div>
                  <div style={{ fontWeight: 700, color: '#7c5a1e' }}>{product.artisan.name}</div>
                  <a href={`/shop/artisan/${product.artisan._id}`} style={{ color: '#4f46e5', fontWeight: 500, fontSize: 15 }}>View {product.artisan.name}'s Shop</a>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <label htmlFor="quantity" style={{ fontWeight: 600 }}>Quantity:</label>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ background: accent, border: 'none', borderRadius: 6, width: 32, height: 32, fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>-</button>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value)))}
                style={{ width: 48, textAlign: 'center', fontSize: 16, borderRadius: 6, border: `1px solid ${accent}` }}
              />
              <button onClick={() => setQuantity(q => q + 1)} style={{ background: accent, border: 'none', borderRadius: 6, width: 32, height: 32, fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>+</button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 18, marginBottom: 24 }}>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                style={{
                  background: '#222', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 10, padding: '1rem 2.2rem', cursor: 'pointer', boxShadow: `0 2px 8px #efd1a1`, display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.2s'
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#444')}
                onMouseOut={e => (e.currentTarget.style.background = '#222')}
              >
                {FaShoppingCart({})} Add to Cart
              </button>
              <button
                className="buy-now-btn"
                onClick={handleBuyNow}
                style={{
                  background: '#fff', color: '#222', fontWeight: 700, fontSize: 18, border: `2px solid #222`, borderRadius: 10, padding: '1rem 2.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.2s, color 0.2s'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = accent;
                  e.currentTarget.style.color = '#7c5a1e';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#222';
                }}
              >
                {FaBolt({})} Buy Now
              </button>
            </div>

            {/* Accordion for info */}
            <div style={{ marginBottom: 24 }}>
              <Accordion
                items={[
                  { title: 'Product info', content: product.description || "" },
                  { title: 'Return & refund policy', content: 'We offer a 30-day return policy for unused items in their original packaging.' }
                ]}
              />
            </div>

            <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>Sales Count: 0</div>
            <a href="#" className="view-more-info" style={{ color: '#4f46e5', fontWeight: 500 }}>View More Product Info</a>
          </div>
        </div>

        {/* Snackbar for add to cart */}
        {showSnackbar && (
          <div style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#388e3c',
            color: '#fff',
            padding: '1rem 2.5rem',
            borderRadius: 16,
            fontWeight: 700,
            fontSize: 18,
            boxShadow: '0 2px 16px rgba(56,142,60,0.13)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            {FaCheckCircle({ size: 22 })} Added to cart!
          </div>
        )}

        {/* Reviews Section */}
        <div style={{ maxWidth: 1100, margin: '2.5rem auto 0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(239,209,161,0.10)', padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#7c5a1e', margin: 0 }}>Customer Reviews</h2>
            {averageRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {[1,2,3,4,5].map(star => (
                  <span key={star}>
                    {star <= Math.round(Number(averageRating))
                      ? FaStar({ color: "#f5b301" })
                      : FaRegStar({ color: "#ccc" })}
                  </span>
                ))}
                <span style={{ fontWeight: 700, marginLeft: 6 }}>{averageRating} / 5</span>
                <span style={{ color: '#888', fontWeight: 500, marginLeft: 6 }}>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}
          </div>
          <div>
            {reviews.length === 0 ? (
              <div style={{ color: '#888', fontSize: 18, padding: '2rem 0', textAlign: 'center' }}>
                {FaUserCircle({ size: 48, color: "#ccc" })}
                <div>No reviews yet. Be the first to review!</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                {reviews.map(review => (
                  <div key={review._id} style={{ background: '#fff8ec', borderRadius: 12, padding: 18, minWidth: 260, flex: '1 1 260px', boxShadow: '0 2px 8px #efd1a1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      {FaUserCircle({ size: 28, color: "#bfa16b" })}
                      <span style={{ fontWeight: 700 }}>{review.customer?.name || 'Anonymous'}</span>
                      <span style={{ color: '#f5b301', fontWeight: 600, marginLeft: 8 }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      <span style={{ color: '#888', fontSize: 13, marginLeft: 'auto' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ color: '#5a4320', fontSize: 16 }}>{review.comment}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Write a Review Form (reuse your existing form logic) */}
          <div style={{ marginTop: 32 }}>
            <h3 style={{ color: '#7c5a1e', fontWeight: 700, fontSize: 20 }}>Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>* Rating</label>
                <div className="star-rating-modern">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={star <= rating ? 'filled' : ''}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setActiveAccordion('star-' + star)}
                      onMouseLeave={() => setActiveAccordion(null)}
                      style={{ cursor: 'pointer', fontSize: 28, color: star <= rating ? '#f5b301' : '#ccc', transition: 'color 0.2s' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="comment">* Comment</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={4}
                  className="review-textarea"
                  placeholder="Share your experience..."
                />
              </div>
              {reviewError && <p className="review-error-modern">{reviewError}</p>}
              <button
                type="submit"
                className="submit-review-btn-modern"
                style={{
                  background: 'linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)',
                  color: '#222',
                  border: 'none',
                  borderRadius: 24,
                  padding: '14px 38px',
                  fontSize: '1.08rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: 8,
                  boxShadow: '0 2px 8px rgba(255, 188, 51, 0.12)',
                  letterSpacing: '0.5px',
                  transition: 'background 0.2s, color 0.2s, transform 0.15s'
                }}
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

// Modern Accordion component
const Accordion = ({ items }: { items: { title: string, content: string }[] }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden', boxShadow: openIdx === idx ? `0 2px 8px #efd1a1` : undefined }}>
          <button
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            style={{
              width: '100%',
              textAlign: 'left',
              background: openIdx === idx ? accent : '#f8fafc',
              color: '#7c5a1e',
              fontWeight: 700,
              fontSize: 17,
              padding: '0.9rem 1.1rem',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              borderBottom: openIdx === idx ? '1px solid #e0b97c' : '1px solid #eee',
              transition: 'background 0.2s'
            }}
          >
            {item.title}
            <span style={{ float: 'right', fontWeight: 400 }}>{openIdx === idx ? '-' : '+'}</span>
          </button>
          {openIdx === idx && (
            <div style={{ background: '#fff8ec', color: '#5a4320', padding: '0.9rem 1.1rem', fontSize: 15, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductDetails; 