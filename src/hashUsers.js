// hashUsers.js
require('dotenv').config();
const mysql  = require('mysql2/promise');
const bcrypt = require('bcrypt');

(async () => {
  // 1. Conecta usando el .env
  const db = await mysql.createConnection({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  // 2. Trae todos los usuarios
  const [rows] = await db.execute('SELECT id, password FROM usuarios');
  for (const { id, password: plain } of rows) {
    // 3. Si ya está hasheada (bcrypt hashes empiezan con $2), la saltamos
    if (plain.startsWith('$2')) continue;

    // 4. Si está en texto plano, generamos el hash y actualizamos
    const hash = await bcrypt.hash(plain, 10);
    await db.execute(
      'UPDATE usuarios SET password = ? WHERE id = ?',
      [hash, id]
    );
    console.log(`🔒 Usuario ${id} encriptado.`);
  }

  await db.end();
  console.log('🎉 Migración completa: todas las contraseñas ahora están encriptadas.');
  process.exit();
})();
