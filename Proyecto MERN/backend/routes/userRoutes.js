const express = require('express');
const User = require('../models/User'); // Importa el modelo User

const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll(); // Obtener todos los usuarios
    res.json(users); // Enviar los usuarios como respuesta
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json(user); // Enviar el nuevo usuario como respuesta
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    user.name = name;
    user.email = email;
    await user.save();
    res.json(user); // Enviar el usuario actualizado como respuesta
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await user.destroy();
    res.status(204).send(); // Responder con 204 (sin contenido)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
