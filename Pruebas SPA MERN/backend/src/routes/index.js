const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

// Otras rutas pueden ir aquí
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);

module.exports = router;