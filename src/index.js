require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcrypt');
const mysql   = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL según tu .env
const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});
db.connect(err => {
  if (err) throw err;
  console.log('🟢 Conectado a MySQL');
});

// Ruta de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT password FROM usuarios WHERE username = ?';
  
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la DB' });
    if (results.length === 0)
      return res.status(401).json({ error: 'Usuario no encontrado' });
    
    const hash = results[0].password;
    const match = await bcrypt.compare(password, hash);
    if (!match) 
      return res.status(401).json({ error: 'Contraseña incorrecta' });

    // ¡Listo! Puedes generar un token aquí si quieres
    res.json({ mensaje: 'Ingreso exitoso' });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Backend en puerto ${PORT}`));
