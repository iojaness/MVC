const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const journeyController = require('../controllers/journeyController');
const userController = require('../controllers/userController');

router.post('/login', authController.login);
router.get('/journey', journeyController.getJourney);
router.post('/journey', journeyController.postJouney);
router.get('/journey/:id', journeyController.getVehicle);
router.patch('/journey', journeyController.patchVehicleToTravel);
router.get('/user_bosses', userController.getBosses);

module.exports = router;