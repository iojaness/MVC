const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const login = async (req, res) => {
  const { username, password } = req.body;

    try {
        const results = await User.getPasswordByUsername(username);
        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }
        const hash = results[0].password;
        const match = await bcrypt.compare(password, hash);
        if (!match)
            return res.status(401).json({ error: 'Contraseña incorrecta' });

        res.json({ mensaje: 'Ingreso exitoso' });
    }
    catch (err) {
        console.error('❌ Error en login:', err);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
};

module.exports = { login }