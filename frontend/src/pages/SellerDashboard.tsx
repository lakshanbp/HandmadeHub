import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { FaBox, FaClipboardList, FaChartLine, FaPlusCircle, FaEdit, FaTrash, FaTimes, FaMoneyBillWave, FaTruck } from 'react-icons/fa';
import { fetchMyProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import './SellerDashboard.css';
import apiClient from '../services/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
}

// Add Product Form Component
const AddProductForm: React.FC<{ onClose: () => void; onProductAdded: () => void }> = ({ onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [] as File[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: filesArray }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('category', formData.category);
      productData.append('stock', formData.stock);

      formData.images.forEach((image, index) => {
        productData.append('imageFile', image);
      });

      await createProduct(productData);
      onProductAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button onClick={onClose} className="close-btn">
            {FaTimes({})}
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Clothing">Clothing</option>
              <option value="Art">Art</option>
              <option value="Crafts">Crafts</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="form-group">
            <label>Product Images *</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
            <small>You can select multiple images</small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Advanced EditProductForm modal
const EditProductForm: React.FC<{ product: Product; onClose: () => void; onProductUpdated: () => void }> = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    price: product.price.toString(),
    category: '',
    stock: product.stock?.toString() || '',
    images: [] as File[],
    previewImages: product.images || []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: filesArray, previewImages: filesArray.map(f => URL.createObjectURL(f)) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      if (formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          data.append('imageFile', image);
        });
      }
      await updateProduct(product._id, data);
      onProductUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button onClick={onClose} className="close-btn">
            {FaTimes({})}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" />
            </div>
          </div>
          <div className="form-group">
            <label>Product Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {formData.previewImages.map((img, idx) => (
                <img key={idx} src={img} alt="Preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SellerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetchMyProducts()
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch products.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = () => {
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setShowEditForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
      fetchProducts();
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Loading products...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h2 style={{ margin: 0 }}>My Products</h2>
        <button
          style={{
            background: '#1a73e8',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 22px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
          onClick={() => setShowAddForm(true)}
        >
          <span style={{ fontSize: 18, display: 'inline-block' }}>+</span> Add New Product
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: 12, borderBottom: '2px solid #eee', textAlign: 'left' }}>IMAGE</th>
            <th style={{ padding: 12, borderBottom: '2px solid #eee', textAlign: 'left' }}>NAME</th>
            <th style={{ padding: 12, borderBottom: '2px solid #eee', textAlign: 'right' }}>PRICE</th>
            <th style={{ padding: 12, borderBottom: '2px solid #eee', textAlign: 'right' }}>STOCK</th>
            <th style={{ padding: 12, borderBottom: '2px solid #eee', textAlign: 'center' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id} style={{ borderBottom: '1px solid #eee', verticalAlign: 'middle' }}>
              <td style={{ padding: 10 }}>
                <img src={product.images[0] || 'https://via.placeholder.com/60'} alt={product.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
              </td>
              <td style={{ padding: 10 }}>{product.name}</td>
              <td style={{ padding: 10, textAlign: 'right' }}>${product.price.toFixed(2)}</td>
              <td style={{ padding: 10, textAlign: 'right' }}>{product.stock}</td>
              <td style={{ padding: 10, textAlign: 'center' }}>
                <button onClick={() => handleEdit(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}>
                  <span role="img" aria-label="edit" style={{ color: '#1a73e8', fontSize: 18 }}>✏️</span>
                </button>
                <button onClick={() => handleDelete(product._id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <span role="img" aria-label="delete" style={{ color: '#e53935', fontSize: 18 }}>🗑️</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddForm && <AddProductForm onClose={() => setShowAddForm(false)} onProductAdded={handleProductAdded} />}
      {showEditForm && editProduct && (
        <EditProductForm
          product={editProduct}
          onClose={() => setShowEditForm(false)}
          onProductUpdated={fetchProducts}
        />
      )}
    </div>
  );
};

const SellerOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    apiClient.get('/orders/my-orders')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load orders.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 32 }}>Loading orders...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>{error}</div>;
  if (orders.length === 0) return <div style={{ padding: 32 }}>No orders found.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>My Orders</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Order ID</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Date</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Status</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Total</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{order._id}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{order.status}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>${order.totalPrice?.toFixed(2) ?? '-'}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{order.orderItems?.length ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SellerAnalytics: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    apiClient.get('/orders/my-orders')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load analytics.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 32 }}>Loading analytics...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>{error}</div>;

  // Calculate stats
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const productSales: Record<string, number> = {};
  orders.forEach(order => {
    (order.orderItems || []).forEach((item: any) => {
      productSales[item.product] = (productSales[item.product] || 0) + (item.qty || 1);
    });
  });
  const bestProductId = Object.keys(productSales).reduce((a, b) => productSales[a] > productSales[b] ? a : b, '');
  const bestProductQty = productSales[bestProductId] || 0;

  return (
    <div style={{ padding: 24 }}>
      <h2>Sales Analytics</h2>
      <div style={{ margin: '24px 0', display: 'flex', gap: 32 }}>
        <div style={{ background: '#f5f5f5', padding: 18, borderRadius: 8, minWidth: 160 }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Total Orders</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{totalOrders}</div>
        </div>
        <div style={{ background: '#f5f5f5', padding: 18, borderRadius: 8, minWidth: 160 }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Total Sales</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>${totalSales.toFixed(2)}</div>
        </div>
        <div style={{ background: '#f5f5f5', padding: 18, borderRadius: 8, minWidth: 160 }}>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Best Product</div>
          <div style={{ fontSize: 16 }}>{bestProductId ? `${bestProductId} (${bestProductQty} sold)` : 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};

const SellerPayments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    apiClient.get('/payments/my-payments')
      .then(res => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load payments.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 32 }}>Loading payments...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>{error}</div>;
  if (payments.length === 0) return <div style={{ padding: 32 }}>No payments found.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>My Payments</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Payment ID</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Date</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Amount</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment._id}>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{payment._id}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{new Date(payment.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>${payment.amount?.toFixed(2) ?? '-'}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SellerTracking: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    apiClient.get('/orders/my-orders')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tracking info.');
        setLoading(false);
      });
  }, []);

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => (order.trackingStatus || '').toLowerCase() === statusFilter);

  const searchedOrders = filteredOrders.filter(order =>
    order._id.toLowerCase().includes(search.toLowerCase()) ||
    (order.trackingNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    pending: '#fbc02d',
    shipped: '#1976d2',
    'in transit': '#0288d1',
    delivered: '#388e3c',
    cancelled: '#d32f2f'
  };

  const exportToCSV = () => {
    const rows = [
      ['Order ID', 'Tracking Number', 'Carrier', 'Status'],
      ...searchedOrders.map(order => [
        order._id,
        order.trackingNumber || '',
        order.carrier || '',
        order.trackingStatus || ''
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'tracking.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div style={{ padding: 32 }}>Loading tracking info...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>{error}</div>;
  if (orders.length === 0) return <div style={{ padding: 32 }}>No orders found.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Parcel Tracking</h2>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="text"
          placeholder="Search by Order ID or Tracking Number"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc', width: 260 }}
        />
        <label style={{ marginLeft: 16, marginRight: 8 }}>Filter by Status:</label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="in transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={exportToCSV} style={{ marginLeft: 16, padding: '6px 14px', borderRadius: 4, background: '#1a73e8', color: '#fff', border: 'none', fontWeight: 500 }}>
          Export CSV
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Order ID</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Tracking Number</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Carrier</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Status</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>Track</th>
          </tr>
        </thead>
        <tbody>
          {searchedOrders.map(order => (
            <React.Fragment key={order._id}>
              <tr>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{order._id}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{order.trackingNumber || '-'}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{order.carrier || '-'}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>
                  <span style={{
                    background: statusColors[(order.trackingStatus || '').toLowerCase()] || '#eee',
                    color: '#222',
                    borderRadius: 12,
                    padding: '2px 12px',
                    fontWeight: 600,
                    fontSize: 13
                  }}>
                    {order.trackingStatus || '-'}
                  </span>
                </td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>
                  {order.trackingUrl ? (
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">Track</a>
                  ) : '-'}
                  {order.trackingHistory && order.trackingHistory.length > 0 && (
                    <button
                      style={{ marginLeft: 8 }}
                      onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                    >
                      {expandedOrderId === order._id ? 'Hide History' : 'Show History'}
                    </button>
                  )}
                </td>
              </tr>
              {expandedOrderId === order._id && order.trackingHistory && (
                <tr>
                  <td colSpan={5} style={{ background: '#fafafa' }}>
                    <table style={{ width: '100%', marginTop: 8 }}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Location</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.trackingHistory.map((event: any, idx: number) => (
                          <tr key={idx}>
                            <td>{new Date(event.date).toLocaleString()}</td>
                            <td>{event.location || '-'}</td>
                            <td>{event.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SellerProfile: React.FC = () => {
  const [form, setForm] = useState({
    name: '', email: '', bio: '', portfolioLink: '', instagram: '', location: '', phone: '', facebook: '', twitter: '', profileImage: '', bannerImage: '', logoImage: '', storeColor: '#fff', storeAnnouncement: ''
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient.get('/users/me')
      .then(res => {
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          bio: res.data.bio || '',
          portfolioLink: res.data.portfolioLink || '',
          instagram: res.data.instagram || '',
          location: res.data.location || '',
          phone: res.data.phone || '',
          facebook: res.data.facebook || '',
          twitter: res.data.twitter || '',
          profileImage: res.data.profileImage || '',
          bannerImage: res.data.bannerImage || '',
          logoImage: res.data.logoImage || '',
          storeColor: res.data.storeColor || '#fff',
          storeAnnouncement: res.data.storeAnnouncement || ''
        });
        setPreviewUrl(res.data.profileImage || null);
        setBannerPreviewUrl(res.data.bannerImage || null);
        setLogoPreviewUrl(res.data.logoImage || null);
        setUserId(res.data._id || null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner' | 'logo') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'profile') {
        setProfileImageFile(e.target.files[0]);
        setPreviewUrl(URL.createObjectURL(e.target.files[0]));
      } else if (type === 'banner') {
        setBannerImageFile(e.target.files[0]);
        setBannerPreviewUrl(URL.createObjectURL(e.target.files[0]));
      } else if (type === 'logo') {
        setLogoImageFile(e.target.files[0]);
        setLogoPreviewUrl(URL.createObjectURL(e.target.files[0]));
      }
    }
  };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim()) return 'Name and email are required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Invalid email format.';
    const urlFields = ['portfolioLink', 'facebook', 'twitter'];
    for (const field of urlFields) {
      if (form[field as keyof typeof form] && !/^https?:\/\//.test(form[field as keyof typeof form] as string)) {
        return `${field} must be a valid URL (start with http:// or https://)`;
      }
    }
    if (form.phone && !/^\+?[0-9\-\s]{7,20}$/.test(form.phone)) return 'Invalid phone number format.';
    if (profileImageFile && !['image/jpeg', 'image/png', 'image/jpg'].includes(profileImageFile.type)) return 'Only jpg, jpeg, png images are allowed.';
    if (profileImageFile && profileImageFile.size > 2 * 1024 * 1024) return 'Profile image must be less than 2MB.';
    if (bannerImageFile && !['image/jpeg', 'image/png', 'image/jpg'].includes(bannerImageFile.type)) return 'Only jpg, jpeg, png images are allowed for banner.';
    if (bannerImageFile && bannerImageFile.size > 2 * 1024 * 1024) return 'Banner image must be less than 2MB.';
    if (logoImageFile && !['image/jpeg', 'image/png', 'image/jpg'].includes(logoImageFile.type)) return 'Only jpg, jpeg, png images are allowed for logo.';
    if (logoImageFile && logoImageFile.size > 2 * 1024 * 1024) return 'Logo image must be less than 2MB.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    const validationError = validate();
    if (validationError) {
      return;
    }
    try {
      const data = new FormData();
      Object.keys(form).forEach(key => {
        data.append(key, form[key as keyof typeof form] || '');
      });
      if (profileImageFile) {
        data.append('profileImage', profileImageFile);
      }
      if (bannerImageFile) {
        data.append('bannerImage', bannerImageFile);
      }
      if (logoImageFile) {
        data.append('logoImage', logoImageFile);
      }
      await apiClient.put('/users/me', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      // Remove error message for failed to load profile
    }
  };

  if (loading) return <div className="profile-card"><div className="profile-loading">Loading profile...</div></div>;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h2>Edit Profile</h2>
        <p className="profile-subtitle">Showcase your brand and connect with customers!</p>
      </div>
      <hr className="profile-divider" />
      {success && <div className="profile-alert success"><span>✔</span> {success}</div>}
      {userId && (
        <a href={`/shop/artisan/${userId}`} target="_blank" rel="noopener noreferrer" className="profile-public-link">
          View My Public Shop
        </a>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="profile-image-row">
          <div className="profile-image-upload">
            <label>Profile Image</label>
            {previewUrl && <img src={previewUrl} alt="Profile Preview" className="profile-img-preview" />}
            <label className="profile-file-btn">
              Choose File
              <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'profile')} />
            </label>
          </div>
          <div className="profile-image-upload">
            <label>Banner Image</label>
            {bannerPreviewUrl && <img src={bannerPreviewUrl} alt="Banner Preview" className="profile-banner-preview" />}
            <label className="profile-file-btn">
              Choose File
              <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'banner')} />
            </label>
          </div>
          <div className="profile-image-upload">
            <label>Logo Image</label>
            {logoPreviewUrl && <img src={logoPreviewUrl} alt="Logo Preview" className="profile-logo-preview" />}
            <label className="profile-file-btn">
              Choose File
              <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'logo')} />
            </label>
          </div>
        </div>
        <div className="profile-color-row">
          <label>Store Color</label>
          <input type="color" name="storeColor" value={form.storeColor} onChange={handleChange} className="profile-color-picker" />
          <span className="profile-color-swatch" style={{ background: form.storeColor }}></span>
        </div>
        <div className="profile-form-group">
          <label>Store Announcement</label>
          <textarea name="storeAnnouncement" value={form.storeAnnouncement} onChange={handleChange} rows={2} className="profile-textarea" />
        </div>
        <div className="profile-form-group">
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="profile-input" required />
        </div>
        <div className="profile-form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="profile-input" required />
        </div>
        <div className="profile-form-group">
          <label>Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="profile-textarea" />
        </div>
        <div className="profile-social-grid">
          <div>
            <label>Portfolio Link <span className="profile-optional">(optional)</span></label>
            <input type="url" name="portfolioLink" value={form.portfolioLink} onChange={handleChange} className="profile-input" placeholder="e.g. https://yourportfolio.com" />
          </div>
          <div>
            <label>Instagram <span className="profile-optional">(optional)</span></label>
            <input type="text" name="instagram" value={form.instagram} onChange={handleChange} className="profile-input" placeholder="e.g. @yourhandle or https://instagram.com/yourhandle" />
          </div>
          <div>
            <label>Location <span className="profile-optional">(optional)</span></label>
            <input type="text" name="location" value={form.location} onChange={handleChange} className="profile-input" placeholder="e.g. New York, USA" />
          </div>
          <div>
            <label>Phone <span className="profile-optional">(optional)</span></label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} className="profile-input" placeholder="e.g. +1 234 567 8901" />
          </div>
          <div>
            <label>Facebook <span className="profile-optional">(optional)</span></label>
            <input type="url" name="facebook" value={form.facebook} onChange={handleChange} className="profile-input" placeholder="e.g. https://facebook.com/yourpage" />
          </div>
          <div>
            <label>Twitter <span className="profile-optional">(optional)</span></label>
            <input type="url" name="twitter" value={form.twitter} onChange={handleChange} className="profile-input" placeholder="e.g. https://twitter.com/yourhandle" />
          </div>
        </div>
        <button type="submit" className="profile-save-btn">Save Changes</button>
      </form>
    </div>
  );
};

const SellerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <SellerProducts />;
      case 'orders':
        return <SellerOrders />;
      case 'analytics':
        return <SellerAnalytics />;
      case 'payments':
        return <SellerPayments />;
      case 'tracking':
        return <SellerTracking />;
      case 'profile':
        return <SellerProfile />;
      default:
        return <SellerProducts />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="seller-dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <h3>Artisan Menu</h3>
          </div>
          <nav className="sidebar-nav">
            <a href="#products" onClick={() => setActiveTab('products')} className={activeTab === 'products' ? 'active' : ''}>
              {FaBox({})}
              <span>My Products</span>
            </a>
            <a href="#orders" onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>
              {FaClipboardList({})}
              <span>My Orders</span>
            </a>
            <a href="#analytics" onClick={() => setActiveTab('analytics')} className={activeTab === 'analytics' ? 'active' : ''}>
              {FaChartLine({})}
              <span>Analytics</span>
            </a>
            <a href="#payments" onClick={() => setActiveTab('payments')} className={activeTab === 'payments' ? 'active' : ''}>
              {FaMoneyBillWave({})}
              <span>Payments</span>
            </a>
            <a href="#tracking" onClick={() => setActiveTab('tracking')} className={activeTab === 'tracking' ? 'active' : ''}>
              {FaTruck({})}
              <span>Tracking</span>
            </a>
            <a href="#profile" onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>
              {FaEdit({})}
              <span>Profile</span>
            </a>
          </nav>
        </aside>
        <main className="dashboard-main-content">
          {renderContent()}
        </main>
      </div>
    </>
  );
};

export default SellerDashboard; 