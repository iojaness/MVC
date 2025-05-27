// hashUsers.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const getConection = require('./db');

(async () => {
  // 1. Conecta usando el .env
  const db = await getConection();

  // 2. Trae todos los usuarios
  const [rows] = await db.execute('SELECT id, password FROM user');
  for (const { id, password: plain } of rows) {
    // 3. Si ya está hasheada (bcrypt hashes empiezan con $2), la saltamos
    if (plain.startsWith('$2')) continue;

    // 4. Si está en texto plano, generamos el hash y actualizamos
    const hash = await bcrypt.hash(plain, 10);
    await db.execute(
      'UPDATE user SET password = ? WHERE id = ?',
      [hash, id]
    );
    console.log(`🔒 Usuario ${id} encriptado.`);
  }

  await db.end();
  console.log('🎉 Migración completa: todas las contraseñas ahora están encriptadas.');
  process.exit();
})();
