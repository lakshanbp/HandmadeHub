import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import api from '../services/api';
import './OrderDetailsPage.css';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

interface TrackingHistory {
  date: string;
  location: string;
  status: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber: string;
  carrier: string;
  trackingStatus: string;
  trackingUrl: string;
  trackingHistory: TrackingHistory[];
  createdAt: string;
}

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return FaCheckCircle({ className: "status-icon delivered" });
      case 'cancelled':
        return FaTimesCircle({ className: "status-icon cancelled" });
      case 'shipped':
        return FaTruck({ className: "status-icon shipped" });
      case 'confirmed':
        return FaBox({ className: "status-icon confirmed" });
      default:
        return FaClock({ className: "status-icon pending" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      case 'shipped':
        return '#3b82f6';
      case 'confirmed':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
    return steps.indexOf(status) + 1;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTrackingDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="order-details-container">
        <div className="loading-spinner">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/orders')} className="back-btn">
            {FaArrowLeft({})} Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-container">
        <div className="error-message">
          <h3>Order Not Found</h3>
          <p>The order you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/orders')} className="back-btn">
            {FaArrowLeft({})} Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <button onClick={() => navigate('/orders')} className="back-btn">
          {FaArrowLeft({})} Back to Orders
        </button>
        <div className="order-title">
          <h1>Order #{order._id.slice(-8)}</h1>
          <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="order-details-grid">
        {/* Order Status Timeline */}
        <div className="order-status-section">
          <h2>Order Status</h2>
          <div className="status-timeline">
            <div className={`timeline-step ${getStatusStep(order.status) >= 1 ? 'completed' : ''}`}>
              <div className="step-icon">
                {FaClock({})}
              </div>
              <div className="step-content">
                <h4>Order Placed</h4>
                <p>Your order has been received</p>
              </div>
            </div>
            
            <div className={`timeline-step ${getStatusStep(order.status) >= 2 ? 'completed' : ''}`}>
              <div className="step-icon">
                {FaBox({})}
              </div>
              <div className="step-content">
                <h4>Order Confirmed</h4>
                <p>Your order has been confirmed</p>
              </div>
            </div>
            
            <div className={`timeline-step ${getStatusStep(order.status) >= 3 ? 'completed' : ''}`}>
              <div className="step-icon">
                {FaTruck({})}
              </div>
              <div className="step-content">
                <h4>Shipped</h4>
                <p>Your order is on its way</p>
              </div>
            </div>
            
            <div className={`timeline-step ${getStatusStep(order.status) >= 4 ? 'completed' : ''}`}>
              <div className="step-icon">
                {FaCheckCircle({})}
              </div>
              <div className="step-content">
                <h4>Delivered</h4>
                <p>Your order has been delivered</p>
              </div>
            </div>
          </div>

          <div className="current-status">
            <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
              {getStatusIcon(order.status)}
              <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <h2>Order Items</h2>
          <div className="order-items-list">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name}
                  className="item-image"
                />
                <div className="item-details">
                  <h4>{item.product.name}</h4>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-price">¥{item.product.price}</p>
                </div>
                <div className="item-total">
                  ¥{(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>¥{order.totalPrice}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>¥{order.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Tracking Information */}
        {order.trackingNumber && (
          <div className="tracking-section">
            <h2>Tracking Information</h2>
            <div className="tracking-details">
              <div className="tracking-info-row">
                <span className="label">Tracking Number:</span>
                <span className="value">{order.trackingNumber}</span>
              </div>
              {order.carrier && (
                <div className="tracking-info-row">
                  <span className="label">Carrier:</span>
                  <span className="value">{order.carrier}</span>
                </div>
              )}
              {order.trackingUrl && (
                <div className="tracking-info-row">
                  <span className="label">Track Package:</span>
                  <a 
                    href={order.trackingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="tracking-link"
                  >
                    View on Carrier Website
                  </a>
                </div>
              )}
            </div>

            {order.trackingHistory && order.trackingHistory.length > 0 && (
              <div className="tracking-history">
                <h3>Tracking History</h3>
                <div className="history-timeline">
                  {order.trackingHistory.map((entry, index) => (
                    <div key={index} className="history-entry">
                      <div className="history-icon">
                        {FaMapMarkerAlt({})}
                      </div>
                      <div className="history-content">
                        <div className="history-header">
                          <span className="history-status">{entry.status}</span>
                          <span className="history-date">
                            {FaCalendarAlt({})} {formatTrackingDate(entry.date)}
                          </span>
                        </div>
                        {entry.location && (
                          <p className="history-location">{entry.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage; 