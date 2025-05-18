const getConection = require('../db');

// Consulata para validar acceso de usuarios
const getPasswordByUsername = async (username) => {
  const db = await getConection();
  const [rows] = await db.execute('SELECT password FROM user WHERE username = ?', [username]);
  return rows;
};

module.exports = { getPasswordByUsername }