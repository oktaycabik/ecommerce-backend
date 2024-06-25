const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Auth failed: No token provided' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };

    const user = await User.findById(req.userData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Auth failed: Invalid token' });
  }
};

module.exports = authenticateUser;
