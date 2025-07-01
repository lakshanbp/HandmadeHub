import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaSearch } from 'react-icons/fa';
import api from '../services/api';
import './OrderTrackingPage.css';

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

const OrderTrackingPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my');
      setOrders(response.data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to fetch orders');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.items.some(item => 
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || order._id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="order-tracking-container">
        <div className="loading-spinner">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-tracking-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="order-tracking-container">
      <div className="order-tracking-header">
        <h1>My Orders</h1>
        <p>Track your orders and view their current status</p>
      </div>

      <div className="order-tracking-filters">
        <div className="search-box">
          {FaSearch({ className: "search-icon" })}
          <input
            type="text"
            placeholder="Search by product name or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          {FaBox({ className: "no-orders-icon" })}
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet, or no orders match your search criteria.</p>
          <button 
            onClick={() => navigate('/shop')} 
            className="shop-now-btn"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="order-status">
                  {getStatusIcon(order.status)}
                  <span 
                    className="status-text"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4>{item.product.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">¥{item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: ¥{order.totalPrice}</strong>
                </div>
                
                {order.trackingNumber && (
                  <div className="tracking-info">
                    <p><strong>Tracking:</strong> {order.trackingNumber}</p>
                    {order.carrier && <p><strong>Carrier:</strong> {order.carrier}</p>}
                    {order.trackingUrl && (
                      <a 
                        href={order.trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="tracking-link"
                      >
                        Track Package
                      </a>
                    )}
                  </div>
                )}

                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage; 