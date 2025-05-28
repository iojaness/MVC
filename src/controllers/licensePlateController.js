const PlateModel = require('../models/licensePlateModel');

const getPlates = async (req, res) => {
  try {
    const plates = await PlateModel.getAllPlates();
    res.status(200).json(plates);
  } catch (err) {
    console.error('❌ Error en getPlates:', err);
    res.status(500).json({ error: 'Error en la base de datos al obtener placas' });
  }
};

module.exports = { getPlates };
