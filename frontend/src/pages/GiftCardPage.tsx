import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import './GiftCardPage.css';

const GiftCardPage: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [quantity, setQuantity] = useState<number>(1);
  const [recipientType, setRecipientType] = useState<'someone' | 'myself'>('someone');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleBuyNow = () => {
    const giftCardItem = {
      _id: `giftcard_${Date.now()}`,
      name: `eGift Card - ¥${selectedAmount}`,
      price: selectedAmount,
      quantity: quantity,
      images: ['/images/image_8.jpg'],
    };
    
    addToCart(giftCardItem);
    navigate('/cart');
  };

  return (
    <>
      <Navbar />
      <div className="gift-card-page-container">
        <div className="gift-card-image-column">
          <img src="/images/image_8.jpg" alt="Handmade Hub Gift Card" className="gift-card-image-display" />
        </div>
        <div className="gift-card-form-column">
          <h1>eGift Card</h1>
          <p className="price">¥{selectedAmount}</p>
          <p className="description">
            You can't go wrong with a gift card. Choose an amount and write a personalized message to make this gift your own.
          </p>

          <div className="form-group">
            <label>Amount</label>
            <div className="amount-selector">
              {[25, 50, 100, 150, 200].map(amount => (
                <button
                  key={amount}
                  className={selectedAmount === amount ? 'active' : ''}
                  onClick={() => setSelectedAmount(amount)}
                >
                  ¥{amount}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <div className="quantity-selector">
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <input type="text" value={quantity} readOnly />
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>

          <div className="form-group">
            <label>Who is the gift card for?</label>
            <div className="recipient-selector">
              <button
                className={recipientType === 'someone' ? 'active' : ''}
                onClick={() => setRecipientType('someone')}
              >
                For someone else
              </button>
              <button
                className={recipientType === 'myself' ? 'active' : ''}
                onClick={() => setRecipientType('myself')}
              >
                For myself
              </button>
            </div>
          </div>
          
          {recipientType === 'someone' && (
            <>
              <div className="form-group">
                <label htmlFor="recipient-email">Recipient email *</label>
                <input type="email" id="recipient-email" />
              </div>
              <div className="form-group">
                <label htmlFor="recipient-name">Recipient name</label>
                <input type="text" id="recipient-name" />
              </div>
              <div className="form-group">
                <label htmlFor="delivery-date">Delivery date</label>
                <input type="text" id="delivery-date" defaultValue="Now" />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows={4}></textarea>
          </div>

          <button className="buy-now-button" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GiftCardPage; 