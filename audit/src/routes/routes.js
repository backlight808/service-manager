const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/controller');

// Define API routes
router.get('/all', weatherController.getAllWeatherData);
router.post('/store', weatherController.createWeatherData);
router.put('/update/:id', weatherController.updateWeatherData);
router.delete('/remove/:id', weatherController.deleteWeatherData);

module.exports = router;