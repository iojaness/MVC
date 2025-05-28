const SupplierModel = require('../models/supplierModel');

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await SupplierModel.getAllSuppliers();
    res.status(200).json(suppliers);
  } catch (err) {
    console.error('❌ Error en getSuppliers:', err);
    res.status(500).json({ error: 'Error en la base de datos al obtener proveedores' });
  }
};

module.exports = { getSuppliers };
