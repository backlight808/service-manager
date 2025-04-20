const express = require('express');
const router = express.Router();
const programController = require('../controllers/controller');
const authController = require('../controllers/auth.controller');

// Define API routes
router.get('/all', programController.getAllProgramData);
router.post('/store', programController.createProgramData);
router.put('/update/:id', programController.updateprogramData);
router.delete('/remove/:id', programController.deleteProgramData);


// Add login route
router.post('/login', authController.login); // New login route


module.exports = router;