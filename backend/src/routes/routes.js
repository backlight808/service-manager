const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/controller');
const authController = require('../controllers/auth.controller');

// Define API routes
router.get('/all', weatherController.getAllWeatherData);
router.post('/store', weatherController.createWeatherData);
router.put('/update/:id', weatherController.updateWeatherData);
router.delete('/remove/:id', weatherController.deleteWeatherData);


// Add login route
router.post('/login', authController.login); // New login route


module.exports = router;