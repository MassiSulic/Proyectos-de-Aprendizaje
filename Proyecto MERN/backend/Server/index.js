const express = require('express');
const cors = require('cors');
const sequelize = require('./db'); // Configuración de la base de datos
const userRoutes = require('../routes/userRoutes'); // Rutas para usuarios

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/users', userRoutes); // Aquí van las rutas del CRUD

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  sequelize.sync(); // Sincroniza la base de datos
});
