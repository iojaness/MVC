# Web App MVC - Node + React

Aplicación web siguiendo el patrón Modelo-Vista-Controlador (MVC), con **Node.js** para el backend y **React (Vite)** para el frontend.

## 🚀 Tecnologías

- Backend: Node.js + Express
- Frontend: React + Vite
- Estilo de arquitectura: MVC
- Herramientas: Nodemon, Concurrently

## 📁 Estructura del Proyecto

MVC/
├── public/                 # Archivos estáticos del frontend (compilado de React)
├── src/
│   ├── controllers/        # Controladores de Express
│   ├── models/             # Modelos (por ejemplo, Mongoose o clases JS)
│   ├── routes/             # Rutas de la API
│   ├── views/              # Opcional: vistas server-side
│   ├── app.js              # Configuración principal de Express
│   └── config/             # Configuración de BD, variables, etc.
├── react-app/              # Código fuente de React (sin crear app dos veces)
│   ├── src/
│   └── public/
├── SQL                     # Scripts SQL
├── .gitignore
├── README.md
└── package.json            # Principal
