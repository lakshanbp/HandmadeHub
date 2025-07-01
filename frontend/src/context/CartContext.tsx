import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  cartCount: number;
}

interface DecodedToken {
  id: string;
  role: string;
  name: string;
  exp: number;
  artisanStatus: 'none' | 'pending' | 'approved' | 'rejected';
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

// Helper to check if user is logged in
const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    // Invalid token, remove it
    localStorage.removeItem('token');
    return false;
  }
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [cartError, setCartError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Only fetch cart on mount if user is logged in
  useEffect(() => {
    if (isLoggedIn()) {
      api.get('/users/cart')
        .then(res => {
          setCart(res.data.items || []);
          setCartError(null);
        })
        .catch(err => {
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            // Silent handling for auth errors - just clear token and cart
            localStorage.removeItem('token');
            setCart([]);
            setCartError(null); // Don't show error for auth issues
          } else {
            // Only show error for non-auth issues
            console.error('Cart fetch error:', err);
            setCartError('An error occurred while fetching your cart. Please try again later.');
          }
        });
    } else {
      setCart([]);
      setCartError(null);
    }
  }, []); // Only on mount

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i._id === item._id);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        newCart = [...prevCart, item];
      }
      // Sync with backend only if logged in
      if (isLoggedIn()) {
        api.post('/users/cart', { items: newCart }).catch(err => {
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            localStorage.removeItem('token');
          }
        });
      }
      return newCart;
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    setCart(prevCart =>
      prevCart.map(item => (item._id === id ? { ...item, quantity: Math.max(1, qty) } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item._id !== id);
      // Sync with backend if logged in
      if (isLoggedIn()) {
        api.post('/users/cart', { items: updatedCart }).catch(err => {
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            localStorage.removeItem('token');
          }
        });
      }
      // Always update localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const updateCart = (items: CartItem[]) => {
    setCart(items);
    if (isLoggedIn()) {
      api.post('/users/cart', { items }).catch(err => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          setCart([]);
          setCartError(null); // Don't show error for auth issues
        } else {
          // Only show error for non-auth issues
          console.error('Cart update error:', err);
          setCartError('An error occurred while updating your cart. Please try again later.');
        }
      });
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, cartCount }}>
      {cartError && <div style={{ color: 'red', textAlign: 'center', margin: '16px 0' }}>{cartError}</div>}
      {children}
    </CartContext.Provider>
  );
}; 