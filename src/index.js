// Llamando las bibliotecas a usar
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcrypt');

// Rutas
const authRoutes    = require('./routes/authRoutes');
const journeyRoutes = require('./routes/journeyRoutes');
const dataRoutes    = require('./routes/dataRoutes');

// Creando la app
const app = express();

// Asignando los middleware
app.use(cors());
app.use(express.json());

// Llamando las rutas
app.use('/', authRoutes);
app.use('/', journeyRoutes);
app.use('/', dataRoutes);

// Puerto de ejecución
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend en puerto ${PORT}`);
});
