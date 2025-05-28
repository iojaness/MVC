const getConection = require('../db');

const getAllPlaces = async () => {
  const db = await getConection();
  const [rows] = await db.execute('SELECT id, description AS name FROM `place`');
  return rows;
};

module.exports = { getAllPlaces };
