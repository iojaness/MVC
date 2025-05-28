const DriverModel = require('../models/driverModel');

const getDrivers = async (req, res) => {
  try {
    const drivers = await DriverModel.getAllDrivers();
    res.status(200).json(drivers);
  } catch (err) {
    console.error('❌ Error en getDrivers:', err);
    res.status(500).json({ error: 'Error en la base de datos al obtener conductores' });
  }
};

module.exports = { getDrivers };
