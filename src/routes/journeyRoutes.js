const express = require('express');
const router = express.Router();

const {
  getJourney,
  postJouney,
  getVehicle,
  patchVehicleToTravel,
  confirmJourney
} = require('../controllers/journeyController');

// Rutas para los viajes
router.get('/journeys', getJourney);
router.post('/journeys', postJouney);

// Ruta para confirmar un trayecto (frontend hace PATCH /journeys/:id/confirm)
router.patch('/journeys/:id/confirm', confirmJourney);

// Rutas para los vehículos
// Nota: para asignar vehículo, ahora el frontend usa PATCH /journeys/vehicle
router.patch('/journeys/vehicle', patchVehicleToTravel);

// (Mantener o eliminar según lo uses) Si necesitás seguir exponiendo GET /vehicle/:id:
router.get('/vehicle/:id', getVehicle);

module.exports = router;
