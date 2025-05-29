const UserModel = require('../models/userModel');

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error('❌ Error en getUsers:', err);
    res.status(500).json({ error: 'Error en la base de datos al obtener usuarios' });
  }
};

const getBosses = async (req, res) => {
  try {
    const users = await UserModel.getBoss();
    res.status(200).json(users);
  } catch (err) {
    console.error('❌ Error en getBosses:', err);
    res.status(500).json({ error: 'Error en la base de datos al obtener usuarios' });
  }
};

module.exports = { getUsers, getBosses };
