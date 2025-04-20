const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');

// Define API routes
// router.get('/all', auditController.getAllWeatherData);
router.post('/store', auditController.processDeleteMessage);
// router.put('/update/:id', weatherController.updateWeatherData);
// router.delete('/remove/:id', weatherController.deleteWeatherData);

module.exports = router;