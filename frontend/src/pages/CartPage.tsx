import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>Your Cart</h2>
        {cart.length === 0 ? (
          <div style={{ color: '#888', fontSize: '1.1rem' }}>Your cart is empty.</div>
        ) : (
          <>
            <table style={{ width: '100%', marginBottom: 24 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: 8 }}>Product</th>
                  <th style={{ padding: 8 }}>Price</th>
                  <th style={{ padding: 8 }}>Quantity</th>
                  <th style={{ padding: 8 }}>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #f3f3f3' }}>
                    <td style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={(item.images && item.images[0]) || 'https://via.placeholder.com/60'} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, background: '#eee' }} />
                      <span>{item.name}</span>
                    </td>
                    <td style={{ padding: 8 }}>
                      {typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : 'N/A'}
                    </td>
                    <td style={{ padding: 8 }}>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e => updateQuantity(item._id, Number(e.target.value))}
                        style={{ width: 50, padding: 4 }}
                      />
                    </td>
                    <td style={{ padding: 8 }}>
                      {typeof item.price === 'number' && typeof item.quantity === 'number'
                        ? `$${(item.price * item.quantity).toFixed(2)}`
                        : 'N/A'}
                    </td>
                    <td style={{ padding: 8 }}>
                      <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: '#b94a48', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', fontSize: '1.15rem', fontWeight: 600, marginBottom: 24 }}>
              Total: {typeof total === 'number' && !isNaN(total) ? `$${total.toFixed(2)}` : 'N/A'}
            </div>
            <button
              style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 24, padding: '12px 32px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage; 