const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const journeyController = require('../controllers/journeyController');

router.post('/login', authController.login);
router.get('/journey', journeyController.getJourney);
router.post('/journey', journeyController.postJouney);
router.get('/journey/:id', journeyController.getVehicle);
router.patch('/journey', journeyController.patchVehicleToTravel);
module.exports = router;