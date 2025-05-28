const getConection = require('../db');

// Consulata para validar acceso de usuarios
const getPasswordByUsername = async (username) => {
  const db = await getConection();
  const [rows] = await db.execute('SELECT password FROM user WHERE username = ?', [username]);
  return rows;
};

const getAllUsers = async () => {
  const db = await getConection();
  // Traer id y username (o name) para el dropdown de usuarios
  const [rows] = await db.execute('SELECT id, name FROM `user`');
  return rows;
};

module.exports = { getPasswordByUsername, getAllUsers };