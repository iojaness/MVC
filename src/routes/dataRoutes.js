const express = require('express');
const router = express.Router();

const { getUsers }              = require('../controllers/userController');
const { getPlaces }             = require('../controllers/placeController');
const { getSuppliers }          = require('../controllers/supplierController');
const { getDrivers }            = require('../controllers/driverController');
const { getTypes }              = require('../controllers/typeOfVehicleController');
const { getPlates }             = require('../controllers/licensePlateController');
const { getPrice }              = require('../controllers/priceController');

// Rutas para llenar dropdowns
router.get('/users', getUsers);
router.get('/places', getPlaces);
router.get('/suppliers', getSuppliers);
router.get('/drivers', getDrivers);
router.get('/vehicle-types', getTypes);
router.get('/license-plates', getPlates);
router.get('/price', getPrice);

module.exports = router;
