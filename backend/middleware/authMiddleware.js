const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  // Skip protection in test environment and set a mock user
  if (process.env.MODE_ENVIROMENT === 'test') {
    req.user = {
<<<<<<< HEAD
      _id: '6803d48bbffc189a530ba991',
      name: 'test',
      email: 'test@gmail.com',
=======
      _id: '68026479b4acc3c62792fa2c',
      name: 'vidyadhar challa',
      email: 'vidyadharchalla333@gmail.com',
>>>>>>> eb39be279fb7f83e975ea8bdfd9d070c41433732
    };
    return next();
  }

  let token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token failed' });
  }
};

module.exports = { protect };
