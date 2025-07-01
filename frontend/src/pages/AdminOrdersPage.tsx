import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { fetchAllOrdersAdmin, updateOrderStatusAdmin } from '../services/api';

// Define interfaces for our data structures
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}
interface OrderItem {
  product: Product;
  quantity: number;
  _id: string;
}
interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetchAllOrdersAdmin();
      setOrders(res.data);
    } catch (err) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatusAdmin(orderId, status);
      loadOrders(); // Refresh orders
      if (selectedOrder) {
        setSelectedOrder(prev => prev ? { ...prev, status: status as Order['status'] } : null);
      }
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <main style={{ flexGrow: 1, padding: '32px 48px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>Order Management</h1>
        {loading && <p>Loading orders...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={tableHeaderStyle}>Order ID</th>
                <th style={tableHeaderStyle}>Customer</th>
                <th style={tableHeaderStyle}>Date</th>
                <th style={tableHeaderStyle}>Total</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={tableCellStyle}>{order._id.slice(-6)}</td>
                  <td style={tableCellStyle}>{order.customer?.name || 'Guest'}</td>
                  <td style={tableCellStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={tableCellStyle}>${order.totalPrice.toFixed(2)}</td>
                  <td style={tableCellStyle}><span style={statusBadgeStyle(order.status)}>{order.status}</span></td>
                  <td style={tableCellStyle}>
                    <button onClick={() => setSelectedOrder(order)} style={actionButtonStyle('edit')}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {selectedOrder && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Order Details</h2>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Customer:</strong> {selectedOrder.customer?.name} ({selectedOrder.customer?.email})</p>
            <p><strong>Total:</strong> ${selectedOrder.totalPrice.toFixed(2)}</p>
            <div style={{ margin: '16px 0' }}>
              <strong>Items:</strong>
              <ul>
                {selectedOrder.items.map(item => (
                  <li key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
                    <img src={item.product.images[0]} alt={item.product.name} style={{ width: 40, height: 40, borderRadius: 4 }} />
                    {item.product.name} (x{item.quantity})
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <label><strong>Status:</strong></label>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                style={{ padding: '6px 10px', borderRadius: 6 }}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <button onClick={closeModal} style={actionButtonStyle('secondary')}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline Styles
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modalContentStyle: React.CSSProperties = {
  background: '#fff', padding: '24px 32px', borderRadius: 8,
  width: '100%', maxWidth: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
};
const tableHeaderStyle: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 15, color: '#444' };
const tableCellStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 15, verticalAlign: 'middle' };
const statusBadgeStyle = (status: string): React.CSSProperties => ({
  padding: '4px 8px', borderRadius: 12, fontSize: 13, fontWeight: 500, textTransform: 'capitalize',
  background: status === 'delivered' ? '#e8f5e9' : status === 'shipped' ? '#e3f2fd' : status === 'cancelled' ? '#ffebee' : '#fffde7',
  color: status === 'delivered' ? '#2e7d32' : status === 'shipped' ? '#1e88e5' : status === 'cancelled' ? '#c62828' : '#f57f17',
});
const actionButtonStyle = (type: 'edit' | 'secondary'): React.CSSProperties => ({
  border: 'none', borderRadius: 6, padding: '8px 14px', marginRight: 8, cursor: 'pointer',
  fontWeight: 500, color: '#fff', background: type === 'edit' ? '#2196f3' : '#aaa',
});

export default AdminOrdersPage; 