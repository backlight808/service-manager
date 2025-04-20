const express = require('express');
const programRoutes = require('./routes/routes');
const { connectToDatabase } = require('./config/config');
const logger = require('./utils/logger');
const cors = require('cors'); // Import the cors middleware


const app = express(); 

// Middleware to parse JSON request bodies.  This is CRUCIAL.
app.use(express.json());
// Use the cors middleware to allow cross-origin requests
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); 
app.use(cors({ origin: 'http://localhost:4200' }));

// Mount the program routes
app.use('/program', programRoutes);

// Connect to the database
connectToDatabase()
  .then(() => {
    logger.info('Connected to database');
  })
  .catch(err => {
    logger.error('Database connection failed:', err);
    //  Don't start the server if the database connection fails.  Instead, you might
    //  want to exit the process or handle this in some other way.
    process.exit(1); // Exit the process with an error code
  });

module.exports = app;