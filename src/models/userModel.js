const db = require('../db');

// Consulata para validar acceso de usuarios
exports.getPasswordByUsername = (username, callback) => {
  const sql = 'SELECT password FROM usuarios WHERE username = ?';
  db.query(sql, [username], callback);
};