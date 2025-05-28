const getConection = require('../db');

const getAllSuppliers = async () => {
  const db = await getConection();
  const [rows] = await db.execute('SELECT id, description AS name FROM `supplier`');
  return rows;
};

module.exports = { getAllSuppliers };
