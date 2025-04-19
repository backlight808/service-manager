const logger = require('../utils/logger');

const authController = {
  login: (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials for simplicity
    const validUsername = 'admin';
    const validPassword = 'password123';

    if (username === validUsername && password === validPassword) {
      logger.info('Login successful');
      res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      logger.warn('Invalid username or password');
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  },
};

module.exports = authController;