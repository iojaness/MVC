const getConection = require('../db');

const getAllPlates = async () => {
  const db = await getConection();
  // Traemos todas las placas, mostramos número y devolvemos el id
  const [rows] = await db.execute('SELECT id, number AS plate FROM `licence_plate`');
  return rows;
};

module.exports = { getAllPlates };
