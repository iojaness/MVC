const TypeModel = require('../models/typeOfVehicleModel');

const getTypes = async (req, res) => {
  try {
    const types = await TypeModel.getAllTypes();
    res.status(200).json(types);
  } catch (err) {
    console.error('❌ Error en getTypes:', err);
    res.status(500).json({ error: 'Error en la base de datos al obtener tipos de vehículo' });
  }
};

module.exports = { getTypes };
