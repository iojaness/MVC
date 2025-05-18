// Conexión a MySQL según tu .env

const mysql = require('mysql2/promise');

async function createConnection() {
  try {
    const db = await mysql.createConnection({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('🟢 Conectado a MySQL con promesas');
    return db;
  } catch (err) {
    console.error('❌ Error al conectar a MySQL:', err.message);
    throw err;
  }
}

module.exports = createConnection;