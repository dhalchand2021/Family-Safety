const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Connect to database
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB connection error:', err));
}

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
const auth = require('./routes/authRoutes');
const devices = require('./routes/deviceRoutes');
const sessions = require('./routes/sessionRoutes');
const alerts = require('./routes/alertRoutes');

app.use('/api/v1/auth', auth);
app.use('/api/v1/devices', devices);
app.use('/api/v1/sessions', sessions);
app.use('/api/v1/alerts', alerts);

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Family Safety Platform API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

module.exports = app;
