import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitOrder } from '../services/api';
import Navbar from '../components/Navbar';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';

const stripePromise = loadStripe('pk_test_51Re4zJRwYjuH1xrhKi5pLBOISVfrnORvcQcLlNVsK0d2jIG4hnz4hkmi8ilU3WcRW5qw18PKsnZdeP4fItXcneew00S6NABEHS');

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'India',
  'Japan',
  'Other',
];

const CheckoutForm: React.FC<{
  amount: number;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  billingSame: boolean;
  setBillingSame: (v: boolean) => void;
  showManualAddress: boolean;
  setShowManualAddress: (v: boolean) => void;
  street: string;
  setStreet: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  state: string;
  setState: (v: string) => void;
  zip: string;
  setZip: (v: string) => void;
  onSuccess: () => void;
}> = ({ amount, name, setName, email, setEmail, country, setCountry, billingSame, setBillingSame, showManualAddress, setShowManualAddress, street, setStreet, city, setCity, state, setState, zip, setZip, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(amount * 100) })
      });
      const { clientSecret } = await res.json();
      const result = await stripe!.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements!.getElement(CardElement)!,
        },
      });
      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setSuccess('Payment successful!');
        onSuccess();
      }
    } catch (err: any) {
      setError('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 36, width: '100%', maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, color: '#222' }}>Shipping information</h3>
      <div style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontWeight: 500, color: '#444' }}>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16, background: '#fafbfc' }} />
        <label style={{ fontWeight: 500, color: '#444' }}>Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16, background: '#fafbfc' }} />
        <label style={{ fontWeight: 500, color: '#444' }}>Country</label>
        <select value={country} onChange={e => setCountry(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16, background: '#fafbfc' }}>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {!showManualAddress && (
          <a href="#" style={{ color: '#666', fontSize: 14, textDecoration: 'underline', marginTop: 4 }} onClick={e => { e.preventDefault(); setShowManualAddress(true); }}>Enter address manually</a>
        )}
        {showManualAddress && (
          <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input type="text" value={street} onChange={e => setStreet(e.target.value)} placeholder="Street" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16, background: '#fafbfc' }} />
            <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16, background: '#fafbfc' }} />
            <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="State" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16, background: '#fafbfc' }} />
            <input type="text" value={zip} onChange={e => setZip(e.target.value)} placeholder="Zip / Postal Code" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16, background: '#fafbfc' }} />
          </div>
        )}
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 700, margin: '28px 0 10px 0', color: '#222' }}>Payment details</h3>
      <div style={{ marginBottom: 0 }}>
        <label style={{ fontWeight: 500, color: '#444' }}>Card information</label>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 12, marginTop: 4, background: '#fafbfc' }}>
          <CardElement options={{ style: { base: { fontSize: '18px', color: '#222' } } }} />
        </div>
      </div>
      <div style={{ marginBottom: 0, marginTop: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: 15, color: '#444' }}>
          <input type="checkbox" checked={billingSame} onChange={e => setBillingSame(e.target.checked)} style={{ marginRight: 8 }} />
          Billing address is same as shipping
        </label>
      </div>
      <button type="submit" disabled={!stripe || loading} style={{ width: '100%', background: '#edcb9a', color: '#222', border: 'none', padding: '16px 0', borderRadius: 10, fontWeight: 700, fontSize: 20, marginTop: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(106,90,205,0.08)' }}>
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
      {error && <div style={{ color: 'red', marginTop: 12, fontWeight: 500 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 12, fontWeight: 500 }}>{success}</div>}
      <div style={{ marginTop: 32, color: '#aaa', fontSize: 13, textAlign: 'center' }}>
        Powered by <span style={{ fontWeight: 600 }}>stripe</span> &nbsp; Terms &nbsp; Privacy
      </div>
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  const { cart, removeFromCart } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United States');
  const [billingSame, setBillingSame] = useState(true);
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 5 : 0;
  const total = subtotal + shipping;

  const handleOrderSuccess = async () => {
    setLoading(true);
    setError(null);
    try {
      await submitOrder({
        customerName: name,
        customerAddress: showManualAddress
          ? `${street}, ${city}, ${state}, ${zip}`
          : '',
        customerEmail: email,
        items: cart.map(item => ({ product: item._id, quantity: item.quantity })),
        totalPrice: total,
      });
      cart.forEach(item => removeFromCart(item._id));
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Order submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 36, textAlign: 'center' }}>
        <div style={{ color: '#2e7d32', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
          ✅ Order placed successfully!
        </div>
        <p style={{ color: '#666', fontSize: '1rem', marginBottom: '2rem' }}>
          Thank you for your purchase! You will receive an email confirmation shortly.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/orders')} 
            style={{ 
              background: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              fontSize: '1rem', 
              fontWeight: '600', 
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
          >
            Track My Orders
          </button>
          <button 
            onClick={() => navigate('/')} 
            style={{ 
              background: '#6b7280', 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              fontSize: '1rem', 
              fontWeight: '600', 
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#4b5563'}
            onMouseOut={(e) => e.currentTarget.style.background = '#6b7280'}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return <div style={{ maxWidth: 500, margin: '60px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 36, textAlign: 'center' }}>Your cart is empty. Redirecting to cart...</div>;
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '40px auto', background: 'transparent', borderRadius: 16, display: 'flex', gap: 48, minHeight: 520, flexWrap: 'wrap' }}>
        {/* Left: Order Summary */}
        <div style={{ flex: 1, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '48px 40px 40px 56px', minWidth: 340, marginBottom: 24 }}>
          <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 32, color: '#39324a' }}>${total.toFixed(2)}</div>
          {cart.map(item => (
            <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
              <img src={(item.images && item.images[0]) || 'https://via.placeholder.com/56'} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 12, background: '#eee', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#222' }}>{item.name}</div>
                <div style={{ color: '#888', fontSize: 14, marginTop: 2 }}>Qty {item.quantity}</div>
                {item.quantity > 1 && <div style={{ color: '#aaa', fontSize: 13 }}>${(item.price / item.quantity).toFixed(2)} each</div>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#222' }}>${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #eee', margin: '24px 0 0 0', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, marginBottom: 8, color: '#444' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, color: '#888', marginBottom: 8 }}>
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div style={{ color: '#aaa', fontSize: 13, marginBottom: 12 }}>Ground shipping (3-5 business days)</div>
            <div style={{ margin: '18px 0 14px 0', display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: '#888' }}>
              <span>Support payment methods:</span>
              <img src="/images/visa.png" alt="Visa" style={{ height: 22 }} />
              <img src="/images/mastercard.png" alt="MasterCard" style={{ height: 22 }} />
              <img src="/images/amex.png" alt="Amex" style={{ height: 22 }} />
              <img src="/images/discover.png" alt="Discover" style={{ height: 22 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20, marginTop: 10, color: '#39324a' }}>
              <span>Total due</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {/* Right: Shipping & Payment */}
        <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 350 }}>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              amount={total}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              country={country}
              setCountry={setCountry}
              billingSame={billingSame}
              setBillingSame={setBillingSame}
              showManualAddress={showManualAddress}
              setShowManualAddress={setShowManualAddress}
              street={street}
              setStreet={setStreet}
              city={city}
              setCity={setCity}
              state={state}
              setState={setState}
              zip={zip}
              setZip={setZip}
              onSuccess={handleOrderSuccess}
            />
          </Elements>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage; 