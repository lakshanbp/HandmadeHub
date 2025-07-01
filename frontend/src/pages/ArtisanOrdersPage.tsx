import React, { useEffect, useState } from 'react';
import { fetchArtisanOrders, updateOrderTracking } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaSearch, FaEdit } from 'react-icons/fa';
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
  customer: { name: string; email: string };
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

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const ArtisanOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [trackingUpdate, setTrackingUpdate] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetchArtisanOrders();
      setOrders(res.data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (order: Order) => {
    setSelectedOrder(order);
    setStatusUpdate(order.status);
    setTrackingUpdate(order.trackingNumber || '');
    setShowUpdateModal(true);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setUpdatingOrderId(selectedOrder._id);
    try {
      await updateOrderTracking(selectedOrder._id, {
        trackingNumber: trackingUpdate,
        status: statusUpdate,
      });
      setShowUpdateModal(false);
      fetchOrders();
    } catch (err) {
      alert('Failed to update order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return FaCheckCircle({ className: 'status-icon delivered' });
      case 'cancelled':
        return FaTimesCircle({ className: 'status-icon cancelled' });
      case 'shipped':
        return FaTruck({ className: 'status-icon shipped' });
      case 'confirmed':
        return FaBox({ className: 'status-icon confirmed' });
      default:
        return FaClock({ className: 'status-icon pending' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.items.some(item => item.product.name.toLowerCase().includes(search.toLowerCase())) ||
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="order-tracking-container">
      <div className="order-tracking-header">
        <h1>My Orders (Artisan)</h1>
        <p>Manage all orders for your products. Update status and tracking as you process orders.</p>
      </div>
      <div className="order-tracking-filters">
        <div className="search-box">
          {FaSearch({ className: 'search-icon' })}
          <input
            type="text"
            placeholder="Search by product, order ID, or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Orders</option>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="loading-spinner">Loading your orders...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="no-orders">
          {FaBox({ className: 'no-orders-icon' })}
          <h3>No orders found</h3>
          <p>No orders match your search or filter.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                  <p style={{ color: '#bfa76a', fontWeight: 600, fontSize: '0.97rem', marginTop: 4 }}>
                    Customer: {order.customer.name}
                  </p>
                </div>
                <div className="order-status">
                  {getStatusIcon(order.status)}
                  <span className="status-text" style={{ color: '#222' }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4>{item.product.name}</h4>
                      <p>Qty: {item.quantity}</p>
                      <p className="item-price">¥{item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: ¥{order.totalPrice}</strong>
                </div>
                <button
                  className="view-details-btn"
                  style={{ marginBottom: 8 }}
                  onClick={() => navigate(`/order/${order._id}`)}
                >
                  View Details
                </button>
                <button
                  className="view-details-btn"
                  style={{ background: '#bfa76a', color: '#222', fontWeight: 700 }}
                  onClick={() => openUpdateModal(order)}
                  disabled={updatingOrderId === order._id}
                >
                  {FaEdit({ style: { marginRight: 6 } })} Update Status/Tracking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Update Modal */}
      {showUpdateModal && selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 340, boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}>
            <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 18 }}>Update Order</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600, color: '#bfa76a' }}>Status</label>
              <select
                value={statusUpdate}
                onChange={e => setStatusUpdate(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e2c98c', marginTop: 6 }}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600, color: '#bfa76a' }}>Tracking Number</label>
              <input
                type="text"
                value={trackingUpdate}
                onChange={e => setTrackingUpdate(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #e2c98c', marginTop: 6 }}
                placeholder="Enter tracking number (optional)"
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <button
                onClick={handleUpdateOrder}
                style={{ background: '#222', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 16, cursor: 'pointer' }}
                disabled={updatingOrderId === selectedOrder._id}
              >
                {updatingOrderId === selectedOrder._id ? 'Updating...' : 'Save'}
              </button>
              <button
                onClick={() => setShowUpdateModal(false)}
                style={{ background: '#fff', color: '#bfa76a', fontWeight: 700, border: '1.5px solid #e2c98c', borderRadius: 8, padding: '10px 22px', fontSize: 16, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtisanOrdersPage; 