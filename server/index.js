const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Enforcement: Check for JWT_SECRET in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('CRITICAL: JWT_SECRET must be set in production environment!');
  process.exit(1);
}

// Middleware
const allowedOrigins = ['http://localhost:3000']; 
// In development, we can dynamically allow chrome-extension:// origins
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('chrome-extension://')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
// Serve static uploads for easy thumbnail/poster access
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Database
initDB();

// Routes
const authRoutes = require('./routes/auth');
const videosRoutes = require('./routes/videos');

app.use('/api/auth', authRoutes);
app.use('/api/videos', videosRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ScreenV1 API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
