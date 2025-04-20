const logger = require('../utils/logger');
const jwt = require('jsonwebtoken'); 
const { connectToDatabase } = require('../config/config');
const authController = {

  // workinf code commented 
  // login: (req, res) => {
  //   const { username, password } = req.body;

  //   // Hardcoded credentials for simplicity
  //   const validUsername = 'admin';
  //   const validPassword = 'password123';

  //   if (username === validUsername && password === validPassword) {
  //     logger.info('Login successful');
  //     res.status(200).json({ success: true, message: 'Login successful' });
  //   } else {
  //     logger.warn('Invalid username or password');
  //     res.status(401).json({ success: false, message: 'Invalid username or password' });
  //   }
  // },
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      // Get a database connection
      const connection = await connectToDatabase();

      // Query the database for the user
      const [rows] = await connection.execute(
        'SELECT id, username, password, role FROM medical_research_db.users WHERE username = ?',
        [username]
      );

      if (rows.length === 0) {
        logger.warn('Invalid username');
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

      const user = rows[0];

      // Compare the provided password with the stored password
      if (password === user.password) { // Replace this with bcrypt comparison if passwords are hashed
        logger.info('Login successful');
        const token = jwt.sign(
          { username: user.username, role:user.role, userId:user.id }, // Payload
          'your-secret-key', // Replace with a secure secret key
          { expiresIn: '1h' } // Token expiration time
        );
        return res.status(200).json({ success: true, message: 'Login successful', token: token });
        // Generate a JWT token
        

      } else {
        logger.warn('Invalid password');
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } catch (error) {
      logger.error('Error during login:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
};

module.exports = authController;