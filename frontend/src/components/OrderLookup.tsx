import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBox } from 'react-icons/fa';
import api from '../services/api';
import './OrderLookup.css';

const OrderLookup: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to fetch the order
      await api.get(`/orders/${orderId}`);
      // If successful, navigate to the order details page
      navigate(`/order/${orderId}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Order not found. Please check your order ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-lookup-container">
      <div className="order-lookup-header">
        {FaBox({ className: "lookup-icon" })}
        <h2>Track Your Order</h2>
        <p>Enter your order ID to track your package</p>
      </div>

      <form onSubmit={handleLookup} className="order-lookup-form">
        <div className="input-group">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID (e.g., 507f1f77bcf86cd799439011)"
            className="order-id-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="lookup-btn"
            disabled={loading || !orderId.trim()}
          >
            {loading ? (
              <span>Searching...</span>
            ) : (
              <>
                {FaSearch({})}
                Track Order
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </form>

      <div className="order-lookup-help">
        <h3>Need Help?</h3>
        <ul>
          <li>Your order ID was sent to your email after purchase</li>
          <li>You can also find it in your order confirmation</li>
          <li>If you're logged in, visit <a href="/orders">My Orders</a> to see all your orders</li>
        </ul>
      </div>
    </div>
  );
};

export default OrderLookup; 