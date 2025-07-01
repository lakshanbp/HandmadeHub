import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import axios from 'axios';

// Define the Product type
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  description?: string;
}

// Define the type for the form data
type ProductFormData = Omit<Product, '_id' | 'images'> & {
  imageFile?: File | null;
  images?: string[];
};

const AdminProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<ProductFormData>>({
    name: '',
    price: 0,
    category: 'homeware',
    stock: 0,
    imageFile: null,
    images: [],
    description: '',
  });
  const [artisans, setArtisans] = useState<{ _id: string; name: string }[]>([]);
  const [selectedArtisan, setSelectedArtisan] = useState<string>('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const fetchArtisans = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/users/artisans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArtisans(res.data);
      if (res.data.length > 0) setSelectedArtisan(res.data[0]._id);
    } catch (err) {
      setArtisans([]);
    }
  };

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product, imageFile: null });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: 0, category: 'homeware', stock: 0, imageFile: null, images: [], description: '' });
    }
    fetchArtisans();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, imageFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (key === 'imageFile' && value) {
          data.append('imageFile', value as File);
        } else if (key !== 'images' && value !== null && value !== undefined) {
          data.append(key, String(value));
        }
      });
      if (selectedArtisan) {
        data.append('artisan', selectedArtisan);
      }

      if (editingProduct) {
        await updateProduct(editingProduct._id, data);
      } else {
        await createProduct(data);
      }
      closeModal();
      loadProducts();
    } catch (err) {
      setError('Failed to save product.');
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        loadProducts(); // Refresh list
      } catch (err) {
        setError('Failed to delete product.');
      }
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <main style={{ flexGrow: 1, padding: '32px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Product Management</h1>
          <button onClick={() => openModal()} style={actionButtonStyle('approve')}>Create New Product</button>
        </div>
        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ ...tableHeaderStyle, width: 60 }}>Image</th>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Category</th>
                <th style={tableHeaderStyle}>Price</th>
                <th style={tableHeaderStyle}>Stock</th>
                <th style={{ ...tableHeaderStyle, width: 150 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={tableCellStyle}>
                    <img src={product.images[0] || 'https://via.placeholder.com/40'} alt={product.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                  </td>
                  <td style={tableCellStyle}>{product.name}</td>
                  <td style={tableCellStyle}>{product.category}</td>
                  <td style={tableCellStyle}>${product.price.toFixed(2)}</td>
                  <td style={tableCellStyle}>{product.stock}</td>
                  <td style={tableCellStyle}>
                    <button onClick={() => openModal(product)} style={actionButtonStyle('edit')}>Edit</button>
                    <button onClick={() => handleDelete(product._id)} style={actionButtonStyle('reject')}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>{editingProduct ? 'Edit Product' : 'Create Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={formGroupStyle}>
                <label>Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={formGroupStyle}>
                <label>Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} style={{...inputStyle, height: 80}} />
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{...formGroupStyle, flex: 1}}>
                  <label>Price</label>
                  <input type="number" name="price" value={formData.price || 0} onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={{...formGroupStyle, flex: 1}}>
                  <label>Stock</label>
                  <input type="number" name="stock" value={formData.stock || 0} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>
              <div style={formGroupStyle}>
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                  <option value="homeware">Homeware</option>
                  <option value="accessories">Accessories</option>
                  <option value="planters">Planters</option>
                  <option value="gifts">Gifts</option>
                </select>
              </div>
              <div style={formGroupStyle}>
                <label>Product Image</label>
                <input type="file" name="imageFile" onChange={handleFileChange} style={inputStyle} />
                {editingProduct && formData.images && (
                  <img src={formData.images[0]} alt="Current" style={{ width: 50, height: 50, marginTop: 8, borderRadius: 4 }} />
                )}
              </div>
              <div style={formGroupStyle}>
                <label>Artisan</label>
                <select name="artisan" value={selectedArtisan} onChange={e => setSelectedArtisan(e.target.value)} style={inputStyle} required>
                  {artisans.map(artisan => (
                    <option key={artisan._id} value={artisan._id}>{artisan.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={closeModal} style={actionButtonStyle('secondary')}>Cancel</button>
                <button type="submit" style={actionButtonStyle('approve')}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline Styles
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};
const modalContentStyle: React.CSSProperties = {
  background: '#fff',
  padding: '24px 32px',
  borderRadius: 8,
  width: '100%',
  maxWidth: 500,
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
};
const formGroupStyle: React.CSSProperties = { marginBottom: 16 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', marginTop: 4 };
const tableHeaderStyle: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: 15, color: '#444' };
const tableCellStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 15, verticalAlign: 'middle' };
const actionButtonStyle = (type: 'approve' | 'reject' | 'edit' | 'secondary'): React.CSSProperties => ({
  border: 'none',
  borderRadius: 6,
  padding: '8px 14px',
  marginRight: 8,
  cursor: 'pointer',
  fontWeight: 500,
  color: '#fff',
  background: type === 'approve' ? '#4caf50' : type === 'reject' ? '#f44336' : type === 'edit' ? '#2196f3' : '#aaa',
});

export default AdminProductManagement; 