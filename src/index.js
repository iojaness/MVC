// Llamando las bibliotecas a usar
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcrypt');

const authRoutes = require('./routes/authRoutes')

// Creando la app
const app = express();
// Asignando los middleware
app.use(cors());
app.use(express.json());

// Llamnado las rutas
app.use('/', authRoutes)

// Puerto de ejecución
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend en puerto ${PORT}`)
} );
