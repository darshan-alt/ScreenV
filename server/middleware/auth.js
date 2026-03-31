const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_for_screen_v1_dev_only';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Token is usually passed as "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden: Invalid token' });
    
    // User object comes from payload encoded during login
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
  JWT_SECRET
};
