const bcrypt = require('bcrypt');
const User = require('../models/userModel');

exports.login = (req, res) => {
  const { username, password } = req.body;

  User.getPasswordByUsername(username, async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la DB' });
    if (results.length === 0)
      return res.status(401).json({ error: 'Usuario no encontrado' });

    const hash = results[0].password;
    const match = await bcrypt.compare(password, hash);
    if (!match)
      return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Aquí podrías generar un JWT si lo deseas
    res.json({ mensaje: 'Ingreso exitoso' });
  });
};