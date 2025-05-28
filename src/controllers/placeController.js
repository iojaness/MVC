const PlaceModel = require('../models/placeModel');

const getPlaces = async (req, res) => {
  try {
    const places = await PlaceModel.getAllPlaces();
    res.status(200).json(places);
  } catch (err) {
    console.error('❌ Error en getPlaces:', err);
    res.status(500).json({ error: 'Error en la base de datos al obtener lugares' });
  }
};

module.exports = { getPlaces };
