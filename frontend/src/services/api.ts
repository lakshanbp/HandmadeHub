import axios from 'axios';

const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || 'https://handmadehubdb-d8buffa5drcpdseg.japanwest-01.azurewebsites.net') + '/api',
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const fetchProducts = (searchQuery?: string) => {
  let url = '/products';
  if (searchQuery) {
    url += `?q=${encodeURIComponent(searchQuery)}`;
  }
  return api.get(url);
};
export const fetchProductById = (id: string) => api.get(`/products/${id}`);
export const fetchReviewsByProduct = (productId: string) => api.get(`/reviews/product/${productId}`);
export const fetchRelatedProducts = (category: string, excludeId: string) =>
  api.get(`/products/search?category=${encodeURIComponent(category)}`).then(res =>
    res.data.filter((p: any) => p._id !== excludeId)
  );
export const submitOrder = (order: any) => api.post('/orders', order);

export const registerUser = (data: { name: string; email: string; password: string; role: string }) =>
  api.post('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const fetchAllUsers = () => api.get('/users');

// You can add other endpoints here, e.g., for artisan requests
export const fetchArtisanRequests = () => api.get('/artisan-requests');
export const updateArtisanRequest = (requestId: string, status: 'approved' | 'rejected') =>
  api.put(`/artisan-requests/${requestId}`, { status });

// Product Management
export const createProduct = (formData: FormData) => api.post('/products', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const updateProduct = (productId: string, formData: FormData) => api.put(`/products/${productId}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const deleteProduct = (productId: string) => api.delete(`/products/${productId}`);

// Order Management (Admin)
export const fetchAllOrdersAdmin = () => api.get('/orders/all');
export const updateOrderStatusAdmin = (orderId: string, status: string) => api.put(`/orders/${orderId}/status`, { status });

// Customer Order Tracking
export const fetchMyOrders = () => api.get('/orders/my');
export const fetchOrderById = (orderId: string) => api.get(`/orders/${orderId}`);

// Artisan Dashboard & Requests
export const fetchMyProducts = () => api.get('/products/my-products');
export const getMyArtisanRequest = () => api.get('/artisan-requests/my-request');
export const submitArtisanRequest = (data: { brandName: string; bio: string; portfolioLink: string }) =>
  api.post('/artisan-requests', data);

// Review submission
export const submitReview = (productId: string, review: { rating: number; comment: string }) =>
  api.post(`/reviews/${productId}`, review);

// Artisan Order Management
export const fetchArtisanOrders = () => api.get('/orders/my-orders');
export const updateOrderTracking = (orderId: string, data: { 
  trackingNumber?: string; 
  trackingStatus?: string; 
  status?: string; 
  carrier?: string; 
  trackingUrl?: string; 
  location?: string; 
}) => api.put(`/orders/${orderId}/tracking`, data);

export default {
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
};