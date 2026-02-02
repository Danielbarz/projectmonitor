const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Get token from header
  const token = req.header('Authorization');

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 3. Verify token
    // Usually tokens are sent as "Bearer <token>", so we split if necessary
    // But for simplicity, we assume the header contains just the token or "Bearer <token>"
    const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);

    // 4. Add user from payload to request object
    req.user = decoded; // decoded contains { id, role }
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};