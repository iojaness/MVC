const PriceModel = require('../models/priceModel');

const getPrice = async (req, res) => {
  try {
    const { type, supplier } = req.query;
    if (!type || !supplier) {
      return res.status(400).json({ error: 'Faltan parámetros type o supplier' });
    }
    const result = await PriceModel.getPrice(type, supplier);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error en getPrice:', err);
    res.status(500).json({ error: 'Error en la base de datos al obtener tarifa' });
  }
};

module.exports = { getPrice };
