const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// CORS configuration for Azure deployment
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'https://handmadehub.azurewebsites.net', // Azure frontend (if deployed)
    'https://handmadehub-cdbahwd0amf2djdc.canadacentral-01.azurewebsites.net', // Your Azure backend
    'https://handmadehub-frontend.azurewebsites.net', // Alternative Azure frontend URL
    'https://handmadehub.vercel.app', // If using Vercel
    'https://handmadehub.netlify.app', // If using Netlify
    process.env.FRONTEND_URL // Environment variable for frontend URL
  ].filter(Boolean), // Remove any undefined values
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Swagger setup
const setupSwagger = require('./swagger');
setupSwagger(app);

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const artisanRequestRoutes = require('./routes/artisanRequests');
const paymentRoutes = require('./routes/payments');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/artisan-requests', artisanRequestRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  console.log('404 handler hit for:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error handler:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});