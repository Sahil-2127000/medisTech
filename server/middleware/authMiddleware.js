const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

module.exports = (req, res, next) => {
  // Grab token strictly locally shuttled via HttpOnly secure mechanism from the parser
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'No authentication token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Mount decrypted JWT payload seamlessly back into the explicit request pipeline 
    next();
  } catch (error) {
    console.error('JWT Error:', error);
    res.status(401).json({ message: 'Token is mathematically invalid or expired' });
  }
};
