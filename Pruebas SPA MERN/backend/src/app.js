require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const routes = require('./routes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Configura CORS
app.use(cors({
  origin: '*',
  credentials: true, // Permite el envío de cookies y encabezados de autenticación
}));


// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api', routes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});