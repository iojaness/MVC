const getConection = require('../db');

const getAllTypes = async () => {
  const db = await getConection();
  // Observa que en la tabla el campo se llama `descritcion`, así que lo alias como name
  const [rows] = await db.execute('SELECT id, descritcion AS name FROM `type_of_vehicle`');
  return rows;
};

module.exports = { getAllTypes };
