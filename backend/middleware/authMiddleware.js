const jwt = require('jsonwebtoken');

// Middleware to verify the token
const protect = (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user info to request (id and role)
      req.user = decoded; 

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure req.user exists and has a role
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'User not authenticated or role missing' });
    }

    // Check if the user's role is in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };