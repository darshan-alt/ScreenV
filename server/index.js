const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
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
