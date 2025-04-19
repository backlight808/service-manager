const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config({ path: './config/.env' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_AUDIT_DATABASE || 'auditdb', // Use a separate database for audit logs
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    logger.error('Error connecting to database:', error);
    throw error;
  }
};

module.exports = {
  dbConfig,
  connectToDatabase
};